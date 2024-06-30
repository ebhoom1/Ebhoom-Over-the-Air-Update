const multer = require('multer');
const File = require('../models/File');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR);

if (!process.env.UPLOAD_DIR) {
    console.error('UPLOAD_DIR is not defined in the .env file');
    process.exit(1);
}

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'latest.bin');
    },
});

const upload = multer({ storage }).single('file');

const uploadFile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }

        await File.deleteMany({});

        const file = new File({
            filename: req.file.filename,
            path: req.file.path,
        });

        await file.save();

        res.status(200).send({
            message: 'File uploaded successfully',
            downloadLink: `${req.protocol}://${req.get('host')}/api/files/download`,
        });
    });
};

const getFile = async (req, res) => {
    const file = await File.findOne({});
    if (!file) {
        return res.status(404).send({ message: 'No file found' });
    }

    res.setHeader('Content-Disposition', 'attachment; filename=latest.bin');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.sendFile(path.resolve(file.path));
};

module.exports = {
    uploadFile,
    getFile,
};
