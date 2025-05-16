const mongoose=require('mongoose')
const express=require('express')
const User=require('../model/userModel')
const bcrypt=require("bcryptjs")
const jwt=require('jsonwebtoken')

const validator = require('validator');

const createToken = (userId) => {
    const JWT_SECRET = process.env.JWT_SECRETE || 'your_jwt_secret_here';
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
};

const registerUser=async (req,res)=>{
    const {name,email,password}=req.body

    if(!name||!email||!password)
    {
       return res.json({success:false,message:"All field are require"})

    }
    if(!validator.isEmail(email))
    {
        return res.json({success:false,message:"Invaild email"})
    }
    if(password.length<8)
    {
          return res.json({success:false,message:"Password shuld be min 8 length"})
    }
    try {
       const userExists=await User.findOne({email})

    if(userExists)
    {
        return res.json({success:true,message:'User Exists'})
    }
    const hashed=await bcrypt.hash(password,10)

    const user=await User.create({name,email,password:hashed})

   const token=createToken(user._id)

   res.json({success:true,token,user:{id:user,name:user.name,email:user.email}})
   
    } catch (error) {
     console.log(error)
     res.json({success:false,message:'Server Error'})
    }
}

const login=async(req,res)=>{
    const {email,password}=req.body;

    if(!email||!password){
        return res.json({success:false,message:"All fields are required"})
    }
  try{
    const user=await User.findOne({email})
    if(!user){
        return res.json({success:false,message:"User not found"})
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.json({success:false,message:"Invalid Password"})
    }
    const token=createToken(user._id);

    res.json({success:true,token,user:{id:user,name:user.name,email:user.email}})
}
catch(error){
    console.log(error)
    res.json({success:false,message:"Server Error"})
}
}

//GET CURRENT user
const getCurrentUser=async(req,res)=>{
    try {
        const user=await User.findById(req.user.id).select('name email')
        if(!user){
            return res.json({success:false,message:'User not found'})
        }
        res.json({success:true,user})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Server Error"})
    }
}

//UPDATE USER
 const update=async(req,res)=>{
    const {name,email}=req.body;

    if((!name||!email)||(email&&!validator.isEmail(email))){
        return res.json({success:false,message:"Atleast one field is required"})
    }

    try {
        const exists=await User.findOne({email,id:{$ne:req.user.id}})
        if(exists){
            return res.json({success:false,message:"Email already exists"})
        }
        const user=await User.findByIdAndUpdate(req.user.id,{name,email},
            {new:true}).select('name email')

            res.json({success:true,user})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Server Error"})
    }
 }

 //change password
 const changePassword=async(req,res)=>{

  const {password,newPassword}=req.body;
  if(!password||!newPassword){
      return res.json({success:false,message:"All fields are required"})
  }
  if(newPassword.length<8){
      return res.json({success:false,message:"New password should be min 8 length"})
  }

  try {
    const pass = req.user.id;

  const user=await User.findById(pass).select('password')
   if(!user){
      return res.json({success:false,message:"User not found"})
  }
  const isMatch=await bcrypt.compare(password,user.password)

  if(!isMatch){
      return res.json({success:false,message:"Invalid Password"})
  }
  user.password=await bcrypt.hash(newPassword,10)
  await user.save()
  res.json({success:true,message:"Password changed"})

  } catch (error) {
      console.log(error)
      res.json({success:false,message:"Server Error"})
  }
 
 }

module.exports={registerUser,login,getCurrentUser,update,changePassword}