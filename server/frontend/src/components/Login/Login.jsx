// src/components/Login/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const loginUrl = `${window.location.origin}/djangoapp/api/login/`; // Updated API URL

  // Helper to get the CSRF token from cookies
  const getCsrfToken = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return token ? token.split('=')[1] : '';
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

      if (!response.ok) {
        // Handle HTTP errors
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      if (data.status === "Authenticated") {
        sessionStorage.setItem("username", data.userName);
        navigate("/"); // Navigate to home
      } else {
        setError("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <form className="login-panel" onSubmit={handleLogin}>
          <h2 className="login-title">Login</h2>
          <div className="form-group">
            <label className="input-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="input-field"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
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
            <button type="button" className="action-button" onClick={() => navigate("/")}>Cancel</button>
          </div>
          <div className="register-link">
            <Link to="/register">Don't have an account? Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
