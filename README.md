# Full-Stack Car Dealership Application

This project is the capstone for IBM’s Full-Stack Application Development Certification. It is a complete full-stack web application that demonstrates proficiency in front‑end and back‑end technologies. The application is a Car Dealership website where users can view dealer details, read and post reviews, and search an inventory of cars using dynamic filters.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup and Deployment](#setup-and-deployment)
  - [Backend (Django & Node.js Microservices)](#backend-django--nodejs-microservices)
  - [Frontend (React)](#frontend-react)
- [Usage](#usage)
- [Testing](#testing)
- [CI/CD and Containerization](#cicd-and-containerization)
- [Replication Instructions](#replication-instructions)
- [License](#license)

## Overview

The Car Dealership application provides:
- **Dealer Browsing:** Users can browse a list of dealers, view detailed dealer information (address, reviews, etc.), and search the car inventory.
- **Reviews:** Authenticated users can post and view reviews for each dealer.
- **Car Inventory Search:** Users can filter and search car listings by make, model, year, mileage, and price.
- **User Authentication:** Secure login, registration, and logout functionalities.

The back end is built using Django and integrates two separate Node.js microservices:
1. **Dealer/Reviews Service:** Manages dealer details and customer reviews.
2. **Car Inventory Service:** Manages car inventory data using MongoDB and Mongoose.

The front end is built with React, providing a modern, responsive user interface.

## Features

- **Dynamic Inventory Search:** Real-time filtering of car listings.
- **Responsive and Modern UI:** Polished React interface with professional styling.
- **Microservice Architecture:** Separate Node.js services for dealer/reviews and car inventory.
- **Secure Authentication:** Implemented using Django.
- **Containerized Deployment:** Fully Dockerized services using Docker Compose.
- **Cloud Ready:** Configurable for deployment on various cloud platforms.

## Technology Stack

- **Frontend:** React, HTML5, CSS3, Bootstrap
- **Backend:** Django, Node.js, Express, Python
- **Database:** MongoDB (with Mongoose for Node.js microservices)
- **Containerization:** Docker, Docker Compose
- **Deployment:** Configurable for IBM Code Engine, Kubernetes, or any cloud platform
- **Tools:** Git, GitHub, Virtualenv

## Project Structure

```
xrwvm-fullstack_developer_capstone/
├── server/
│   ├── djangoproj/                # Django project configuration files
│   │   ├── asgi.py                # ASGI configuration for Django
│   │   ├── settings.py            # Django settings (DB, static files, allowed hosts, etc.)
│   │   ├── urls.py                # Global URL configuration for Django
│   │   └── wsgi.py                # WSGI configuration for Django
│   ├── djangoapp/                 # Django application containing API endpoints and views
│   │   ├── __init__.py            # Initialization file
│   │   ├── admin.py               # Django admin configuration
│   │   ├── apps.py                # Application configuration
│   │   ├── models.py              # Django models (e.g., CarMake, CarModel)
│   │   ├── populate.py            # Script to populate initial car data
│   │   ├── restapis.py            # Helper functions for Node.js microservice API calls
│   │   ├── urls.py                # Application-specific URL configuration
│   │   └── views.py               # Django views for authentication, dealers, reviews, and inventory search
│   ├── database/                  # Node.js microservice for dealer/reviews data
│   │   ├── app.js                 # Express server for dealer/reviews service
│   │   ├── package.json           # Node.js configuration for dealer/reviews service
│   │   ├── Dockerfile             # Dockerfile for dealer/reviews service
│   │   └── docker-compose.yml     # Docker Compose config for dealer/reviews service and MongoDB
│   ├── carsInventory/             # Node.js microservice for car inventory
│   │   ├── data/                  # Contains car_records.json (inventory data)
│   │   ├── inventory.js           # Mongoose schema for car inventory
│   │   ├── app.js                 # Express server for car inventory service
│   │   ├── package.json           # Node.js configuration for car inventory service
│   │   ├── Dockerfile             # Dockerfile for car inventory service
│   │   └── docker-compose.yml     # Docker Compose config for car inventory service and MongoDB
│   └── frontend/                  # React client application
│       ├── public/                # Public assets (HTML, favicon, etc.)
│       └── src/
│           ├── components/        # React components
│           │   ├── Dealers/       # Components related to dealers and reviews
│           │   │   ├── Dealer.jsx     # Dealer details and reviews page
│           │   │   └── SearchCars.jsx # Car inventory search component
│           │   └── Header/        # Header component (navigation bar)
│           │       └── Header.jsx
│           ├── App.js             # Main React routing and component integration
│           └── index.js           # Entry point for React
└── README.md                      # This file
```

### Detailed Explanation

- **Djangoproj:** Contains core Django configurations (ASGI, WSGI, settings, etc.).
- **Djangoapp:** Implements API endpoints and views for authentication, dealer information, reviews, and car inventory search.
- **Database:** A Node.js microservice for managing dealer and reviews data; includes its own Docker configuration.
- **CarsInventory:** A Node.js microservice for managing car inventory data using MongoDB and Mongoose. It includes the Mongoose schema (`inventory.js`), server file (`app.js`), and Docker/Docker Compose configuration.
- **Frontend:** A React application with components for dealers, reviews, a header, and a new SearchCars component for car inventory search.

## Setup and Deployment

### Backend (Django & Node.js Microservices)

#### A. Clone the Repository and Navigate to the Server Directory

```bash
git clone https://github.com/marcoyuuu/xrwvm-fullstack_developer_capstone.git
cd /home/project/xrwvm-fullstack_developer_capstone/server
```

#### B. Set Up the Django Environment

```bash
# Create and activate the virtual environment
pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate

# Install Django requirements
python3 -m pip install -U -r requirements.txt

# Run migrations and collect static files
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic --noinput

# Start the Django development server (default: http://127.0.0.1:8000)
python3 manage.py runserver
```

#### C. Start the Dealer/Reviews Microservice

```bash
cd database
docker-compose up --build -d
docker ps
```

*This builds and runs the Node.js service (for dealer/reviews) along with its MongoDB container.*

#### D. Start the Car Inventory Microservice

```bash
cd ../carsInventory
npm install
docker-compose up --build -d
docker ps
```

*This builds and runs the Node.js car inventory service along with its MongoDB container.*

### Frontend (React)

#### 1. Build the Client

```bash
cd ../frontend
npm install
npm run build
```

*The production build is created in the `build` folder and will be served by Django as static files.*

---

## Usage

- **Home Page:**  
  After deployment, access your application using your domain or localhost. For example, if running locally:
  
  ```
  http://127.0.0.1:8000/
  ```

- **Dealer Page:**  
  Navigate to a dealer’s page (e.g., dealer with ID 17):
  
  ```
  http://127.0.0.1:8000/dealer/17
  ```
  
  On this page, you will see the dealer details, reviews, and a professional **Search Cars** button.

- **Search Cars:**  
  Click the **Search Cars** button to access the search component (e.g., for dealer 17):
  
  ```
  http://127.0.0.1:8000/searchcars/17
  ```
  
  Use the dropdowns to filter the car inventory by make, model, year, mileage, and price.

- **API Endpoints:**  
  You can also test individual API endpoints, such as:
  - Dealer details: `/djangoapp/api/dealer/{id}/`
  - Inventory search: `/djangoapp/get_inventory/{dealer_id}?make=Toyota`

---

## Testing

- **Direct API Testing:**  
  Use a tool like Postman or your browser to test endpoints, for example:
  
  ```
  http://127.0.0.1:8000/djangoapp/get_inventory/1?make=Toyota
  ```
  
- **UI Testing:**  
  Navigate through the application pages (Home, Dealer, Search Cars) to verify that the UI renders correctly and that filtering works as expected.

---

## CI/CD and Containerization

- **Docker Compose:**  
  Both Node.js microservices (Dealer/Reviews and Car Inventory) are containerized using Docker and managed via Docker Compose.
- **Deployment:**  
  The project is ready for deployment on cloud platforms (e.g., IBM Code Engine, Kubernetes) by updating environment variables and domain configurations.

---

## Replication Instructions

To replicate the project on your local machine or cloud environment, follow these commands:

### 1. Clone Repository and Set Up Django

```bash
# Clone the repository and navigate to the server directory
git clone https://github.com/marcoyuuu/xrwvm-fullstack_developer_capstone.git
cd /home/project/xrwvm-fullstack_developer_capstone/server

# Set up the Django environment
pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate
python3 -m pip install -U -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic --noinput
python3 manage.py runserver
```

### 2. Start the Dealer/Reviews Microservice

```bash
cd database
docker-compose up --build -d
docker ps
```

### 3. Start the Car Inventory Microservice

```bash
cd ../carsInventory
npm install
docker-compose up --build -d
docker ps
```

### 4. Build the React Frontend

```bash
cd ../frontend
npm install
npm run build
```

### 5. Access the Application

Open your browser and navigate to your deployed domain or locally at:

```
http://127.0.0.1:8000/
```

---

## License

This project is licensed under the [MIT License](LICENSE).
