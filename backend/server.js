require('dotenv').config();
console.log('Environment Variables:', {
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGODB_URI,
});
const mongoose = require('mongoose');
const connectDb = require('./config/db');
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const userRoutes = require('./route/userRoutes');
const productRoutes = require('./route/productRoutes');
const orderRoutes = require('./route/orderRoutes');
const storeRoutes = require('./route/storeRoutes');
const path = require('path');
const fs = require('fs'); 

const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn’t exist
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory:', uploadDir);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));


// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for testing
  credentials: true,
  methods: 'GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
}));

// Routes
app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/stores', storeRoutes);

app.get('/', (req, res) => res.send('Hello World'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Connect to database and start server
connectDb();

mongoose.connection.once('open', () => {
  console.log('Database connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});