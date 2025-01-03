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
def get_dealerships(request, state="All"):
    logger.info(f"Fetching dealerships for state: {state}")

    # Use the correct backend API URL
    backend_base_url = "https://marcoyu-3030.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"
    endpoint = "/fetchDealers" if state == "All" else f"/fetchDealers/{state}"
    full_url = f"{backend_base_url}{endpoint}"

    try:
        dealerships = get_request(full_url)
        logger.debug(f"Response from get_request: {dealerships}")
        if dealerships:
            return json_response({"status": 200, "dealers": dealerships})
        else:
            logger.error("No dealerships found in response.")
            return json_response({"status": 500, "message": "Failed to retrieve dealerships"})
    except Exception as e:
        logger.error(f"Error fetching dealerships: {e}")
        return json_response({"status": 500, "message": "Internal Server Error"})


def get_dealer_details(request, dealer_id):
    logger.info(f"Fetching dealer details for ID: {dealer_id}")

    # Use the correct backend API URL
    backend_base_url = "https://marcoyu-3030.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"
    full_url = f"{backend_base_url}/fetchDealer/{dealer_id}"

    try:
        dealership = get_request(full_url)
        if dealership:
            return json_response({"status": 200, "dealer": dealership})
        return json_response({"status": 404, "message": "Dealer not found"})
    except Exception as e:
        logger.error(f"Error fetching dealer details: {e}")
        return json_response({"status": 500, "message": "Internal Server Error"})


def get_dealer_reviews(request, dealer_id):
    logger.info(f"Fetching reviews for dealer ID: {dealer_id}")

    # Use the correct backend API URL
    backend_base_url = "https://marcoyu-3030.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai"
    full_url = f"{backend_base_url}/fetchReviews/dealer/{dealer_id}"

    try:
        reviews = get_request(full_url)
        if reviews:
            for review_detail in reviews:
                sentiment = analyze_review_sentiments(review_detail.get('review', ''))
                review_detail['sentiment'] = sentiment.get('sentiment', 'neutral')
            return json_response({"status": 200, "reviews": reviews})
        return json_response({"status": 404, "message": "No reviews found"})
    except Exception as e:
        logger.error(f"Error fetching reviews: {e}")
        return json_response({"status": 500, "message": "Internal Server Error"})

def fetch_dealers(request):
    """
    Returns a list of dealers. Replace with actual database or API logic.
    """
    dealers = [
        {"id": 1, "name": "Dealer 1", "city": "City 1", "state": "State 1", "address": "123 Main St", "zip": "12345"},
        {"id": 2, "name": "Dealer 2", "city": "City 2", "state": "State 2", "address": "456 Elm St", "zip": "67890"}
    ]
    return JsonResponse(dealers, safe=False)

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