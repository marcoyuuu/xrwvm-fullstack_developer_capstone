from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import logging
import json
from .populate import initiate  # Assuming this is needed for another part of your code

# Get an instance of a logger
logger = logging.getLogger(__name__)

# Create your views here.

# Login view to handle sign-in requests
@csrf_exempt
def login_user(request):
    # Get username and password from request body
    data = json.loads(request.body)
    username = data.get('userName')
    password = data.get('password')
    
    # Try to authenticate user
    user = authenticate(username=username, password=password)
    response_data = {"userName": username}

    if user is not None:
        # If user is valid, log them in and return success response
        login(request, user)
        response_data["status"] = "Authenticated"
    else:
        # If authentication fails, add an error status
        response_data["status"] = "Failed"

    return JsonResponse(response_data)

# Logout view to handle sign-out requests
@csrf_exempt
def logout_user(request):
    # Log out the user
    logout(request)
    # Return a JSON response indicating user is logged out
    response_data = {"userName": ""}
    return JsonResponse(response_data)

# Registration view (if needed)
# @csrf_exempt
# def register_user(request):
#     # Your registration logic here
#     pass

# Additional views as needed (commented out placeholders)
# def get_dealerships(request):
#     pass

# def get_dealer_reviews(request, dealer_id):
#     pass

# def get_dealer_details(request, dealer_id):
#     pass

# def add_review(request):
#     pass
