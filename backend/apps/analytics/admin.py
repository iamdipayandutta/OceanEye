from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import AnalyticsSnapshot, RegionalStatistics, TrendingKeyword

@admin.register(AnalyticsSnapshot)
class AnalyticsSnapshotAdmin(admin.ModelAdmin):
    """Admin for analytics snapshots"""
    
    list_display = [
        'date', 'total_reports', 'verified_reports', 'pending_reports',
        'high_severity_reports', 'active_users', 'created_at'
    ]
    list_filter = ['date', 'created_at']
    search_fields = []
    date_hierarchy = 'date'
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Date & Overview', {
            'fields': ('date', 'total_reports', 'verified_reports', 'pending_reports', 'rejected_reports')
        }),
        ('Severity Breakdown', {
            'fields': ('high_severity_reports', 'active_hotspots')
        }),
        ('User Activity', {
            'fields': ('active_users', 'new_users')
        }),
        ('Social Media', {
            'fields': ('social_media_mentions', 'trending_keywords')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).order_by('-date')

@admin.register(RegionalStatistics)
class RegionalStatisticsAdmin(admin.ModelAdmin):
    """Admin for regional statistics"""
    
    list_display = [
        'region_name', 'state', 'total_reports_month', 'critical_reports_month',
        'risk_level', 'last_updated'
    ]
    list_filter = ['state', 'risk_level', 'last_updated']
    search_fields = ['region_name', 'state']
    readonly_fields = ['last_updated']
    
    fieldsets = (
        ('Location', {
            'fields': ('region_name', 'state')
        }),
        ('Geographic Bounds', {
            'fields': ('north_lat', 'south_lat', 'east_lng', 'west_lng')
        }),
        ('Monthly Statistics', {
            'fields': ('total_reports_month', 'critical_reports_month', 'active_users_month')
        }),
        ('Risk Assessment', {
            'fields': ('risk_level',)
        }),
        ('Timestamps', {
            'fields': ('last_updated',)
        }),
    )

@admin.register(TrendingKeyword)
class TrendingKeywordAdmin(admin.ModelAdmin):
    """Admin for trending keywords"""
    
    list_display = [
        'keyword', 'mention_count', 'sentiment_score', 'related_hazard_type',
        'date', 'created_at'
    ]
    list_filter = ['sentiment_score', 'date', 'created_at', 'related_hazard_type']
    search_fields = ['keyword']
    readonly_fields = ['created_at']
    ordering = ['-mention_count']
    
    fieldsets = (
        ('Keyword Info', {
            'fields': ('keyword', 'mention_count', 'related_hazard_type')
        }),
        ('Sentiment Analysis', {
            'fields': ('sentiment_score',)
        }),
        ('Date', {
            'fields': ('date',)
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )