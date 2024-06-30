const multer = require('multer');
const File = require('../models/File');
const fs = require('fs');
const path = require('path');

// Ensure dotenv is configured
require('dotenv').config();

// Define upload directory
const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR);

if (!process.env.UPLOAD_DIR) {
    console.error('UPLOAD_DIR is not defined in the .env file');
    process.exit(1);
}

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'latest.pem');
    },
});

const upload = multer({ storage }).single('file');

const uploadFile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        // Remove the previous file record
        await File.deleteMany({});
        
        // Save new file record
        const file = new File({
            filename: req.file.filename,
            path: req.file.path,
        });

        await file.save();
        
        res.status(200).send({
            message: 'File uploaded successfully',
            downloadLink: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        });
    });
};

const getFile = async (req, res) => {
    const file = await File.findOne({});
    if (!file) {
        return res.status(404).send({ message: 'No file found' });
    }

    res.status(200).sendFile(path.resolve(file.path));
};

module.exports = {
    uploadFile,
    getFile,
};
