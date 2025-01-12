// src/components/Dealers/PostReview.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import "./Dealers.css";
import "../assets/style.css";

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [reviewText, setReviewText] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [carModels, setCarModels] = useState([]);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  // Note the trailing slashes on API endpoints.
  const dealerUrl = `/djangoapp/api/dealer/${id}/`;
  const reviewUrl = `/djangoapp/api/add_review/`;
  const carModelsUrl = `/djangoapp/api/get_cars/`;

  const getCsrfToken = useCallback(() => {
    const tokenString = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return tokenString ? tokenString.split('=')[1] : '';
  }, []);

  const getDealer = useCallback(async () => {
    try {
      const res = await fetch(dealerUrl, { method: "GET" });
      const data = await res.json();
      if (data.status === 200 && data.dealer) {
        setDealer(data.dealer);
      } else {
        setError("Failed to load dealer information.");
      }
    } catch (err) {
      console.error("Error fetching dealer:", err);
      setError("Error fetching dealer information.");
    }
  }, [dealerUrl]);

  const getCarModels = useCallback(async () => {
    try {
      const res = await fetch(carModelsUrl, { method: "GET" });
      const data = await res.json();
      if (data && Array.isArray(data.CarModels)) {
        setCarModels(data.CarModels);
      } else {
        setError("Failed to load car models.");
      }
    } catch (err) {
      console.error("Error fetching car models:", err);
      setError("Error fetching car models.");
    }
  }, [carModelsUrl]);

  const handlePostReview = useCallback(async () => {
    if (!selectedModel || !reviewText.trim() || !purchaseDate || !carYear) {
      alert("All details are mandatory");
      return;
    }
    const [makeChosen, ...modelParts] = selectedModel.split(" ");
    const modelChosen = modelParts.join(" ");
    let reviewerName = `${sessionStorage.getItem("firstname") || ""} ${sessionStorage.getItem("lastname") || ""}`.trim();
    if (!reviewerName) {
      reviewerName = sessionStorage.getItem("username") || "Anonymous";
    }
    const payload = {
      name: reviewerName,
      dealership: id,
      review: reviewText,
      purchase: true,
      purchase_date: purchaseDate,
      car_make: makeChosen,
      car_model: modelChosen,
      car_year: carYear,
    };
    try {
      const res = await fetch(reviewUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken()
        },
        body: JSON.stringify(payload),
      });
      const responseData = await res.json();
      if (responseData.status === 200) {
        navigate(`/dealer/${id}/`);
      } else {
        setError("Failed to post review. Please try again.");
      }
    } catch (err) {
      console.error("Error posting review:", err);
      setError("An error occurred while posting the review.");
    }
  }, [selectedModel, reviewText, purchaseDate, carYear, id, navigate, reviewUrl, getCsrfToken]);

  useEffect(() => {
    getDealer();
    getCarModels();
  }, [getDealer, getCarModels]);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>
          {dealer.full_name ? dealer.full_name : "Loading dealer..."}
        </h1>
        <textarea
          id="review"
          cols="50"
          rows="7"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
          required
        />
        <div className="input_field">
          <label htmlFor="purchase_date">Purchase Date</label>
          <input
            type="date"
            id="purchase_date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            required
          />
        </div>
        <div className="input_field">
          <label htmlFor="car_model">Car Make and Model</label>
          <select
            name="cars"
            id="cars"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            required
          >
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carModels.map((cm, index) => (
              <option key={index} value={`${cm.CarMake} ${cm.CarModel}`}>
                {cm.CarMake} {cm.CarModel}
              </option>
            ))}
          </select>
        </div>
        <div className="input_field">
          <label htmlFor="car_year">Car Year</label>
          <input
            type="number"
            id="car_year"
            value={carYear}
            onChange={(e) => setCarYear(e.target.value)}
            max={new Date().getFullYear()}
            min={2015}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="submit-panel">
          <button type="button" className="postreview" onClick={handlePostReview}>
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
