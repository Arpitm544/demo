const express = require('express');
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require('../controller/taskController');
const protect=require('../middleware/authMiddleware')
const taskRouter=express.Router();

taskRouter.post('/gb',protect,createTask)
taskRouter.get('/gb',protect,getAllTasks)

taskRouter.get('/:id/gb',protect,getTaskById)
taskRouter.put('/:id/gb',protect,updateTask)
taskRouter.delete('/:id/gb',protect,deleteTask)

module.exports=taskRouter;