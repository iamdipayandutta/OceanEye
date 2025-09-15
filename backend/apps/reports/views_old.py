from rest_framework import generics, filters, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.utils import timezone

from .models import HazardType, HazardReport, Hotspot, ReportComment
from .serializers import (
    HazardTypeSerializer,
    HazardReportSerializer,
    HazardReportCreateSerializer,
    HazardReportListSerializer,
    HotspotSerializer,
    ReportCommentSerializer,
    ReportVerificationSerializer
)
from .filters import HazardReportFilter

class HazardTypeListView(generics.ListAPIView):
    """List all active hazard types"""
    
    queryset = HazardType.objects.filter(is_active=True)
    serializer_class = HazardTypeSerializer
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        summary="List hazard types",
        description="Get all active hazard types for reporting",
        tags=["Hazard Types"]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class HazardReportListCreateView(generics.ListCreateAPIView):
    """List and create hazard reports"""
    
    queryset = HazardReport.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = HazardReportFilter
    search_fields = ['title', 'description', 'location_description']
    ordering_fields = ['created_at', 'incident_datetime', 'severity', 'status']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return HazardReportCreateSerializer
        elif self.request.query_params.get('detail') == 'true':
            return HazardReportSerializer
        return HazardReportListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Filter based on user role
        if user.is_citizen:
            # Citizens see verified reports + their own reports
            queryset = queryset.filter(
                Q(status='verified') | Q(reporter=user)
            )
        elif user.is_analyst or user.is_official or user.is_admin_user:
            # Analysts and officials see all reports
            pass
        
        # Filter anonymous reports for privacy
        if not (user.is_analyst or user.is_official or user.is_admin_user):
            queryset = queryset.exclude(
                Q(is_anonymous=True) & ~Q(reporter=user)
            )
        
        return queryset.select_related('hazard_type', 'reporter', 'verified_by')
    
    @extend_schema(
        summary="List hazard reports",
        description="Get paginated list of hazard reports with filtering",
        tags=["Reports"],
        parameters=[
            OpenApiParameter('detail', bool, description='Include full details'),
            OpenApiParameter('hazard_type', int, description='Filter by hazard type ID'),
            OpenApiParameter('status', str, description='Filter by status'),
            OpenApiParameter('severity', str, description='Filter by severity'),
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        summary="Create hazard report",
        description="Submit a new hazard report with optional media files",
        tags=["Reports"]
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class HazardReportDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve and update specific hazard report"""
    
    queryset = HazardReport.objects.all()
    serializer_class = HazardReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Apply same filtering as list view
        if user.is_citizen:
            queryset = queryset.filter(
                Q(status='verified') | Q(reporter=user)
            )
        
        return queryset.select_related('hazard_type', 'reporter', 'verified_by')
    
    @extend_schema(
        summary="Get hazard report details",
        description="Retrieve detailed information about a specific report",
        tags=["Reports"]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(
        summary="Update hazard report",
        description="Update report (only by reporter or analysts)",
        tags=["Reports"]
    )
    def patch(self, request, *args, **kwargs):
        report = self.get_object()
        user = request.user
        
        # Only reporter or analysts can update
        if not (report.reporter == user or user.is_analyst or user.is_official):
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().patch(request, *args, **kwargs)

@extend_schema(
    summary="Verify hazard report",
    description="Verify or reject a report (analysts only)",
    tags=["Reports"]
)
@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def verify_report(request, pk):
    """Verify or reject a hazard report"""
    
    try:
        report = HazardReport.objects.get(pk=pk)
    except HazardReport.DoesNotExist:
        return Response({'error': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Only analysts and officials can verify
    if not (request.user.is_analyst or request.user.is_official):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = ReportVerificationSerializer(
        report,
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HotspotListView(generics.ListAPIView):
    """List active hazard hotspots"""
    
    queryset = Hotspot.objects.filter(is_active=True)
    serializer_class = HotspotSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['alert_level', 'dominant_hazard_type']
    ordering_fields = ['detected_at', 'confidence_score', 'report_count']
    ordering = ['-confidence_score']
    
    @extend_schema(
        summary="List active hotspots",
        description="Get current active hazard hotspots with clustering analysis",
        tags=["Hotspots"]
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

@extend_schema(
    summary="Get map data",
    description="Get all verified reports for map display",
    tags=["Maps"]
)
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def map_data(request):
    """Get reports data for map display"""
    
    # Get verified reports for public map
    reports = HazardReport.objects.filter(
        status='verified',
        is_anonymous=False
    ).select_related('hazard_type').values(
        'id', 'latitude', 'longitude', 'title', 'severity',
        'hazard_type__name', 'hazard_type__color', 'incident_datetime'
    )
    
    # Get active hotspots
    hotspots = Hotspot.objects.filter(is_active=True).values(
        'id', 'center_latitude', 'center_longitude', 'radius_km',
        'name', 'alert_level', 'confidence_score'
    )
    
    return Response({
        'reports': list(reports),
        'hotspots': list(hotspots)
    })

@extend_schema(
    summary="Get dashboard statistics",
    description="Get summary statistics for dashboard",
    tags=["Analytics"]
)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    
    user = request.user
    
    # Base statistics
    stats = {
        'total_reports': HazardReport.objects.count(),
        'verified_reports': HazardReport.objects.filter(status='verified').count(),
        'pending_reports': HazardReport.objects.filter(status='pending').count(),
        'active_hotspots': Hotspot.objects.filter(is_active=True).count(),
    }
    
    # User-specific statistics
    if user.is_citizen:
        stats.update({
            'my_reports': HazardReport.objects.filter(reporter=user).count(),
            'my_verified_reports': HazardReport.objects.filter(
                reporter=user, status='verified'
            ).count(),
        })
    
    # Recent activity
    recent_reports = HazardReport.objects.filter(
        created_at__gte=timezone.now() - timezone.timedelta(days=7)
    ).count()
    
    stats['recent_reports'] = recent_reports
    
    return Response(stats)