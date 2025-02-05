# djangoapp/views.py

from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import logging
import json
from django.db.utils import OperationalError
from .populate import initiate
from .models import CarMake, CarModel
from .restapis import (
    backend_url,
    get_request,
    post_review,
    analyze_review_sentiments,
    searchcars_request
)

# Initialize logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

def json_response(data, status=200):
    return JsonResponse(data, status=status)

def custom_404(request, exception):
    return json_response({'error': 'Not Found'}, status=404)

def custom_500(request):
    return json_response({'error': 'Internal Server Error'}, status=500)

# ===== Authentication Views =====

@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return json_response({"error": "Invalid request method"}, status=400)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        logger.error("JSON decode error in login_user")
        return json_response({"error": "Invalid JSON format"}, status=400)
    username = data.get('userName')
    password = data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        logger.info(f"User '{username}' authenticated successfully.")
        return json_response({"userName": username, "status": "Authenticated"})
    logger.warning(f"Authentication failed for user '{username}'.")
    return json_response({"status": "Failed"}, status=401)

@csrf_exempt
def logout_user(request):
    if request.method != "POST":
        return json_response({"error": "Invalid request method"}, status=400)
    logout(request)
    logger.info("User logged out successfully.")
    return json_response({"userName": ""})

@csrf_exempt
def registration(request):
    if request.method != "POST":
        return json_response({"error": "Invalid request method"}, status=400)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        logger.error("JSON decode error in registration")
        return json_response({"error": "Invalid JSON format"}, status=400)
    username = data.get('userName')
    password = data.get('password')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    if User.objects.filter(username=username).exists():
        logger.warning(f"Registration attempt with existing username '{username}'.")
        return json_response({"userName": username, "error": "Already Registered"}, status=400)
    try:
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )
        login(request, user)
        logger.info(f"User '{username}' registered and authenticated successfully.")
        return json_response({"userName": username, "status": "Authenticated"})
    except Exception:
        logger.error(f"Error in registration for user '{username}'.")
        return json_response({"error": "Registration failed"}, status=500)

# ===== Car Model and Make Views =====

def get_cars(request):
    try:
        if CarMake.objects.count() == 0:
            logger.info("No CarMake records found. Running initiate() to populate data...")
            initiate()
            logger.info("Data population completed.")
        car_models = CarModel.objects.select_related('car_make').all()
        cars = [{"CarModel": cm.name, "CarMake": cm.car_make.name} for cm in car_models]
        logger.info(f"Retrieved {len(cars)} car models successfully.")
        return json_response({"CarModels": cars})
    except OperationalError:
        logger.error("Database table not found. Have you run migrations?", exc_info=True)
        return json_response({"error": "Failed to retrieve car models. Have you run migrations?"}, status=500)
    except Exception as exc:
        logger.error(f"Exception in get_cars: {exc}", exc_info=True)
        return json_response({"error": "Failed to retrieve car models"}, status=500)

# ===== Dealer Views =====

def fetch_dealers(request, state="All"):
    logger.info(f"Fetching dealerships for state: {state}")
    try:
        if state != "All":
            endpoint = f"/fetchDealers/{state}"  # No trailing slash
        else:
            endpoint = "/fetchDealers"
        full_url = f"{backend_url}{endpoint}"
        logger.info(f"Calling backend URL: {full_url}")
        dealers = get_request(full_url)
        if dealers is not None:
            logger.info(f"Retrieved {len(dealers)} dealers.")
            return json_response({"status": 200, "dealers": dealers})
        else:
            logger.error("Failed to fetch dealers from backend API.")
            return json_response({"status": 500, "error": "Failed to fetch dealers"}, status=500)
    except Exception as e:
        logger.exception("Exception in fetch_dealers")
        return json_response({"status": 500, "error": "Internal Server Error"}, status=500)

def get_dealer_details(request, dealer_id):
    logger.info(f"Fetching dealer details for ID: {dealer_id}")
    try:
        full_url = f"{backend_url}/fetchDealer/{dealer_id}"  # No trailing slash
        logger.info(f"Fetching dealer details from URL: {full_url}")
        dealer = get_request(full_url)
        if dealer is not None:
            logger.info(f"Dealer details retrieved for ID: {dealer_id}")
            return json_response({"status": 200, "dealer": dealer})
        logger.warning(f"Dealer with ID {dealer_id} not found.")
        return json_response({"status": 404, "error": "Dealer not found"}, status=404)
    except Exception:
        logger.exception("Exception in get_dealer_details")
        return json_response({"status": 500, "error": "Internal Server Error"}, status=500)

def get_dealer_reviews(request, dealer_id):
    logger.info(f"Fetching reviews for dealer ID: {dealer_id}")
    try:
        full_url = f"{backend_url}/fetchReviews/dealer/{dealer_id}"  # No trailing slash
        logger.info(f"Fetching reviews from URL: {full_url}")
        reviews = get_request(full_url)
        if reviews is not None:
            for review_detail in reviews:
                sentiment = analyze_review_sentiments(review_detail.get('review', ''))
                review_detail['sentiment'] = sentiment.get('sentiment', 'neutral') if sentiment else 'neutral'
            logger.info(f"Retrieved {len(reviews)} reviews for dealer ID: {dealer_id}")
            return json_response({"status": 200, "reviews": reviews})
        logger.warning(f"No reviews found for dealer ID {dealer_id}.")
        return json_response({"status": 404, "error": "No reviews found"}, status=404)
    except Exception:
        logger.exception("Exception in get_dealer_reviews")
        return json_response({"status": 500, "error": "Internal Server Error"}, status=500)

# ===== Review Submission View =====

@csrf_exempt
def add_review(request):
    if request.method != "POST":
        logger.warning("add_review called with invalid request method.")
        return json_response({"status": 405, "message": "Method Not Allowed"}, status=405)
    if not request.user.is_authenticated:
        logger.warning("Unauthorized add_review attempt.")
        return json_response({"status": 403, "message": "Unauthorized"}, status=403)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        logger.error("JSON decode error in add_review")
        return json_response({"status": 400, "message": "Invalid JSON format"}, status=400)
    try:
        response = post_review(data)
        if response and "id" in response:
            logger.info(f"Review posted successfully by user '{request.user.username}'.")
            return json_response({"status": 200, "message": "Review posted successfully"})
        logger.error("Failed to post review via backend API. Response: " + str(response))
        return json_response({"status": 500, "message": "Error in posting review"}, status=500)
    except Exception:
        logger.exception("Exception in add_review")
        return json_response({"status": 500, "message": "Internal Server Error"}, status=500)

def get_inventory(request, dealer_id):
    data = request.GET  # Get query parameters
    if dealer_id:
        # Determine which filter is provided; default to retrieving all cars for the dealer.
        if 'year' in data:
            endpoint = f"/carsbyyear/{dealer_id}/{data['year']}"
        elif 'make' in data:
            endpoint = f"/carsbymake/{dealer_id}/{data['make']}"
        elif 'model' in data:
            endpoint = f"/carsbymodel/{dealer_id}/{data['model']}"
        elif 'mileage' in data:
            endpoint = f"/carsbymaxmileage/{dealer_id}/{data['mileage']}"
        elif 'price' in data:
            endpoint = f"/carsbyprice/{dealer_id}/{data['price']}"
        else:
            endpoint = f"/cars/{dealer_id}"
 
        cars = searchcars_request(endpoint)
        return JsonResponse({"status": 200, "cars": cars})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})
