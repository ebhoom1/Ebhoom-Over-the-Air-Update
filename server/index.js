const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

// Connect to MongoDB
mongoose.connect('mongodb+srv://ebhoomFileUpload:ebhoomFileUpload@fileupload.lpsg05j.mongodb.net/fileUpload', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001','http://13.233.118.179:8080'],
  credentials: true,
}));

// Define File Schema
const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  shortId: String,
});

const File = mongoose.model('File', fileSchema);

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${shortid.generate()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Upload Endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = new File({
    filename: req.file.originalname,
    path: req.file.path,
    shortId: shortid.generate(),
  });

  await file.save();
  res.send(`http://13.233.118.179:${port}/download/${file.shortId}`);
});

// Download Endpoint
app.get('/download/:shortId', async (req, res) => {
  const file = await File.findOne({ shortId: req.params.shortId });

  if (!file) {
    return res.status(404).send('File not found');
  }

  res.download(file.path, file.filename, (err) => {
    if (err) {
      console.error(err);
    }
  });
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../client/build')));

// All other requests should be handled by React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://13.233.118.179:${port}`);
});
