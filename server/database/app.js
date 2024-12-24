const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

// Load data from JSON files
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// MongoDB connection with error handling
mongoose.connect("mongodb://mongo_db:27017/", { dbName: 'dealershipsDB', useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully.');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Models
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Initialize database with data
(async () => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data['reviews']);
    console.log('Reviews collection initialized.');

    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data['dealerships']);
    console.log('Dealerships collection initialized.');
  } catch (error) {
    console.error("Error initializing database", error);
  }
})();

// Routes
app.get('/', (req, res) => {
  res.send("Welcome to the Mongoose API");
});

app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching reviews by dealer:', error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find();
    res.json(dealers);
  } catch (error) {
    console.error('Error fetching dealerships:', error);
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const dealers = await Dealerships.find({ state: req.params.state });
    res.json(dealers);
  } catch (error) {
    console.error('Error fetching dealerships by state:', error);
    res.status(500).json({ error: 'Error fetching dealerships by state' });
  }
});

app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealer = await Dealerships.findOne({ id: parseInt(req.params.id) });
    if (dealer) {
      res.json(dealer);
    } else {
      res.status(404).json({ error: 'Dealership not found' });
    }
  } catch (error) {
    console.error('Error fetching dealership by ID:', error);
    res.status(500).json({ error: 'Error fetching dealership by ID' });
  }
});

app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    if (!data.name || !data.dealership || !data.review) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const documents = await Reviews.find().sort({ id: -1 });
    const new_id = documents.length ? documents[0]['id'] + 1 : 1;

    const review = new Reviews({
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase || false,
      purchase_date: data.purchase_date || '',
      car_make: data.car_make || '',
      car_model: data.car_model || '',
      car_year: data.car_year || '',
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.error('Error inserting review:', error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
