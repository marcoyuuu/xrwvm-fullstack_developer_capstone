from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import logging
import json
from .populate import initiate
from .models import CarMake, CarModel

# Get an instance of a logger
logger = logging.getLogger(__name__)

# Helper to handle responses and errors
def json_response(data, status=200):
    return JsonResponse(data, status=status)

# User Authentication Views
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

# Placeholder views for dealer functionality
def get_dealerships(request):
    pass

def get_dealer_reviews(request, dealer_id):
    pass

def get_dealer_details(request, dealer_id):
    pass

def add_review(request):
    pass
