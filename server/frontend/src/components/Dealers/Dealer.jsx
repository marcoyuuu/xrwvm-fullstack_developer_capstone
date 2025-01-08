// src/components/Dealers/Dealer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { id } = useParams();

  const root_url = window.location.origin;
  const dealer_url = `${root_url}/djangoapp/dealer/${id}`;
  const reviews_url = `${root_url}/djangoapp/reviews/dealer/${id}`;
  const post_review_url = `/postreview/${id}`; // Relative path for React Router

  // Memoized function to fetch dealer information
  const get_dealer = useCallback(async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();

      if (retobj.status === 200) {
        const dealerobjs = Array.from(retobj.dealer);
        if (dealerobjs.length > 0) {
          setDealer(dealerobjs[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
    }
  }, [dealer_url]);

  // Memoized function to fetch reviews
  const get_reviews = useCallback(async () => {
    try {
      const res = await fetch(reviews_url, {
        method: "GET"
      });
      const retobj = await res.json();

      if (retobj.status === 200) {
        if (retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [reviews_url]);

  // Function to determine sentiment icon
  const senti_icon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return positive_icon;
      case "negative":
        return negative_icon;
      default:
        return neutral_icon;
    }
  };

  // useEffect to fetch dealer and reviews on component mount or when dependencies change
  useEffect(() => {
    get_dealer();
    get_reviews();
    const username = sessionStorage.getItem("username");
    if (username) {
      setIsLoggedIn(true);
    }
  }, [get_dealer, get_reviews]);

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name}
          {isLoggedIn && (
            <Link to={post_review_url}>
              <img
                src={review_icon}
                style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }}
                alt='Post Review'
              />
            </Link>
          )}
        </h1>
        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed ? (
          <p>Loading Reviews....</p>
        ) : unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map(review => (
            <div className='review_panel' key={review.id || `${review.name}-${review.review}`}>
              <img
                src={senti_icon(review.sentiment)}
                className="emotion_icon"
                alt={`${review.sentiment} sentiment`}
              />
              <div className='review'>{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
