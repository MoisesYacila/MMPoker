const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    //DONT SAVE PASSWORD LIKE THIS, I WILL FIX THIS BEFORE APP GOES LIVE
    password: String,
    admin: Boolean
})

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;