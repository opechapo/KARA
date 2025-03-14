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
const userRoutes = require('./route/userRoutes');
const productRoutes = require('./route/productRoutes');
const orderRoutes = require('./route/orderRoutes');
const storeRoutes = require('./routes/storeRoutes');
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());


// CORS configuration
app.use(cors({
  // origin: (origin, callback) => {
  //   const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL];
  //   if (!origin || allowedOrigins.includes(origin)) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error('Not allowed by CORS'));
  //   }
  // },
  origin: 'http://localhost:5173',
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