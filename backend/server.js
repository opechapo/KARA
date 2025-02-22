require("dotenv").config();
const mongoose = require('mongoose');
const connectDb = require("./config/db");
const express= require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const PORT = 3000


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use(errorHandler);
mongoose.connection.once("open", () =>{
  console.log("Database connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))  
})


