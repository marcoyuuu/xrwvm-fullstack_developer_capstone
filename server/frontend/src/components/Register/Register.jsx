import React, { useState } from "react";
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

  const registerUrl = `${window.location.origin}/djangoapp/register/`;

  const getCsrfToken = () => {
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
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

      const data = await response.json();

      if (data.status === "Authenticated") {
        sessionStorage.setItem("username", data.userName);
        window.location.href = window.location.origin;
      } else if (data.error === "Already Registered") {
        setError("The username is already registered.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2 className="register-title">Sign Up</h2>
        <button className="close-btn" onClick={() => (window.location.href = window.location.origin)}>
          <img src={closeIcon} alt="Close" />
        </button>
      </div>
      <hr />
      <form onSubmit={register} className="register-form">
        <div className="inputs">
          <InputField icon={userIcon} placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <InputField icon={userIcon} placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <InputField icon={userIcon} placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <InputField icon={emailIcon} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField icon={passwordIcon} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="submit-panel">
          <button type="submit" className="submit-btn">Register</button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ icon, placeholder, type = "text", value, onChange }) => (
  <div className="input-field">
    <img src={icon} className="input-icon" alt={placeholder} />
    <input type={type} placeholder={placeholder} className="input-element" value={value} onChange={onChange} required />
  </div>
);

export default Register;
