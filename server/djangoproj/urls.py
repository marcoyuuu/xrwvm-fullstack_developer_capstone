# djangoproj/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),
    # Catch‐all for React app (ensure API endpoints are already matched above)
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='react-app'),
    # Explicitly add the searchcars route:
    path('searchcars/<int:dealer_id>', TemplateView.as_view(template_name='index.html'), name='searchcars'),
]
