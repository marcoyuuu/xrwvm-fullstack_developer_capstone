# djangoapp/views.py

from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import logging
import json

from .populate import initiate
from .models import CarMake, CarModel
from .restapis import backend_url, get_request, post_review, analyze_review_sentiments

# Initialize logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)  # Ensure logger captures debug-level logs

# You might need to configure handlers if not already done in settings
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
    except Exception as e:
        logger.error(f"Error in registration for user '{username}': {e}")
        return json_response({"error": "Registration failed"}, status=500)

# ===== Car Model and Make Views =====
def get_cars(request):
    logger.info("Received request to get car models.")
    try:
        # Populate data if none exists
        if CarMake.objects.count() == 0:
            logger.debug("No CarMake entries found. Initiating data population.")
            initiate()
            logger.debug("Data population completed.")
        car_models = CarModel.objects.select_related('car_make')
        cars = [{"CarModel": cm.name, "CarMake": cm.car_make.name} for cm in car_models]
        logger.debug(f"Retrieved {len(cars)} car models.")
        return json_response({"CarModels": cars})
    except Exception as e:
        logger.error(f"Error in get_cars view: {e}")
        return json_response({"error": "Failed to retrieve car models"}, status=500)

# ===== Dealer Views =====
def fetch_dealers(request, state="All"):
    logger.info(f"Fetching dealerships for state: {state}")
    try:
        if state != "All":
            endpoint = f"/fetchDealers/{state}/"
        else:
            endpoint = "/fetchDealers/"
        full_url = f"{backend_url}{endpoint}"
        logger.debug(f"Fetching dealers from URL: {full_url}")
        dealers = get_request(full_url)
        if dealers is not None:
            logger.debug(f"Retrieved {len(dealers)} dealers.")
            return json_response({"status": 200, "dealers": dealers})
        logger.error("Failed to fetch dealers from backend API.")
        return json_response({"status": 500, "error": "Failed to fetch dealers"}, status=500)
    except Exception as e:
        logger.error(f"Exception in fetch_dealers: {e}")
        return json_response({"status": 500, "error": "Internal Server Error"}, status=500)

def get_dealer_details(request, dealer_id):
    logger.info(f"Fetching dealer details for ID: {dealer_id}")
    try:
        full_url = f"{backend_url}/fetchDealer/{dealer_id}/"
        logger.debug(f"Fetching dealer details from URL: {full_url}")
        dealer = get_request(full_url)
        if dealer is not None:
            logger.debug(f"Dealer details retrieved for ID: {dealer_id}")
            return json_response({"status": 200, "dealer": dealer})
        logger.warning(f"Dealer with ID {dealer_id} not found.")
        return json_response({"status": 404, "error": "Dealer not found"}, status=404)
    except Exception as e:
        logger.error(f"Exception in get_dealer_details: {e}")
        return json_response({"status": 500, "error": "Internal Server Error"}, status=500)

def get_dealer_reviews(request, dealer_id):
    logger.info(f"Fetching reviews for dealer ID: {dealer_id}")
    try:
        full_url = f"{backend_url}/fetchReviews/dealer/{dealer_id}/"
        logger.debug(f"Fetching reviews from URL: {full_url}")
        reviews = get_request(full_url)
        if reviews is not None:
            for review_detail in reviews:
                sentiment = analyze_review_sentiments(review_detail.get('review', ''))
                review_detail['sentiment'] = sentiment.get('sentiment', 'neutral') if sentiment else 'neutral'
            logger.debug(f"Retrieved {len(reviews)} reviews for dealer ID: {dealer_id}")
            return json_response({"status": 200, "reviews": reviews})
        logger.warning(f"No reviews found for dealer ID {dealer_id}.")
        return json_response({"status": 404, "error": "No reviews found"}, status=404)
    except Exception as e:
        logger.error(f"Exception in get_dealer_reviews: {e}")
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
        if response and response.get("status") == "Success":
            logger.info(f"Review posted successfully by user '{request.user.username}'.")
            return json_response({"status": 200, "message": "Review posted successfully"})
        logger.error("Failed to post review via backend API.")
        return json_response({"status": 500, "message": "Error in posting review"}, status=500)
    except Exception as e:
        logger.error(f"Exception in add_review: {e}")
        return json_response({"status": 500, "message": "Internal Server Error"}, status=500)
