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
    HazardReportListSerializer,
    HotspotSerializer,
    ReportCommentSerializer
)

class HazardTypeListView(generics.ListAPIView):
    """List all available hazard types"""
    
    queryset = HazardType.objects.filter(is_active=True)
    serializer_class = HazardTypeSerializer
    permission_classes = [permissions.AllowAny]

class HazardReportListCreateView(generics.ListCreateAPIView):
    """List hazard reports and create new ones"""
    
    queryset = HazardReport.objects.all()
    serializer_class = HazardReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['hazard_type', 'severity', 'status', 'location_state', 'location_district']
    search_fields = ['description', 'location_state', 'location_district']
    ordering_fields = ['created_at', 'severity', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Filter based on user role
        if user.is_citizen:
            # Citizens see all verified reports + their own reports
            queryset = queryset.filter(
                Q(status__in=['verified', 'resolved']) | Q(reported_by=user)
            )
        elif user.is_analyst or user.is_admin_user:
            # Analysts and admins see all reports
            pass
        elif user.is_government_official:
            # Officials see verified reports
            queryset = queryset.filter(status__in=['verified', 'in_progress', 'resolved'])
        
        return queryset.select_related('hazard_type', 'reported_by').prefetch_related('media')
    
    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

class HazardReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a hazard report"""
    
    queryset = HazardReport.objects.all()
    serializer_class = HazardReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        
        if user.is_citizen:
            # Citizens can only access their own reports or verified ones
            return queryset.filter(
                Q(reported_by=user) | Q(status__in=['verified', 'resolved'])
            )
        
        return queryset
    
    def perform_update(self, serializer):
        user = self.request.user
        report = self.get_object()
        
        # Only allow certain users to update reports
        if user.is_citizen and report.reported_by != user:
            raise permissions.PermissionDenied("You can only update your own reports")
        
        serializer.save()

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def report_statistics_view(request):
    """Get statistics about hazard reports"""
    
    # Base queryset based on user permissions
    queryset = HazardReport.objects.all()
    user = request.user
    
    if user.is_citizen:
        queryset = queryset.filter(
            Q(status__in=['verified', 'resolved']) | Q(reported_by=user)
        )
    elif user.is_government_official:
        queryset = queryset.filter(status__in=['verified', 'in_progress', 'resolved'])
    
    # Calculate statistics
    total_reports = queryset.count()
    pending_reports = queryset.filter(status='pending').count()
    verified_reports = queryset.filter(status='verified').count()
    resolved_reports = queryset.filter(status='resolved').count()
    
    # Reports by severity
    severity_stats = queryset.values('severity').annotate(count=Count('id'))
    
    # Reports by hazard type
    hazard_type_stats = queryset.values('hazard_type__name').annotate(count=Count('id'))
    
    # Recent reports (last 30 days)
    recent_date = timezone.now() - timezone.timedelta(days=30)
    recent_reports = queryset.filter(created_at__gte=recent_date).count()
    
    return Response({
        'total_reports': total_reports,
        'pending_reports': pending_reports,
        'verified_reports': verified_reports,
        'resolved_reports': resolved_reports,
        'recent_reports': recent_reports,
        'severity_distribution': list(severity_stats),
        'hazard_type_distribution': list(hazard_type_stats)
    })

class HotspotListView(generics.ListAPIView):
    """List hazard hotspots"""
    
    queryset = Hotspot.objects.filter(is_active=True)
    serializer_class = HotspotSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def map_data_view(request):
    """Get map data for visualization"""
    
    user = request.user
    
    # Get reports based on user permissions
    if user.is_citizen:
        reports = HazardReport.objects.filter(
            Q(status__in=['verified', 'resolved']) | Q(reported_by=user)
        )
    elif user.is_government_official:
        reports = HazardReport.objects.filter(
            status__in=['verified', 'in_progress', 'resolved']
        )
    else:
        reports = HazardReport.objects.all()
    
    # Get hotspots
    hotspots = Hotspot.objects.filter(is_active=True)
    
    return Response({
        'reports': HazardReportListSerializer(reports, many=True).data,
        'hotspots': HotspotSerializer(hotspots, many=True).data
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_report_view(request, pk):
    """Verify a hazard report (analyst/admin only)"""
    
    user = request.user
    if not (user.is_analyst or user.is_admin_user):
        return Response(
            {'error': 'Only analysts and admins can verify reports'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        report = HazardReport.objects.get(pk=pk)
        report.status = 'verified'
        report.verified_by = user
        report.verified_at = timezone.now()
        report.save()
        
        return Response({
            'message': 'Report verified successfully',
            'report': HazardReportSerializer(report).data
        })
    except HazardReport.DoesNotExist:
        return Response(
            {'error': 'Report not found'},
            status=status.HTTP_404_NOT_FOUND
        )

class ReportCommentListCreateView(generics.ListCreateAPIView):
    """List and create comments for reports"""
    
    serializer_class = ReportCommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        report_id = self.kwargs['report_id']
        return ReportComment.objects.filter(
            report_id=report_id
        ).select_related('user').order_by('-created_at')
    
    def perform_create(self, serializer):
        report_id = self.kwargs['report_id']
        serializer.save(
            user=self.request.user,
            report_id=report_id
        )