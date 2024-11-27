import React, { useState,useEffect } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import axios from 'axios';
import Sign from './component/SignForm.jsx';

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); 
  };
  const handleLogout = async () => {
    try {
        await axios.get('http://localhost:4000/logout', { withCredentials: true });
        setIsLoggedIn(false); 
    } catch (err) {
        console.error('Logout error:', err);
    }
};
  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:4000/session', { withCredentials: true });
        if (response.data.success) {
          setIsLoggedIn(true);
        }
        else {
          setIsLoggedIn(false);
       }
      } catch (err) {
        console.error('Session check error:', err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false); 
      }
    };
    checkSession();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isLoggedIn ? (
        <App onLogout={handleLogout} />
      ) : (
        <Sign onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

createRoot(document.getElementById('root')).render(<Main />);
