from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

User = get_user_model()

class HazardType(models.Model):
    """Catalog of ocean hazard types"""
    
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default='#FF0000')  # Hex color
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'hazard_types'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class HazardReport(models.Model):
    """Main model for citizen hazard reports"""
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending Review'
        VERIFIED = 'verified', 'Verified'
        REJECTED = 'rejected', 'Rejected'
        INVESTIGATING = 'investigating', 'Under Investigation'
    
    class Severity(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
        CRITICAL = 'critical', 'Critical'
    
    # Unique identifier
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Core information
    reporter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='reports'
    )
    hazard_type = models.ForeignKey(
        HazardType,
        on_delete=models.CASCADE,
        related_name='reports'
    )
    
    # Location data
    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        validators=[MinValueValidator(-90), MaxValueValidator(90)]
    )
    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        validators=[MinValueValidator(-180), MaxValueValidator(180)]
    )
    location_description = models.CharField(
        max_length=255,
        help_text="Human-readable location description"
    )
    
    # Report details
    title = models.CharField(max_length=200)
    description = models.TextField()
    severity = models.CharField(
        max_length=10,
        choices=Severity.choices,
        default=Severity.MEDIUM
    )
    
    # Status and verification
    status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.PENDING
    )
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_reports'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    verification_notes = models.TextField(blank=True)
    
    # Additional metadata
    is_anonymous = models.BooleanField(default=False)
    confidence_score = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.5,
        validators=[MinValueValidator(0), MaxValueValidator(1)]
    )
    
    # Environmental data at time of report
    weather_conditions = models.JSONField(
        default=dict,
        help_text="Weather data like wind speed, wave height, etc."
    )
    
    # Social media correlation
    social_media_mentions = models.PositiveIntegerField(default=0)
    
    # Timestamps
    incident_datetime = models.DateTimeField(
        help_text="When the incident occurred"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'hazard_reports'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['latitude', 'longitude']),
            models.Index(fields=['status', 'severity']),
            models.Index(fields=['incident_datetime']),
            models.Index(fields=['hazard_type', 'status']),
        ]
    
    def __str__(self):
        return f"{self.hazard_type.name} - {self.location_description}"
    
    @property
    def coordinates(self):
        return [float(self.longitude), float(self.latitude)]

class ReportMedia(models.Model):
    """Media files attached to hazard reports"""
    
    class MediaType(models.TextChoices):
        IMAGE = 'image', 'Image'
        VIDEO = 'video', 'Video'
        AUDIO = 'audio', 'Audio'
    
    report = models.ForeignKey(
        HazardReport,
        on_delete=models.CASCADE,
        related_name='media_files'
    )
    
    media_type = models.CharField(
        max_length=10,
        choices=MediaType.choices
    )
    
    file = models.FileField(upload_to='reports/%Y/%m/')
    filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()  # in bytes
    
    # Image-specific fields
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    
    # Video-specific fields
    duration = models.DurationField(null=True, blank=True)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'report_media'
        ordering = ['uploaded_at']
    
    def __str__(self):
        return f"{self.media_type} - {self.filename}"

class ReportComment(models.Model):
    """Comments and notes on hazard reports"""
    
    report = models.ForeignKey(
        HazardReport,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='report_comments'
    )
    
    content = models.TextField()
    is_internal = models.BooleanField(
        default=False,
        help_text="Internal comments only visible to officials"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'report_comments'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.report.title}"

class Hotspot(models.Model):
    """Detected hazard hotspots based on clustering analysis"""
    
    class AlertLevel(models.TextChoices):
        INFO = 'info', 'Information'
        WARNING = 'warning', 'Warning'
        ALERT = 'alert', 'Alert'
        EMERGENCY = 'emergency', 'Emergency'
    
    # Location
    center_latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        validators=[MinValueValidator(-90), MaxValueValidator(90)]
    )
    center_longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        validators=[MinValueValidator(-180), MaxValueValidator(180)]
    )
    radius_km = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Hotspot details
    name = models.CharField(max_length=200)
    description = models.TextField()
    alert_level = models.CharField(
        max_length=10,
        choices=AlertLevel.choices,
        default=AlertLevel.INFO
    )
    
    # Related reports
    reports = models.ManyToManyField(
        HazardReport,
        related_name='hotspots'
    )
    
    # Analysis data
    confidence_score = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(1)]
    )
    report_count = models.PositiveIntegerField(default=0)
    dominant_hazard_type = models.ForeignKey(
        HazardType,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    detected_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'hotspots'
        ordering = ['-detected_at']
        indexes = [
            models.Index(fields=['center_latitude', 'center_longitude']),
            models.Index(fields=['alert_level', 'is_active']),
        ]
    
    def __str__(self):
        return f"Hotspot: {self.name} ({self.get_alert_level_display()})"