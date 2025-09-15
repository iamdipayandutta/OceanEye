from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.reports.models import HazardType

User = get_user_model()

class Command(BaseCommand):
    help = 'Initialize database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('🌊 Initializing OceanEye Database...')
        
        # Create hazard types
        hazard_types = [
            {
                'name': 'High Waves',
                'code': 'HIGH_WAVES',
                'description': 'Dangerous wave conditions affecting coastal areas',
                'icon': 'waves',
                'color': '#1E40AF'
            },
            {
                'name': 'Coastal Flooding',
                'code': 'FLOODING',
                'description': 'Coastal or inland flooding events',
                'icon': 'droplets',
                'color': '#0EA5E9'
            },
            {
                'name': 'Storm Surge',
                'code': 'STORM_SURGE',
                'description': 'Abnormal rise of water during storms',
                'icon': 'cloud-rain',
                'color': '#7C3AED'
            },
            {
                'name': 'Cyclone/Storm',
                'code': 'CYCLONE',
                'description': 'Tropical cyclone and severe storm events',
                'icon': 'wind',
                'color': '#DC2626'
            },
            {
                'name': 'Tsunami',
                'code': 'TSUNAMI',
                'description': 'Tsunami waves and related hazards',
                'icon': 'mountain',
                'color': '#B91C1C'
            },
            {
                'name': 'Marine Debris',
                'code': 'MARINE_DEBRIS',
                'description': 'Ocean pollution and debris accumulation',
                'icon': 'trash-2',
                'color': '#D97706'
            }
        ]

        for hazard_data in hazard_types:
            hazard_type, created = HazardType.objects.get_or_create(
                code=hazard_data['code'],
                defaults=hazard_data
            )
            if created:
                self.stdout.write(f'✅ Created hazard type: {hazard_type.name}')

        self.stdout.write(
            self.style.SUCCESS('🎉 Database initialization completed!')
        )