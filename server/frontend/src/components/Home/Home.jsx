// src/components/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import dealershipImage from '../assets/car_dealership.jpg'; // Ensure image is in src/assets
import './Home.css'; // Create a separate CSS file for Home styles

const Home = () => {
  return (
    <div>
      <Header />
      <div className="home-container">
        <div className="card">
          <img src={dealershipImage} className="card-img-top" alt="Dealership" />
          <div className="banner">
            <h5>Welcome to our Dealerships!</h5>
            <Link to="/dealers" className="btn btn-primary">View Dealerships</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
