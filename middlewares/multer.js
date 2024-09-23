import multer from "multer";

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
};

const fileSizeLimit = 5 * 1024 * 1024; // 5 MB for file uploads

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: fileSizeLimit, // For file uploads
        fieldSize: 50 * 1024 * 1024  // Increase field value size to 10 MB
    }
});

export default upload;
