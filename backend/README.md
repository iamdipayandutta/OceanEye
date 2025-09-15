# OceanEye Backend API

Django REST API backend for the OceanEye Citizen Insight Platform - a crowdsourced ocean hazard reporting and analytics system.

## Features

- **User Management**: Role-based authentication (Citizens, Analysts, Admins, Officials)
- **Hazard Reporting**: Geotagged reports with media upload support
- **Real-time Analytics**: Dashboard statistics and trending analysis
- **Verification Workflow**: Expert review and validation of citizen reports
- **Hotspot Detection**: Spatial clustering of hazard incidents
- **Social Media Integration**: Ready for NLP analysis of social media posts
- **API Documentation**: Automatic Swagger/OpenAPI documentation

## Technology Stack

- **Backend**: Django 5.0.7 + Django REST Framework
- **Database**: SQLite (development) → PostgreSQL (production)
- **Authentication**: JWT tokens with role-based permissions
- **Documentation**: drf-spectacular (Swagger/OpenAPI)
- **File Storage**: Django file handling (ready for cloud storage)
- **Background Tasks**: Celery + Redis (for future social media processing)

## Quick Start

### Prerequisites

- Python 3.8+
- pip package manager

### Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**:
   ```bash
   copy .env.example .env
   # Edit .env file with your configuration
   ```

5. **Database setup**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py init_db
   ```

6. **Run development server**:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/`

### Default Accounts

After running `init_db`, these accounts are available:

- **Admin**: `admin` / `admin123`
- **Analyst**: `analyst1` / `analyst123`
- **Citizen**: `citizen1` / `citizen123`

## API Documentation

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## API Endpoints

### Authentication
- `POST /api/v1/auth/register/` - User registration
- `POST /api/v1/auth/login/` - User login
- `POST /api/v1/auth/logout/` - User logout
- `GET /api/v1/auth/profile/` - Get user profile
- `PATCH /api/v1/auth/profile/` - Update user profile

### Reports
- `GET /api/v1/reports/` - List reports (with filtering)
- `POST /api/v1/reports/` - Create new report
- `GET /api/v1/reports/{id}/` - Get report details
- `PATCH /api/v1/reports/{id}/` - Update report
- `PATCH /api/v1/reports/{id}/verify/` - Verify report (analysts only)

### Data & Analytics
- `GET /api/v1/reports/map-data/` - Public map data
- `GET /api/v1/reports/dashboard-stats/` - Dashboard statistics
- `GET /api/v1/reports/hotspots/` - Active hotspots
- `GET /api/v1/reports/hazard-types/` - Available hazard types

## Database Models

### User Model
- Role-based access control (Citizen, Analyst, Admin, Official)
- Phone number and organization fields
- Notification preferences
- Account verification status

### HazardReport Model
- Geotagged location (latitude/longitude)
- Hazard type, severity, and status
- Media file attachments
- Verification workflow
- Weather conditions data
- Social media correlation

### Supporting Models
- **HazardType**: Catalog of hazard categories
- **ReportMedia**: File attachments (images/videos)
- **ReportComment**: Comments and notes
- **Hotspot**: Detected hazard clusters
- **SocialMediaPost**: Social media analysis (future)

## File Structure

```
backend/
├── oceaneye_backend/          # Django project settings
│   ├── settings.py           # Main configuration
│   ├── urls.py              # URL routing
│   └── wsgi.py              # WSGI configuration
├── apps/                     # Django applications
│   ├── accounts/            # User management
│   ├── reports/             # Hazard reporting
│   ├── analytics/           # Analytics models
│   └── social_media/        # Social media integration
├── requirements.txt         # Python dependencies
├── manage.py               # Django management
└── .env.example           # Environment template
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL (production)
DB_NAME=oceaneye_db
DB_USER=oceaneye_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### Database Migration to PostgreSQL

1. **Install PostgreSQL**:
   ```bash
   pip install psycopg2-binary
   ```

2. **Update settings.py**:
   Uncomment PostgreSQL configuration and comment SQLite

3. **Run migrations**:
   ```bash
   python manage.py migrate
   python manage.py init_db
   ```

## Security Features

- JWT token authentication
- Role-based permissions
- CORS configuration for frontend
- Password validation
- Rate limiting ready (future enhancement)
- Production security settings

## Testing

```bash
# Run tests
python manage.py test

# Create test data
python manage.py init_db
```

## Deployment

### Production Settings

1. **Set environment variables**:
   ```env
   DEBUG=False
   SECRET_KEY=your-production-secret-key
   ALLOWED_HOSTS=your-domain.com
   ```

2. **Collect static files**:
   ```bash
   python manage.py collectstatic
   ```

3. **Database migrations**:
   ```bash
   python manage.py migrate
   ```

### Docker Deployment (Optional)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

## Integration with Frontend

The API is designed to work seamlessly with the React frontend:

1. **CORS enabled** for local development
2. **JWT authentication** for secure API access
3. **Pagination** for large datasets
4. **Filtering and search** for map and dashboard views
5. **File upload** support for media attachments

## Future Enhancements

1. **Social Media NLP**: Text analysis and sentiment detection
2. **Real-time Updates**: WebSocket integration
3. **Hotspot Detection**: DBSCAN clustering algorithms
4. **Weather Integration**: External API connections
5. **Mobile Notifications**: Push notification system
6. **Backup Systems**: Automated data backup
7. **Performance Monitoring**: APM integration

## Support

For technical support or questions about the backend implementation, please refer to the project documentation or contact the development team.

## License

This project is part of the OceanEye Citizen Insight Platform developed for INCOIS (Indian National Centre for Ocean Information Services).