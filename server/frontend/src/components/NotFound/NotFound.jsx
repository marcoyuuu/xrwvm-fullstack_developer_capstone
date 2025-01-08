// src/components/NotFound/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import './NotFound.css'; // Create corresponding CSS

const NotFound = () => {
  return (
    <div>
      <Header />
      <div className="notfound-container">
        <h1>404 - Page Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Go to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
