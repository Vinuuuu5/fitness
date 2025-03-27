import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset the error and success message
    setError('')

    
    setSuccessMessage('');

    try {
      // Make API call
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        setSuccessMessage(response.data.message || 'Login successful! Welcome.');
        onLogin(response.data); // Pass user data or token if needed
      }
    } catch (err) {
      // On error, show error message from the backend if available
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };


  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
