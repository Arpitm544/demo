const Task=require('../model/taskModel')
const express=require('express')

//create task
const createTask=async(req,res)=>{
    const {title,description,priority,dueDate,completed}=req.body;

    if(!title||!priority||!dueDate){
        return res.json({success:false,message:"All fields are required"})
    }

    try {
        const task = new Task({
          title,
          description,
          priority,
          dueDate,
          owner: req.user.id,
          completed: completed ==='Yes' || completed === true,
        });

        await task.save()

        res.json({success:true,task})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Server Error"})
    }
}

//get all task
const getAllTasks=async(req,res)=>{
    try {
        const tasks=await Task.find({owner:req.user.id}).sort({createdAt: -1})
        res.json({success:true,tasks})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Server Error"})
    }
}

//get task by id
const getTaskById=async(req,res)=>{
    try {
        const task=await Task.findById(req.params.id)
        if(!task){
            return res.json({success:false,message:"Task not found"})
        }
        res.json({success:true,task})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Server Error"})
    }
}



//update task
const updateTask=async(req,res)=>{
    const {title,description,priority,dueDate,completed}=req.body;

    if(!title&&!priority&&!dueDate){
        return res.json({success:false,message:"Any fields are required"})
    }

    try {
        const task=await Task.findByIdAndUpdate(req.params.id,{
            title,
            description,
            priority,
            dueDate,
            completed: completed ==='Yes' || completed === true,
        },{new:true})
        if(!task){
            return res.json({success:false,message:"Task not found"})
        }
        res.json({success:true,task})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Server Error"})
    }
}

//delete task
const deleteTask=async(req,res)=>{
    try {
        const task=await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.json({success:false,message:"Task not found"})
        }
        res.json({success:true,message:"Task deleted"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Server Error"})
    }
}

module.exports={createTask,getAllTasks,getTaskById,updateTask,deleteTask}