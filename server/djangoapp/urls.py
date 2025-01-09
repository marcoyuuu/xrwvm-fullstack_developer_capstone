# djangoapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('fetchDealers/', views.fetch_dealers, name='fetch_dealers'),
    path('fetchDealers/<str:state>/', views.fetch_dealers, name='fetch_dealers_by_state'),
    path('dealer/<int:dealer_id>/', views.get_dealer_details, name='dealer_details'),
    path('reviews/dealer/<int:dealer_id>/', views.get_dealer_reviews, name='dealer_reviews'),
    path('login/', views.login_user, name='login_user'),
    path('logout/', views.logout_user, name='logout_user'),
    path('register/', views.registration, name='registration'),
    # ... other URL patterns
]
