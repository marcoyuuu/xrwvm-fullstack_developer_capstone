// src/components/Dealers/Dealers.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("All");

  // Base URLs for dealers endpoints (API)
  const baseDealersUrl = "/djangoapp/api/dealers/";

  // Fetch all dealers (used on component mount)
  const get_dealers = useCallback(async () => {
    try {
      const res = await fetch(baseDealersUrl, { method: "GET" });
      const retobj = await res.json();
      // Check whether the response is wrapped (has a status key)
      let all_dealers = [];
      if (retobj.status === 200 && retobj.dealers) {
        all_dealers = Array.from(retobj.dealers);
      } else if (Array.isArray(retobj)) {
        all_dealers = retobj;
      } else {
        console.error("Unexpected API format:", retobj);
      }
      // Build state list from all dealers
      const statesArr = all_dealers.map(dealer => dealer.state);
      setStates([...new Set(statesArr)]);
      setDealersList(all_dealers);
    } catch (error) {
      console.error("Error fetching dealers:", error);
    }
  }, [baseDealersUrl]);

  // Filter dealers by state
  const filterDealers = useCallback(async (state) => {
    // When filtering by state, ensure the trailing slash is present
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

  // On component mount, load all dealers
  useEffect(() => {
    get_dealers();
  }, [get_dealers]);

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    filterDealers(state);
  };

  return (
    <div>
      <Header />

      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select
                name="state"
                id="state"
                onChange={handleStateChange}
                value={selectedState}
              >
                <option value="" disabled hidden>State</option>
                <option value="All">All States</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
            </th>
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
