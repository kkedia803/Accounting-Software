const express = require('express');
const multer = require('multer');
const { uploadFiles } = require('../controllers/fileController');
const router = express.Router();

// Setup Multer storage and upload settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname);
    }
});
const upload = multer({ storage: storage });



// Route for uploading files and performing OCR
router.post('/upload', upload.array('files',10), uploadFiles);

// router.post('/upload', upload.array('files', 10), (req, res) => {
//     // Handling the uploaded files
//     console.log(req.files); // req.files will have the uploaded files
//     res.status(200).json({ message: 'Files uploaded successfully' });
// });

module.exports = router;
