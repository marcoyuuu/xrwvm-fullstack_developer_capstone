# djangoproj/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    # Admin URL
    path('admin/', admin.site.urls),

    # Include djangoapp URLs
    path('djangoapp/', include('djangoapp.urls')),

    # Serve React App for All Other Routes (Catch-All)
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='react-app'),
]
