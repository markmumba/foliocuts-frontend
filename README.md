# FolioCuts - Digital Barbershop Management System

A comprehensive multi-tenant SaaS platform designed specifically for barbershops in Kenya. FolioCuts helps barbershop owners manage their business operations, from staff and customer management to appointment scheduling, service tracking, and financial records.

## 🎯 Project Overview

FolioCuts is a full-stack application that provides barbershop owners with a complete digital solution to manage their business. The platform supports multiple barbershops (tenants) with role-based access control, subscription management, and comprehensive analytics.

### Key Features

- **Multi-Tenant Architecture**: Support for multiple barbershops with isolated data
- **Role-Based Access Control**: Different roles (Owner, Admin, Receptionist, Barber, Service Girl) with appropriate permissions
- **Staff Management**: Add, manage, and track barbers and service staff
- **Customer Management**: Maintain customer database with contact information and service history
- **Service Management**: Create and manage service types and individual services
- **Transaction Records**: Track all customer transactions and payments
- **Subscription Plans**: Flexible subscription system with trial periods (Basic, Premium, Enterprise)
- **Analytics & Reporting**: Comprehensive dashboards and reports for business insights
- **M-Pesa Integration**: Payment processing through M-Pesa for Kenyan market
- **Email Notifications**: Automated email notifications for OTP and login

## 🏗️ Architecture

The application consists of three main components:

```
┌─────────────────────────────────────────────────────┐
│                   Landing Page                       │
│              (Next.js + TypeScript)                  │
│         Marketing site with pricing & features       │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────┐
│                   Frontend                           │
│         (React + Vite + TypeScript)                  │
│      Main dashboard application for users            │
└──────────────────────┼──────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────┐
│                   Backend API                        │
│      (Spring Boot + Java 21 + PostgreSQL)           │
│         RESTful API with JWT authentication          │
└──────────────────────┴──────────────────────────────┘
```

## 📁 Project Structure

```
Digital barbershop/
├── landing-page/          # Next.js marketing website
│   ├── app/              # Next.js app router
│   ├── components/        # React components
│   │   ├── homepage/     # Landing page sections
│   │   └── ui/           # Reusable UI components
│   └── public/           # Static assets
│
├── frontend/              # React dashboard application
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── auth/     # Authentication components
│   │   │   ├── dashboard/# Dashboard components
│   │   │   ├── layout/   # Layout components
│   │   │   ├── records/  # Transaction records
│   │   │   ├── shop/     # Shop management
│   │   │   ├── staff/    # Staff management
│   │   │   └── ui/       # UI component library
│   │   ├── context/      # React contexts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   └── types/        # TypeScript type definitions
│   └── Dockerfile
│
├── backend/               # Spring Boot API
│   ├── src/main/java/com/foliocuts/backend/
│   │   ├── modules/      # Feature modules
│   │   │   ├── auth/     # Authentication & authorization
│   │   │   ├── tenant/   # Tenant management
│   │   │   ├── subscription/ # Subscription management
│   │   │   ├── services/ # Service management
│   │   │   ├── records/  # Transaction records
│   │   │   └── analytics/# Analytics module
│   │   └── common/       # Shared utilities
│   ├── src/main/resources/
│   │   ├── db/           # Database migrations & scripts
│   │   └── templates/    # Email templates
│   └── Dockerfile
│
├── deployment-stuff/      # Deployment configurations
│   ├── traefik/          # Traefik reverse proxy config
│   └── monitoring/       # Monitoring setup
│
└── docker-compose.yml     # Docker Compose for local development
```

## 🛠️ Tech Stack

### Frontend (Dashboard)
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **TanStack Table** - Data tables
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Landing Page
- **Next.js 16** - React framework with SSR
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Spring Boot 3.5.5** - Java framework
- **Java 21** - Programming language
- **PostgreSQL** - Relational database
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **Spring Data JPA** - Database access
- **MapStruct** - Object mapping
- **Lombok** - Boilerplate reduction
- **Spring Mail** - Email functionality
- **SpringDoc OpenAPI** - API documentation

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Traefik** - Reverse proxy and load balancer
- **Nginx** - Web server (for frontend)
- **PostgreSQL** - Database

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/pnpm
- **Java 21** and Gradle
- **Docker** and Docker Compose
- **PostgreSQL** 14+ (or use Docker)

### Environment Variables

#### Landing Page (`landing-page/.env.local`)
```env
NEXT_PUBLIC_FRONTEND_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8081/api/v1
```

#### Backend (`backend/src/main/resources/application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/foliocuts
    username: your_username
    password: your_password
  mail:
    host: smtp.gmail.com
    port: 587
    username: your_email@gmail.com
    password: your_app_password

jwt:
  secret: your_jwt_secret_key
  expiration: 86400000
```

### Running Locally

#### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option 2: Individual Services

**Backend:**
```bash
cd backend
./gradlew bootRun
# API available at http://localhost:8081
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Dashboard available at http://localhost:5173
```

**Landing Page:**
```bash
cd landing-page
npm install
npm run dev
# Landing page available at http://localhost:3000
```

## 📚 Key Features Explained

### Multi-Tenant System
Each barbershop operates as an isolated tenant with its own:
- Staff members
- Customers
- Services
- Transaction records
- Subscription plan

### Role-Based Access Control
- **ADMIN**: Full system access, manages all tenants
- **OWNER**: Full access to their barbershop
- **RECEPTIONIST**: Can manage customers, services, and records
- **BARBER**: Limited access to view and update their own records
- **SERVICE_GIRL**: Similar to barber role

### Subscription Management
- **Trial Period**: New tenants get a 14-day trial
- **Flexible Plans**: Basic, Premium, and Enterprise tiers
- **Feature Limits**: Based on subscription plan (staff count, services, etc.)

### Analytics & Reporting
- Revenue tracking
- Customer analytics
- Service performance metrics
- Staff productivity reports

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
1. User logs in with email and password
2. Backend validates credentials and returns JWT token
3. Frontend stores token and includes it in API requests
4. Backend validates token on each request

## 📊 Database Schema

Key entities:
- **Tenants**: Barbershop businesses
- **Users**: Staff members with roles
- **Customers**: Customer database
- **Services**: Service offerings
- **Service Types**: Categories of services
- **Records**: Transaction records
- **Subscriptions**: Tenant subscription plans
- **Subscription Plan Templates**: Available subscription tiers

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

The application is designed to be deployed using:
- Docker containers
- Traefik as reverse proxy
- PostgreSQL database
- SSL/HTTPS support

## 📝 API Documentation

When the backend is running, API documentation is available at:
```
http://localhost:8081/swagger-ui.html
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
./gradlew test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

Developed for barbershops in Kenya to digitize and streamline their operations.

## 🔗 Links

- **Landing Page**: [Production URL]
- **Dashboard**: [Production URL]
- **API Documentation**: [Swagger UI URL]

## 📞 Support

For support, email support@foliocuts.com or open an issue in the repository.

---

**FolioCuts** - Empowering barbershops with digital solutions 💈

