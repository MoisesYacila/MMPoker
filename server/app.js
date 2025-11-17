// If we are in development mode, add our .env file to the environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const { isValidEmail, isValidFullName, isValidUsername } = require('../shared/validators');
const Account = require('./models/account');
const Player = require('./models/player');
const Game = require('./models/game');
const Post = require('./models/post');
const Comment = require('./models/comment');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require('express-session');
const { isLoggedIn, isAdmin, validatePlayer, validateTournament, validatePost } = require('./middleware.js');
const multer = require('multer');
const Joi = require('joi');
const cloudinary = require('cloudinary').v2;
const mongoSanitize = require('express-mongo-sanitize');
const pino = require('pino');
const pinoHttp = require('pino-http');
const helmet = require('helmet');
const upload = multer({
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    dest: 'uploads/' // Directory to store uploaded files temporarily
});
const { createClient } = require('redis');
const { RedisStore } = require('connect-redis');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/mmpoker';

// Create a pino logger instance for production
const pinoLogger = pino({
    // In production, we will log only 'warn' and higher importance logs, in development we will log 'info' and higher
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'info'),
    // Redact sensitive information from logs
    redact: ['req.headers.cookie', 'req.headers.authorization', 'req.body.password']
});

// Use pino-http middleware for HTTP request logging
app.use(pinoHttp({ logger: pinoLogger }));

// Initialize Redis client with our Redis URL
const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

// Connect to Redis and handle connection errors
redisClient.connect().catch((err) => {
    pinoLogger.error({ err }, "Redis connection error.");
});

// Also handle Redis client errors after connection
redisClient.on('error', (err) => {
    pinoLogger.error({ err }, "Redis client error");
});

// Initialize Redis store for session management
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "mmpoker:"
})

//Connect to DB
mongoose.connect(dbUrl)
    .then(() => {
        pinoLogger.info("Database connected.");
    })
    .catch(err => {
        pinoLogger.error({ err }, "Database connection error.");
    });

// Configuration for Google authentication
// From passport-google-oauth20 documentation
const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
    state: true
};

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


//Check documentation if there are any questions with these
app.use(cors({
    // Need these to allow React to interact with the server
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow credentials (cookies) to be sent
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// To prevent MongoDB Operator Injection attacks and activate helmet, which adds security headers
app.use(mongoSanitize());
app.use(helmet());

// Setting up session and passport, from the documentation
const sessionConfig = {
    store: redisStore,
    name: process.env.SESSION_COOKIE_NAME, // By default, the session cookie is named 'connect.sid', we change it for security reasons
    secret: process.env.SESSION_SECRET || 'secret',   // Change this to a random string in production
    resave: false,
    secure: true, // Set to true if using HTTPS, consider this for production
    saveUninitialized: false,
    cookie: {
        // Sets the max age of the cookie to 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

//Important to use session before passport.initialize() and passport.session()
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Setting up passport local strategy for username/password authentication
// We want to make sure that the user can login regardless of the case of their username, so we check against the lowercase version
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // Find the user by their lowercase username
        const user = await Account.findOne({ usernameLower: username.toLowerCase() });
        if (!user) return done(null, false, { message: 'Incorrect username or password.' });

        // Check if the password is correct
        const isValid = await user.authenticate(password);
        if (!isValid) return done(null, false, { message: 'Incorrect username or password.' });
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Set up Google authentication strategy
// We use the config object we created above
// This function requires the verify callback
passport.use(new GoogleStrategy(googleConfig,
    // Passport syntax
    // Here we want to know if an account exists with the given googleId, if so we want to log in the user
    // If not, we want to create a new account with the given googleId
    async function verify(accessToken, refreshToken, profile, done) {
        try {
            let account = await Account.findOne({ googleId: profile.id });

            if (!account) {
                account = new Account({
                    googleId: profile.id,
                    fullName: profile.displayName,
                    username: `GoogleUser${profile.id}`,
                    // Optional chaining
                    // We are saying: If profile.emails and profile.emails[0] are not undefined,
                    // then get the value, which is the email address
                    email: profile.emails?.[0]?.value.toLowerCase(),
                    admin: false
                });
                await account.save();
            }

            // Pass the account to the done callback, which will be used by passport to log in the user
            return done(null, account);
        } catch (err) {
            return done(err);
        }
    }
));

//Handling requests
app.get('/players', async (req, res) => {
    const players = await Player.find({});
    res.send(players);
})

// Get the top player(s) for each stat total
// Important to have this endpoint before /players/:id, otherwise it will try to get the player with the id 'leaders' and return an error
app.get('/players/leaders/total', async (req, res) => {
    // MongoDB aggregation operation
    // This is new to me, so I will describe everything in detail

    // We get the top players for each category and return them in an object
    // We can use facet to get multiple pipelines in one query
    const topPlayers = await Player.aggregate().facet({
        // Steps
        // 1. Find the max number of wins (group)
        // 2. Lookup the players with that number of wins (DB JOIN, lookup)
        // 3. In case of a tie, split players into separate documents (unwind)
        // 4. Removes the outer object, so we don't have a nested array (replaceRoot)
        "mostGames": [
            {
                // Not grouping by anything, just getting the max num of games played. That's why we set _id to null
                $group: { _id: null, maxGames: { $max: "$gamesPlayed" } }
            },
            {
                // Lookup the players with that number of games played
                // We use $lookup to join the players collection with the result of the previous step
                // We use the maxGames field from the last step to join with the gamesPlayed field in the players collection
                // This will return an array of players called topPlayers with the max number of games played
                $lookup: {
                    from: "players",
                    localField: "maxGames",
                    foreignField: "gamesPlayed",
                    as: "topPlayers"
                }
            },
            { $unwind: "$topPlayers" },
            { $replaceRoot: { newRoot: "$topPlayers" } }
        ],
        // Same idea for the rest of the categories
        "mostWins": [{

            $group: { _id: null, maxWins: { $max: "$wins" } }
        },
        {

            $lookup: {
                from: "players",
                localField: "maxWins",
                foreignField: "wins",
                as: "topPlayers"
            }
        },
        { $unwind: "$topPlayers" },
        { $replaceRoot: { newRoot: "$topPlayers" } }
        ],
        "mostWinnings": [
            {
                $group: { _id: null, maxWinnings: { $max: "$winnings" } }
            },
            {
                $lookup: {
                    from: "players",
                    localField: "maxWinnings",
                    foreignField: "winnings",
                    as: "topPlayers"
                }
            },
            { $unwind: "$topPlayers" },
            { $replaceRoot: { newRoot: "$topPlayers" } }
        ],
        "mostITM": [
            {
                $group: { _id: null, maxITM: { $max: "$itmFinishes" } }
            },
            {
                $lookup: {
                    from: "players",
                    localField: "maxITM",
                    foreignField: "itmFinishes",
                    as: "topPlayers"
                }
            },
            { $unwind: "$topPlayers" },
            { $replaceRoot: { newRoot: "$topPlayers" } }
        ],
        "mostOTB": [
            {
                $group: { _id: null, maxOTB: { $max: "$onTheBubble" } }
            },
            {
                $lookup: {
                    from: "players",
                    localField: "maxOTB",
                    foreignField: "onTheBubble",
                    as: "topPlayers"
                }
            },
            { $unwind: "$topPlayers" },
            { $replaceRoot: { newRoot: "$topPlayers" } }
        ],

        "mostBounties": [
            {
                $group: { _id: null, maxBounties: { $max: "$bounties" } }
            },
            {
                $lookup: {
                    from: "players",
                    localField: "maxBounties",
                    foreignField: "bounties",
                    as: "topPlayers"
                }
            },
            { $unwind: "$topPlayers" },
            { $replaceRoot: { newRoot: "$topPlayers" } }
        ],

        "mostRebuys": [
            {
                $group: { _id: null, maxRebuys: { $max: "$rebuys" } }
            },
            {
                $lookup: {
                    from: "players",
                    localField: "maxRebuys",
                    foreignField: "rebuys",
                    as: "topPlayers"
                }
            },
            { $unwind: "$topPlayers" },
            { $replaceRoot: { newRoot: "$topPlayers" } }
        ],
        "mostAddOns": [
            {
                $group: { _id: null, maxAddOns: { $max: "$addOns" } }
            },
            {
                $lookup: {
                    from: "players",
                    localField: "maxAddOns",
                    foreignField: "addOns",
                    as: "topPlayers"
                }
            },
            { $unwind: "$topPlayers" },
            { $replaceRoot: { newRoot: "$topPlayers" } }
        ]

    });
    res.send(topPlayers);
})

app.get('/players/leaders/average', async (req, res) => {
    // MongoDB aggregation operation
    // Still new to me, so I will describe everything in detail
    const topPlayers = await Player.aggregate([
        {
            // Make sure we only get players that have played at least one game
            $match: { gamesPlayed: { $gt: 0 } }
        },
        {
            // Calculate the stats we need for each player
            // We use $addFields to add new fields to the player object
            $addFields: {
                avgProfit: { $divide: ["$winnings", "$gamesPlayed"] },
                itmPercentage: { $divide: ["$itmFinishes", "$gamesPlayed"] },
                otbPercentage: { $divide: ["$onTheBubble", "$gamesPlayed"] },
                avgBounties: { $divide: ["$bounties", "$gamesPlayed"] },
                avgRebuys: { $divide: ["$rebuys", "$gamesPlayed"] },
                avgAddOns: { $divide: ["$addOns", "$gamesPlayed"] }
            }
        },
        {
            // $facet allows us to perform independent queries at the same time
            // Each field inside $facet is its own pipeline that gets processed separately
            $facet: {
                "bestAvgProfit": [
                    // Sort by avgProfit in descending order
                    { $sort: { avgProfit: -1 } },
                    // In the avgProfit category, we are getting the first value, which is the highest and storing it in maxAvgProfit
                    // $group gets all the values and then takes the first one
                    { $group: { _id: null, maxAvgProfit: { $first: "$avgProfit" } } },

                    // Find players with the maxAvgProfit
                    // $lookup is a join operation that allows us to join two collections together
                    // We are joining the players collection with the result of the previous step
                    {
                        $lookup: {
                            from: "players",
                            // Temporary variable to have access to the maxAvgProfit value in $lookup
                            let: { maxProfit: "$maxAvgProfit" },
                            // Recomputes the avgProfit for each player and uses $match to find the player(s) with the maxAvgProfit
                            pipeline: [
                                { $match: { gamesPlayed: { $gt: 0 } } },
                                {
                                    $addFields: {
                                        avgProfit: { $divide: ["$winnings", "$gamesPlayed"] }
                                    }
                                },
                                // The $$ is to access the variable we created in the previous step, otherwise, we wouldn't be able to access it
                                { $match: { $expr: { $eq: ["$avgProfit", "$$maxProfit"] } } }
                            ],
                            as: "topPlayers"
                        }
                    },
                    // Unwind the topPlayers array to get each player in a separate document
                    { $unwind: "$topPlayers" },
                    // Add the category name to the player object
                    { $addFields: { category: "Profit Per Game" } },
                    //Remove the outer object, so we don't have a nested array
                    { $replaceRoot: { newRoot: "$topPlayers" } }
                ],
                // Same idea for the rest of the categories
                "bestITM": [
                    { $sort: { itmPercentage: -1 } },
                    { $group: { _id: null, maxITM: { $first: "$itmPercentage" } } },
                    {
                        $lookup: {
                            from: "players",
                            let: { maxITM: "$maxITM" },
                            pipeline: [
                                { $match: { gamesPlayed: { $gt: 0 } } },
                                {
                                    $addFields: {
                                        itmPercentage: { $divide: ["$itmFinishes", "$gamesPlayed"] }
                                    }
                                },
                                { $match: { $expr: { $eq: ["$itmPercentage", "$$maxITM"] } } }
                            ],
                            as: "topPlayers"
                        }
                    },
                    { $unwind: "$topPlayers" },
                    { $addFields: { category: "ITM Percentage" } },
                    { $replaceRoot: { newRoot: "$topPlayers" } }
                ],
                "mostOTB": [
                    { $sort: { otbPercentage: -1 } },
                    { $group: { _id: null, maxOTB: { $first: "$otbPercentage" } } },
                    {
                        $lookup: {
                            from: "players",
                            let: { maxOTB: "$maxOTB" },
                            pipeline: [
                                { $match: { gamesPlayed: { $gt: 0 } } },
                                {
                                    $addFields: {
                                        otbPercentage: { $divide: ["$onTheBubble", "$gamesPlayed"] }
                                    }
                                },
                                { $match: { $expr: { $eq: ["$otbPercentage", "$$maxOTB"] } } }
                            ],
                            as: "topPlayers"
                        }
                    },
                    { $unwind: "$topPlayers" },
                    { $addFields: { category: "OTB Percentage" } },
                    { $replaceRoot: { newRoot: "$topPlayers" } }
                ],
                "mostAvgBounties": [
                    { $sort: { avgBounties: -1 } },
                    { $group: { _id: null, maxAvgBounties: { $first: "$avgBounties" } } },
                    {
                        $lookup: {
                            from: "players",
                            let: { maxAvgBounties: "$maxAvgBounties" },
                            pipeline: [
                                { $match: { gamesPlayed: { $gt: 0 } } },
                                {
                                    $addFields: {
                                        avgBounties: { $divide: ["$bounties", "$gamesPlayed"] }
                                    }
                                },
                                { $match: { $expr: { $eq: ["$avgBounties", "$$maxAvgBounties"] } } }
                            ],
                            as: "topPlayers"
                        }
                    },
                    { $unwind: "$topPlayers" },
                    { $addFields: { category: "Average Bounties" } },
                    { $replaceRoot: { newRoot: "$topPlayers" } }
                ],
                "mostAvgRebuys": [
                    { $sort: { avgRebuys: -1 } },
                    { $group: { _id: null, maxAvgRebuys: { $first: "$avgRebuys" } } },
                    {
                        $lookup: {
                            from: "players",
                            let: { maxAvgRebuys: "$maxAvgRebuys" },
                            pipeline: [
                                { $match: { gamesPlayed: { $gt: 0 } } },
                                {
                                    $addFields: {
                                        avgRebuys: { $divide: ["$rebuys", "$gamesPlayed"] }
                                    }
                                },
                                { $match: { $expr: { $eq: ["$avgRebuys", "$$maxAvgRebuys"] } } }
                            ],
                            as: "topPlayers"
                        }
                    },
                    { $unwind: "$topPlayers" },
                    { $addFields: { category: "Average Rebuys" } },
                    { $replaceRoot: { newRoot: "$topPlayers" } }
                ],
                "mostAvgAddOns": [
                    { $sort: { avgAddOns: -1 } },
                    { $group: { _id: null, maxAvgAddOns: { $first: "$avgAddOns" } } },
                    {
                        $lookup: {
                            from: "players",
                            let: { maxAvgAddOns: "$maxAvgAddOns" },
                            pipeline: [
                                { $match: { gamesPlayed: { $gt: 0 } } },
                                {
                                    $addFields: {
                                        avgAddOns: { $divide: ["$addOns", "$gamesPlayed"] }
                                    }
                                },
                                { $match: { $expr: { $eq: ["$avgAddOns", "$$maxAvgAddOns"] } } }
                            ],
                            as: "topPlayers"
                        }
                    },
                    { $unwind: "$topPlayers" },
                    { $addFields: { category: "Average Add Ons" } },
                    { $replaceRoot: { newRoot: "$topPlayers" } }
                ]
            }
        }
    ]);

    res.send(topPlayers);
})

// Checks if the user is logged in or not
app.get('/loggedin', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.send(false);
    }
    res.send(true);
})

// Checks if the user is an admin or not
app.get('/isAdmin', async (req, res) => {
    // Get the user for us to get their full name
    const user = await Account.findById(req.user?._id);

    if (!req.user?.admin) {
        if (!req.user) {
            return res.send({
                isAdmin: false,
                isLoggedIn: false
            });
        }
        else {
            return res.send({
                isAdmin: false,
                isLoggedIn: true,
                id: req.user._id,
                userFullName: user?.fullName || '',
                username: user?.username || ''
            });
        }

    }
    res.send({
        isAdmin: true,
        isLoggedIn: true,
        id: req.user._id,
        userFullName: user?.fullName || '',
        username: user?.username || ''
    });
})

// Redirect to Google
// This is the route that the user will hit when they want to log in with Google
// With paspport, we are choosing Google, and we are asking for the profile and email information from Google
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// After Google Auth is completed, Google will redirect to this route
// Passport will handle the authentication and redirect the user to the success or failure URL
app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/leaderboard`); // Success!
    }
);

// Logout route
app.get('/logout', (req, res, next) => {
    // Passport syntax for logging out
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.send('Logged out successfully');
    });
})

// Get one player
app.get('/players/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        // Valid ObjectId, but no player found
        if (!player) {
            return res.status(404).send('Player not found');
        }
        res.send(player);
    }
    // Invalid ObjectId
    catch (err) {
        return res.status(404).send('Player not found');
    }
})

//This gets a list of games for a player with a given id
//The id here is a player id
app.get('/games/:id', async (req, res) => {
    const { id } = req.params;
    //Mongoose way of finding all the games that a player has played
    //Checks if the player we are looking for is in the game
    const games = await Game.find({ "leaderboard.player": id })
    res.send(games);
})

//The id here is a game id
//Gets one specific game for show
app.get('/games/game/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        // Valid ObjectId, but no game found
        if (!game) {
            return res.status(404).send('Game not found');
        }
        res.send(game);
    }
    // Invalid ObjectId
    catch (err) {
        return res.status(404).send('Game not found');
    }
})

// Get all posts
app.get('/posts', async (req, res) => {
    // Populate the author field to get the author's details
    // Sort by date in descending order (newest first)
    const posts = await Post.find({}).populate('author').sort({ date: -1 });
    res.send(posts);
})

// Get all comments from a specific post
app.get('/posts/:id/comments', async (req, res) => {
    const { id } = req.params;
    try {
        const comments = await Comment.find({ post: id }).populate('author');
        res.send(comments);
    }
    catch (err) {
        pinoLogger.error({ err }, 'Error retrieving comments:');
        return res.status(500).send('Error retrieving comments')
    }
});

// Get one post
app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Populate the author field to get the author's details
        const post = await Post.findById(id).populate('author').populate({ path: 'comments', populate: { path: 'author' } });
        // await Post.findById(id).populate('author');
        // Valid ObjectId, but no post found
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.send(post);
    }
    // Invalid ObjectId
    catch (err) {
        pinoLogger.error({ err }, 'Error retrieving post:');
        return res.status(404).send('Post not found');
    }
})

// Validate account data (username and email) for uniqueness
app.get('/accounts/validateData', async (req, res) => {
    // Get the account data from the request body
    const accountData = req.query;
    let isUsernameTaken = false;
    let isEmailTaken = false;

    // Try to find an account with the given username or email
    // If the username or email match, then we know they are taken
    try {
        const accountUsername = await Account.findOne({ usernameLower: accountData.username?.toLowerCase() });
        const accountEmail = await Account.findOne({ email: accountData.email?.toLowerCase() });

        if (accountData.username) {
            if (accountUsername?.usernameLower == accountData.username.toLowerCase()) {
                isUsernameTaken = true;
            }
        }
        if (accountData.email) {
            if (accountEmail?.email == accountData.email.toLowerCase()) {
                isEmailTaken = true;
            }
        }
        res.send({
            isUsernameTaken,
            isEmailTaken
        });
    }
    catch (err) {
        pinoLogger.error({ err }, 'Error retrieving accounts:');
        return res.status(500).send('Error retrieving accounts');
    }
})


// Get account information for the logged in user
app.get('/accounts/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    try {
        const account = await Account.findById(id);
        // Valid ObjectId, but no account found
        if (!account) {
            return res.status(404).send('Account not found');
        }
        res.send(account);
    }
    // Invalid ObjectId
    catch (err) {
        return res.status(404).send('Account not found');
    }
})

// Get all active accounts. Only available to admins
app.get('/accounts', isAdmin, async (req, res) => {
    const allAccounts = await Account.find({ deleted: false });
    res.send(allAccounts);
})

//Delete one player
app.delete('/players/:id', isAdmin, async (req, res) => {
    const player = await Player.findByIdAndDelete(req.params.id);
    res.send(player);
})

//Delete one game
app.delete('/games/game/:id', isAdmin, async (req, res) => {
    const id = req.params.id
    const game = await Game.findById(id);

    //Go through every player and remove their stats in this game
    game.leaderboard.forEach(async (player, i) => {
        //In order so i == 0 means this player won
        if (i == 0)
            await Player.findByIdAndUpdate(player.player, { $inc: { wins: -1 } });
        if (player.itm)
            await Player.findByIdAndUpdate(player.player, { $inc: { itmFinishes: -1 } });
        if (player.otb)
            await Player.findByIdAndUpdate(player.player, { $inc: { onTheBubble: -1 } });

        //Delete the rest of the stats for this game
        await Player.findByIdAndUpdate(player.player, {
            $inc: {
                winnings: -player.profit,
                bounties: -player.bounties,
                rebuys: -player.rebuys,
                addOns: -player.addOns,
                gamesPlayed: -1
            }
        });

        //Delete actual game
        await Game.findByIdAndDelete(id);
    });

    res.send('Deleted game (TEST)');
});

// Delete a post
// Only admins can delete posts
// As of right now, any admin can delete any post, regardless of who created it
app.delete('/posts/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        // Find the post by ID and delete it
        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        // If the post has an image, delete it from Cloudinary
        if (post.imagePublicId) {
            await cloudinary.uploader.destroy(post.imagePublicId)
                .then(() => {
                    pinoLogger.info('Image deleted from Cloudinary');
                })
                .catch((error) => {
                    pinoLogger.error({ error }, 'Error deleting image from Cloudinary:');
                });
        }
    } catch (err) {
        pinoLogger.error({ err }, 'Error deleting post:');
        res.status(500).send('Error deleting post');
    }
    res.send('Deleted post');
})

// Delete a comment in a post
app.delete('/posts/:postId/comments/:commentId', isLoggedIn, async (req, res) => {
    const { postId, commentId } = req.params;
    const { author } = req.body; // Get the author from the request body

    // Get the comment and populate to get the author's info
    let comment = await Comment.findById(commentId).populate('author');
    if (!comment) {
        return res.status(404).send('Comment not found');
    }

    // If a user has an active account, only they can delete their comments
    // If the account is deleted, then admins can delete the comment
    if (author._id.toString() == comment.author._id.toString() || (comment.author.deleted && req.user.admin)) {
        try {
            // Find the post and remove the comment
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).send('Post not found');
            }

            // Delete the comment from the post's comments array and from the DB
            post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);

            comment = await Comment.findByIdAndDelete(commentId);

            // Save and send the updated post
            await post.save();

            // Populate the author and comments fields to get the updated post with all details
            // We also populate the author field in the comments
            // This is called deep population
            const updatedPost = await Post.findById(postId).populate('author').populate({ path: 'comments', populate: { path: 'author' } });

            res.send(updatedPost);
        } catch (err) {
            pinoLogger.error({ err }, 'Error deleting comment:');
            res.status(500).send('Error deleting comment');
        }
    }
    else {
        return res.status(403).send('Unauthorized to delete comment.');
    }
})

// Delete an account
app.delete('/accounts/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;

    // Only the account owner or an admin can delete the account
    if (req.user._id.toString() == id || req.user.admin) {
        try {
            const account = await Account.findById(id);
            if (!account) {
                return res.status(404).send('Account not found');
            }

            // We are doing a soft delete, so we are not actually deleting the account from the database
            // Instead, we are just clearing out the sensitive information

            // If the account was created with Google, we clear out the Google ID
            if (account.googleId) {
                account.googleId = null;
            }

            // We're setting the username and email to something that indicates the account was deleted
            // Needs to be unique to avoid issues with the DB, so we add the account ID to it
            account.username = `[deleted]${account._id}`;
            account.email = `deleted-${account._id}@example.com`;
            account.deleted = true;

            await account.save();

            // Log out the user if they deleted their own account
            if (req.user._id.toString() == id) {
                req.logout((err) => {
                    if (err) {
                        return next(err);
                    }
                    res.send('Account deleted and logged out successfully');
                });
            }
            else {
                res.send('Account deleted successfully');
            }

        } catch (err) {
            pinoLogger.error({ err }, 'Error deleting account:');
            res.status(500).send('Error deleting account');
        }
    }
    else {
        return res.status(403).send('You are not authorized to delete this account');
    }
});

// Post request handling sign ups
app.post('/signup', async (req, res, next) => {
    // Check if the user is already logged in
    // It shouldn't be the case, but we add it for safety
    if (req.isAuthenticated()) {
        return res.status(400).json('Already logged in');
    }
    // Destructure data from req.body
    const { username, password, email, firstName, lastName } = req.body;

    // Try/catch to handle errors during sign up
    try {
        // Make an account with the data from the form
        // We don't initially pass the password to the Account constructor 
        // because the register method will hash it for us and store the hashed password it in the DB
        // Lowercase the email for consistency. For the username, the schema already handles that with usernameLower, which is automatically added when we save the account
        const account = new Account({ username, email: email.toLowerCase(), fullName: `${firstName} ${lastName}`, admin: false });
        const registeredAccount = await Account.register(account, password);

        // Passport function to log in the user after signing up
        req.logIn(registeredAccount, (err) => {
            if (err) {
                return next(err);
            }
            else {
                res.send('Created account');
            }
        });
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

// Post request handling log in
app.post('/login', async (req, res, next) => {
    // Check if the user is already logged in
    // It shouldn't be the case, but we add it for safety
    if (req.isAuthenticated()) {
        return res.status(400).json('Already logged in');
    }

    // Remember to add the withCredentials: true to the axios request in the front end
    // Passport custom callback function to handle login and pass over info to React
    passport.authenticate('local', (err, user, info) => {
        // Passport error
        if (err) {
            return next(err);
        }
        // Checks if the credentials are valid
        if (!user) {
            return res.status(401).json('Invalid username or password');
        }

        if (user?.deleted) {
            return res.status(403).json('This account has been deleted');
        }

        // Function provided by passport, sets up the session
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            // If login is successful, send a response to the client with the user info
            // Important to return and not just do res.json
            return res.json({ message: 'Logged in successfully', user: { id: user._id, email: user.email, isAdmin: user.admin, fullName: user.fullName, username: user.username } });
        });

        // Call the middleware function with req and res
    })(req, res, next);
});

//Post request handling adding players to DB
app.post('/players', isLoggedIn, validatePlayer, async (req, res) => {
    //Destructure from req.body and add player with all the info to DB
    const { firstName, lastName, nationality } = req.body;
    const player = new Player({
        firstName, lastName, nationality, gamesPlayed: 0, wins: 0,
        itmFinishes: 0, onTheBubble: 0, bounties: 0,
        rebuys: 0, addOns: 0, winnings: 0
    });
    await player.save();


    //Check if this is necessary.
    //e.preventDefault() on the form submit handler avoids getting to this page
    res.send(req.body);
})

//Post request to add games to DB
app.post('/games', isAdmin, validateTournament, async (req, res) => {
    //Get info from request
    const { leaderboard, numPlayers, prizePool } = req.body;

    //gameData will be part of the Game object
    const gameData = new Array(numPlayers);
    const currDate = new Date();

    //The leaderboard array is an array of objects with all the info about each player's stats in this game
    //Revise this later: No need to do all of this, when we can just add the leaderboard array directly to Game object
    //Input validation required tho
    leaderboard.forEach((player, i) => {
        if (player._id !== '-1') {
            const playerData = {
                player: player.player,
                //Mongoose automatically converts 'yes' and 'no' string to true and false values
                itm: player.itm,
                otb: player.otb,
                profit: parseInt(player.profit),
                rebuys: player.rebuys,
                bounties: player.bounties,
                addOns: player.addOns
            }
            gameData[i] = playerData;
        }

    })

    //Create a new game and add all the information
    const newGame = new Game({
        date: new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()),
        numPlayers: numPlayers,
        prizePool: prizePool,
        leaderboard: gameData
    })

    //Save to DB
    await newGame.save();
    res.send(newGame);
})

// Post request to add posts to the blog 
// This endpoint allows admins to create new posts with an optional image upload
// upload.single('picture') comes from multer, which handles file uploads and allows us to upload one picture
// 'picture' is the name of the file input in the form
app.post('/posts', upload.single('picture'), isAdmin, validatePost, async (req, res) => {
    const { title, content } = req.body;

    // Validate that title and content are not empty
    if (!title || title.trim() === '' || !content || content.trim() === '') {
        return res.status(400).json({ error: 'Title and content cannot be empty' });
    }
    const user = await Account.findById(req.user?._id);

    if (!user) {
        return res.status(401).send('User not found');
    }

    // Create a new Post object with the data from the request
    const post = new Post({
        // Get the user id from the request
        author: user._id,
        // Initially empty image, will be filled if a file is uploaded
        image: '',
        title: title,
        content: content,
        comments: [],
        date: new Date(),
        likes: 0,
        likedBy: []
    });

    // If a file is uploaded, upload it to Cloudinary
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'MMPoker/posts',          // organize in a subfolder for posts
                resource_type: 'image',           // explicitly image
                use_filename: true,               // keep original file name
                unique_filename: true,            // avoid name conflicts by adding unique suffix
                overwrite: false,                 // don't overwrite existing files
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // whitelist of allowed image formats
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },   // limit max dimensions to 800x800
                    { fetch_format: 'auto', quality: 'auto' }     // auto format and quality for performance
                ]
            });
            // If the upload is successful, this code will run, otherwise, the catch block will handle errors
            post.image = result.secure_url; // Store the secure URL of the uploaded image
            post.imagePublicId = result.public_id; // Store the public ID in case we need to delete it later
        }
        catch (err) {
            // Send error to the front end to handle it there
            pinoLogger.error({ err }, 'Error uploading image to Cloudinary');
            return res.status(415).send(err);
        }
    }
    // Save the post to the database
    await post.save();
    res.send(post);
});

// Post request to add comments to a post
app.post('/posts/:id/comments', isLoggedIn, async (req, res) => {
    // Get the id and content from the request
    const { id } = req.params;
    const { content } = req.body;

    // Validate that the content is not empty
    if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    try {
        const post = await Post.findById(id);
        const user = await Account.findById(req.user?._id);
        if (!post) {
            return res.status(404).send('Post not found');
        }


        // Create a new comment
        // We need to reference the post and the author in the comment
        // Store the object ids, not the full objects, then we can populate them later when we need the full objects
        const comment = new Comment({
            content: content,
            author: user._id,
            post: post._id,
            date: new Date()
        });

        // Save the comment and add it to the post's comments array and save the post
        await comment.save();
        post.comments.push(comment._id);
        await post.save();

        // Populate the comments array with the author information and send the updated post back
        const updatedPost = await Post.findById(id).populate('author').populate({ path: 'comments', populate: { path: 'author' } });

        res.send(updatedPost);

    }

    catch (err) {
        pinoLogger.error({ err }, 'Error adding comment:');
        return res.status(500).json({ error: err.message });
    }
})

// Patch request handles the new games, and it updates the stats for all the players involved
app.patch('/players', isAdmin, async (req, res) => {
    const { leaderboard } = req.body;

    leaderboard.forEach(async (player, i) => {
        if (player.player !== '-1') {
            //Mongoose syntax, increase games played by 1
            await Player.findByIdAndUpdate(player.player, { $inc: { gamesPlayed: +1 } });

            //Increase one to stats if player made it to the money or was on the bubble
            if (player.itm === 'yes')
                await Player.findByIdAndUpdate(player.player, { $inc: { itmFinishes: +1 } });
            if (player.otb === 'yes')
                await Player.findByIdAndUpdate(player.player, { $inc: { onTheBubble: +1 } });

            //index 0 means first row, this player has won
            if (i === 0)
                await Player.findByIdAndUpdate(player.player, { $inc: { wins: +1 } });

            //Update earnings bounties, rebuys and add ons for everyone
            await Player.findByIdAndUpdate(player.player, {
                $inc: {
                    winnings: +player.profit,
                    bounties: +player.bounties,
                    rebuys: +player.rebuys,
                    addOns: +player.addOns
                }
            });
        }

    })
    res.send("Received patch request");
})

//Patch request to handle the edited games and update the stats for the players involved
app.patch('/players/edit/:gameId', isAdmin, validateTournament, async (req, res) => {
    const { oldLeaderboard, leaderboard, prizePool, numPlayers } = req.body;
    const { gameId } = req.params;

    //Use two sets to check if we need to change the gamesPlayed stat for every player involved in the edit
    let oldSet = new Set();
    let newSet = new Set();
    oldLeaderboard.forEach((player) => { oldSet.add(player.player) });
    leaderboard.forEach((player) => { newSet.add(player.player) });

    //Use map for O(1) lookups
    const oldMap = new Map();
    oldLeaderboard.forEach((player) => {
        // The key is the player id, and the value is the player object which contains all the stats
        oldMap.set(player.player, player);
    });

    // Check if we added or removed a player, and update the global stats for that player
    Array.from(newSet, async (player, i) => {
        // Sets should never be empty, so this should work
        if (i == 0) {
            // Will check against the first value of oldSet, if we have a different winner, update data in DB
            const oldWinner = oldSet.values().next().value;
            if (player != oldWinner) {
                await Player.findByIdAndUpdate(player, { $inc: { wins: +1 } });
                await Player.findByIdAndUpdate(oldWinner, { $inc: { wins: -1 } });
            }
        }

        // We added a new player to the game
        if (!oldSet.has(player)) {
            // Mongoose syntax to increase stats
            await Player.findByIdAndUpdate(player, { $inc: { gamesPlayed: +1 } });

            // Increase one to the stats if player made it to the money or was on the bubble
            if (leaderboard[i].itm)
                await Player.findByIdAndUpdate(player, { $inc: { itmFinishes: +1 } });
            if (leaderboard[i].otb)
                await Player.findByIdAndUpdate(player, { $inc: { onTheBubble: +1 } });

            //Update all other stats
            await Player.findByIdAndUpdate(player, {
                $inc: {
                    winnings: +leaderboard[i].profit,
                    bounties: +leaderboard[i].bounties,
                    rebuys: +leaderboard[i].rebuys,
                    addOns: +leaderboard[i].addOns
                }
            });
        }

        //This player was already in the game
        else {
            //Compare everything and update
            const currPlayerData = oldMap.get(player);

            //Update ITM and OTB if they changed. They're both booleans
            if (leaderboard[i].itm != currPlayerData.itm) {
                if (leaderboard[i].itm)
                    await Player.findByIdAndUpdate(player, { $inc: { itmFinishes: +1 } });
                else
                    await Player.findByIdAndUpdate(player, { $inc: { itmFinishes: -1 } });
            }

            if (leaderboard[i].otb != currPlayerData.otb) {
                if (leaderboard[i].otb)
                    await Player.findByIdAndUpdate(player, { $inc: { onTheBubble: +1 } });
                else
                    await Player.findByIdAndUpdate(player, { $inc: { onTheBubble: -1 } });
            }

            //If any other stat has changed update it
            if (leaderboard[i].profit != currPlayerData.profit
                || leaderboard[i].rebuys != currPlayerData.rebuys
                || leaderboard[i].bounties != currPlayerData.bounties
                || leaderboard[i].addOns != currPlayerData.addOns) {

                // Calculate the net difference between their old stat and their new stat
                const diffProfit = leaderboard[i].profit - currPlayerData.profit;
                const diffRebuys = leaderboard[i].rebuys - currPlayerData.rebuys;
                const diffBounties = leaderboard[i].bounties - currPlayerData.bounties;
                const diffAddOns = leaderboard[i].addOns - currPlayerData.addOns;

                // Update everything else
                await Player.findByIdAndUpdate(player, {
                    $inc: {
                        winnings: +diffProfit,
                        bounties: +diffBounties,
                        rebuys: +diffRebuys,
                        addOns: +diffAddOns
                    }
                });
            }
        }
    });

    //If a player is deleted from the game, delete stats for this game on their profile
    oldSet.forEach(async (player, i) => {
        if (!newSet.has(player)) {
            const currPlayerData = oldMap.get(player);

            //Mongoose syntax, decrease games played by 1
            //Already decreased wins if it was needed
            await Player.findByIdAndUpdate(player, { $inc: { gamesPlayed: -1 } });

            //Decrease one to the stats if player made it to the money or was on the bubble
            if (currPlayerData.itm)
                await Player.findByIdAndUpdate(player, { $inc: { itmFinishes: -1 } });

            if (currPlayerData.otb)
                await Player.findByIdAndUpdate(player, { $inc: { onTheBubble: -1 } });

            //Update earnings, bounties, rebuys and add ons
            await Player.findByIdAndUpdate(player, {
                $inc: {
                    winnings: -currPlayerData.profit,
                    bounties: -currPlayerData.bounties,
                    rebuys: -currPlayerData.rebuys,
                    addOns: -currPlayerData.addOns
                }
            });
        }
    });

    //Update leaderboard
    await Game.findByIdAndUpdate(gameId, { leaderboard, numPlayers, prizePool });

    res.send('Received EDIT patch request');
})

// Patch request to edit a player's information
app.patch('/players/player/:id', isAdmin, validatePlayer, async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, nationality } = req.body;

    try {
        const player = await Player.findById(id);
        player.firstName = firstName;
        player.lastName = lastName;
        player.nationality = nationality;
        await player.save();
    }
    catch (err) {
        return res.status(404).send('Player not found');
    }
    res.send('Player info updated successfully');
})

// Patch request to handle likes on posts
app.patch('/posts/:id/like', isLoggedIn, async (req, res) => {
    // Get the post by id from the request parameters
    const { id } = req.params;
    const post = await Post.findById(id);

    // If player has already liked the post, remove their like
    if (post.likedBy.includes(req.user._id)) {
        post.likes -= 1;
        post.likedBy = post.likedBy.filter(like => like.toString() !== req.user._id.toString());
    }
    // If player has not liked the post, add their like
    else {
        post.likes += 1;
        post.likedBy.push(req.user._id);
    }

    await post.save();

    // Mongoose snytax to populate the post's comments array with the author information
    const updatedPost = await Post.findById(id).populate('author').populate({ path: 'comments', populate: { path: 'author' } });

    res.send(updatedPost);
})

// Patch request to edit a post
app.patch('/posts/:id/edit', upload.single('picture'), isAdmin, validatePost, async (req, res) => {
    const { id } = req.params;
    const { title, content, deletedImage } = req.body;

    // Validate that title and content are not empty
    if (!title || title.trim() === '' || !content || content.trim() === '') {
        return res.status(400).json({ error: 'Title and content cannot be empty' });
    }

    // Find the post by id and update its title and content
    try {
        const post = await Post.findById(id);
        if (!post)
            return res.status(404).send('Post not found.');
        post.title = title;
        post.content = content;

        // If the user removed the image, delete it from Cloudinary and update the post
        if (deletedImage && deletedImage != '') {
            // The parameter has to be the public ID of the image to be deleted
            await cloudinary.uploader.destroy(deletedImage)
                .then(() => {
                    post.image = '';
                    post.imagePublicId = '';
                })
                .catch((error) => {
                    pinoLogger.error({ error }, 'Error deleting old image from Cloudinary:');
                    return res.status(500).send('Error deleting old image');
                });
        }

        // If a new image is uploaded, upload it to Cloudinary and update the post's image
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'MMPoker/posts',
                resource_type: 'image',
                use_filename: true,
                unique_filename: true,
                overwrite: false,
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { fetch_format: 'auto', quality: 'auto' }
                ]
            });

            // If the upload is successful, this code will run, otherwise, the catch block will handle errors
            post.image = result.secure_url;
            post.imagePublicId = result.public_id; // Store the public ID in case we need to delete it later
        }
        await post.save();
    }
    catch (err) {
        pinoLogger.error({ err }, 'Error uploading image to Cloudinary:');
        if (err.http_code == 400) {
            return res.status(415).send(err);
        }

        return res.status(500).send('Internal server error. Error uploading image');
    }

    res.send('Post updated successfully');
})

// Patch request to update account information
app.patch('/accounts/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;
    const { username, email, fullName } = req.body;
    let changedUsername = false;

    // Server side validation
    if (!isValidEmail(email)) {
        return res.status(400).send('Invalid email format');
    }
    if (!isValidUsername(username)) {
        return res.status(400).send('Invalid username format');
    }
    if (!isValidFullName(fullName)) {
        return res.status(400).send('Invalid full name format');
    }


    try {
        // Find the account by id and update its information
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).send('Account not found.');
        }

        // Check if the username already exists in the database excluding the current account
        // We do a case insensitive search by using usernameLower field
        const existingUsername = await Account.findOne({
            usernameLower: username.trim().toLowerCase(),
            _id: { $ne: id }
        });

        // If the username already exists in the database and it's not the current account, return an error
        if (existingUsername) {
            return res.status(400).send('Username already taken');
        }

        // If we haven't returned yet, it means the username is valid and not taken, so we can update it
        account.username = username.trim();
        changedUsername = true;

        // Check if the email already exists in the database excluding the current account
        const existingEmail = await Account.findOne({
            email: email.trim().toLowerCase(),
            _id: { $ne: id }
        });

        // If the email already exists in the database and it's not the current account, return an error
        if (existingEmail) {
            return res.status(400).send('Email already taken');
        }

        // If we haven't returned yet, it means the email is valid and not taken, so we can update it
        account.email = email.trim();

        if (fullName != '')
            account.fullName = fullName.trim();

        await account.save();

        if (changedUsername) {
            // Re log in the user with the updated info in the account object. Function provided by passport
            req.logIn(account, (err) => {
                if (err) {
                    return next(err);
                }

                // Ensures the session is saved before sending the response
                res.send(account);
            });
        }
        else {
            res.send(account);
        }
    }
    catch (err) {
        pinoLogger.error({ err }, 'Error updating account information:');
        return res.status(500).send('Server error');
    }
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    pinoLogger.info(`Server listening on port ${port}`);
})