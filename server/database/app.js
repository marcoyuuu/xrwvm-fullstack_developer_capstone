/* jshint esversion: 8 */
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

const corsOptions = {
  origin: 'https://marcoyu-8000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Import Models
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Read data from JSON files
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

mongoose.connect("mongodb://mongo_db:27017/", { dbName: 'dealershipsDB' })
  .then(() => {
    console.log("Connected to MongoDB");
    initializeData();
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });

const initializeData = async () => {
  try {
    console.log("Initializing Reviews data...");
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data.reviews);
    console.log("Reviews data initialized");

    console.log("Initializing Dealerships data...");
    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data.dealerships);
    console.log("Dealerships data initialized");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

app.get('/', (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// Match with or without trailing slash
app.get(['/fetchReviews', '/fetchReviews/'], async (req, res) => {
  try {
    console.log("Received GET request for /fetchReviews");
    const docs = await Reviews.find();
    res.json(docs);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

app.get(['/fetchReviews/dealer/:id', '/fetchReviews/dealer/:id/'], async (req, res) => {
  try {
    console.log(`Received GET request for /fetchReviews/dealer/${req.params.id}`);
    const docs = await Reviews.find({ dealership: req.params.id });
    res.json(docs);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

app.get(['/fetchDealers', '/fetchDealers/'], async (req, res) => {
  try {
    console.log("Received GET request for /fetchDealers");
    const docs = await Dealerships.find();
    res.json(docs);
  } catch (error) {
    console.error("Error fetching dealerships:", error);
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

app.get(['/fetchDealers/:state', '/fetchDealers/:state/'], async (req, res) => {
  try {
    console.log(`Received GET request for /fetchDealers/${req.params.state}`);
    const docs = await Dealerships.find({ state: req.params.state });
    res.json(docs);
  } catch (error) {
    console.error("Error fetching dealerships by state:", error);
    res.status(500).json({ error: 'Error fetching dealerships by state' });
  }
});

app.get(['/fetchDealer/:id', '/fetchDealer/:id/'], async (req, res) => {
  const id = req.params.id;
  try {
    console.log(`Received GET request for /fetchDealer/${id}`);
    const dealer = await Dealerships.findOne({ id: id });
    if (dealer) {
      res.json(dealer);
    } else {
      res.status(404).json({ error: 'Dealer not found' });
    }
  } catch (error) {
    console.error("Error fetching dealer details:", error);
    res.status(500).json({ error: 'Error fetching dealer details' });
  }
});

app.post(['/insert_review', '/insert_review/'], async (req, res) => {
  const data = req.body;
  try {
    console.log("Received POST request for /insert_review with data:", data);
    const docs = await Reviews.find().sort({ id: -1 }).limit(1);
    let new_id = docs.length > 0 ? docs[0].id + 1 : 1;
    const review = new Reviews({
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year,
    });
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.error("Error inserting review:", error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Fallback route for unmatched endpoints
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Node.js service is running on http://localhost:${port}`);
});
