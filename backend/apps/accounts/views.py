from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserLoginSerializer,
    PasswordChangeSerializer
)

User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""
    
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            user = User.objects.get(username=response.data['username'])
            # Auto-login after registration
            login(request, user)
            response.data.update({
                'user': UserProfileSerializer(user).data,
                'message': 'Registration successful and logged in'
            })
        return response

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """User login endpoint"""
    
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'message': 'Login successful'
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """User logout endpoint"""
    
    logout(request)
    return Response({'message': 'Successfully logged out'})

class UserProfileView(generics.RetrieveUpdateAPIView):
    """User profile management"""
    
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password_view(request):
    """Change user password"""
    
    serializer = PasswordChangeSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({'message': 'Password changed successfully'})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    """List users (for admin/analyst use)"""
    
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Only admins and analysts can see user lists
        if user.is_admin_user or user.is_analyst:
            return User.objects.all().order_by('-date_joined')
        
        # Citizens can only see their own profile
        return User.objects.filter(id=user.id)
    
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)