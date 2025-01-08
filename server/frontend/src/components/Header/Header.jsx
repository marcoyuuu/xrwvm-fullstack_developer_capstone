// src/components/Header/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/style.css";
import "../assets/bootstrap.min.css";

const Header = () => {
  const navigate = useNavigate();

  const logout = async (e) => {
    e.preventDefault();
    const logout_url = `${window.location.origin}/djangoapp/logout/`;
    try {
      const res = await fetch(logout_url, {
        method: "GET",
      });

      const json = await res.json();
      if (json) {
        const username = sessionStorage.getItem('username');
        sessionStorage.removeItem('username');
        alert(`Logging out ${username}...`);
        navigate("/"); // Navigate to home without reloading
      } else {
        alert("The user could not be logged out.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout.");
    }
  };

  // The default home page items are the login details panel
  let home_page_items = <div></div>;

  // Gets the username in the current session
  const curr_user = sessionStorage.getItem('username');

  // If the user is logged in, show the username and logout option on home page
  if (curr_user) {
    home_page_items = (
      <div className="input_panel">
        <span className='username'>{curr_user}</span>
        <button className="nav_item btn btn-link" onClick={logout}>Logout</button>
      </div>
    );
  } else {
    home_page_items = (
      <div className="input_panel">
        <Link to="/login" className="nav_item btn btn-link">Login</Link>
      </div>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "darkturquoise", height: "1in" }}>
      <div className="container-fluid">
        <h2 style={{ paddingRight: "5%" }}>Dealerships</h2>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" style={{ fontSize: "larger" }} aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={{ fontSize: "larger" }} to="/about">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={{ fontSize: "larger" }} to="/contact">Contact Us</Link>
            </li>
          </ul>
          <span className="navbar-text">
            <div className="loginlink" id="loginlogout">
              {home_page_items}
            </div>
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Header;
