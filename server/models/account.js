const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passportGoogle = require('passport-google-oauth');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    // We only need email here because passport-local-mongoose will automatically add the username and password fields
    email: {
        type: String,
        required: true,
        unique: true
    },
    admin: Boolean
});

// Set up passport-local-mongoose
AccountSchema.plugin(passportLocalMongoose);

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;