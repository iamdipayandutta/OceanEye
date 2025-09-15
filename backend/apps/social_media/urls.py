from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'posts', views.SocialMediaPostViewSet, basename='social-media-posts')

app_name = 'social_media'

urlpatterns = [
    # ViewSet URLs
    path('api/', include(router.urls)),
    
    # Real-time hashtag endpoints
    path('api/hashtags/realtime/', views.get_realtime_hashtags, name='realtime_hashtags'),
    path('api/hashtags/analytics/', views.get_hashtag_analytics, name='hashtag_analytics'),
    path('api/hashtags/simulate/', views.simulate_hashtag_collection, name='simulate_hashtags'),
]