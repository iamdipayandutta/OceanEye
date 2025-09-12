# 🌊 OceanEye - Citizen Insight Platform

**Real-time ocean hazard monitoring through citizen science and AI-powered analysis**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-blue.svg)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [User Roles](#user-roles)
- [Hazard Types](#hazard-types)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## 🌊 Overview

OceanEye is a comprehensive ocean hazard monitoring and reporting platform developed by the **Indian National Centre for Ocean Information Services (INCOIS)** and the OceanEye Development Team. The platform combines citizen science with professional emergency management tools to provide real-time ocean hazard monitoring and community protection for coastal areas worldwide.

### Key Objectives
- **Community Protection**: Enable early warning systems for coastal communities
- **Citizen Engagement**: Crowdsource hazard reports from local communities
- **Professional Tools**: Provide emergency management professionals with actionable insights
- **Data Integration**: Combine citizen reports with social media signals and official data
- **Real-time Monitoring**: Continuous tracking of ocean hazards and environmental threats

## ✨ Features

### 🏠 Landing Page
- **Professional Branding**: Ocean-themed design with INCOIS partnership
- **Feature Showcase**: Highlights platform capabilities
- **Statistics Dashboard**: Real-time metrics display
- **Multi-access Points**: Different entry points for various user types

### 🗺️ Ocean Hazard Maps (Public Access)
- **Real-time Visualization**: Live hazard maps accessible to anyone without login
- **Interactive Map View**: Cluster and heatmap visualization modes
- **Advanced Filtering**: Filter by date range, hazard type, and verification status
- **Public Safety Tool**: Open access for community awareness and safety
- **Recent Reports**: Public sidebar with latest verified community submissions
- **Trending Analysis**: Real-time hazard trends and analytics

### 👥 Citizen Dashboard (`/citizendashboard`)
- **Simplified Reporting**: Easy-to-use hazard reporting interface for citizens
- **My Reports Tracking**: Personal dashboard to track submitted reports and their status
- **Nearby Alerts**: Local warnings and safety information
- **Quick Actions**: One-click hazard reporting with location services
- **Safety Tips**: Educational content for ocean safety awareness
- **Gamification**: Points system to encourage community participation

### 📝 Citizen Hazard Report (`/citizenhazardreport`)
- **Dedicated Reporting Form**: Comprehensive hazard reporting interface
- **GPS Integration**: Automatic location detection with manual override
- **Media Upload**: Photo and video attachment capabilities
- **Severity Assessment**: Guided severity level selection
- **Emergency Guidelines**: Built-in safety and emergency contact information
- **Privacy Options**: Anonymous reporting capabilities
- **Form Validation**: Ensures complete and accurate hazard reports

### 🌍 Interactive Map View
- **Dual Visualization Modes**:
  - **Cluster View**: Individual report pins with severity color coding
  - **Heatmap View**: Density visualization for pattern recognition
- **Live Updates**: Real-time indicator with pulse animations
- **Interactive Popups**: Detailed report information with media preview
- **Verification Workflow**: Admin tools for report validation and management

### 👥 Admin Panel
- **System Overview**: Comprehensive metrics and health monitoring
- **Report Management**: Search, filter, verify, and manage citizen reports
- **User Management**: Role-based access control and user administration
- **Alert System**: Custom rule creation and automated monitoring
- **Configuration**: System settings and API integrations

### 📊 Analytics Panel
- **Real-time Statistics**: Live data visualization and trends
- **Performance Metrics**: System and user engagement analytics
- **Data Insights**: Pattern recognition and predictive analytics

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.8.3** - Type-safe development environment
- **Vite 5.4.19** - Fast build tool and development server
- **React Router DOM 6.30.1** - Client-side routing

### UI Framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Lucide React** - Beautiful & consistent icon library
- **Custom Themes** - Ocean-inspired gradient system

### State Management & Data
- **TanStack Query 5.83.0** - Server state management
- **React Hook Form 7.61.1** - Form handling with validation
- **Zod 3.25.76** - Runtime type validation

### Development Tools
- **ESLint** - Code linting and style enforcement
- **PostCSS** - CSS processing and optimization

## 📁 Project Structure

```
oceaneye-citizen-insight/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AdminPanel.tsx # System administration
│   │   ├── CitizenDashboard.tsx # Citizen reporting interface
│   │   ├── CitizenHazardReport.tsx # Dedicated hazard reporting form
│   │   ├── Dashboard.tsx  # Main dashboard interface
│   │   ├── LandingPage.tsx # Public homepage
│   │   ├── MapView.tsx    # Interactive map component
│   │   ├── Navigation.tsx # Header navigation
│   │   └── ThemeProvider.tsx # Theme management
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Main page router
│   │   ├── CitizenDashboard.tsx # Citizen dashboard page
│   │   ├── CitizenHazardReport.tsx # Hazard reporting page
│   │   └── NotFound.tsx   # 404 error page
│   ├── App.tsx            # Root application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamdipayandutta/oceaneye-citizen-insight.git
   cd oceaneye-citizen-insight
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🎮 Usage

### Getting Started
1. **Landing Page**: Visit the homepage to understand platform capabilities
2. **Dashboard Access**: Click "Access Dashboard" to enter the monitoring interface
3. **Navigation**: Use the role-based navigation to access different features
4. **Map Interaction**: Click on hazard markers to view detailed reports
5. **Admin Panel**: Administrators can access system management tools

### Key Workflows

#### For Citizens
1. Access the platform through landing page
2. Navigate to reporting interface
3. Submit geotagged hazard reports with photos/videos
4. Track report status and verification

#### For Analysts
1. Access professional dashboard
2. Review and verify citizen reports
3. Analyze hazard patterns and trends
4. Generate insights for emergency response

#### For Administrators
1. Access admin panel for system management
2. Manage users and assign roles
3. Configure alert rules and notifications
4. Monitor system health and performance

## 👤 User Roles

### 🏠 Citizen
- **Submit Reports**: Create geotagged hazard reports
- **Upload Media**: Attach photos and videos
- **Track Status**: Monitor report verification progress
- **View Public Data**: Access general hazard information

### 📊 Analyst
- **Verify Reports**: Review and validate citizen submissions
- **Data Analysis**: Examine patterns and trends
- **Generate Insights**: Create actionable intelligence
- **Dashboard Access**: Professional monitoring tools

### ⚙️ Administrator
- **System Management**: Full platform administration
- **User Management**: Role assignment and access control
- **Configuration**: System settings and integrations
- **Alert Management**: Custom rule creation and monitoring

## 🌊 Hazard Types

The platform monitors various ocean and coastal hazards:

| Hazard Type | Description | Severity Levels |
|-------------|-------------|-----------------|
| **High Waves** | Coastal wave height monitoring | High, Medium, Low |
| **Flooding** | Coastal and inland flood detection | High, Medium, Low |
| **Cyclones** | Storm tracking and impact assessment | High, Medium, Low |
| **Extreme Tides** | Tidal surge monitoring | High, Medium, Low |
| **Marine Debris** | Ocean pollution and debris tracking | High, Medium, Low |

### Severity Color Coding
- 🔴 **High**: Red - Immediate threat requiring urgent action
- 🟠 **Medium**: Orange - Significant risk requiring monitoring
- 🟡 **Low**: Yellow - Minor concern for awareness

## 🔌 API Integration

### Supported Integrations
- **Social Media APIs**: Twitter, Instagram for hazard-related posts
- **Weather Services**: Real-time meteorological data
- **SMS Services**: Twilio, AWS SNS for notifications
- **Map Providers**: OpenStreetMap, Mapbox, Google Maps
- **Government Feeds**: Official agency data integration

### Configuration
API integrations are managed through the Admin Panel:
1. Navigate to Admin Panel > Settings
2. Configure API keys and endpoints
3. Test connections and enable services
4. Set up automated data synchronization

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper TypeScript types
4. Follow the existing code style and conventions
5. Test your changes thoroughly
6. Submit a pull request with detailed description

### Code Standards
- **TypeScript**: Use proper type annotations
- **Components**: Follow React best practices
- **Styling**: Use Tailwind CSS utilities
- **Testing**: Include tests for new features
- **Documentation**: Update README for significant changes

### Reporting Issues
- Use GitHub Issues for bug reports and feature requests
- Provide detailed reproduction steps
- Include browser and system information
- Attach screenshots for UI-related issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **INCOIS** - Indian National Centre for Ocean Information Services
- **Coastal Communities** - For their valuable hazard reports and feedback
- **Open Source Community** - For the amazing tools and libraries
- **Emergency Management Professionals** - For their expertise and requirements



**Built with ❤️ for safer coastal communities worldwide**