const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Account = require('./models/account');
const Player = require('./models/player');
const Game = require('./models/game');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

//Connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/mmpoker')
    .then(() => {
        console.log("Database connected.")
    })
    .catch(err => {
        console.log("Database connection error.")
        console.log(err)
    });

//Check documentation if there are any questions with these
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Setting up session and passport, from the documentation
const sessionConfig = {
    secret: 'secret',   // Change this to a random string in production
    resave: false,
    saveUninitialized: false,
    cookie: {
        // Sets the max age of the cookie to 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
        //secure: true, // Set to true if using HTTPS, consider this for production
    }
};

//Important to use session before passport.initialize() and passport.session()
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Setting up passport according to its documentation
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

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

app.get('/players/:id', async (req, res) => {
    const player = await Player.findById(req.params.id);
    res.send(player);
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
    const game = await Game.findById(req.params.id);
    res.send(game);
})

//Delete one player
app.delete('/players/:id', async (req, res) => {
    const player = await Player.findByIdAndDelete(req.params.id);
    res.send(player);
})

//Delete one game
app.delete('/games/game/:id', async (req, res) => {
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

    console.log(game);

    res.send('Deleted game (TEST)');
});

// Post request handling sign ups
app.post('/signup', async (req, res) => {
    // Destructure data from req.body
    const { username, password, email } = req.body;

    // Make an account with the data from the form
    // We don't initially pass the password to the Account constructor 
    // because the register method will hash it for us and store the hashed password it in the DB
    const account = new Account({ username, email });
    const registeredAccount = await Account.register(account, password);
    console.log(registeredAccount);
    res.send(registeredAccount);
});

//Post request handling adding players to DB
app.post('/players', async (req, res) => {
    console.log(req.body)
    //Destructure from req.body and add player with all the info to DB
    const { name, country } = req.body;
    const player = new Player({
        name: name, nationality: country, gamesPlayed: 0, wins: 0,
        itmFinishes: 0, onTheBubble: 0, bounties: 0,
        rebuys: 0, addOns: 0, winnings: 0
    });
    await player.save();


    //Check if this is necessary.
    //e.preventDefault() on the form submit handler avoids getting to this page
    res.send(req.body);
})

//Post request to add games to DB
app.post('/games', async (req, res) => {
    //Get info from request
    const { data, numPlayers, prizePool } = req.body;

    //gameData will be part of the Game object
    const gameData = new Array(numPlayers);
    const currDate = new Date();

    //The data array is an array of objects with all the info about each player's stats in this game
    //Revise this later: No need to do all of this, when we can just add the data array directly to Game object
    //Input validation required tho
    data.forEach((player, i) => {
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
    res.send(req.body);
})

// Patch request handles the new games, and it updates the stats for all the players involved
app.patch('/players', async (req, res) => {
    console.log(req.body)
    const { data } = req.body;

    data.forEach(async (player, i) => {
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
app.patch('/players/edit/:id', async (req, res) => {
    const { oldData, newData } = req.body;
    const { id } = req.params;

    //Use two sets to check if we need to change the gamesPlayed stat for every player involved in the edit
    let oldSet = new Set();
    let newSet = new Set();
    oldData.leaderboard.forEach((player) => { oldSet.add(player.player) });
    newData.forEach((player) => { newSet.add(player.player) });

    //Use map for O(1) lookups
    const oldMap = new Map();
    oldData.leaderboard.forEach((player) => {
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
            if (newData[i].itm)
                await Player.findByIdAndUpdate(player, { $inc: { itmFinishes: +1 } });
            if (newData[i].otb)
                await Player.findByIdAndUpdate(player, { $inc: { onTheBubble: +1 } });

            //Update all other stats
            await Player.findByIdAndUpdate(player, {
                $inc: {
                    winnings: +newData[i].profit,
                    bounties: +newData[i].bounties,
                    rebuys: +newData[i].rebuys,
                    addOns: +newData[i].addOns
                }
            });
        }

        //This player was already in the game
        else {
            //Compare everything and update
            const currPlayerData = oldMap.get(player);

            //Update ITM and OTB if they changed. They're both booleans
            if (newData[i].itm != currPlayerData.itm) {
                if (newData[i].itm)
                    await Player.findByIdAndUpdate(player, { $inc: { itmFinishes: +1 } });
                else
                    await Player.findByIdAndUpdate(player, { $inc: { itmFinishes: -1 } });
            }

            if (newData[i].otb != currPlayerData.otb) {
                if (newData[i].otb)
                    await Player.findByIdAndUpdate(player, { $inc: { onTheBubble: +1 } });
                else
                    await Player.findByIdAndUpdate(player, { $inc: { onTheBubble: -1 } });
            }

            //If any other stat has changed update it
            if (newData[i].profit != currPlayerData.profit
                || newData[i].rebuys != currPlayerData.rebuys
                || newData[i].bounties != currPlayerData.bounties
                || newData[i].addOns != currPlayerData.addOns) {

                // Calculate the net difference between their old stat and their new stat
                const diffProfit = newData[i].profit - currPlayerData.profit;
                const diffRebuys = newData[i].rebuys - currPlayerData.rebuys;
                const diffBounties = newData[i].bounties - currPlayerData.bounties;
                const diffAddOns = newData[i].addOns - currPlayerData.addOns;

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
    await Game.findByIdAndUpdate(id, { leaderboard: newData, numPlayers: newData.length });

    res.send('Received EDIT patch request');
})

app.listen(8080, () => {
    console.log("Server listening on port 8080");
})