import React, { useState } from 'react';
import "./Login.css";
import Header from '../Header/Header';

const Login = ({ onClose }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);
  const loginUrl = `${window.location.origin}/djangoapp/login/`;

  // Helper to get the CSRF token from cookies
  const getCsrfToken = () => {
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);  // Clear previous error

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken()
        },
        body: JSON.stringify({ userName, password }),
      });

      const data = await response.json();
      if (data.status === "Authenticated") {
        sessionStorage.setItem("username", data.userName);
        setOpen(false);
      } else {
        setError("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  if (!open) {
    window.location.href = "/";
    return null;
  }

  return (
    <div>
      <Header />
      <div onClick={onClose} className="modal-overlay">
        <div onClick={(e) => e.stopPropagation()} className="modal-container">
          <form className="login-panel" onSubmit={handleLogin}>
            <h2 className="login-title">Login</h2>
            <div className="form-group">
              <label className="input-label">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="input-field"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="button-group">
              <button type="submit" className="action-button">Login</button>
              <button type="button" className="action-button" onClick={() => setOpen(false)}>Cancel</button>
            </div>
            <div className="register-link">
              <a href="/register">Don't have an account? Register here</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
