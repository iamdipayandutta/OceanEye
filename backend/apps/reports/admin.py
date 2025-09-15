from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.urls import reverse
from .models import HazardType, HazardReport, ReportMedia, ReportComment, Hotspot

class ReportMediaInline(admin.TabularInline):
    """Inline admin for report media"""
    model = ReportMedia
    extra = 0
    readonly_fields = ['file_size', 'uploaded_at', 'media_preview']
    fields = ['media_type', 'file', 'filename', 'file_size', 'media_preview', 'uploaded_at']
    
    def media_preview(self, obj):
        """Show media preview in admin"""
        if obj.file:
            if obj.media_type in ['image', 'photo']:
                return format_html(
                    '<img src="{}" style="max-width: 100px; max-height: 100px;">', 
                    obj.file.url
                )
            else:
                return format_html('<a href="{}" target="_blank">View File</a>', obj.file.url)
        return 'No file'
    media_preview.short_description = 'Preview'

class ReportCommentInline(admin.TabularInline):
    """Inline admin for report comments"""
    model = ReportComment
    extra = 0
    fields = ['author', 'content', 'is_internal', 'created_at']
    readonly_fields = ['created_at']

@admin.register(HazardType)
class HazardTypeAdmin(admin.ModelAdmin):
    """Enhanced admin for hazard types"""
    
    list_display = ['name', 'code', 'color_badge', 'report_count', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'code', 'description']
    ordering = ['name']
    list_editable = ['is_active']
    
    def color_badge(self, obj):
        """Display color as badge"""
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            obj.color,
            obj.color
        )
    color_badge.short_description = 'Color'
    
    def report_count(self, obj):
        """Display number of reports for this hazard type"""
        count = obj.reports.count()
        if count > 0:
            url = reverse('admin:reports_hazardreport_changelist') + f'?hazard_type__id__exact={obj.id}'
            return format_html('<a href="{}">{} reports</a>', url, count)
        return '0 reports'
    report_count.short_description = 'Reports'

@admin.register(HazardReport)
class HazardReportAdmin(admin.ModelAdmin):
    """Enhanced admin for hazard reports"""
    
    list_display = [
        'title', 'hazard_type_badge', 'severity_badge', 'status_badge', 
        'reporter_link', 'location_display', 'media_count', 'created_at'
    ]
    list_filter = [
        'hazard_type', 'severity', 'status', 'incident_datetime', 'created_at'
    ]
    search_fields = [
        'title', 'description', 'location_description', 'reporter__username'
    ]
    readonly_fields = ['id', 'coordinates', 'created_at', 'updated_at', 'map_link']
    inlines = [ReportMediaInline, ReportCommentInline]
    list_per_page = 20
    date_hierarchy = 'incident_datetime'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'hazard_type', 'title', 'description', 'severity')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude', 'coordinates', 'location_description', 'map_link')
        }),
        ('Reporter Information', {
            'fields': ('reporter', 'is_anonymous', 'incident_datetime')
        }),
        ('Verification', {
            'fields': ('status', 'verified_by', 'verified_at', 'verification_notes')
        }),
        ('Additional Data', {
            'fields': ('confidence_score', 'weather_conditions', 'social_media_mentions'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def hazard_type_badge(self, obj):
        """Display hazard type as colored badge"""
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 6px; '
            'border-radius: 3px; font-size: 10px;">{}</span>',
            obj.hazard_type.color,
            obj.hazard_type.name
        )
    hazard_type_badge.short_description = 'Type'
    hazard_type_badge.admin_order_field = 'hazard_type'
    
    def severity_badge(self, obj):
        """Display severity with color coding"""
        colors = {
            'low': '#28a745',      # Green
            'medium': '#ffc107',   # Yellow
            'high': '#fd7e14',     # Orange
            'critical': '#dc3545'  # Red
        }
        color = colors.get(obj.severity, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 6px; '
            'border-radius: 3px; font-size: 10px;">{}</span>',
            color,
            obj.get_severity_display()
        )
    severity_badge.short_description = 'Severity'
    severity_badge.admin_order_field = 'severity'
    
    def status_badge(self, obj):
        """Display status with color coding"""
        colors = {
            'pending': '#6c757d',      # Gray
            'verified': '#28a745',     # Green
            'rejected': '#dc3545',     # Red
            'investigating': '#007bff' # Blue
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 6px; '
            'border-radius: 3px; font-size: 10px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'status'
    
    def reporter_link(self, obj):
        """Link to reporter user"""
        url = reverse('admin:accounts_user_change', args=[obj.reporter.id])
        return format_html('<a href="{}">{}</a>', url, obj.reporter.username)
    reporter_link.short_description = 'Reporter'
    reporter_link.admin_order_field = 'reporter__username'
    
    def location_display(self, obj):
        """Display location with coordinates"""
        return f"{obj.location_description}"
    location_display.short_description = 'Location'
    
    def media_count(self, obj):
        """Display media count"""
        count = obj.media.count()
        return f"{count} files" if count > 0 else "No media"
    media_count.short_description = 'Media'
    
    def map_link(self, obj):
        """Google Maps link for coordinates"""
        if obj.latitude and obj.longitude:
            url = f"https://www.google.com/maps?q={obj.latitude},{obj.longitude}"
            return format_html('<a href="{}" target="_blank">View on Map</a>', url)
        return 'No coordinates'
    map_link.short_description = 'Map Link'
    
    actions = ['verify_reports', 'mark_investigating']
    
    def verify_reports(self, request, queryset):
        """Bulk verify selected reports"""
        updated = queryset.update(status='verified', verified_by=request.user)
        self.message_user(request, f'{updated} reports were verified.')
    verify_reports.short_description = 'Verify selected reports'
    
    def mark_investigating(self, request, queryset):
        """Mark reports as under investigation"""
        updated = queryset.update(status='investigating')
        self.message_user(request, f'{updated} reports marked as investigating.')
    mark_investigating.short_description = 'Mark as investigating'

@admin.register(ReportMedia)
class ReportMediaAdmin(admin.ModelAdmin):
    """Admin for report media"""
    
    list_display = ['filename', 'report', 'media_type', 'file_size', 'uploaded_at']
    list_filter = ['media_type', 'uploaded_at']
    search_fields = ['filename', 'report__title']

@admin.register(ReportComment)
class ReportCommentAdmin(admin.ModelAdmin):
    """Admin for report comments"""
    
    list_display = ['report', 'author', 'is_internal', 'created_at']
    list_filter = ['is_internal', 'created_at']
    search_fields = ['content', 'report__title', 'author__username']

@admin.register(Hotspot)
class HotspotAdmin(admin.ModelAdmin):
    """Admin for hotspots"""
    
    list_display = [
        'name', 'alert_level', 'dominant_hazard_type', 'report_count',
        'confidence_score', 'is_active', 'detected_at'
    ]
    list_filter = ['alert_level', 'dominant_hazard_type', 'is_active', 'detected_at']
    search_fields = ['name', 'description']
    readonly_fields = ['detected_at', 'last_updated']