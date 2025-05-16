const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Error Handler
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
}); 