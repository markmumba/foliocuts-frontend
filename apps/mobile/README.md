# Digital Barbershop Mobile App

Employee mobile application built with Expo and React Native.

## Setup

1. Install dependencies from the frontend root:
```bash
cd frontend
npm install
```

2. Set up environment variables:
Create a `.env` file in this directory:
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:8082/api/v1
```

3. Start the development server:
```bash
npm run dev:mobile
# or
cd apps/mobile && npm run dev
```

## Features

- Employee authentication
- View assigned services
- Track performance metrics
- View recent activities
- Create records (transactions)

## Shared Packages

This app uses shared packages from the monorepo:
- `@digital-barbershop/shared-types` - TypeScript types
- `@digital-barbershop/shared-api` - API client and services


