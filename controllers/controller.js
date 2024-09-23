import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import Blog from "../models/postModel.js";
import cloudinary from "../utils/cloudinary.js";

const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body;
    
    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if(user){
        generateToken(res,user._id,'userJwt');
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email, 
        })
    }else{
        res.status(400);
        throw new Error('Invalid user data');
    } 
})

const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    
    const user = await User.findOne({email});
    
    if(user && (await user.matchPassword(password))){
        generateToken(res,user._id,'userJwt');
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
        })
    }else{
        res.status(401);
        throw new Error('Invalid email or password');
    }
})


const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
});

const getBlog = asyncHandler(async (req, res) => {
    const {id} =req.params;
    const blogs = await Blog.findById(id);
    res.status(200).json(blogs);
});

const addNewBlog = asyncHandler(async (req, res) => {
    
    const { title, content,author, userId } = req.body;
    let imageUrl = null;

    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(400).json({ error: 'Failed to upload image to Cloudinary' });
        }
    }

    const blog = await Blog.create({
        title,
        content,
        userId,
        author,
        image: imageUrl
    });

    res.status(201).json(blog);
});

const updateBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    if (blog.image) {
        const publicIdMatch = blog.image.match(/\/upload\/v\d+\/([^./]+)\./);
        if (publicIdMatch && publicIdMatch[1]) {
            const publicId = publicIdMatch[1];
            await cloudinary.uploader.destroy(publicId);
        }
    }

    let imageUrl = blog.image; // Retain existing image if not uploading a new one

    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(400).json({ error: 'Failed to upload new image to Cloudinary' });
        }
    }

    blog.title = req.body.title || blog.title;
    blog.excerpt = req.body.excerpt || blog.excerpt;
    blog.content = req.body.content || blog.content;
    blog.image = imageUrl;

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
});

const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        res.status(404);
        throw new Error('Blog not found');
    }

    if (blog.image) {
        const publicIdMatch = blog.image.match(/\/upload\/v\d+\/([^./]+)\./);
        if (publicIdMatch && publicIdMatch[1]) {
            const publicId = publicIdMatch[1];
            await cloudinary.uploader.destroy(publicId);
        }
    }

    await Blog.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Blog deleted' });
});

export {
    registerUser,
    authUser,
    getAllBlogs,
    getBlog,
    addNewBlog,
    updateBlog,
    deleteBlog
}