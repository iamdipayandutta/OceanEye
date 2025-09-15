from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import HazardType, HazardReport, ReportMedia, ReportComment, Hotspot

User = get_user_model()

class HazardTypeSerializer(serializers.ModelSerializer):
    """Serializer for hazard types"""
    
    class Meta:
        model = HazardType
        fields = ['id', 'name', 'code', 'description', 'icon', 'color', 'is_active']

class ReportMediaSerializer(serializers.ModelSerializer):
    """Serializer for report media files"""
    
    class Meta:
        model = ReportMedia
        fields = [
            'id', 'media_type', 'file', 'filename', 'file_size',
            'width', 'height', 'duration', 'uploaded_at'
        ]
        read_only_fields = ['id', 'file_size', 'uploaded_at']

class ReportCommentSerializer(serializers.ModelSerializer):
    """Serializer for report comments"""
    
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_role = serializers.CharField(source='author.get_role_display', read_only=True)
    
    class Meta:
        model = ReportComment
        fields = [
            'id', 'content', 'is_internal', 'author_name', 'author_role',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author_name', 'author_role', 'created_at', 'updated_at']

class HazardReportSerializer(serializers.ModelSerializer):
    """Serializer for hazard reports"""
    
    hazard_type_name = serializers.CharField(source='hazard_type.name', read_only=True)
    reporter_name = serializers.CharField(source='reporter.get_full_name', read_only=True)
    verified_by_name = serializers.CharField(source='verified_by.get_full_name', read_only=True)
    media_files = ReportMediaSerializer(many=True, read_only=True)
    comments = ReportCommentSerializer(many=True, read_only=True)
    coordinates = serializers.ReadOnlyField()
    
    class Meta:
        model = HazardReport
        fields = [
            'id', 'hazard_type', 'hazard_type_name', 'latitude', 'longitude',
            'coordinates', 'location_description', 'title', 'description',
            'severity', 'status', 'is_anonymous', 'confidence_score',
            'weather_conditions', 'social_media_mentions', 'incident_datetime',
            'reporter_name', 'verified_by_name', 'verified_at', 'verification_notes',
            'media_files', 'comments', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'hazard_type_name', 'reporter_name', 'verified_by_name',
            'coordinates', 'media_files', 'comments', 'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        validated_data['reporter'] = self.context['request'].user
        return super().create(validated_data)

class HazardReportCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating reports"""
    
    media_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = HazardReport
        fields = [
            'hazard_type', 'latitude', 'longitude', 'location_description',
            'title', 'description', 'severity', 'is_anonymous',
            'weather_conditions', 'incident_datetime', 'media_files'
        ]
    
    def create(self, validated_data):
        media_files = validated_data.pop('media_files', [])
        validated_data['reporter'] = self.context['request'].user
        
        report = super().create(validated_data)
        
        # Handle media file uploads
        for file in media_files:
            media_type = 'image' if file.content_type.startswith('image/') else 'video'
            ReportMedia.objects.create(
                report=report,
                media_type=media_type,
                file=file,
                filename=file.name,
                file_size=file.size
            )
        
        return report

class HazardReportListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for report lists"""
    
    hazard_type_name = serializers.CharField(source='hazard_type.name', read_only=True)
    hazard_type_color = serializers.CharField(source='hazard_type.color', read_only=True)
    reporter_name = serializers.CharField(source='reporter.get_full_name', read_only=True)
    media_count = serializers.IntegerField(source='media_files.count', read_only=True)
    comment_count = serializers.IntegerField(source='comments.count', read_only=True)
    coordinates = serializers.ReadOnlyField()
    
    class Meta:
        model = HazardReport
        fields = [
            'id', 'hazard_type_name', 'hazard_type_color', 'latitude', 'longitude',
            'coordinates', 'location_description', 'title', 'severity', 'status',
            'confidence_score', 'incident_datetime', 'reporter_name',
            'media_count', 'comment_count', 'created_at'
        ]

class HotspotSerializer(serializers.ModelSerializer):
    """Serializer for hotspots"""
    
    dominant_hazard_name = serializers.CharField(
        source='dominant_hazard_type.name',
        read_only=True
    )
    recent_reports = HazardReportListSerializer(
        source='reports.all',
        many=True,
        read_only=True
    )
    
    class Meta:
        model = Hotspot
        fields = [
            'id', 'center_latitude', 'center_longitude', 'radius_km',
            'name', 'description', 'alert_level', 'confidence_score',
            'report_count', 'dominant_hazard_name', 'is_active',
            'detected_at', 'last_updated', 'recent_reports'
        ]

class ReportVerificationSerializer(serializers.ModelSerializer):
    """Serializer for report verification by analysts"""
    
    class Meta:
        model = HazardReport
        fields = ['status', 'verification_notes']
    
    def update(self, instance, validated_data):
        validated_data['verified_by'] = self.context['request'].user
        validated_data['verified_at'] = timezone.now()
        return super().update(instance, validated_data)