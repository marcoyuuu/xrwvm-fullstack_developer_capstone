from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

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
    path('postreview/<int:id>/', TemplateView.as_view(template_name="index.html"), name='post_review_page'),  # Add this line

    # Serve manifest.json and static assets
    path('manifest.json', TemplateView.as_view(template_name="manifest.json"), name='manifest_json'),
    path('favicon.ico', TemplateView.as_view(template_name="favicon.ico"), name='favicon'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
