// database/app.js
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

// Middleware
app.use(cors());
app.use(express.json());

// Import Models
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Load Data from JSON Files
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// Connect to MongoDB
mongoose.connect("mongodb://mongo_db:27017/", { 'dbName': 'dealershipsDB' })
    .then(() => {
        console.log("Connected to MongoDB");
        // Initialize Data
        initializeData();
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });

// Function to Initialize Data
const initializeData = async () => {
    try {
        await Reviews.deleteMany({});
        await Reviews.insertMany(reviews_data['reviews']);
        console.log("Reviews data initialized");

        await Dealerships.deleteMany({});
        await Dealerships.insertMany(dealerships_data['dealerships']);
        console.log("Dealerships data initialized");
    } catch (error) {
        console.error("Error initializing data:", error);
    }
};

// Express route to home
app.get('/', (req, res) => {
    res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
    try {
        const documents = await Reviews.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
    try {
        const documents = await Reviews.find({ dealership: req.params.id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
    try {
        const dealerships = await Dealerships.find();
        res.json(dealerships);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealerships' });
    }
});

// Express route to fetch dealerships by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
    const state = req.params.state;
    try {
        const dealerships = await Dealerships.find({ state: state });
        res.json(dealerships);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealerships by state' });
    }
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const dealer = await Dealerships.findOne({ id: id });
        if (dealer) {
            res.json(dealer);
        } else {
            res.status(404).json({ error: 'Dealer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealer details' });
    }
});

// Express route to insert review
app.post('/insert_review', async (req, res) => {
    const data = req.body;

    try {
        const documents = await Reviews.find().sort({ id: -1 }).limit(1);
        let new_id = documents.length > 0 ? documents[0].id + 1 : 1;

        const review = new Reviews({
            id: new_id,
            name: data['name'],
            dealership: data['dealership'],
            review: data['review'],
            purchase: data['purchase'],
            purchase_date: data['purchase_date'],
            car_make: data['car_make'],
            car_model: data['car_model'],
            car_year: data['car_year'],
        });

        const savedReview = await review.save();
        res.json(savedReview);
    } catch (error) {
        console.error("Error inserting review:", error);
        res.status(500).json({ error: 'Error inserting review' });
    }
});

// Handle undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
