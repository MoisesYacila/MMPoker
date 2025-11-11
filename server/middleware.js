const Joi = require('joi');
const NAME_REGEX = /^[\p{L}\s'-]{2,30}$/u;

const isLoggedIn = (req, res, next) => {
    // Don't allow operation if user is not authenticated
    if (!req.isAuthenticated()) {
        // We can catch this in the front end to handle the error
        return res.status(401).send('Unauthorized. Login required to perform this action.');
    }
    // If user is authenticated, continue to the next middleware or route handler
    next();
}

const isAdmin = (req, res, next) => {
    // Check if the user is authenticated and has admin privileges
    if (!req.isAuthenticated()) {
        // If not authenticated, send a 401 Unauthorized response
        return res.status(401).send('Unauthorized. Login required to perform this action.');
    }
    if (!req.user.admin) {
        // If not admin, send a 403 Forbidden response
        return res.status(403).send('Forbidden. Only admins can take this action.');
    }
    // If the user is an admin, continue to the next middleware or route handler
    next();
}

const validatePlayer = (req, res, next) => {
    // Full name between 5 and 40 characters, only letters, spaces, apostrophes, and hyphens
    const playerSchema = Joi.object({
        firstName: Joi.string().pattern(NAME_REGEX).required(),
        lastName: Joi.string().pattern(NAME_REGEX).required(),
        nationality: Joi.string().length(2).required()
    });
    const { error } = playerSchema.validate(req.body);
    if (error) {
        return res.status(400).send(`Validation error: ${error.details[0].message}`);
    }
    next();
}

const validateTournament = (req, res, next) => {
    // Schema for tournament data validation
    const tournamentSchema = Joi.object({
        // Data array with at least 5 players
        // Each one must have the following fields
        leaderboard: Joi.array().items(Joi.object({
            // 24 character hex string which is the format for MongoDB ObjectIDs
            player: Joi.string().hex().length(24).required(),
            itm: Joi.boolean().required(),
            otb: Joi.boolean().required(),
            profit: Joi.number().required(),
            rebuys: Joi.number().required().min(0).integer(),
            bounties: Joi.number().required().min(0).integer(),
            addOns: Joi.number().required().min(0).integer()
        })).required().min(5),
        numPlayers: Joi.number().required().min(5).integer(),
        prizePool: Joi.number().required().min(0),
        // Optional field for editing tournaments. It holds the previous leaderboard data
        oldLeaderboard: Joi.array().items(Joi.object({
            // 24 character hex string which is the format for MongoDB ObjectIDs
            _id: Joi.string().hex().length(24).optional(),
            player: Joi.string().hex().length(24).required(),
            itm: Joi.boolean().required(),
            otb: Joi.boolean().required(),
            profit: Joi.number().required(),
            rebuys: Joi.number().required().min(0).integer(),
            bounties: Joi.number().required().min(0).integer(),
            addOns: Joi.number().required().min(0).integer()
        })).optional().min(5)
    });
    const { error } = tournamentSchema.validate(req.body);
    if (error) {
        return res.status(400).send(`Validation error: ${error.details[0].message}`);
    }
    next();
}

const validatePost = (req, res, next) => {
    // Schema for post data validation
    const postSchema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        content: Joi.string().min(2).required()
    }).unknown(true); // Allow unknown keys for handling multipart/form-data (like images)
    const { error } = postSchema.validate(req.body);
    if (error) {
        return res.status(400).send(`Validation error: ${error.details[0].message}`);
    }
    next();
}


// Export the middleware functions
// Make sure to export as an object and not separately, otherwise module.exports will be the last middleware
// and the first one will be ignored
module.exports = {
    isLoggedIn,
    isAdmin,
    validatePlayer,
    validateTournament,
    validatePost
}