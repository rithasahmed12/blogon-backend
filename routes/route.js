import express from 'express';
import { 
    authUser,
    registerUser,
    getAllBlogs,
    getBlog,
    addNewBlog,
    updateBlog,
    deleteBlog
} from '../controllers/controller.js';
const router = express.Router();
import upload from "../middlewares/multer.js";
import { protect } from '../middlewares/authMiddleware.js';


router.post('/signup',registerUser); 
router.post('/login',authUser);

router.route('/post').get(protect,getAllBlogs).post(protect,upload.single('image'), addNewBlog);
router.route('/post/:id').put(protect,upload.single('image'), updateBlog).delete(protect,deleteBlog).get(protect,getBlog);


export default router