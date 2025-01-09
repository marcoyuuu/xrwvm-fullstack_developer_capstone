# djangoapp/restapis.py
import requests
import os
from dotenv import load_dotenv
from requests.exceptions import RequestException
import logging

logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Base URLs from environment variables
backend_url = os.getenv("backend_url", "http://localhost:3030")
sentiment_analyzer_url = os.getenv("sentiment_analyzer_url", "http://localhost:5050/analyze")

def get_request(url, **kwargs):
    try:
        logger.info(f"Making GET request to URL: {url}")
        response = requests.get(url, params=kwargs, timeout=10)
        response.raise_for_status()
        return response.json()
    except RequestException as e:
        logger.error(f"Error making GET request to {url}: {e}")
        return None

def analyze_review_sentiments(text):
    request_url = f"{sentiment_analyzer_url}?text={text}"
    logger.info(f"Sentiment analysis request to {request_url}")
    try:
        response = requests.get(request_url, timeout=10)
        response.raise_for_status()
        return response.json()
    except RequestException as e:
        logger.error(f"Sentiment analysis failed: {e}")
        return None

def post_review(data_dict):
    request_url = f"{backend_url}/insert_review"
    logger.info(f"POST to {request_url} with data {data_dict}")

    required_fields = ["name", "dealership", "review", "purchase", "purchase_date", "car_make", "car_model", "car_year"]
    missing_fields = [field for field in required_fields if field not in data_dict]
    
    if missing_fields:
        logger.error(f"Validation error: Missing fields - {missing_fields}")
        return {"status": "Failed", "message": f"Missing required fields: {', '.join(missing_fields)}"}

    try:
        response = requests.post(request_url, json=data_dict, timeout=10)
        response.raise_for_status()
        return response.json()
    except RequestException as e:
        logger.error(f"Failed to post review: {e}")
        return {"status": "Failed", "message": "Network exception occurred"}
