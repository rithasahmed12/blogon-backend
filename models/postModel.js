import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String},
    userId: { type: String},
    image: { type: String, default: null } // Optional image field
}, {
    timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog
