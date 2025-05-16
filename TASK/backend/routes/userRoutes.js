const express = require('express');
const { registerUser, login, getCurrentUser, update, changePassword } = require('../controller/userController');
const protect=require('../middleware/authMiddleware')
const userRouter=express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',login)
userRouter.get('/current',protect,getCurrentUser)
userRouter.put('/update',protect,update)
userRouter.put('/change-password',protect,changePassword)

module.exports=userRouter;