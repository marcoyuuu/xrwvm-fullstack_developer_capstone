# Full-Stack Car Dealership Application

This project is the capstone for IBM’s Full-Stack Application Development Certification. It is a complete full-stack web application that demonstrates proficiency in front‑end and back‑end technologies. The application serves as a Car Dealership website, allowing users to view dealer details, reviews, and search the car inventory using dynamic filters.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup and Deployment](#setup-and-deployment)
  - [Backend (Django & Node.js Microservices)](#backend-django--nodejs-microservices)
  - [Frontend (React)](#frontend-react)
- [Usage](#usage)
- [Testing](#testing)
- [CI/CD and Containerization](#cicd-and-containerization)
- [License](#license)

## Overview

The Car Dealership application provides the following functionality:
- **Dealer Browsing:** Users can view a list of dealers, select a dealer, and see details such as address, reviews, and additional dealer information.
- **Reviews:** Authenticated users can post and view reviews for each dealer.
- **Car Inventory Search:** Users can filter and search through a car inventory by make, model, year, mileage, and price.
- **User Authentication:** Secure login, registration, and logout functionalities.

The application uses Django as the primary back‑end, integrates two separate Node.js microservices (one for dealer details/reviews and one for car inventory), and a React front‑end for a dynamic user experience.

## Features

- **Dynamic Car Inventory Search:** Filter car listings by various criteria in real time.
- **Responsive User Interface:** A polished and modern UI built with React.
- **Microservice Architecture:** Separate Node.js services manage dealership data and car inventory.
- **Secure Authentication:** User authentication is implemented using Django.
- **Containerization Ready:** Dockerized services for easy deployment and scaling.

## Technology Stack

- **Frontend:** React, HTML5, CSS3, Bootstrap
- **Backend:** Django, Node.js, Express, Python
- **Database:** MongoDB (using Mongoose for Node.js microservices)
- **Containerization:** Docker, Docker Compose
- **Cloud & Deployment:** IBM Code Engine, Kubernetes (configurable)
- **Tools:** Git, GitHub, Virtual Environments (virtualenv)

## Setup and Deployment

### Backend (Django & Node.js Microservices)

#### 1. Clone the Repository and Navigate to the Server Directory

```bash
git clone https://github.com/marcoyuuu/xrwvm-fullstack_developer_capstone.git
cd /home/project/xrwvm-fullstack_developer_capstone/server
```

#### 2. Set Up the Django Environment

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

#### 3. Start the Node.js Microservices

##### Dealer/Reviews Microservice  
*(Assuming you have previously set this up in the `database` folder.)*

##### Car Inventory Microservice

Navigate to the `carsInventory` directory, install dependencies, and use Docker Compose to build and run the service:

```bash
cd /home/project/xrwvm-fullstack_developer_capstone/server/carsInventory
npm install

# If needed, stop any existing containers:
docker-compose down

# Build and run the microservice (along with MongoDB) in detached mode
docker-compose up --build -d

# Verify containers are running
docker ps
```

### Frontend (React)

#### 1. Navigate to the Frontend Directory and Build the Client

```bash
cd /home/project/xrwvm-fullstack_developer_capstone/server/frontend
npm install
npm run build
```

The built static files will be served by Django.

---

## Usage

- **Home Page:**  
  Access the home page at:  
  `https://marcoyu-8000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/`

- **Dealer Page:**  
  View a dealer’s details, reviews, and click the “Search Cars” button. For example:  
  `https://marcoyu-8000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/dealer/17`

- **Search Cars:**  
  Clicking the “Search Cars” button navigates to the search component. Use the dropdown filters (make, model, year, mileage, price) to filter the car inventory. For instance, test with:  
  `https://marcoyu-8000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/searchcars/17`

- **API Endpoints:**  
  You can also test individual API endpoints directly (using Postman or a browser), such as:  
  - Dealer details: `/djangoapp/api/dealer/{id}/`  
  - Inventory search: `/djangoapp/get_inventory/{dealer_id}?make=Toyota`

---

## Testing

- **Direct API Testing:**  
  Use Postman or your browser to verify API endpoints, for example:  
  ```
  http://127.0.0.1:8000/djangoapp/get_inventory/1?make=Toyota
  ```

- **UI Testing:**  
  Navigate through the React app to ensure pages render correctly, filtering works, and the overall user experience is smooth.

---

## CI/CD and Containerization

- **Docker Compose:**  
  The car inventory microservice is containerized using Docker and orchestrated with Docker Compose. The provided `docker-compose.yml` in the `carsInventory` folder handles both MongoDB and the Node.js service.
  
- **Kubernetes & IBM Code Engine:**  
  The project is configured for deployment on IBM Code Engine and can be adapted to run in a Kubernetes environment.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Replicating the Setup

To replicate this project on your own machine or in a cloud environment, follow these steps:

1. **Clone the repository** and navigate to the server directory.
2. **Set up the Django environment** as described above.
3. **Start the Node.js microservices** using Docker Compose.
4. **Build and deploy the React front-end**.
5. **Configure environment variables** (in `.env`) as needed for your deployment.
6. **Run and test the application** using the provided URLs and API endpoints.

By following these instructions, you will have a fully functional, professional-grade car dealership application. Enjoy exploring the project, and feel free to customize it further!
