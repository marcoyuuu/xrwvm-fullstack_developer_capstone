import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const [postReview, setPostReview] = useState(<></>);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Correctly extract dealer ID from the URL using useParams()
  const params = useParams();
  const dealer_id = params.dealer_id; // This should match the name used in your routes

  // Construct URLs using the dealer ID from useParams
  const root_url = window.location.origin;
  const dealer_url = `${root_url}/djangoapp/dealer/${dealer_id}`;
  const reviews_url = `${root_url}/djangoapp/reviews/dealer/${dealer_id}`;
  const post_review = `${root_url}/postreview/${dealer_id}`;

  // Debugging: Log the URLs being used
  console.log("Dealer URL:", dealer_url);
  console.log("Reviews URL:", reviews_url);
  console.log("Post Review URL:", post_review);

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      console.log("Dealer Response Status:", res.status);
      if (!res.ok) {
        throw new Error(`Failed to fetch dealer data: ${res.status}`);
      }

      const retobj = await res.json();
      console.log("Dealer Response Data:", retobj); // Log the entire response object to see its structure

      if (retobj.status === 200) {
        setDealer(retobj.dealer || retobj); // Set the dealer object depending on the response structure
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
      setError(true);
    }
  };

  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url, {
        method: "GET"
      });
      console.log("Reviews Response Status:", res.status);
      if (!res.ok) {
        throw new Error(`Failed to fetch reviews data: ${res.status}`);
      }

      const retobj = await res.json();
      console.log("Reviews Response Data:", retobj);

      if (retobj.status === 200) {
        if (retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(true);
    }
  };

  // Utility function for getting sentiment icon
  const senti_icon = (sentiment) => {
    let icon = sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
    return icon;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await get_dealer();
        await get_reviews();
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (dealer_id) {
      fetchData();
    }
    if (sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review}>
          <img
            src={review_icon}
            style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }}
            alt='Post Review'
          />
        </a>
      );
    }
  }, [dealer_id]);

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      {loading ? (
        <p>Loading Dealer Information...</p>
      ) : error ? (
        <p>Error loading dealer information. Please try again later.</p>
      ) : (
        <>
          <div style={{ marginTop: "10px" }}>
            <h1 style={{ color: "grey" }}>{dealer?.full_name ? dealer.full_name : "Dealer Name Not Available"}{postReview}</h1>
            <h4 style={{ color: "grey" }}>
              {dealer?.city ? dealer.city : "City Not Available"},
              {dealer?.address ? dealer.address : "Address Not Available"},
              Zip - {dealer?.zip ? dealer.zip : "N/A"},
              {dealer?.state ? dealer.state : "State Not Available"}
            </h4>
          </div>
          <div className="reviews_panel">
            {reviews.length === 0 && unreviewed === false ? (
              <p>Loading Reviews....</p>
            ) : unreviewed === true ? (
              <div>No reviews yet!</div>
            ) : (
              reviews.map((review, index) => (
                <div className='review_panel' key={index}>
                  <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' />
                  <div className='review'>{review.review}</div>
                  <div className="reviewer">
                    {review.name} {review.car_make} {review.car_model} {review.car_year}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dealer;