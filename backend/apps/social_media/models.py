from django.db import models
from django.contrib.auth import get_user_model
from apps.reports.models import HazardType

User = get_user_model()

class SocialMediaPlatform(models.Model):
    """Supported social media platforms"""
    
    name = models.CharField(max_length=50, unique=True)
    api_endpoint = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    rate_limit_per_hour = models.PositiveIntegerField(default=1000)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'social_media_platforms'
    
    def __str__(self):
        return self.name

class SocialMediaPost(models.Model):
    """Social media posts related to ocean hazards"""
    
    class Sentiment(models.TextChoices):
        POSITIVE = 'positive', 'Positive'
        NEGATIVE = 'negative', 'Negative'
        NEUTRAL = 'neutral', 'Neutral'
    
    # Platform and post identification
    platform = models.ForeignKey(
        SocialMediaPlatform,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    external_id = models.CharField(
        max_length=100,
        help_text="Post ID from the social media platform"
    )
    
    # Content
    content = models.TextField()
    author_username = models.CharField(max_length=100)
    author_followers = models.PositiveIntegerField(default=0)
    
    # Engagement metrics
    likes_count = models.PositiveIntegerField(default=0)
    shares_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    
    # Location data (if available)
    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True
    )
    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True
    )
    location_name = models.CharField(max_length=200, blank=True)
    
    # NLP Analysis results
    detected_hazard_types = models.ManyToManyField(
        HazardType,
        blank=True,
        related_name='social_media_posts'
    )
    sentiment = models.CharField(
        max_length=10,
        choices=Sentiment.choices,
        default=Sentiment.NEUTRAL
    )
    confidence_score = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.0
    )
    keywords = models.JSONField(default=list)
    
    # Language detection
    language = models.CharField(max_length=10, default='en')
    
    # Verification
    is_verified_source = models.BooleanField(default=False)
    relevance_score = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.0
    )
    
    # Timestamps
    posted_at = models.DateTimeField()
    collected_at = models.DateTimeField(auto_now_add=True)
    analyzed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'social_media_posts'
        unique_together = ['platform', 'external_id']
        ordering = ['-posted_at']
        indexes = [
            models.Index(fields=['posted_at', 'relevance_score']),
            models.Index(fields=['latitude', 'longitude']),
            models.Index(fields=['sentiment', 'confidence_score']),
        ]
    
    def __str__(self):
        return f"{self.platform.name} post by {self.author_username}"

class MonitoringKeyword(models.Model):
    """Keywords to monitor across social media platforms"""
    
    keyword = models.CharField(max_length=100)
    related_hazard_type = models.ForeignKey(
        HazardType,
        on_delete=models.CASCADE,
        related_name='monitoring_keywords'
    )
    
    # Language variations
    language = models.CharField(max_length=10, default='en')
    variations = models.JSONField(
        default=list,
        help_text="Alternative spellings and translations"
    )
    
    # Monitoring settings
    is_active = models.BooleanField(default=True)
    priority = models.PositiveIntegerField(
        default=1,
        help_text="Higher numbers = higher priority"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'monitoring_keywords'
        unique_together = ['keyword', 'language']
        ordering = ['-priority', 'keyword']
    
    def __str__(self):
        return f"{self.keyword} ({self.language})"

class SocialMediaAlert(models.Model):
    """Alerts generated from social media analysis"""
    
    class AlertType(models.TextChoices):
        SPIKE = 'spike', 'Mention Spike'
        SENTIMENT = 'sentiment', 'Negative Sentiment'
        LOCATION = 'location', 'Location-based Alert'
        VERIFICATION = 'verification', 'Needs Verification'
    
    alert_type = models.CharField(
        max_length=15,
        choices=AlertType.choices
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Related data
    related_posts = models.ManyToManyField(
        SocialMediaPost,
        related_name='alerts'
    )
    hazard_type = models.ForeignKey(
        HazardType,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    
    # Geographic focus
    center_latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True
    )
    center_longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True
    )
    radius_km = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # Alert properties
    severity_score = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.5
    )
    is_active = models.BooleanField(default=True)
    acknowledged_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='acknowledged_alerts'
    )
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'social_media_alerts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['alert_type', 'is_active']),
            models.Index(fields=['severity_score', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_alert_type_display()}: {self.title}"