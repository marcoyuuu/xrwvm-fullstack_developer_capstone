// src/components/Register/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Register.css";
import userIcon from "../assets/person.png";
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";
import closeIcon from "../assets/close.png";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const registerUrl = `${window.location.origin}/djangoapp/api/register/`; // Updated API URL

  // Helper to get the CSRF token from cookies
  const getCsrfToken = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return token ? token.split('=')[1] : '';
  };

  const register = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken()
        },
        body: JSON.stringify({
          userName,
          password,
          firstName,
          lastName,
          email,
        }),
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
      } else if (data.error === "Already Registered") {
        setError("The username is already registered.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2 className="register-title">Sign Up</h2>
        <button className="close-btn" onClick={() => navigate("/")}>
          <img src={closeIcon} alt="Close" />
        </button>
      </div>
      <hr />
      <form onSubmit={register} className="register-form">
        <div className="inputs">
          <InputField
            icon={userIcon}
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <InputField
            icon={userIcon}
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputField
            icon={userIcon}
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <InputField
            icon={emailIcon}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            icon={passwordIcon}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="submit-panel">
          <button type="submit" className="submit-btn">Register</button>
        </div>
      </form>
      <div className="register-link">
        <Link to="/login">Already have an account? Login here</Link>
      </div>
    </div>
  );
};

const InputField = ({ icon, placeholder, type = "text", value, onChange }) => (
  <div className="input-field">
    <img src={icon} className="input-icon" alt={`${placeholder} icon`} />
    <input
      type={type}
      placeholder={placeholder}
      className="input-element"
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default Register;
