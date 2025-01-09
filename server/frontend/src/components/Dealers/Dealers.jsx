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

  const dealer_url = "/djangoapp/dealers/";
  const dealer_url_by_state = "/djangoapp/dealers/";

  const filterDealers = useCallback(async (state) => {
    const url = state === "All" ? dealer_url : `${dealer_url_by_state}${state}`;
    try {
      const res = await fetch(url, {
        method: "GET"
      });
      const retobj = await res.json();
      if (retobj.status === 200) {
        let state_dealers = Array.from(retobj.dealers);
        setDealersList(state_dealers);
      }
    } catch (error) {
      console.error("Error fetching dealers by state:", error);
    }
  }, [dealer_url, dealer_url_by_state]);

  const get_dealers = useCallback(async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      if (retobj.status === 200) {
        let all_dealers = Array.from(retobj.dealers);
        let statesArr = all_dealers.map(dealer => dealer.state);
        setStates([...new Set(statesArr)]);
        setDealersList(all_dealers);
      }
    } catch (error) {
      console.error("Error fetching dealers:", error);
    }
  }, [dealer_url]);

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
          {dealersList.map(dealer => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>
              <td><Link to={`/dealer/${dealer.id}`}>{dealer.full_name}</Link></td>
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
