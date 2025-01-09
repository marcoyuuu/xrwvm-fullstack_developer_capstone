# djangoapp/urls.py
from django.urls import path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    # Static pages
    path('', TemplateView.as_view(template_name="index.html"), name='home'),
    path('about/', TemplateView.as_view(template_name="index.html"), name='about'),
    path('contact/', TemplateView.as_view(template_name="index.html"), name='contact'),

    # React frontend paths for login and register
    path('login/', TemplateView.as_view(template_name="index.html"), name='login_page'),
    path('register/', TemplateView.as_view(template_name="index.html"), name='register_page'),

    # React frontend paths for dealerships
    path('dealers/', views.fetch_dealers, name='dealers_page'),
    path('dealers/<str:state>/', views.fetch_dealers, name='dealers_by_state'),
    path('dealer/<int:dealer_id>/', views.get_dealer_details, name='dealer_details_page'),
    path('dealer/<int:dealer_id>/add-review/', TemplateView.as_view(template_name="index.html"), name='add_review_page'),
    path('postreview/<int:id>/', TemplateView.as_view(template_name="index.html"), name='post_review_page'),

    # Serve manifest.json and static assets
    path('manifest.json', TemplateView.as_view(template_name="manifest.json"), name='manifest_json'),
    path('favicon.ico', TemplateView.as_view(template_name="favicon.ico"), name='favicon'),
]
