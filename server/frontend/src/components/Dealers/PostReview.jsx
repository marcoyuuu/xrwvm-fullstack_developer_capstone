// src/components/Dealers/PostReview.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const root_url = window.location.origin;
  const dealer_url = `${root_url}/djangoapp/dealer/${id}`;
  const review_url = `${root_url}/djangoapp/add_review`;
  const carmodels_url = `${root_url}/djangoapp/get_cars`;

  // Helper to get the CSRF token from cookies
  const getCsrfToken = useCallback(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return token ? token.split('=')[1] : '';
  }, []);

  const get_dealer = useCallback(async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();

      if (retobj.status === 200) {
        let dealerobjs = Array.from(retobj.dealer);
        if (dealerobjs.length > 0) {
          setDealer(dealerobjs[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
    }
  }, [dealer_url]);

  const get_cars = useCallback(async () => {
    try {
      const res = await fetch(carmodels_url, {
        method: "GET"
      });
      const retobj = await res.json();

      let carmodelsarr = Array.from(retobj.CarModels);
      setCarmodels(carmodelsarr);
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  }, [carmodels_url]);

  const postreview = useCallback(async () => {
    const firstName = sessionStorage.getItem("firstname") || "";
    const lastName = sessionStorage.getItem("lastname") || "";
    let name = `${firstName} ${lastName}`.trim();

    // If the first and last name are not set, use the username
    if (!name) {
      name = sessionStorage.getItem("username") || "Anonymous";
    }

    // Validation
    if (!model || review.trim() === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    const [make_chosen, ...model_split] = model.split(" ");
    const model_chosen = model_split.join(" ");

    const jsoninput = {
      "name": name,
      "dealership": id,
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    };

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken()
        },
        body: JSON.stringify(jsoninput),
      });

      const json = await res.json();
      if (json.status === 200) {
        navigate(`/dealer/${id}`);
      } else {
        setError("Failed to post review. Please try again.");
      }
    } catch (error) {
      console.error("Error posting review:", error);
      setError("An error occurred while posting the review.");
    }
  }, [model, review, date, year, id, navigate, review_url, getCsrfToken]);

  useEffect(() => {
    get_dealer();
    get_cars();
  }, [get_dealer, get_cars]);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
        <textarea
          id='review'
          cols='50'
          rows='7'
          onChange={(e) => setReview(e.target.value)}
          value={review}
          placeholder="Write your review here..."
          required
        ></textarea>
        <div className='input_field'>
          <label htmlFor="purchase_date">Purchase Date</label>
          <input
            type="date"
            id="purchase_date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
            required
          />
        </div>
        <div className='input_field'>
          <label htmlFor="car_model">Car Make and Model</label>
          <select
            name="cars"
            id="cars"
            onChange={(e) => setModel(e.target.value)}
            value={model}
            required
          >
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map((carmodel) => (
              <option key={carmodel.id || `${carmodel.CarMake}-${carmodel.CarModel}`} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className='input_field'>
          <label htmlFor="car_year">Car Year</label>
          <input
            type="number"
            id="car_year"
            onChange={(e) => setYear(e.target.value)}
            value={year}
            max={new Date().getFullYear()}
            min={2015}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="submit-panel">
          <button type='button' className='postreview' onClick={postreview}>Post Review</button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
