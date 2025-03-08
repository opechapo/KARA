const User = require('./models/User');
const asyncHandler = require('express-async-handler');
const generateToken = require("../utils");
const bcrypt = require('bcryptjs');

// Register User

const register = asyncHandler(async (req, res) => {
  try {
    const { email, password, name, role, phoneNumber } = req.body;

    if (!email || !password || !name || !role || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    } else if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    } else if (password.length > 20) {
      return res.status(400).json({ message: "Password must not be up to 20 characters" });
    }
     // check if user already exists
        
     const userExists = await User.findOne({ email })
     if(userExists) {
         return res.status(400).json({message: 'Email aleady exists'});
     }

     const user = await User.create({email, password, name, role, phoneNumber })
     const token = generateToken(user._id);

     res.cookie('token', token, {
         path: '/',
         httpOnly: true,
         expires: new Date(Date.now() + 1000 * 86400),   //expires within 24hrs
         sameSite: 'none',
         secure: true
     })

     // Send a success response with user details and token
     if(user) {
         const { _id,email } = user;
         res.status(201).json({_id,email})
     } else {
         console.log(error);
        res.status(400).json({ message: "Invalid Data" });
     }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// // Login User
// const loginUser = asyncHandler(async (req, res) => {
//   try {
//     const {email, password} = req.body;
//     let user = await User.findOne({email})

//     // Check if the admin exists
//     if(!user) {
//         return res.status(404).json({message: 'User Not Found!'})
//     }
//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if(!isMatch) {
//         return res.status(400).json({message: 'Invalid Credentials'})
//     }

//     const token = generateToken(user._id);
//     res.cookie('token', token, {
//         path: '/',
//         httpOnly: true,
//         expires: new Date(Date.now() + 1000 * 86400),   //expires within 24hrs
//         sameSite: 'none',
//         secure: true
//     })

//     const {_id} = user;
//     res.status(201).json({_id,email, token})
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Get User 

// const getUser = asyncHandler(async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.findById(userId);

//     if(user) {
//       const {_id,email}  = user
//       return res.status(200).json({_id,email})
//   } else {
//       return res.status(404).json({message: 'User Not Found!'})
//   }

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Update User

// const updateUser = asyncHandler(async(req, res) => {
//   try{
//     const { userId } = req.params;
//     const {email, password} = req.body;
//     const user = await User.findById(userId);
//     if(!user) {
//         return res.status(404).json({message: 'User not found'})
//     }

    
//     user.email = email || user.email;
//     user.password = password || user.password;

//     await user.save();
//     res.status(200).json(user);
//   } catch(error){
//     console.error(error);
//     res.status(500).json({message: 'Internal Server Error'})
//   }
// })

// // DeleteUser

// const deleteUser = asyncHandler(async(req, res) =>{
//   try{
//     const { userId } = req.params;
//     const user = await User.findById(userId);
//     if(!user){
//       return res.status(404).json({message: 'User not found'})
//     }
//     await user.deleteOne();
//     res.status(200).json({message: 'User deleted successfully'})
//   } catch(error){
//     console.error(error);
//     res.status(500).json({message: 'Internal Server Error'})
//   }
// })

// //logOutUser

// const logoutUser = asyncHandler(async(req, res) => {
//   res.cookie('token', '', {
//       path: '/',
//       httpOnly: true,
//       expires: new Date(0),  
//       sameSite: 'none',
//       secure: true
//   })
//   return res.status(200).json({message: 'Logout Successful'})
// })



module.exports = { register };

// module.exports = { register, loginUser, getUser, updateUser, deleteUser, logoutUser };