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
- **Dealer Browsing:** Users can browse a list of dealers, view details (address, reviews, etc.), and access the car inventory search.
- **Reviews:** Authenticated users can post and view reviews for each dealer.
- **Car Inventory Search:** Users can filter and search car listings by make, model, year, mileage, and price.
- **User Authentication:** Secure login, registration, and logout functionalities.

The back end is built using Django, with two Node.js microservices:
1. **Dealer/Reviews Service:** Manages dealer details and reviews.
2. **Car Inventory Service:** Manages car inventory data using MongoDB and Mongoose.

The front end is built with React, with components for dealers, reviews, and car inventory search.

## Features

- **Dynamic Inventory Search:** Filter car listings in real time.
- **Responsive and Modern UI:** Polished React interface with professional styling.
- **Microservice Architecture:** Separate Node.js services for dealer/reviews and car inventory.
- **Secure Authentication:** Implemented using Django.
- **Containerized Deployment:** Fully Dockerized services using Docker Compose.
- **Cloud Ready:** Configurable for deployment on IBM Code Engine and Kubernetes.

## Technology Stack

- **Frontend:** React, HTML5, CSS3, Bootstrap
- **Backend:** Django, Node.js, Express, Python
- **Database:** MongoDB (with Mongoose)
- **Containerization:** Docker, Docker Compose
- **Deployment:** IBM Code Engine, Kubernetes
- **Tools:** Git, GitHub, Virtualenv

## Project Structure

The project is organized as follows:

```
xrwvm-fullstack_developer_capstone/
├── server/
│   ├── djangoproj/                # Django project configuration files
│   │   ├── asgi.py                # ASGI configuration for Django
│   │   ├── settings.py            # Django settings (including static files, DB, allowed hosts, etc.)
│   │   ├── urls.py                # Global URL configuration for Django
│   │   └── wsgi.py                # WSGI configuration for Django
│   ├── djangoapp/                 # Django application containing API endpoints and views
│   │   ├── __init__.py            # Initialization file
│   │   ├── admin.py               # Django admin configuration
│   │   ├── apps.py                # Application configuration
│   │   ├── models.py              # Django models (CarMake, CarModel, etc.)
│   │   ├── populate.py            # Data population script for initial car data
│   │   ├── restapis.py            # Helper functions to call Node.js microservices (includes searchcars_request)
│   │   ├── urls.py                # Application-specific URL configuration
│   │   └── views.py               # Django views handling API requests (login, dealer details, reviews, inventory search)
│   ├── database/                  # Node.js microservice for dealer and reviews data
│   │   ├── app.js                 # Express server for dealers and reviews
│   │   ├── Dockerfile             # Dockerfile for dealer/reviews service
│   │   ├── docker-compose.yml     # Docker Compose file for dealer/reviews service (and associated MongoDB)
│   │   └── package.json           # Node.js configuration for dealer/reviews service
│   ├── carsInventory/             # Node.js microservice for car inventory
│   │   ├── data/                  # Contains car_records.json (inventory data)
│   │   ├── inventory.js           # Mongoose schema for car inventory
│   │   ├── app.js                 # Express server for car inventory
│   │   ├── Dockerfile             # Dockerfile for car inventory service
│   │   ├── docker-compose.yml     # Docker Compose file for car inventory service (and associated MongoDB)
│   │   └── package.json           # Node.js configuration for car inventory service
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
└── README.md                      # This file: project overview, setup, and usage instructions
```

### Detailed Explanation:
- **Djangoproj:** Contains all core Django configuration files.  
- **Djangoapp:** Implements API endpoints and views (authentication, dealers, reviews, and inventory search).  
- **Database:** Node.js microservice managing dealer and reviews data with its own Docker configuration.  
- **CarsInventory:** New Node.js microservice that provides car inventory data via MongoDB. It includes a Mongoose model (`inventory.js`), a main server file (`app.js`), and is Dockerized with a Dockerfile and docker-compose.yml.  
- **Frontend:** A React application with components for displaying dealer information, reviews, and a new SearchCars component for car inventory filtering.

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

# Start the Django development server
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

*This builds and runs the Node.js car inventory service and its MongoDB container.*

### Frontend (React)

#### 1. Build the Client

```bash
cd ../frontend
npm install
npm run build
```

*The production build is created in the `build` folder and will be served as static files by Django.*

---

## Usage

- **Home Page:**  
  Access the application at:  
  `https://marcoyu-8000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/`

- **Dealer Page:**  
  Navigate to a dealer’s page, e.g.:  
  `https://marcoyu-8000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/dealer/17`  
  Here, you will see the dealer details, reviews, and a professionally styled **Search Cars** button.

- **Search Cars:**  
  Clicking the **Search Cars** button takes you to the search page:  
  `https://marcoyu-8000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/searchcars/17`  
  Use dropdowns to filter by make, model, year, mileage, and price.

- **API Endpoints:**  
  You can test individual endpoints, for example:  
  - Dealer details: `/djangoapp/api/dealer/{id}/`  
  - Inventory search: `/djangoapp/get_inventory/{dealer_id}?make=Toyota`

---

## Testing

- **Direct API Testing:**  
  Test endpoints using Postman or your browser, e.g.:  
  ```bash
  http://127.0.0.1:8000/djangoapp/get_inventory/1?make=Toyota
  ```
- **UI Testing:**  
  Navigate through the React application, test the dealer page, and verify that the Search Cars component displays and filters data correctly.

---

## CI/CD and Containerization

- **Docker Compose:**  
  Both Node.js microservices (Dealer/Reviews and Car Inventory) are containerized using Docker and managed via Docker Compose.
- **Deployment:**  
  The project is ready for deployment on IBM Code Engine and can be extended to run in Kubernetes.

---

## Replication Instructions

To replicate the project setup on your local machine or a cloud environment, follow these commands:

### 1. Clone Repository and Set Up Django

```bash
# Clone the repository and navigate to server directory
git clone https://github.com/marcoyuuu/xrwvm-fullstack_developer_capstone.git
cd /home/project/xrwvm-fullstack_developer_capstone/server

# Set up Django environment
pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate
python3 -m pip install -U -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic --noinput
python3 manage.py runserver
```

### 2. Start Dealer/Reviews Microservice

```bash
cd database
docker-compose up --build -d
docker ps
```

### 3. Start Car Inventory Microservice

```bash
cd ../carsInventory
npm install
docker-compose up --build -d
docker ps
```

### 4. Build React Frontend

```bash
cd ../frontend
npm install
npm run build
```

### 5. Access the Application

Open your browser at:  
`https://marcoyu-8000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/`

---

## License

This project is licensed under the [MIT License](LICENSE).
