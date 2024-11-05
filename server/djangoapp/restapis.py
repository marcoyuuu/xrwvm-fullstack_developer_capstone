# Import necessary libraries
import requests
import os
from dotenv import load_dotenv
from requests.exceptions import RequestException

# Load environment variables
load_dotenv()

# Base URLs from environment variables, with fallbacks
backend_url = os.getenv("backend_url", "http://localhost:3030")
sentiment_analyzer_url = os.getenv("sentiment_analyzer_url", "http://localhost:5050/analyze")

def get_request(endpoint, **kwargs):
    """
    Makes a GET request to the backend API.

    Args:
        endpoint (str): API endpoint to be appended to the backend base URL.
        kwargs (dict): Key-value pairs for URL parameters.

    Returns:
        dict: JSON response from the API if successful, None otherwise.
    """
    params = "&".join(f"{key}={value}" for key, value in kwargs.items())
    request_url = f"{backend_url}/{endpoint}?{params}".strip("?")
    print(f"GET from {request_url}")

    try:
        response = requests.get(request_url, timeout=10)
        response.raise_for_status()
        return response.json()
    except RequestException as e:
        print(f"Network exception occurred: {e}")
        return None

def analyze_review_sentiments(text):
    """
    Analyzes the sentiment of the provided text using an external sentiment analyzer API.

    Args:
        text (str): The text to analyze.

    Returns:
        dict: JSON response with sentiment analysis results if successful, None otherwise.
    """
    request_url = f"{sentiment_analyzer_url}?text={text}"
    print(f"Sentiment analysis request to {request_url}")

    try:
        response = requests.get(request_url, timeout=10)
        response.raise_for_status()
        return response.json()
    except RequestException as e:
        print(f"Sentiment analysis failed: {e}")
        return None

def post_review(data_dict):
    """
    Posts review data to the backend API.

    Args:
        data_dict (dict): Dictionary containing the review data.

    Returns:
        dict: JSON response from the API if successful, None otherwise.
    """
    # Endpoint for posting review
    request_url = f"{backend_url}/insert_review"
    print(f"POST to {request_url} with data {data_dict}")

    # Validate data dictionary for required fields
    required_fields = ["name", "dealership", "review", "purchase", "purchase_date", "car_make", "car_model", "car_year"]
    missing_fields = [field for field in required_fields if field not in data_dict]
    
    if missing_fields:
        print(f"Validation error: Missing fields - {missing_fields}")
        return {"status": "Failed", "message": f"Missing required fields: {', '.join(missing_fields)}"}

    try:
        response = requests.post(request_url, json=data_dict, timeout=10)
        response.raise_for_status()  # Raise an error for 4xx/5xx responses
        return response.json()
    except RequestException as e:
        print(f"Failed to post review: {e}")
        return {"status": "Failed", "message": "Network exception occurred"}
