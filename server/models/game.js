const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GameInfo = require('./gameinfo')

//Schema for a single poker game
const GameSchema = new Schema({
    date: Date,
    numPlayers: Number,
    prizePool: Number,
    leaderboard: [GameInfo]
})

const Game = mongoose.model('Game', GameSchema);
module.exports = Game;