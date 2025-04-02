const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    name: String,
    nationality: {
        type: String,
        enum: ['US', 'NI', 'ES', 'MX', 'VE', 'AR']
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