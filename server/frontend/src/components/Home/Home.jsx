// src/components/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import dealershipImage from '../assets/car_dealership.jpg'; // Ensure image is in src/assets
import './Home.css';

const Home = () => {
  return (
    <div>
      <Header />
      <div className="home-container">
        <div className="card">
          <img src={dealershipImage} className="card-img-top" alt="Dealership" />
          <div className="banner">
            <h5>Welcome to our Dealerships!</h5>
            <Link to="/dealers" className="btn view-dealers-btn">View Dealerships</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
