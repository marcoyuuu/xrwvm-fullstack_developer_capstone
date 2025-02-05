/* jshint esversion: 8 */
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3050;

// Enable CORS and URL-encoded body parsing
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Load car inventory data from JSON file
const carsData = JSON.parse(fs.readFileSync('data/car_records.json', 'utf8'));

// Connect to MongoDB (ensure your MongoDB container is running)
mongoose.connect('mongodb://mongo_db:27017/', { dbName: 'dealershipsDB' })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import the Mongoose model
const Cars = require('./inventory');

// Initialize the collection with the data
Cars.deleteMany({})
  .then(() => Cars.insertMany(carsData.cars))
  .then(() => console.log('Car inventory data initialized'))
  .catch(error => console.error('Error initializing data:', error));

// Root endpoint
app.get('/', async (req, res) => {
  res.send('Welcome to the Mongoose API');
});

// Endpoint: Get cars by dealer_id
app.get('/cars/:id', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars' });
  }
});

// Endpoint: Get cars by make (dealer_id and make)
app.get('/carsbymake/:id/:make', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id, make: req.params.make });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by make' });
  }
});

// Endpoint: Get cars by model (dealer_id and model)
app.get('/carsbymodel/:id/:model', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id, model: req.params.model });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by model' });
  }
});

// Endpoint: Get cars by max mileage
app.get('/carsbymaxmileage/:id/:mileage', async (req, res) => {
  try {
    let mileage = parseInt(req.params.mileage);
    let condition = {};
    if(mileage === 50000) {
      condition = { $lte: mileage };
    } else if (mileage === 100000) {
      condition = { $lte: mileage, $gt: 50000 };
    } else if (mileage === 150000) {
      condition = { $lte: mileage, $gt: 100000 };
    } else if (mileage === 200000) {
      condition = { $lte: mileage, $gt: 150000 };
    } else {
      condition = { $gt: 200000 };
    }
    const documents = await Cars.find({ dealer_id: req.params.id, mileage: condition });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by mileage' });
  }
});

// Endpoint: Get cars by price
app.get('/carsbyprice/:id/:price', async (req, res) => {
  try {
    let price = parseInt(req.params.price);
    let condition = {};
    if(price === 20000) {
      condition = { $lte: price };
    } else if (price === 40000) {
      condition = { $lte: price, $gt: 20000 };
    } else if (price === 60000) {
      condition = { $lte: price, $gt: 40000 };
    } else if (price === 80000) {
      condition = { $lte: price, $gt: 60000 };
    } else {
      condition = { $gt: 80000 };
    }
    const documents = await Cars.find({ dealer_id: req.params.id, price: condition });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by price' });
  }
});

// Endpoint: Get cars by minimum year
app.get('/carsbyyear/:id/:year', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id, year: { $gte: parseInt(req.params.year) } });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by year' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
