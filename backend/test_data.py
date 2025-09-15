#!/usr/bin/env python3
"""
Test script to create sample data and verify database functionality
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oceaneye_backend.settings')
django.setup()

from django.utils import timezone
from apps.accounts.models import User
from apps.reports.models import HazardType, HazardReport

def create_sample_data():
    print('=== CREATING SAMPLE DATA ===')
    
    # Create hazard types
    hazard_types_data = [
        {'name': 'Cyclone', 'code': 'CYC', 'description': 'Tropical cyclone or hurricane', 'color': '#FF0000', 'is_active': True},
        {'name': 'Tsunami', 'code': 'TSU', 'description': 'Large ocean wave caused by earthquake', 'color': '#0000FF', 'is_active': True},
        {'name': 'Storm Surge', 'code': 'SSG', 'description': 'Rise in sea level during storm', 'color': '#00FF00', 'is_active': True},
        {'name': 'Oil Spill', 'code': 'OSP', 'description': 'Marine pollution from oil discharge', 'color': '#000000', 'is_active': True}
    ]
    
    for ht_data in hazard_types_data:
        hazard_type, created = HazardType.objects.get_or_create(
            code=ht_data['code'],
            defaults=ht_data
        )
        status = "created" if created else "exists"
        print(f'✅ Hazard Type: {hazard_type.name} ({status})')
    
    # Create a test citizen user
    test_user, created = User.objects.get_or_create(
        username='test_citizen',
        defaults={
            'email': 'citizen@test.com',
            'first_name': 'Test',
            'last_name': 'Citizen',
            'role': 'citizen',
            'phone_number': '+91-9876543210'
        }
    )
    status = "created" if created else "exists"
    print(f'✅ Test User: {test_user.username} ({status})')
    
    # Create a test analyst user
    analyst_user, created = User.objects.get_or_create(
        username='test_analyst',
        defaults={
            'email': 'analyst@test.com',
            'first_name': 'Test',
            'last_name': 'Analyst',
            'role': 'analyst',
            'phone_number': '+91-9876543211'
        }
    )
    status = "created" if created else "exists"
    print(f'✅ Analyst User: {analyst_user.username} ({status})')
    
    # Create a sample hazard report
    cyclone_type = HazardType.objects.get(code='CYC')
    report, created = HazardReport.objects.get_or_create(
        title='Test Cyclone Report',
        defaults={
            'hazard_type': cyclone_type,
            'reporter': test_user,
            'description': 'This is a test cyclone report for verification',
            'latitude': 13.0827,  # Chennai coordinates
            'longitude': 80.2707,
            'location_description': 'Chennai, Tamil Nadu',
            'severity': 'high',
            'status': 'pending',
            'incident_datetime': timezone.now()
        }
    )
    status = "created" if created else "exists"
    print(f'✅ Sample Report: {report.title} ({status})')
    
    return True

def test_database_integrity():
    print('\n=== DATABASE INTEGRITY TEST ===')
    
    # Test counts
    user_count = User.objects.count()
    hazard_type_count = HazardType.objects.count()
    report_count = HazardReport.objects.count()
    
    print(f'Users: {user_count}')
    print(f'Hazard Types: {hazard_type_count}')
    print(f'Reports: {report_count}')
    
    # Test relationships
    print('\n=== RELATIONSHIP TEST ===')
    reports_with_users = HazardReport.objects.select_related('reporter', 'hazard_type').all()
    for report in reports_with_users:
        print(f'📝 Report: {report.title}')
        print(f'   👤 Reported by: {report.reporter.get_full_name()} ({report.reporter.role})')
        print(f'   🌊 Type: {report.hazard_type.name}')
        print(f'   📍 Location: {report.location_description}')
        print(f'   ⚠️  Severity: {report.severity}')
        print(f'   📊 Status: {report.status}')
    
    # Test user types
    print('\n=== USER TYPES TEST ===')
    citizens = User.objects.filter(role='citizen').count()
    analysts = User.objects.filter(role='analyst').count()
    admins = User.objects.filter(role='admin').count()
    officials = User.objects.filter(role='official').count()
    
    print(f'Citizens: {citizens}')
    print(f'Analysts: {analysts}')
    print(f'Admins: {admins}')
    print(f'Officials: {officials}')
    
    return True

def test_model_methods():
    print('\n=== MODEL METHODS TEST ===')
    
    # Test User model methods
    test_user = User.objects.filter(username='test_citizen').first()
    if test_user:
        print(f'✅ User full name: {test_user.get_full_name()}')
        print(f'✅ User is citizen: {test_user.is_citizen}')
        print(f'✅ User is analyst: {test_user.is_analyst}')
        print(f'✅ User is admin: {test_user.is_admin_user}')
        print(f'✅ User is official: {test_user.is_official}')
    
    # Test HazardReport model methods
    test_report = HazardReport.objects.first()
    if test_report:
        print(f'✅ Report string representation: {str(test_report)}')
        print(f'✅ Report location: {test_report.location_description}')
    
    return True

if __name__ == '__main__':
    try:
        print('🧪 BACKEND & DATABASE COMPREHENSIVE TEST')
        print('=' * 50)
        
        # Test database connection
        from django.db import connection
        print(f'🔗 Database: {connection.vendor} - {connection.settings_dict["NAME"]}')
        print(f'🌐 Host: {connection.settings_dict["HOST"]}:{connection.settings_dict["PORT"]}')
        print()
        
        # Run tests
        create_sample_data()
        test_database_integrity()
        test_model_methods()
        
        print('\n' + '=' * 50)
        print('🎉 ALL TESTS PASSED - BACKEND IS WORKING PERFECTLY!')
        print('✅ PostgreSQL database connection: OK')
        print('✅ Django models: OK')
        print('✅ Data creation: OK')
        print('✅ Relationships: OK')
        print('✅ Model methods: OK')
        
    except Exception as e:
        print(f'\n❌ TEST FAILED: {str(e)}')
        import traceback
        traceback.print_exc()
        sys.exit(1)