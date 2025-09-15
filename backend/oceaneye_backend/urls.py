"""oceaneye_backend URL Configuration"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .admin import admin_site

urlpatterns = [
    # Custom Admin Dashboard
    path('admin/', admin_site.urls),
    
    # API v1 URLs
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/reports/', include('apps.reports.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
    path('api/v1/social/', include('apps.social_media.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)