const express = require('express');
const { uploadFile, getFile } = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', uploadFile);
router.get('/download', getFile);

module.exports = router;
