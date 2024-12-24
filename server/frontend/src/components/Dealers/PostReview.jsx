import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import Header from "../Header/Header";

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState();
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);
  const [error, setError] = useState("");

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  let params = useParams();
  let id = params.id;
  let dealer_url = root_url + `djangoapp/dealer/${id}`;
  let review_url = root_url + `djangoapp/add_review`;
  let carmodels_url = root_url + `djangoapp/get_cars`;

  const postreview = async () => {
    let name = `${sessionStorage.getItem("firstname")} ${sessionStorage.getItem("lastname")}`;
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }

    if (!model || review === "" || date === "" || year === "") {
      setError("All fields are required. Please fill them out.");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      name: name,
      dealership: id,
      review: review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsoninput,
      });

      const json = await res.json();
      if (json.status === 200) {
        window.location.href = `${window.location.origin}/dealer/${id}`;
      } else {
        setError("Failed to submit the review. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while submitting the review.");
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url, { method: "GET" });
    const retobj = await res.json();

    if (retobj.status === 200) {
      setDealer(retobj.dealer);
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url, { method: "GET" });
    const retobj = await res.json();
    setCarmodels(retobj.CarModels);
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name || "Dealer Name"}</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <textarea
          id="review"
          cols="50"
          rows="7"
          placeholder="Write your review here..."
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <div className="input_field">
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="input_field">
          Car Make
          <select
            name="cars"
            id="cars"
            onChange={(e) => setModel(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled hidden>
              Choose Car Make and Model
            </option>
            {carmodels.map((carmodel) => (
              <option key={carmodel.CarModel} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>
        <div className="input_field">
          Car Year{" "}
          <input
            type="number"
            placeholder="Year (e.g., 2023)"
            onChange={(e) => setYear(e.target.value)}
            max={new Date().getFullYear()}
            min={2015}
          />
        </div>
        <div>
          <button className="postreview" onClick={postreview}>
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
