import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Layout from './components/Layout';

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleLogin = (data) => {
    const user = {
      email: data.email,
      name: data.name || 'User',
    };
    setCurrentUser(user);
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onSubmit={handleLogin} onSwitchMode={() => navigate('/signup')} />}
      />
      <Route
        path="/signup"
        element={<SignUp onSubmit={handleLogin} onSwitchMode={() => navigate('/login')} />}
      />
      <Route
        path="/"
        element={<Layout user={currentUser} onLogOut={handleLogout} />}
      />
    </Routes>
  );
};

export default App;