import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const fetchTask = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:4000/api/tasks/${id}/gb`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setTask(res.data.task);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load task");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  if (!task) return <p>Loading...</p>;

  return (
    <div>
      <h2>{task.title}</h2>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Status:</strong> {task.completed ? "Completed" : "Pending"}</p>
      <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
    </div>
  );
};

export default TaskDetails;