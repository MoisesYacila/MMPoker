const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Game stats of a specific player
const GameInfoSchema = new Schema({
    player: {
        type: Schema.Types.ObjectId,
        ref: "Player"
    },
    profit: Number,
    rebuys: Number,
    bounties: Number,
    addOns: Number
})

const GameInfo = mongoose.model('GameInfo', GameInfoSchema);
module.exports = GameInfo;