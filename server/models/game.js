const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema for a single poker game
const GameSchema = new Schema({
    date: Date,
    numPlayers: Number,
    prizePool: Number,
    leaderboard: [{
        player: {
            type: Schema.Types.ObjectId,
            ref: "Player"
        },
        itm: Boolean,
        otb: Boolean,
        profit: Number,
        rebuys: Number,
        bounties: Number,
        addOns: Number
    }]
})

const Game = mongoose.model('Game', GameSchema);
module.exports = Game;