import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './fitness-tracker.css';

// Login Component
export function Login({ setActiveView, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // In a real app, you would call your authentication API here
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setActiveView('dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">Login</button>
        </form>
        <p className="auth-switch">
          Don't have an account?{' '}
          <button onClick={() => setActiveView('signup')} className="auth-link">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

// SignUp Component
export function SignUp({ setActiveView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.email === email)) {
      setError('Email already registered');
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // In a real app, you would hash the password
      workouts: [],
      goals: {
        weeklyWorkouts: 3,
        weeklyCardioMinutes: 90,
        weeklyStrengthSessions: 2
      }
    };
    
    // Save user
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Redirect to dashboard
    setActiveView('dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <p className="auth-switch">
          Already have an account?{' '}
          <button onClick={() => setActiveView('login')} className="auth-link">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}