import React, { useState } from 'react';

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      if (isLogin) {
        onLogin(data.token, username);
      } else {
        alert('Registration successful! Please login.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <style>{`
        .auth-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-light);
          font-family: inherit;
        }
        .auth-card {
          background-color: var(--white);
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 380px;
          text-align: center;
        }
        .auth-title {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-dark);
        }
        .auth-subtitle {
          color: var(--text-gray);
          font-size: 14px;
          margin-bottom: 30px;
        }
        .auth-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          border: 2px solid #f0f0f0;
          margin-bottom: 15px;
          outline: none;
          font-size: 14px;
          background-color: #fcfcfc;
          color: var(--text-dark);
          font-family: inherit;
        }
        .auth-input:focus {
          border-color: #ccc;
          background-color: #fff;
        }

        /* --- SIMPLE BUTTON STYLES --- */
        .auth-button {
          width: 100%;
          padding: 16px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
          font-size: 15px;
          margin-top: 10px;
          
          /* Fast, simple transition */
          transition: transform 0.1s ease, opacity 0.2s ease;
        }

        /* 1. Hover: Just gets slightly lighter/transparent */
        .auth-button:hover {
          opacity: 0.9; 
        }

        /* 2. Active (Click): Shrinks down slightly (Tactile feel) */
        .auth-button:active {
          transform: scale(0.98);
        }
        
        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-toggle {
          margin-top: 25px;
          font-size: 14px;
          color: var(--text-gray);
          cursor: pointer;
        }
        .auth-toggle:hover {
          color: var(--primary-color);
          text-decoration: underline;
        }
        .error-msg {
          color: #d32f2f;
          font-size: 13px;
          margin-bottom: 20px;
          background-color: #ffe0e0;
          padding: 12px;
          border-radius: 10px;
          text-align: left;
        }
      `}</style>

      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p className="auth-subtitle">
          {isLogin ? 'Enter your credentials to access your tasks.' : 'Start organizing your life today.'}
        </p>
        
        {error && (
          <div className="error-msg">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input 
            className="auth-input" 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            className="auth-input" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          
          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="auth-toggle" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;