# djangoapp/urls.py

from django.urls import path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    # API Endpoints (prefixed with 'api/')
    path('api/login/', views.login_user, name='api_login'),
    path('api/register/', views.registration, name='api_register'),
    path('api/logout/', views.logout_user, name='api_logout'),
    path('api/dealers/', views.fetch_dealers, name='api_dealers_page'),
    path('api/dealers/<str:state>/', views.fetch_dealers, name='api_dealers_by_state'),
    path('api/dealer/<int:dealer_id>/', views.get_dealer_details, name='api_dealer_details_page'),
    path('api/reviews/dealer/<int:dealer_id>/', views.get_dealer_reviews, name='api_dealer_reviews_page'),
    path('api/get_cars/', views.get_cars, name='api_get_cars'),
    path('api/add_review/', views.add_review, name='api_add_review_page'),

    # Frontend Routes (all returning index.html)
    path('', TemplateView.as_view(template_name="index.html"), name='home'),
    path('about/', TemplateView.as_view(template_name="index.html"), name='about'),
    path('contact/', TemplateView.as_view(template_name="index.html"), name='contact'),
    path('login/', TemplateView.as_view(template_name="index.html"), name='login_page'),
    path('register/', TemplateView.as_view(template_name="index.html"), name='register_page'),
    path('dealers/', TemplateView.as_view(template_name="index.html"), name='dealers_page'),
    path('dealer/<int:dealer_id>/', TemplateView.as_view(template_name="index.html"), name='dealer_details_page'),
    path('postreview/<int:id>/', TemplateView.as_view(template_name="index.html"), name='post_review_page'),

    # Static assets
    path('manifest.json', TemplateView.as_view(template_name="manifest.json"), name='manifest_json'),
    path('favicon.ico', TemplateView.as_view(template_name="favicon.ico"), name='favicon'),
]
