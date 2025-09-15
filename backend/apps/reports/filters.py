import django_filters
from django.db.models import Q
from .models import HazardReport, HazardType

class HazardReportFilter(django_filters.FilterSet):
    """Filter for hazard reports"""
    
    hazard_type = django_filters.ModelChoiceFilter(
        queryset=HazardType.objects.filter(is_active=True)
    )
    
    severity = django_filters.ChoiceFilter(
        choices=HazardReport.Severity.choices
    )
    
    status = django_filters.ChoiceFilter(
        choices=HazardReport.Status.choices
    )
    
    # Date filters
    date_from = django_filters.DateTimeFilter(
        field_name='incident_datetime',
        lookup_expr='gte'
    )
    
    date_to = django_filters.DateTimeFilter(
        field_name='incident_datetime',
        lookup_expr='lte'
    )
    
    # Location filters
    bbox = django_filters.CharFilter(method='filter_bbox')
    
    # Search in multiple fields
    search = django_filters.CharFilter(method='filter_search')
    
    class Meta:
        model = HazardReport
        fields = ['hazard_type', 'severity', 'status', 'date_from', 'date_to']
    
    def filter_bbox(self, queryset, name, value):
        """Filter by bounding box: west,south,east,north"""
        try:
            west, south, east, north = map(float, value.split(','))
            return queryset.filter(
                longitude__gte=west,
                longitude__lte=east,
                latitude__gte=south,
                latitude__lte=north
            )
        except (ValueError, TypeError):
            return queryset
    
    def filter_search(self, queryset, name, value):
        """Search in title, description, and location"""
        if value:
            return queryset.filter(
                Q(title__icontains=value) |
                Q(description__icontains=value) |
                Q(location_description__icontains=value)
            )
        return queryset