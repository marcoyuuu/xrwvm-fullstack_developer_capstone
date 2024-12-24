from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import handler404, handler500
from django.views.defaults import page_not_found, server_error
from django.views.static import serve
from django.http import JsonResponse
import requests

# Function to proxy requests to backend APIs running on a different port
def proxy_to_backend(request, path):
    backend_url = f"http://localhost:3030/{path}"  # Update this URL if the backend port changes
    try:
        response = requests.get(backend_url)
        return JsonResponse(response.json(), status=response.status_code)
    except requests.RequestException as e:
        return JsonResponse({'error': str(e)}, status=500)

urlpatterns = [
    # Admin URL
    path('admin/', admin.site.urls),
    
    # Application URLs
    path('djangoapp/', include('djangoapp.urls')),  # Include URLs from djangoapp

    # Static pages
    path('', TemplateView.as_view(template_name="Home.html"), name='home'),
    path('about/', TemplateView.as_view(template_name="About.html"), name='about'),
    path('contact/', TemplateView.as_view(template_name="Contact.html"), name='contact'),
    
    # React frontend paths for login and register
    path('login/', TemplateView.as_view(template_name="index.html"), name='login_page'),
    path('register/', TemplateView.as_view(template_name="index.html"), name='register_page'),

    # React frontend paths for dealerships
    path('dealers/', TemplateView.as_view(template_name="index.html"), name='dealers_page'),
    path('dealer/<int:dealer_id>/', TemplateView.as_view(template_name="index.html"), name='dealer_details_page'),
    path('dealer/<int:dealer_id>/add-review/', TemplateView.as_view(template_name="index.html"), name='add_review_page'),

    # Proxy API routes to backend
    path('djangoapp/fetchDealers/', lambda request: proxy_to_backend(request, 'fetchDealers')),
    path('djangoapp/fetchDealers/<str:state>/', lambda request, state: proxy_to_backend(request, f'fetchDealers/{state}')),
    path('djangoapp/dealer/<int:dealer_id>/', lambda request, dealer_id: proxy_to_backend(request, f'fetchDealer/{dealer_id}')),
    path('djangoapp/reviews/dealer/<int:dealer_id>/', lambda request, dealer_id: proxy_to_backend(request, f'fetchReviews/dealer/{dealer_id}')),
    
    # Serve manifest.json and static assets
    path('manifest.json', serve, {'path': 'manifest.json', 'document_root': settings.STATIC_ROOT}, name='manifest_json'),
    path('favicon.ico', serve, {'path': 'favicon.ico', 'document_root': settings.STATIC_ROOT}, name='favicon'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Custom error handling
handler404 = 'django.views.defaults.page_not_found'
handler500 = 'django.views.defaults.server_error'
