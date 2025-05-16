import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statuses = ['To Do', 'In Progress', 'Done'];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:4000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load tasks");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:4000/api/tasks', {
        title: newTaskTitle,
        status: 'To Do', // Add directly to To Do list
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setTasks(prev => [...prev, res.data.task]);
        setNewTaskTitle('');
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {statuses.map(status => (
        <div key={status} style={{ flex: 1, border: '1px solid #ccc', padding: '1rem' }}>
          <h3>{status}</h3>

          {/* Only show input form in "To Do" column */}
          {status === 'To Do' && (
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="New task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
              <button type="submit">Add</button>
            </form>
          )}

          {tasks.filter(task => task.status === status).map(task => (
            <div key={task._id} style={{ background: '#f4f4f4', margin: '0.5rem 0', padding: '0.5rem' }}>
              <h4>{task.title}</h4>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;