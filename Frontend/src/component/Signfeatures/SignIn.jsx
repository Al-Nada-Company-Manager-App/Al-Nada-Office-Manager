import React, { useState } from 'react';
import axios from 'axios';
import "../../Styles/Sign.css";

const SignIn = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:4000/login', { username, password }, { withCredentials: true });
        if (response.data.success) {
            // Redirect or handle login success
            onLoginSuccess();
        } else {
            // Display the error message returned from the server
            setError(response.data.message || 'Login failed');
        }
    } catch (err) {
        console.error('Login error:', err);
        setError('An error occurred during login.');
    }
};

  return (
    <div>
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <a href="#">Forgot your password?</a>
        <button type="submit">Sign In</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
      </div>
  );
};

export default SignIn;
