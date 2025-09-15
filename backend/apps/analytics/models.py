from django.db import models
from django.contrib.auth import get_user_model
from apps.reports.models import HazardType, HazardReport

User = get_user_model()

class AnalyticsSnapshot(models.Model):
    """Daily analytics snapshots for performance monitoring"""
    
    date = models.DateField(unique=True)
    
    # Report statistics
    total_reports = models.PositiveIntegerField(default=0)
    verified_reports = models.PositiveIntegerField(default=0)
    pending_reports = models.PositiveIntegerField(default=0)
    rejected_reports = models.PositiveIntegerField(default=0)
    
    # User statistics
    active_users = models.PositiveIntegerField(default=0)
    new_users = models.PositiveIntegerField(default=0)
    
    # Hazard statistics
    high_severity_reports = models.PositiveIntegerField(default=0)
    active_hotspots = models.PositiveIntegerField(default=0)
    
    # Social media metrics
    social_media_mentions = models.PositiveIntegerField(default=0)
    trending_keywords = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'analytics_snapshots'
        ordering = ['-date']
    
    def __str__(self):
        return f"Analytics for {self.date}"

class TrendingKeyword(models.Model):
    """Trending keywords from social media and reports"""
    
    keyword = models.CharField(max_length=100)
    mention_count = models.PositiveIntegerField(default=0)
    sentiment_score = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.0
    )
    related_hazard_type = models.ForeignKey(
        HazardType,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'trending_keywords'
        unique_together = ['keyword', 'date']
        ordering = ['-mention_count']
    
    def __str__(self):
        return f"{self.keyword} ({self.mention_count} mentions)"

class RegionalStatistics(models.Model):
    """Regional analytics for different coastal areas"""
    
    region_name = models.CharField(max_length=200)
    state = models.CharField(max_length=100)
    
    # Geographic bounds
    north_lat = models.DecimalField(max_digits=10, decimal_places=7)
    south_lat = models.DecimalField(max_digits=10, decimal_places=7)
    east_lng = models.DecimalField(max_digits=10, decimal_places=7)
    west_lng = models.DecimalField(max_digits=10, decimal_places=7)
    
    # Statistics for the current month
    total_reports_month = models.PositiveIntegerField(default=0)
    critical_reports_month = models.PositiveIntegerField(default=0)
    active_users_month = models.PositiveIntegerField(default=0)
    
    # Risk assessment
    risk_level = models.CharField(
        max_length=10,
        choices=[
            ('low', 'Low Risk'),
            ('medium', 'Medium Risk'),
            ('high', 'High Risk'),
            ('critical', 'Critical Risk'),
        ],
        default='low'
    )
    
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'regional_statistics'
        ordering = ['state', 'region_name']
    
    def __str__(self):
        return f"{self.region_name}, {self.state}"