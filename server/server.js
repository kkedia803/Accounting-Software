const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
// const menuRoutes = require('./routes/menuRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

app.use(cors({
    origin: '*', // Your React frontend URL
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/files', fileRoutes);

// Make sure this matches the 'files' field in your form
// app.post('/api/files/upload', upload.array('files', 10), (req, res) => {
//   // Handling the uploaded files
//   console.log(req.files); // req.files will have the uploaded files
//   res.status(200).json({ message: 'Files uploaded successfully' });
// });

// app.use('/api/menu', menuRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
