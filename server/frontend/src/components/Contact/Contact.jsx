// src/components/Contact/Contact.jsx
import React from 'react';
import Header from '../Header/Header';
import dealershipImage from '../assets/dealership.jpg'; // Ensure image is in src/assets
import './Contact.css'; // Create a separate CSS file for Contact styles

const Contact = () => {
  return (
    <div>
      <Header />
      <div className="contact-info">
        <h1 className="contact-header">Contact Us</h1>
        
        {/* Image Section */}
        <img src={dealershipImage} alt="Dealership Front View" />

        {/* Contact Sections in Two Columns */}
        <div className="contact-sections">
          <div className="contact-section">
            <h2>Contact Customer Service</h2>
            <p>Email: support@bestcars.com</p>
          </div>

          <div className="contact-section">
            <h2>National Advertising Team</h2>
            <p>Email: NationalSales@bestcars.com</p>
          </div>

          <div className="contact-section">
            <h2>Public Relations Team</h2>
            <p>Email: PR@bestcars.com</p>
          </div>

          <div className="contact-section">
            <h2>Office Contact</h2>
            <p>Phone: 312-611-1111</p>
          </div>

          <div className="contact-section">
            <h2>Become a Car Dealer</h2>
            <p>Visit: growwithbestcars.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
