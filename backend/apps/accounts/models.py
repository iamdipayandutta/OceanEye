from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class User(AbstractUser):
    """Custom User model with role-based access control"""
    
    class Role(models.TextChoices):
        CITIZEN = 'citizen', 'Citizen'
        ANALYST = 'analyst', 'Analyst'
        ADMIN = 'admin', 'Administrator'
        OFFICIAL = 'official', 'Official'
    
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.CITIZEN,
        help_text="User role determines access permissions"
    )
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True,
        help_text="Phone number for emergency notifications"
    )
    
    organization = models.CharField(
        max_length=200,
        blank=True,
        help_text="Organization name for officials and analysts"
    )
    
    location = models.CharField(
        max_length=200,
        blank=True,
        help_text="Primary location/region of interest"
    )
    
    is_verified = models.BooleanField(
        default=False,
        help_text="Whether the user account has been verified"
    )
    
    notification_preferences = models.JSONField(
        default=dict,
        help_text="User notification preferences"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def is_citizen(self):
        return self.role == self.Role.CITIZEN
    
    @property
    def is_analyst(self):
        return self.role == self.Role.ANALYST
    
    @property
    def is_admin_user(self):
        return self.role == self.Role.ADMIN
    
    @property
    def is_official(self):
        return self.role == self.Role.OFFICIAL