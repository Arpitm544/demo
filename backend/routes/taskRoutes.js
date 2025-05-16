const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const { protect } = require('../middleware/authMiddleware');

// Get all tasks
router.get('/', protect, asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
}));

// Create task
router.post('/', protect, asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Please add a title');
  }

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    user: req.user.id
  });

  res.status(201).json(task);
}));

// Update task
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedTask);
}));

// Delete task
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await task.remove();
  res.json({ id: req.params.id });
}));

// Get task statistics
router.get('/statistics', protect, asyncHandler(async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
        },
        highPriority: {
          $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] }
        },
        mediumPriority: {
          $sum: { $cond: [{ $eq: ['$priority', 'Medium'] }, 1, 0] }
        },
        lowPriority: {
          $sum: { $cond: [{ $eq: ['$priority', 'Low'] }, 1, 0] }
        }
      }
    }
  ]);

  res.json(stats[0] || {
    totalTasks: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  });
}));

module.exports = router; 