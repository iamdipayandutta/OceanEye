from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count, Q
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta

# Import models for dashboard statistics
from apps.accounts.models import User
from apps.reports.models import HazardReport, HazardType, Hotspot
from apps.analytics.models import AnalyticsSnapshot
from apps.social_media.models import SocialMediaPost, MonitoringKeyword, SocialMediaAlert

class OceanEyeAdminSite(admin.AdminSite):
    """Custom admin site for OceanEye platform"""
    
    site_header = "OceanEye Admin Dashboard"
    site_title = "OceanEye Admin"
    index_title = "Ocean Hazard Management Platform"
    
    def index(self, request, extra_context=None):
        """Enhanced admin index with dashboard statistics"""
        extra_context = extra_context or {}
        
        # Calculate dashboard statistics
        now = timezone.now()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        
        # User statistics
        total_users = User.objects.count()
        new_users_this_week = User.objects.filter(date_joined__gte=week_ago).count()
        verified_users = User.objects.filter(is_verified=True).count()
        
        # Report statistics
        total_reports = HazardReport.objects.count()
        new_reports_this_week = HazardReport.objects.filter(created_at__gte=week_ago).count()
        verified_reports = HazardReport.objects.filter(status='verified').count()
        pending_reports = HazardReport.objects.filter(status='pending').count()
        critical_reports = HazardReport.objects.filter(
            severity='critical',
            created_at__gte=month_ago
        ).count()
        
        # Social media statistics (if available)
        try:
            total_social_posts = SocialMediaPost.objects.count()
            verified_social_posts = SocialMediaPost.objects.filter(is_verified_source=True).count()
            
            # Recent social media activity (last 24 hours)
            recent_social_posts = SocialMediaPost.objects.filter(
                posted_at__gte=now - timedelta(hours=24)
            ).count()
            
            # Top trending keywords/hashtags
            trending_keywords = MonitoringKeyword.objects.filter(
                is_active=True
            ).order_by('-priority')[:5]
            
            # Social media alerts
            active_social_alerts = SocialMediaAlert.objects.filter(
                is_active=True,
                created_at__gte=week_ago
            ).count()
            
        except:
            total_social_posts = 0
            verified_social_posts = 0
            recent_social_posts = 0
            trending_keywords = []
            active_social_alerts = 0
        
        # Hazard zone and hotspot statistics
        try:
            active_hotspots = Hotspot.objects.filter(is_active=True).count()
            emergency_hotspots = Hotspot.objects.filter(
                is_active=True,
                alert_level='emergency'
            ).count()
            warning_hotspots = Hotspot.objects.filter(
                is_active=True,
                alert_level='warning'
            ).count()
            
            # Geographic distribution of reports
            coastal_reports = HazardReport.objects.filter(
                latitude__range=(-90, 90),
                longitude__range=(-180, 180)
            ).count()
            
        except:
            active_hotspots = 0
            emergency_hotspots = 0
            warning_hotspots = 0
            coastal_reports = 0
        
        # Top hazard types
        top_hazard_types = HazardType.objects.annotate(
            report_count=Count('hazardreport')
        ).order_by('-report_count')[:5]
        
        # Recent activity
        recent_reports = HazardReport.objects.order_by('-created_at')[:5]
        recent_users = User.objects.order_by('-date_joined')[:5]
        
        # Create dashboard context
        dashboard_stats = {
            'user_stats': {
                'total': total_users,
                'new_this_week': new_users_this_week,
                'verified': verified_users,
                'verification_rate': (verified_users / total_users * 100) if total_users > 0 else 0
            },
            'report_stats': {
                'total': total_reports,
                'new_this_week': new_reports_this_week,
                'verified': verified_reports,
                'pending': pending_reports,
                'critical_this_month': critical_reports,
                'verification_rate': (verified_reports / total_reports * 100) if total_reports > 0 else 0
            },
            'social_stats': {
                'total_posts': total_social_posts,
                'verified_posts': verified_social_posts,
                'recent_posts_24h': recent_social_posts,
                'active_alerts': active_social_alerts,
                'verification_rate': (verified_social_posts / total_social_posts * 100) if total_social_posts > 0 else 0
            },
            'hazard_zone_stats': {
                'active_hotspots': active_hotspots,
                'emergency_hotspots': emergency_hotspots,
                'warning_hotspots': warning_hotspots,
                'coastal_reports': coastal_reports
            },
            'trending_keywords': trending_keywords,
            'top_hazard_types': top_hazard_types,
            'recent_reports': recent_reports,
            'recent_users': recent_users,
        }
        
        extra_context['dashboard_stats'] = dashboard_stats
        extra_context['dashboard_html'] = self.get_dashboard_html(dashboard_stats)
        
        return super().index(request, extra_context)
    
    def get_dashboard_html(self, stats):
        """Generate HTML for dashboard statistics with hazard zones and social media hashtag data"""
        
        # Generate recent reports HTML
        recent_reports_html = ""
        for report in stats['recent_reports']:
            status_color = {
                'pending': '#ffc107',
                'verified': '#28a745', 
                'rejected': '#dc3545',
                'investigating': '#17a2b8'
            }.get(report.status, '#6c757d')
            
            recent_reports_html += f"""
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                <div>
                    <strong>{report.title[:30]}...</strong><br>
                    <small style="color: #6c757d;">📍 {report.location_description[:40]}</small>
                </div>
                <span style="background: {status_color}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">
                    {report.status.title()}
                </span>
            </div>
            """
        
        # Generate top hazard types HTML
        hazard_types_html = ""
        for hazard in stats['top_hazard_types']:
            hazard_types_html += f"""
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f1f3f4;">
                <div style="display: flex; align-items: center;">
                    <span style="width: 12px; height: 12px; background: {hazard.color}; border-radius: 50%; margin-right: 8px;"></span>
                    <span>{hazard.name}</span>
                </div>
                <span style="background: #f8f9fa; color: #495057; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                    {hazard.report_count}
                </span>
            </div>
            """
        
        # Generate trending hashtags/keywords HTML
        trending_hashtags_html = ""
        for keyword in stats['trending_keywords']:
            priority_color = {
                1: '#6c757d',
                2: '#17a2b8', 
                3: '#ffc107',
                4: '#fd7e14',
                5: '#dc3545'
            }.get(keyword.priority, '#6c757d')
            
            trending_hashtags_html += f"""
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0;">
                <div>
                    <span style="font-weight: 600; color: #1da1f2;">#{keyword.keyword}</span>
                    <small style="color: #6c757d; margin-left: 8px;">{keyword.language.upper()}</small>
                </div>
                <span style="background: {priority_color}; color: white; padding: 2px 6px; border-radius: 8px; font-size: 9px;">
                    P{keyword.priority}
                </span>
            </div>
            """

        html = f"""
        <style>
            .dashboard-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }}
            .dashboard-card {{
                background: white;
                border: 1px solid #e9ecef;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                transition: transform 0.2s ease;
            }}
            .dashboard-card:hover {{
                transform: translateY(-2px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            }}
            .card-header {{
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #e9ecef;
            }}
            .card-icon {{
                font-size: 24px;
                margin-right: 10px;
            }}
            .stat-row {{
                display: flex;
                justify-content: space-between;
                margin: 12px 0;
                padding: 8px 0;
            }}
            .stat-value {{
                font-weight: bold;
                font-size: 16px;
                color: #2c3e50;
            }}
            .progress-bar {{
                width: 100%;
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
                margin: 5px 0;
            }}
            .progress-fill {{
                height: 100%;
                background: linear-gradient(90deg, #28a745, #20c997);
                transition: width 0.3s ease;
            }}
            .action-button {{
                display: inline-block;
                background: #007bff;
                color: white;
                padding: 8px 12px;
                text-decoration: none;
                border-radius: 6px;
                margin: 4px;
                font-size: 12px;
                transition: background 0.2s ease;
            }}
            .action-button:hover {{
                background: #0056b3;
                color: white;
            }}
            .hazard-zone-indicator {{
                width: 16px;
                height: 16px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 8px;
            }}
        </style>
        
        <div class="dashboard-grid">
            <!-- User Statistics Card -->
            <div class="dashboard-card">
                <div class="card-header">
                    <span class="card-icon">👥</span>
                    <h3 style="margin: 0; color: #495057;">User Analytics</h3>
                </div>
                <div class="stat-row">
                    <span>Total Users:</span>
                    <span class="stat-value">{stats['user_stats']['total']}</span>
                </div>
                <div class="stat-row">
                    <span>New This Week:</span>
                    <span class="stat-value" style="color: #28a745;">+{stats['user_stats']['new_this_week']}</span>
                </div>
                <div class="stat-row">
                    <span>Verified Users:</span>
                    <span class="stat-value">{stats['user_stats']['verified']}</span>
                </div>
                <div style="margin-top: 15px;">
                    <small>Verification Rate</small>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: {stats['user_stats']['verification_rate']:.1f}%;"></div>
                    </div>
                    <small><strong>{stats['user_stats']['verification_rate']:.1f}%</strong></small>
                </div>
            </div>

            <!-- Report Statistics Card -->
            <div class="dashboard-card">
                <div class="card-header">
                    <span class="card-icon">📊</span>
                    <h3 style="margin: 0; color: #495057;">Report Analytics</h3>
                </div>
                <div class="stat-row">
                    <span>Total Reports:</span>
                    <span class="stat-value">{stats['report_stats']['total']}</span>
                </div>
                <div class="stat-row">
                    <span>New This Week:</span>
                    <span class="stat-value" style="color: #28a745;">+{stats['report_stats']['new_this_week']}</span>
                </div>
                <div class="stat-row">
                    <span>Pending Review:</span>
                    <span class="stat-value" style="color: #ffc107;">{stats['report_stats']['pending']}</span>
                </div>
                <div class="stat-row">
                    <span>Critical This Month:</span>
                    <span class="stat-value" style="color: #dc3545;">{stats['report_stats']['critical_this_month']}</span>
                </div>
                <div style="margin-top: 15px;">
                    <small>Verification Rate</small>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: {stats['report_stats']['verification_rate']:.1f}%;"></div>
                    </div>
                    <small><strong>{stats['report_stats']['verification_rate']:.1f}%</strong></small>
                </div>
            </div>

            <!-- Hazard Zones Card -->
            <div class="dashboard-card">
                <div class="card-header">
                    <span class="card-icon">🗺️</span>
                    <h3 style="margin: 0; color: #495057;">Hazard Zones & Hotspots</h3>
                </div>
                <div class="stat-row">
                    <span>Active Hotspots:</span>
                    <span class="stat-value">{stats['hazard_zone_stats']['active_hotspots']}</span>
                </div>
                <div class="stat-row">
                    <span>
                        <span class="hazard-zone-indicator" style="background: #dc3545;"></span>
                        Emergency Zones:
                    </span>
                    <span class="stat-value" style="color: #dc3545;">{stats['hazard_zone_stats']['emergency_hotspots']}</span>
                </div>
                <div class="stat-row">
                    <span>
                        <span class="hazard-zone-indicator" style="background: #ffc107;"></span>
                        Warning Zones:
                    </span>
                    <span class="stat-value" style="color: #ffc107;">{stats['hazard_zone_stats']['warning_hotspots']}</span>
                </div>
                <div class="stat-row">
                    <span>Coastal Reports:</span>
                    <span class="stat-value">{stats['hazard_zone_stats']['coastal_reports']}</span>
                </div>
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #dee2e6;">
                    <a href="/admin/reports/hotspot/" class="action-button" style="background: #17a2b8;">
                        🗺️ Manage Hazard Zones
                    </a>
                </div>
            </div>

            <!-- Social Media & Hashtag Analytics Card -->
            <div class="dashboard-card">
                <div class="card-header">
                    <span class="card-icon">📱</span>
                    <h3 style="margin: 0; color: #495057;">Social Media Analytics</h3>
                </div>
                <div class="stat-row">
                    <span>Total Posts:</span>
                    <span class="stat-value">{stats['social_stats']['total_posts']}</span>
                </div>
                <div class="stat-row">
                    <span>Last 24h:</span>
                    <span class="stat-value" style="color: #17a2b8;">+{stats['social_stats']['recent_posts_24h']}</span>
                </div>
                <div class="stat-row">
                    <span>Active Alerts:</span>
                    <span class="stat-value" style="color: #dc3545;">{stats['social_stats']['active_alerts']}</span>
                </div>
                <div class="stat-row">
                    <span>Verified Sources:</span>
                    <span class="stat-value">{stats['social_stats']['verified_posts']}</span>
                </div>
                <div style="margin-top: 15px;">
                    <small>Source Verification Rate</small>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: {stats['social_stats']['verification_rate']:.1f}%;"></div>
                    </div>
                    <small><strong>{stats['social_stats']['verification_rate']:.1f}%</strong></small>
                </div>
            </div>

            <!-- Trending Hashtags & Keywords Card -->
            <div class="dashboard-card">
                <div class="card-header">
                    <span class="card-icon">#️⃣</span>
                    <h3 style="margin: 0; color: #495057;">Trending Hashtags</h3>
                </div>
                <div style="max-height: 200px; overflow-y: auto;">
                    {trending_hashtags_html if trending_hashtags_html else '<p style="text-align: center; color: #6c757d; margin: 20px 0;">No trending hashtags available</p>'}
                </div>
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #dee2e6;">
                    <a href="/admin/social_media/monitoringkeyword/" class="action-button" style="background: #1da1f2;">
                        #️⃣ Manage Keywords
                    </a>
                    <a href="/admin/social_media/socialmediapost/" class="action-button" style="background: #28a745;">
                        📊 View Posts
                    </a>
                </div>
            </div>

            <!-- Top Hazard Types Card -->
            <div class="dashboard-card">
                <div class="card-header">
                    <span class="card-icon">⚠️</span>
                    <h3 style="margin: 0; color: #495057;">Top Hazard Types</h3>
                </div>
                <div style="max-height: 200px; overflow-y: auto;">
                    {hazard_types_html if hazard_types_html else '<p style="text-align: center; color: #6c757d; margin: 20px 0;">No hazard data available</p>'}
                </div>
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #dee2e6;">
                    <a href="/admin/reports/hazardtype/" class="action-button" style="background: #fd7e14;">
                        ⚠️ Manage Hazard Types
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Recent Activity Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
            <div class="dashboard-card">
                <div class="card-header">
                    <span class="card-icon">📈</span>
                    <h3 style="margin: 0; color: #495057;">Recent Reports</h3>
                </div>
                <div style="max-height: 250px; overflow-y: auto;">
                    {recent_reports_html if recent_reports_html else '<p style="text-align: center; color: #6c757d; margin: 20px 0;">No recent reports</p>'}
                </div>
            </div>
            
            <div class="dashboard-card">
                <div class="card-header">
                    <span class="card-icon">📍</span>
                    <h3 style="margin: 0; color: #495057;">Live Hazard Map</h3>
                </div>
                <div style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 30px; text-align: center; color: #6c757d;">
                    <p><strong>🗺️ Interactive Map Integration</strong></p>
                    <p>Real-time hazard visualization<br>
                    📍 Hotspot clustering<br>
                    🌊 Ocean hazard zones<br>
                    📱 Social media geo-tagged posts</p>
                    <a href="/admin/reports/hazardreport/" class="action-button" style="background: #17a2b8;">
                        View All Reports
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Quick Actions Panel -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; margin: 20px 0; color: white;">
            <h3 style="margin-top: 0; color: white;">🚀 Quick Actions</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="/admin/reports/hazardreport/?status__exact=pending" class="action-button" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);">
                    📋 Review Pending ({stats['report_stats']['pending']})
                </a>
                <a href="/admin/reports/hotspot/?alert_level__exact=emergency" class="action-button" style="background: rgba(220,53,69,0.8); border: 1px solid #dc3545;">
                    🚨 Emergency Zones ({stats['hazard_zone_stats']['emergency_hotspots']})
                </a>
                <a href="/admin/social_media/socialmediaalert/?is_active__exact=1" class="action-button" style="background: rgba(255,193,7,0.8); border: 1px solid #ffc107;">
                    📱 Social Alerts ({stats['social_stats']['active_alerts']})
                </a>
                <a href="/admin/accounts/user/?is_verified__exact=0" class="action-button" style="background: rgba(23,162,184,0.8); border: 1px solid #17a2b8;">
                    ✅ Verify Users
                </a>
            </div>
        </div>
        """
        
        return format_html(html)

# Create custom admin site instance
admin_site = OceanEyeAdminSite(name='oceaneye_admin')

# Register all apps with the custom admin site
from apps.accounts.admin import *
from apps.reports.admin import *
from apps.analytics.admin import *
from apps.social_media.admin import *

# Re-register models with custom admin site
admin_site.register(User, UserAdmin)
admin_site.register(HazardReport, HazardReportAdmin)
admin_site.register(HazardType, HazardTypeAdmin)
admin_site.register(ReportMedia, ReportMediaAdmin)
admin_site.register(ReportComment, ReportCommentAdmin)

# Register analytics models
try:
    admin_site.register(AnalyticsSnapshot, AnalyticsSnapshotAdmin)
    admin_site.register(RegionalStatistics, RegionalStatisticsAdmin)
    admin_site.register(TrendingKeyword, TrendingKeywordAdmin)
except:
    pass  # Models might not exist yet

# Register social media models
try:
    admin_site.register(SocialMediaPlatform, SocialMediaPlatformAdmin)
    admin_site.register(SocialMediaPost, SocialMediaPostAdmin)
    admin_site.register(MonitoringKeyword, MonitoringKeywordAdmin)
    admin_site.register(SocialMediaAlert, SocialMediaAlertAdmin)
except:
    pass  # Models might not exist yet

# Register hotspot model
try:
    admin_site.register(Hotspot)
except:
    pass  # Model might not exist yet