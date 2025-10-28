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
    usernameLower: {
        type: String,
        unique: true
    },
    googleId: String,
    fullName: {
        type: String,
        required: true
    },
    admin: Boolean,
    // Soft delete flag
    deleted: {
        type: Boolean,
        default: false
    }
});

// Set up passport-local-mongoose
AccountSchema.plugin(passportLocalMongoose);

// Set usernameLower before saving
AccountSchema.pre('save', function (next) {
    // this.isModified is provided by Mongoose to check if a field has been modified. It works when we create or update a document.
    if (this.isModified('username')) {
        this.usernameLower = this.username.toLowerCase();
    }
    next();
});

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;