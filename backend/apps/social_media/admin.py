from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import SocialMediaPlatform, SocialMediaPost, MonitoringKeyword, SocialMediaAlert

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import SocialMediaPlatform, SocialMediaPost, MonitoringKeyword, SocialMediaAlert

@admin.register(SocialMediaPlatform)
class SocialMediaPlatformAdmin(admin.ModelAdmin):
    """Admin for social media platforms"""
    
    list_display = ['name', 'api_endpoint', 'is_active', 'rate_limit_per_hour', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Platform Information', {
            'fields': ('name', 'api_endpoint', 'is_active', 'rate_limit_per_hour')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )

@admin.register(SocialMediaPost)
class SocialMediaPostAdmin(admin.ModelAdmin):
    """Admin for social media posts"""
    
    list_display = [
        'platform', 'author_username', 'sentiment_badge', 'engagement_summary',
        'location_info', 'relevance_score', 'posted_at'
    ]
    list_filter = ['platform', 'sentiment', 'is_verified_source', 'language', 'posted_at']
    search_fields = ['content', 'author_username', 'location_name']
    readonly_fields = ['external_id', 'collected_at', 'analyzed_at']
    date_hierarchy = 'posted_at'
    filter_horizontal = ['detected_hazard_types']
    
    fieldsets = (
        ('Post Information', {
            'fields': ('platform', 'external_id', 'author_username', 'author_followers')
        }),
        ('Content', {
            'fields': ('content', 'language', 'keywords')
        }),
        ('Engagement Metrics', {
            'fields': ('likes_count', 'shares_count', 'comments_count')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude', 'location_name')
        }),
        ('Analysis', {
            'fields': ('detected_hazard_types', 'sentiment', 'confidence_score', 'relevance_score')
        }),
        ('Verification', {
            'fields': ('is_verified_source',)
        }),
        ('Timestamps', {
            'fields': ('posted_at', 'collected_at', 'analyzed_at')
        }),
    )
    
    def sentiment_badge(self, obj):
        """Display sentiment with colored badge"""
        colors = {
            'positive': '#10b981',  # green
            'negative': '#ef4444',  # red
            'neutral': '#6b7280',   # gray
        }
        color = colors.get(obj.sentiment, '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 6px; '
            'border-radius: 3px; font-size: 10px;">{}</span>',
            color, obj.sentiment.title()
        )
    sentiment_badge.short_description = 'Sentiment'
    
    def engagement_summary(self, obj):
        """Display engagement metrics summary"""
        total = obj.likes_count + obj.shares_count + obj.comments_count
        return format_html(
            '👍 {} | 🔄 {} | 💬 {} | Total: {}',
            obj.likes_count, obj.shares_count, obj.comments_count, total
        )
    engagement_summary.short_description = 'Engagement'
    
    def location_info(self, obj):
        """Display location information"""
        if obj.latitude and obj.longitude:
            location = f"{obj.latitude:.4f}, {obj.longitude:.4f}"
            if obj.location_name:
                location += f" ({obj.location_name})"
            return location
        elif obj.location_name:
            return obj.location_name
        return '-'
    location_info.short_description = 'Location'

@admin.register(MonitoringKeyword)
class MonitoringKeywordAdmin(admin.ModelAdmin):
    """Admin for monitoring keywords"""
    
    list_display = ['keyword', 'related_hazard_type', 'language', 'priority', 'is_active', 'created_at']
    list_filter = ['related_hazard_type', 'language', 'is_active', 'priority']
    search_fields = ['keyword', 'variations']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Keyword Information', {
            'fields': ('keyword', 'related_hazard_type', 'language', 'variations')
        }),
        ('Settings', {
            'fields': ('is_active', 'priority')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )

@admin.register(SocialMediaAlert)
class SocialMediaAlertAdmin(admin.ModelAdmin):
    """Admin for social media alerts"""
    
    list_display = [
        'alert_type_badge', 'title', 'hazard_type', 'severity_score',
        'status_badge', 'created_at'
    ]
    list_filter = ['alert_type', 'hazard_type', 'is_active', 'severity_score', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    filter_horizontal = ['related_posts']
    
    fieldsets = (
        ('Alert Information', {
            'fields': ('alert_type', 'title', 'description', 'hazard_type')
        }),
        ('Location', {
            'fields': ('center_latitude', 'center_longitude', 'radius_km')
        }),
        ('Status', {
            'fields': ('severity_score', 'is_active', 'acknowledged_by', 'acknowledged_at')
        }),
        ('Related Data', {
            'fields': ('related_posts',)
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )
    
    def alert_type_badge(self, obj):
        """Display alert type with colored badge"""
        colors = {
            'spike': '#f59e0b',      # yellow
            'sentiment': '#ef4444',  # red
            'location': '#3b82f6',   # blue
            'verification': '#8b5cf6', # purple
        }
        color = colors.get(obj.alert_type, '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 6px; '
            'border-radius: 3px; font-size: 10px;">{}</span>',
            color, obj.get_alert_type_display()
        )
    alert_type_badge.short_description = 'Type'
    
    def status_badge(self, obj):
        """Display status badge"""
        if not obj.is_active:
            return format_html('<span style="color: gray;">Inactive</span>')
        elif obj.acknowledged_by:
            return format_html('<span style="color: green;">✓ Acknowledged</span>')
        else:
            return format_html('<span style="color: orange;">⏳ Pending</span>')
    status_badge.short_description = 'Status'