from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'

urlpatterns = [
    # Authentication Paths
    path('register/', views.registration, name='register'),  # Path for user registration
    path('login/', views.login_user, name='login'),          # Path for user login
    path('logout/', views.logout_user, name='logout'),       # Path for user logout

    # Dealer-related Paths (uncomment and implement as needed)
    # path('dealer/<int:dealer_id>/', views.dealer_details, name='dealer_details'),  # Path for viewing dealer details
    # path('dealer/<int:dealer_id>/review/', views.add_review, name='add_review'),    # Path for adding a dealer review

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
