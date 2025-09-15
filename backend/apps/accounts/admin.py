from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

User = get_user_model()

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom user admin with enhanced functionality"""
    
    list_display = [
        'username', 'email', 'get_full_name_display', 'role_badge',
        'verification_status', 'report_count', 'is_active', 'date_joined'
    ]
    list_filter = ['role', 'is_verified', 'is_active', 'date_joined', 'organization']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'organization']
    list_per_page = 25
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role & Verification', {
            'fields': ('role', 'is_verified', 'phone_number', 'organization', 'location')
        }),
        ('Preferences', {
            'fields': ('notification_preferences',),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone_number', 'organization', 'location')
        }),
    )
    
    def get_full_name_display(self, obj):
        """Display full name with fallback to username"""
        full_name = obj.get_full_name()
        return full_name if full_name.strip() else obj.username
    get_full_name_display.short_description = 'Full Name'
    
    def role_badge(self, obj):
        """Display role as colored badge"""
        colors = {
            'citizen': '#28a745',      # Green
            'analyst': '#007bff',      # Blue  
            'admin': '#dc3545',        # Red
            'official': '#6f42c1'      # Purple
        }
        color = colors.get(obj.role, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; '
            'border-radius: 3px; font-size: 11px;">{}</span>',
            color,
            obj.get_role_display()
        )
    role_badge.short_description = 'Role'
    role_badge.admin_order_field = 'role'
    
    def verification_status(self, obj):
        """Display verification status with icon"""
        if obj.is_verified:
            return format_html(
                '<span style="color: green;">✓ Verified</span>'
            )
        else:
            return format_html(
                '<span style="color: orange;">⚠ Pending</span>'
            )
    verification_status.short_description = 'Verified'
    verification_status.admin_order_field = 'is_verified'
    
    def report_count(self, obj):
        """Display number of reports by user"""
        count = obj.reports.count()
        if count > 0:
            url = reverse('admin:reports_hazardreport_changelist') + f'?reporter__id__exact={obj.id}'
            return format_html('<a href="{}">{} reports</a>', url, count)
        return '0 reports'
    report_count.short_description = 'Reports'
    
    actions = ['verify_users', 'send_notification']
    
    def verify_users(self, request, queryset):
        """Bulk verify selected users"""
        updated = queryset.update(is_verified=True)
        self.message_user(request, f'{updated} users were successfully verified.')
    verify_users.short_description = 'Verify selected users'
    
    def send_notification(self, request, queryset):
        """Send notification to selected users (placeholder)"""
        count = queryset.count()
        self.message_user(request, f'Notification queued for {count} users.')
    send_notification.short_description = 'Send notification to selected users'