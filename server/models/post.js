const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    // URL to the image, if provided
    image: String,
    content: {
        type: String,
        required: true
    },
    // Array of comments, each with an author, content, and date
    comments: [{
        author: String,
        content: String,
        date: Date
    }],
    // Reference to the author of the post, which is an Account object
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    date: Date,
    likes: Number
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;