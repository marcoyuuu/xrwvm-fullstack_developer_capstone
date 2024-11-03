import os
from pathlib import Path

# Base directory path
BASE_DIR = Path(__file__).resolve().parent.parent

# Security: Hide secret key in production
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "django-insecure-ccow$tz_=9%dxu4(0%^(z%nx32#s@(zt9$ih@)5l54yny)wm-0")

# Security: Ensure debug is disabled in production
DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"

# Allowed hosts for deployment
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'marcoyu-8000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai',
    'marcoyu-8000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai',
]

# CSRF Trusted Origins for proxy environments
CSRF_TRUSTED_ORIGINS = [
    'https://marcoyu-8000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai',
    'https://marcoyu-8000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai',
]

# Django REST Framework (Optional, remove if not needed)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
}

# Installed applications
INSTALLED_APPS = [
    'djangoapp.apps.DjangoappConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

# Middleware configurations
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',  # Ensure CSRF protection
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Root URL configuration
ROOT_URLCONF = 'djangoproj.urls'

# Templates configurations
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'frontend/static'),
            os.path.join(BASE_DIR, 'frontend/build'),
            os.path.join(BASE_DIR, 'frontend/build/static'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI application
WSGI_APPLICATION = 'djangoproj.wsgi.application'

# Database configuration (SQLite for development)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization settings
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static and media files configuration
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Deployment ready static root

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')  # Media root configuration

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'frontend/static'),
    os.path.join(BASE_DIR, 'frontend/build'),
    os.path.join(BASE_DIR, 'frontend/build/static'),
]

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
