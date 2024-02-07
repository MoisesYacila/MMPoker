const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    name: String,
    nationality: {
        type: String,
        enum: ['us', 'nic', 'spa', 'mex', 'ven', 'arg']
    },
    gamesPlayed: Number,
    wins: Number,
    itmFinishes: Number,
    bubbles: Number,
    bounties: Number,
    rebuys: Number,
    addOns: Number,
    winnings: Number
})

const Player = mongoose.model('Player', PlayerSchema);
module.exports = Player;