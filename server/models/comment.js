const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for comments on posts
// A comment will have content, an author, a reference to the post it belongs to, and a date
const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    date: Date
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
