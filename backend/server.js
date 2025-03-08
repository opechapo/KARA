require("dotenv").config();
const mongoose = require('mongoose');
const connectDb = require("./config/db");
const express= require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const userRoutes = require('./routes/userRoutes');



const PORT = process.env.PORT || 3000

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})

app.use(cors({
  origin: [process.env.FRONTEND_URL], 
  credentials: true,
  optionsSuccessStatus: 200,
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS",
}))

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/users', userRoutes);


// Error Handler
app.use(errorHandler);





app.get('/',(req, res) => console.log("Hello world"))

connectDb();

mongoose.connection.once("open", () =>{
  console.log("Database connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))  
})
