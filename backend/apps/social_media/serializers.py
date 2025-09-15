from rest_framework import serializers
from .models import SocialMediaPost, SocialMediaPlatform, MonitoringKeyword, SocialMediaAlert
from apps.reports.models import HazardType

class SocialMediaPlatformSerializer(serializers.ModelSerializer):
    """
    Serializer for social media platforms
    """
    class Meta:
        model = SocialMediaPlatform
        fields = ['id', 'name', 'api_endpoint', 'is_active', 'rate_limit_per_hour', 'created_at']

class SocialMediaPostSerializer(serializers.ModelSerializer):
    """
    Serializer for social media posts
    """
    platform_name = serializers.CharField(source='platform.name', read_only=True)
    hazard_types = serializers.StringRelatedField(source='detected_hazard_types', many=True, read_only=True)
    
    class Meta:
        model = SocialMediaPost
        fields = [
            'id', 'platform', 'platform_name', 'external_id', 'content', 
            'author_username', 'author_followers', 'likes_count', 'shares_count', 
            'comments_count', 'latitude', 'longitude', 'location_name',
            'hazard_types', 'sentiment', 'confidence_score', 'keywords',
            'language', 'is_verified_source', 'relevance_score',
            'posted_at', 'collected_at', 'analyzed_at'
        ]
        read_only_fields = ['collected_at', 'analyzed_at']

class MonitoringKeywordSerializer(serializers.ModelSerializer):
    """
    Serializer for monitoring keywords
    """
    hazard_type_name = serializers.CharField(source='related_hazard_type.name', read_only=True)
    
    class Meta:
        model = MonitoringKeyword
        fields = [
            'id', 'keyword', 'related_hazard_type', 'hazard_type_name',
            'language', 'variations', 'is_active', 'priority', 'created_at'
        ]

class SocialMediaAlertSerializer(serializers.ModelSerializer):
    """
    Serializer for social media alerts
    """
    hazard_type_name = serializers.CharField(source='hazard_type.name', read_only=True)
    alert_type_display = serializers.CharField(source='get_alert_type_display', read_only=True)
    related_posts_count = serializers.IntegerField(source='related_posts.count', read_only=True)
    
    class Meta:
        model = SocialMediaAlert
        fields = [
            'id', 'alert_type', 'alert_type_display', 'title', 'description',
            'hazard_type', 'hazard_type_name', 'center_latitude', 'center_longitude',
            'radius_km', 'severity_score', 'is_active', 'related_posts_count',
            'acknowledged_by', 'acknowledged_at', 'created_at'
        ]

class HashtagDataSerializer(serializers.Serializer):
    """
    Serializer for real-time hashtag data
    """
    keyword = serializers.CharField()
    hashtag = serializers.CharField()
    priority = serializers.IntegerField()
    language = serializers.CharField()
    post_count = serializers.IntegerField()
    avg_sentiment = serializers.FloatField()
    trend_direction = serializers.CharField()
    related_hazard = serializers.CharField()
    latest_posts = serializers.ListField()
    last_updated = serializers.DateTimeField()

class HashtagTrendSerializer(serializers.Serializer):
    """
    Serializer for hashtag trend data
    """
    hashtag = serializers.CharField()
    priority = serializers.IntegerField()
    daily_data = serializers.ListField()
    total_mentions = serializers.IntegerField()

class PlatformStatsSerializer(serializers.Serializer):
    """
    Serializer for platform statistics
    """
    platform = serializers.CharField()
    post_count = serializers.IntegerField()
    percentage = serializers.FloatField()