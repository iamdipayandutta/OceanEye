from django.urls import path

from .views import (
    UserRegistrationView,
    UserProfileView,
    UserListView,
    login_view,
    logout_view,
    change_password_view,
)

urlpatterns = [
    # Authentication
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', login_view, name='user-login'),
    path('logout/', logout_view, name='user-logout'),
    
    # User profile
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('change-password/', change_password_view, name='change-password'),
    
    # User management (admin/analyst)
    path('users/', UserListView.as_view(), name='user-list'),
]