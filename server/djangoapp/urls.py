from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # Path for registration
    path('register/', view=views.registration, name='register'),

    # Path for login with trailing slash
    path('login/', view=views.login_user, name='login'),

    # Path for logout with trailing slash
    path('logout/', view=views.logout_user, name='logout'),

    # Path for dealer reviews view (uncomment and implement if applicable)
    # path('dealer/<int:dealer_id>/', view=views.dealer_details, name='dealer_details'),

    # Path for add a review view (uncomment and implement if applicable)
    # path('dealer/<int:dealer_id>/review/', view=views.add_review, name='add_review'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 
