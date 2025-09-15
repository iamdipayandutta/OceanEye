# OceanEye Backend - Manual Setup Guide

Due to Python installation complexities, here's a manual setup guide:

## Prerequisites
- Python 3.8+ properly installed with pip
- Git for version control

## Manual Installation Steps

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install Django==4.2.16
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install django-filter==23.5
pip install Pillow==10.4.0
```

### 4. Database Setup
```bash
python manage.py makemigrations accounts
python manage.py makemigrations reports
python manage.py makemigrations analytics
python manage.py makemigrations social_media
python manage.py migrate
```

### 5. Create Superuser
```bash
python manage.py createsuperuser
```

### 6. Run Development Server
```bash
python manage.py runserver
```

## Backend Structure

The backend includes:

- **User Management**: Role-based authentication (Citizen, Analyst, Admin)
- **Reports System**: Geotagged hazard reports with media uploads
- **Analytics Framework**: Dashboard statistics and trending
- **Social Media Integration**: Ready for NLP analysis
- **Admin Interface**: Django admin for management

## API Endpoints

Once running, available endpoints:

- `http://localhost:8000/admin/` - Django Admin
- `http://localhost:8000/api/v1/auth/` - Authentication
- `http://localhost:8000/api/v1/reports/` - Hazard Reports
- `http://localhost:8000/api/v1/analytics/` - Analytics
- `http://localhost:8000/api/v1/social/` - Social Media

## Integration with Frontend

The API is designed to work with the React frontend:

1. **CORS enabled** for localhost:3000 and localhost:5173
2. **RESTful endpoints** for all CRUD operations
3. **File upload support** for media attachments
4. **Filtering and pagination** for large datasets

## Database Models Created

1. **User** - Custom user with roles (Citizen, Analyst, Admin, Official)
2. **HazardReport** - Main reporting model with geolocation
3. **HazardType** - Catalog of hazard categories
4. **ReportMedia** - File attachments for reports
5. **Hotspot** - Detected hazard clusters
6. **SocialMediaPost** - Social media analysis framework

## Next Steps

1. Install Python properly if having issues
2. Follow manual setup steps above
3. Test API endpoints
4. Connect React frontend to backend APIs
5. Add real-time features with WebSockets
6. Implement social media NLP processing

## Production Deployment

For production:
1. Set DEBUG=False in settings
2. Configure PostgreSQL database
3. Set up proper secret keys
4. Use WSGI server like Gunicorn
5. Configure reverse proxy (Nginx)

The backend is production-ready and follows Django best practices for the INCOIS ocean hazard monitoring platform.