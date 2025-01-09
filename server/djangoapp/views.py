# djangoapp/views.py
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import logging
import json
from .populate import initiate
from .models import CarMake, CarModel
from .restapis import get_request, post_review, analyze_review_sentiments

# Initialize logger
logger = logging.getLogger(__name__)

# Helper function to return a JSON response
def json_response(data, status=200):
    return JsonResponse(data, status=status)

# Authentication Views
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('userName')
            password = data.get('password')
            user = authenticate(username=username, password=password)
            if user:
                login(request, user)
                return json_response({"userName": username, "status": "Authenticated"})
            return json_response({"status": "Failed"}, status=401)
        except json.JSONDecodeError:
            return json_response({"error": "Invalid JSON format"}, status=400)
    return json_response({"error": "Invalid request method"}, status=400)

@csrf_exempt
def logout_user(request):
    if request.method == "POST":
        logout(request)
        return json_response({"userName": ""})
    return json_response({"error": "Invalid request method"}, status=400)

@csrf_exempt
def registration(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username, password = data.get('userName'), data.get('password')
            first_name, last_name = data.get('firstName'), data.get('lastName')
            email = data.get('email')
            
            if User.objects.filter(username=username).exists():
                return json_response({"userName": username, "error": "Already Registered"}, status=400)
            
            user = User.objects.create_user(
                username=username, password=password, first_name=first_name,
                last_name=last_name, email=email
            )
            login(request, user)
            return json_response({"userName": username, "status": "Authenticated"})
        
        except json.JSONDecodeError:
            return json_response({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            logger.error(f"Error in registration: {e}")
            return json_response({"error": "Registration failed"}, status=500)
    return json_response({"error": "Invalid request method"}, status=400)

# Car Model and Make Views
def get_cars(request):
    if CarMake.objects.count() == 0:
        initiate()
    
    car_models = CarModel.objects.select_related('car_make')
    cars = [{"CarModel": car_model.name, "CarMake": car_model.car_make.name} for car_model in car_models]
    return json_response({"CarModels": cars})

# Dealer Views
def fetch_dealers(request, state="All"):
    logger.info(f"Fetching dealerships for state: {state}")

    # Determine the correct endpoint based on the state
    if state and state != "All":
        endpoint = f"/fetchDealers/{state}/"
    else:
        endpoint = "/fetchDealers/"
    
    full_url = f"{backend_url}{endpoint}"
    logger.debug(f"Fetching dealers from URL: {full_url}")

    dealers = get_request(full_url)

    if dealers is not None:
        return JsonResponse({"status": 200, "dealers": dealers})
    else:
        logger.error("Failed to fetch dealers from backend API.")
        return JsonResponse({"status": 500, "error": "Failed to fetch dealers"}, status=500)

def get_dealer_details(request, dealer_id):
    logger.info(f"Fetching dealer details for ID: {dealer_id}")

    full_url = f"{backend_url}/fetchDealer/{dealer_id}/"
    logger.debug(f"Fetching dealer details from URL: {full_url}")

    dealer = get_request(full_url)

    if dealer is not None:
        return JsonResponse({"status": 200, "dealer": dealer})
    else:
        logger.error(f"Dealer with ID {dealer_id} not found.")
        return JsonResponse({"status": 404, "error": "Dealer not found"}, status=404)

def get_dealer_reviews(request, dealer_id):
    logger.info(f"Fetching reviews for dealer ID: {dealer_id}")

    full_url = f"{backend_url}/fetchReviews/dealer/{dealer_id}/"
    logger.debug(f"Fetching reviews from URL: {full_url}")

    reviews = get_request(full_url)

    if reviews is not None:
        for review_detail in reviews:
            sentiment = analyze_review_sentiments(review_detail.get('review', ''))
            review_detail['sentiment'] = sentiment.get('sentiment', 'neutral') if sentiment else 'neutral'
        return JsonResponse({"status": 200, "reviews": reviews})
    else:
        logger.error(f"No reviews found for dealer ID {dealer_id}.")
        return JsonResponse({"status": 404, "error": "No reviews found"}, status=404)

# View to handle review submission
@csrf_exempt
def add_review(request):
    """
    Adds a review for a dealer.
    Only accessible to authenticated users.
    """
    if request.user.is_authenticated:
        if request.method == "POST":
            try:
                # Parse JSON body data
                data = json.loads(request.body)
                # Post review data to backend service
                response = post_review(data)
                if response and response.get("status") == "Success":
                    return json_response({"status": 200, "message": "Review posted successfully"})
                return json_response({"status": 500, "message": "Error in posting review"})
            except json.JSONDecodeError:
                return json_response({"status": 400, "message": "Invalid JSON format"})
            except Exception as e:
                logger.error(f"Error posting review: {e}")
                return json_response({"status": 500, "message": "Internal Server Error"})
        return json_response({"status": 405, "message": "Method Not Allowed"}, status=405)
    return json_response({"status": 403, "message": "Unauthorized"}, status=403)
