// src/components/Dealers/Dealers.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png";

const Dealers = () => {
  // Original list of dealers fetched from API (used for resetting filter)
  const [originalDealers, setOriginalDealers] = useState([]);
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("All");
  const [searchQuery, setSearchQuery] = useState('');

  // Base URL for dealers endpoints (API)
  const baseDealersUrl = "/djangoapp/api/dealers/";

  // Fetch all dealers on component mount
  const get_dealers = useCallback(async () => {
    try {
      const res = await fetch(baseDealersUrl, { method: "GET" });
      const retobj = await res.json();
      let all_dealers = [];
      if (retobj.status === 200 && retobj.dealers) {
        all_dealers = Array.from(retobj.dealers);
      } else if (Array.isArray(retobj)) {
        all_dealers = retobj;
      } else {
        console.error("Unexpected API format:", retobj);
      }
      // Set original and displayed dealers
      setOriginalDealers(all_dealers);
      setDealersList(all_dealers);
      // Build state list from all dealers
      const statesArr = all_dealers.map(dealer => dealer.state);
      setStates([...new Set(statesArr)]);
    } catch (error) {
      console.error("Error fetching dealers:", error);
    }
  }, [baseDealersUrl]);

  // Filter dealers based on state (used if filtering via dropdown, can be removed if desired)
  const filterDealers = useCallback(async (state) => {
    const url = state === "All" ? baseDealersUrl : `${baseDealersUrl}${state}/`;
    console.log("Filter URL:", url);
    try {
      const res = await fetch(url, { method: "GET" });
      const retobj = await res.json();
      let filteredDealers = [];
      if (retobj.status === 200 && retobj.dealers) {
        filteredDealers = Array.from(retobj.dealers);
      } else if (Array.isArray(retobj)) {
        filteredDealers = retobj;
      } else {
        console.error("Unexpected API format while filtering:", retobj);
      }
      setDealersList(filteredDealers);
    } catch (error) {
      console.error("Error fetching dealers by state:", error);
    }
  }, [baseDealersUrl]);

  // Handle search input changes
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    // Filter the original list based on the search query (case-insensitive)
    const filtered = originalDealers.filter(dealer =>
      dealer.state.toLowerCase().includes(query.toLowerCase())
    );
    setDealersList(filtered);
  };

  // When the input loses focus, reset the list if the query is empty
  const handleLostFocus = () => {
    if (!searchQuery) {
      setDealersList(originalDealers);
    }
  };

  // On component mount, load all dealers
  useEffect(() => {
    get_dealers();
  }, [get_dealers]);

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  return (
    <div>
      <Header />
      <div className="search-container" style={{ margin: "20px" }}>
        {/* Search input for filtering states */}
        <input
          type="text"
          placeholder="Search states..."
          onChange={handleInputChange}
          onBlur={handleLostFocus}
          value={searchQuery}
          style={{ padding: "8px", width: "200px" }}
        />
      </div>

      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>State</th>
            {isLoggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>
        <tbody>
          {dealersList.map((dealer) => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>
              <td>
                <Link to={`/dealer/${dealer.id}`}>
                  {dealer.full_name}
                </Link>
              </td>
              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state}</td>
              {isLoggedIn && (
                <td>
                  <Link to={`/postreview/${dealer.id}`}>
                    <img src={review_icon} className="review_icon" alt="Post Review" />
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;
