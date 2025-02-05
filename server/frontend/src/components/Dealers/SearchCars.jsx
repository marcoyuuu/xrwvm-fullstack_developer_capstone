import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';

const SearchCars = () => {
  // State variables for cars, filter options, dealer details, and status messages.
  const [cars, setCars] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [dealer, setDealer] = useState({ full_name: "" });
  const [message, setMessage] = useState("Loading Cars…");

  const { id } = useParams();
  const dealerUrl = `/djangoapp/get_inventory/${id}`;
  const fetchDealerUrl = `/djangoapp/api/dealer/${id}/`;

  // Fetch dealer details and ensure we correctly set the dealer name.
  const fetchDealer = async () => {
    try {
      const res = await fetch(fetchDealerUrl, { method: "GET" });
      const retobj = await res.json();
      if (retobj.status === 200 && retobj.dealer) {
        // If the dealer data is an array, use the first element; otherwise, use the object directly.
        const dealerData = Array.isArray(retobj.dealer) ? retobj.dealer[0] : retobj.dealer;
        setDealer({ full_name: dealerData.full_name });
      } else {
        setDealer({ full_name: "Unknown Dealer" });
      }
    } catch (error) {
      console.error("Error fetching dealer details:", error);
      setDealer({ full_name: "Unknown Dealer" });
    }
  };

  // Populate unique makes and models based on the fetched cars data.
  const populateMakesAndModels = (carsArr) => {
    const tmpMakes = carsArr.map(car => car.make);
    const tmpModels = carsArr.map(car => car.model);
    setMakes(Array.from(new Set(tmpMakes)));
    setModels(Array.from(new Set(tmpModels)));
  };

  // Fetch all cars for the dealer from the inventory endpoint.
  const fetchCars = async () => {
    try {
      const res = await fetch(dealerUrl, { method: "GET" });
      const retobj = await res.json();
      if (retobj.status === 200) {
        const allCars = Array.from(retobj.cars);
        setCars(allCars);
        populateMakesAndModels(allCars);
        setMessage("");
      } else {
        setMessage("No cars found.");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      setMessage("Error fetching cars.");
    }
  };

  // Apply filtering criteria to the cars array.
  const setCarsMatchingCriteria = (matchingCars) => {
    let filteredCars = Array.from(matchingCars);
    const makeEl = document.getElementById("make");
    const modelEl = document.getElementById("model");
    const yearEl = document.getElementById("year");
    const mileageEl = document.getElementById("mileage");
    const priceEl = document.getElementById("price");

    if (makeEl && makeEl.selectedIndex !== 0) {
      const selectedMake = makeEl.value;
      filteredCars = filteredCars.filter(car => car.make === selectedMake);
    }
    if (modelEl && modelEl.selectedIndex !== 0) {
      const selectedModel = modelEl.value;
      filteredCars = filteredCars.filter(car => car.model === selectedModel);
    }
    if (yearEl && yearEl.selectedIndex !== 0) {
      const selectedYear = parseInt(yearEl.value);
      filteredCars = filteredCars.filter(car => car.year >= selectedYear);
    }
    if (mileageEl && mileageEl.selectedIndex !== 0) {
      const selectedMileage = parseInt(mileageEl.value);
      if (selectedMileage === 50000) {
        filteredCars = filteredCars.filter(car => car.mileage <= selectedMileage);
      } else if (selectedMileage === 100000) {
        filteredCars = filteredCars.filter(car => car.mileage <= selectedMileage && car.mileage > 50000);
      } else if (selectedMileage === 150000) {
        filteredCars = filteredCars.filter(car => car.mileage <= selectedMileage && car.mileage > 100000);
      } else if (selectedMileage === 200000) {
        filteredCars = filteredCars.filter(car => car.mileage <= selectedMileage && car.mileage > 150000);
      } else {
        filteredCars = filteredCars.filter(car => car.mileage > 200000);
      }
    }
    if (priceEl && priceEl.selectedIndex !== 0) {
      const selectedPrice = parseInt(priceEl.value);
      if (selectedPrice === 20000) {
        filteredCars = filteredCars.filter(car => car.price <= selectedPrice);
      } else if (selectedPrice === 40000) {
        filteredCars = filteredCars.filter(car => car.price <= selectedPrice && car.price > 20000);
      } else if (selectedPrice === 60000) {
        filteredCars = filteredCars.filter(car => car.price <= selectedPrice && car.price > 40000);
      } else if (selectedPrice === 80000) {
        filteredCars = filteredCars.filter(car => car.price <= selectedPrice && car.price > 60000);
      } else {
        filteredCars = filteredCars.filter(car => car.price > 80000);
      }
    }
    console.log("Number of matching cars: " + filteredCars.length);
    if (filteredCars.length === 0) {
      setMessage("No cars found matching criteria");
    } else {
      setMessage("");
    }
    setCars(filteredCars);
  };

  // Functions to search by different criteria.
  const SearchCarsByMake = async () => {
    const make = document.getElementById("make").value;
    const url = dealerUrl + "?make=" + make;
    const res = await fetch(url, { method: 'GET' });
    const retobj = await res.json();
    if (retobj.status === 200) {
      setCarsMatchingCriteria(retobj.cars);
    }
  };

  const SearchCarsByModel = async () => {
    const model = document.getElementById("model").value;
    const url = dealerUrl + "?model=" + model;
    const res = await fetch(url, { method: 'GET' });
    const retobj = await res.json();
    if (retobj.status === 200) {
      setCarsMatchingCriteria(retobj.cars);
    }
  };

  const SearchCarsByYear = async () => {
    const year = document.getElementById("year").value;
    let url = dealerUrl;
    if (year !== "all") {
      url += "?year=" + year;
    }
    const res = await fetch(url, { method: 'GET' });
    const retobj = await res.json();
    if (retobj.status === 200) {
      setCarsMatchingCriteria(retobj.cars);
    }
  };

  const SearchCarsByMileage = async () => {
    const mileage = document.getElementById("mileage").value;
    let url = dealerUrl;
    if (mileage !== "all") {
      url += "?mileage=" + mileage;
    }
    const res = await fetch(url, { method: 'GET' });
    const retobj = await res.json();
    if (retobj.status === 200) {
      setCarsMatchingCriteria(retobj.cars);
    }
  };

  const SearchCarsByPrice = async () => {
    const price = document.getElementById("price").value;
    let url = dealerUrl;
    if (price !== "all") {
      url += "?price=" + price;
    }
    const res = await fetch(url, { method: 'GET' });
    const retobj = await res.json();
    if (retobj.status === 200) {
      setCarsMatchingCriteria(retobj.cars);
    }
  };

  // Reset all dropdowns and refetch all cars.
  const reset = () => {
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach((select) => {
      select.selectedIndex = 0;
    });
    fetchCars();
  };

  useEffect(() => {
    fetchCars();
    fetchDealer();
  }, []);

  return (
    <div>
      <Header />
      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>
        Cars at {dealer.full_name}
      </h1>
      <div style={{ textAlign: 'center', marginBottom: '20px', background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
        <label style={{ marginRight: '10px' }}>Make</label>
        <select id="make" style={{ marginRight: '20px', padding: '5px', borderRadius: '5px' }} onChange={SearchCarsByMake}>
          {makes.length === 0 ? (
            <option value=''>No data found</option>
          ) : (
            <>
              <option value="all">-- All --</option>
              {makes.map((make, index) => (
                <option key={index} value={make}>
                  {make}
                </option>
              ))}
            </>
          )}
        </select>
        <label style={{ marginRight: '10px' }}>Model</label>
        <select id="model" style={{ marginRight: '20px', padding: '5px', borderRadius: '5px' }} onChange={SearchCarsByModel}>
          {models.length === 0 ? (
            <option value=''>No data found</option>
          ) : (
            <>
              <option value="all">-- All --</option>
              {models.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </>
          )}
        </select>
        <label style={{ marginRight: '10px' }}>Year</label>
        <select id="year" style={{ marginRight: '20px', padding: '5px', borderRadius: '5px' }} onChange={SearchCarsByYear}>
          <option value="all">-- All --</option>
          <option value="2024">2024 or newer</option>
          <option value="2023">2023 or newer</option>
          <option value="2022">2022 or newer</option>
          <option value="2021">2021 or newer</option>
          <option value="2020">2020 or newer</option>
        </select>
        <label style={{ marginRight: '10px' }}>Mileage</label>
        <select id="mileage" style={{ marginRight: '20px', padding: '5px', borderRadius: '5px' }} onChange={SearchCarsByMileage}>
          <option value="all">-- All --</option>
          <option value="50000">Under 50,000</option>
          <option value="100000">50,000 - 100,000</option>
          <option value="150000">100,000 - 150,000</option>
          <option value="200000">150,000 - 200,000</option>
          <option value="200001">Over 200,000</option>
        </select>
        <label style={{ marginRight: '10px' }}>Price</label>
        <select id="price" style={{ marginRight: '20px', padding: '5px', borderRadius: '5px' }} onChange={SearchCarsByPrice}>
          <option value="all">-- All --</option>
          <option value="20000">Under 20,000</option>
          <option value="40000">20,000 - 40,000</option>
          <option value="60000">40,000 - 60,000</option>
          <option value="80000">60,000 - 80,000</option>
          <option value="80001">Over 80,000</option>
        </select>
        <button onClick={reset} style={{ padding: '5px 15px', borderRadius: '5px', background: 'mediumspringgreen', color: '#fff', border: 'none', cursor: 'pointer' }}>Reset</button>
      </div>
      <div style={{ margin: '0 20px' }}>
        {cars.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>{message}</p>
        ) : (
          <div style={{ background: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            {cars.map((car) => (
              <div key={car._id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <h3 style={{ margin: '5px 0' }}>{car.make} {car.model}</h3>
                <p style={{ margin: '2px 0' }}><strong>Year:</strong> {car.year}</p>
                <p style={{ margin: '2px 0' }}><strong>Mileage:</strong> {car.mileage}</p>
                <p style={{ margin: '2px 0' }}><strong>Price:</strong> {car.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCars;
