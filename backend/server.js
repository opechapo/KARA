require("dotenv").config();
console.log('Environment Variables:', {
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGODB_URI,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
});
const mongoose = require('mongoose');
const connectDb = require("./config/db");
const express= require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require("./route/userRoutes");
const productRoutes = require("./route/productRoutes");
const orderRoutes = require("./route/orderRoutes");


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);



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

app.get('/',(req, res) => console.log("Hello world"))

connectDb();


mongoose.connection.once("open", () =>{
  console.log("Database connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))  
})
