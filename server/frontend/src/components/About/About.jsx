// src/components/About/About.jsx
import React from 'react';
import Header from '../Header/Header';
import person1 from '../assets/person1.jpg';
import person2 from '../assets/person2.jpg';
import person3 from '../assets/person3.jpg';
import './About.css'; // Create a separate CSS file for About styles

const About = () => {
  return (
    <div>
      <Header />
      <div className="about-container">
        <h1>About Us</h1>
        <p>Welcome to Best Cars dealership, home to the best cars in North America. We deal in sale of domestic and imported cars at reasonable prices.</p>
        <div className="team-members">
          <div className="team-member">
            <img src={person1} alt="Anna Lee" />
            <h3>Anna Lee</h3>
            <p>CEO</p>
            <p>Anna has led Best Cars to new heights with over 15 years in the automotive industry.</p>
            <p>anna.lee@example.com</p>
          </div>
          <div className="team-member">
            <img src={person2} alt="Michael Johnson" />
            <h3>Michael Johnson</h3>
            <p>COO</p>
            <p>Michael ensures operational excellence at every dealership location across the country.</p>
            <p>michael.johnson@example.com</p>
          </div>
          <div className="team-member">
            <img src={person3} alt="David Thompson" />
            <h3>David Thompson</h3>
            <p>CFO</p>
            <p>David manages the financial strategy for Best Cars, driving sustainable growth.</p>
            <p>david.thompson@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
