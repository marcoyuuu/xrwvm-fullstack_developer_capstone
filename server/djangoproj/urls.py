# djangoproj/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from django.http import JsonResponse
import requests
import os

# Function to proxy requests to backend APIs running on a different port
def proxy_to_backend(request, path):
    backend_url = f"http://localhost:3030/{path}"  # Update this URL if the backend port changes
    try:
        response = requests.get(backend_url, timeout=10)
        return JsonResponse(response.json(), status=response.status_code)
    except requests.RequestException as e:
        return JsonResponse({'error': str(e)}, status=500)

urlpatterns = [
    # Admin URL
    path('admin/', admin.site.urls),

    # Include djangoapp URLs
    path('djangoapp/', include('djangoapp.urls')),

    # Proxy API routes to backend
    path('djangoapp/fetchDealers/', lambda request: proxy_to_backend(request, 'fetchDealers')),
    path('djangoapp/fetchDealers/<str:state>/', lambda request, state: proxy_to_backend(request, f'fetchDealers/{state}')),
    path('djangoapp/dealer/<int:dealer_id>/', lambda request, dealer_id: proxy_to_backend(request, f'fetchDealer/{dealer_id}')),
    path('djangoapp/reviews/dealer/<int:dealer_id>/', lambda request, dealer_id: proxy_to_backend(request, f'fetchReviews/dealer/{dealer_id}')),

    # Serve React App for All Other Routes (Catch-All)
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='react-app'),
]

# No need to add static() since WhiteNoise handles it
