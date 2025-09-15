from django.urls import path
from .views import (
    HazardTypeListView,
    HazardReportListCreateView,
    HazardReportDetailView,
    HotspotListView,
    verify_report_view,
    map_data_view,
    report_statistics_view,
)

urlpatterns = [
    # Hazard types
    path('hazard-types/', HazardTypeListView.as_view(), name='hazard-type-list'),
    
    # Reports
    path('', HazardReportListCreateView.as_view(), name='report-list-create'),
    path('<uuid:pk>/', HazardReportDetailView.as_view(), name='report-detail'),
    path('<uuid:pk>/verify/', verify_report_view, name='report-verify'),
    
    # Hotspots
    path('hotspots/', HotspotListView.as_view(), name='hotspot-list'),
    
    # Map and dashboard data
    path('map-data/', map_data_view, name='map-data'),
    path('dashboard-stats/', report_statistics_view, name='dashboard-stats'),
]