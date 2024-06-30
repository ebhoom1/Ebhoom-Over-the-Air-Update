const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fileRoutes = require('./routes/fileRoutes');

dotenv.config(); // Make sure this is at the very top

const app = express();

app.use(cors({
  origin:['http://localhost:3000','http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

// API routes
app.use('/api/files', fileRoutes);

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../client/build')));

// All other requests should be handled by React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error.message);
});
