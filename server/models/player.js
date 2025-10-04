const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    gamesPlayed: Number,
    wins: Number,
    itmFinishes: Number,
    onTheBubble: Number,
    bounties: Number,
    rebuys: Number,
    addOns: Number,
    winnings: Number
});

const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;