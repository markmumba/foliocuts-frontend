# Digital Barbershop Frontend

Turborepo monorepo containing web and mobile applications for the Digital Barbershop platform.

## Structure

```
frontend/
├── apps/
│   ├── web/           # React/Vite web application
│   └── mobile/        # Expo/React Native mobile app
├── packages/
│   ├── shared-types/  # Shared TypeScript types
│   └── shared-api/    # Shared API client and services
├── package.json       # Root package.json with workspaces
└── turbo.json         # Turborepo configuration
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

**Run all apps:**
```bash
npm run dev
```

**Run only web:**
```bash
npm run dev:web
```

**Run only mobile:**
```bash
npm run dev:mobile
```

### Build

```bash
npm run build
```

## Shared Packages

### @digital-barbershop/shared-types

Contains all TypeScript type definitions:
- API response types
- Domain models (User, Record, Service, etc.)
- Enums (Role, PaymentMethod, etc.)

### @digital-barbershop/shared-api

Contains the API client and service functions:
- `ApiClient` - Configurable HTTP client with token refresh
- Service factories (authService, recordService, etc.)
- Storage and navigation adapters for platform-specific implementations

## Environment Variables

### Web App (`apps/web/.env`)
```
VITE_API_BASE_URL=http://localhost:8082/api/v1
```

### Mobile App (`apps/mobile/.env`)
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:8082/api/v1
```

## Apps

### Web App (apps/web)
React + Vite application for admin/owner dashboard.

### Mobile App (apps/mobile)
Expo/React Native app for employees.
- Login and authentication
- View assigned services
- Track performance metrics
- Recent activities
