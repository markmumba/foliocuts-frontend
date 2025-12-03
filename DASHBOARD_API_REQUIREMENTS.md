# Dashboard API Requirements

This document outlines all the backend APIs required to fully integrate the new dashboard design.

## 1. Dashboard Metrics API

**Endpoint:** `GET /api/dashboard/metrics`

**Description:** Fetches key performance metrics for the dashboard header cards.

**Authentication:** Required (Bearer token)

**Query Parameters:** None

**Response:**
```json
{
  "todayRevenue": {
    "value": 45000,
    "change": 12.5,
    "trend": "up"
  },
  "customersServed": {
    "value": 38,
    "change": 8.3,
    "trend": "up"
  },
  "mpesaPayments": {
    "value": 85,
    "change": 5.2,
    "trend": "up"
  },
  "loyaltyRewards": {
    "value": 12,
    "label": "Today"
  }
}
```

**Notes:**
- `value` for revenue should be in KES (number)
- `value` for mpesaPayments should be percentage (0-100)
- `change` is the percentage change (positive or negative)
- `trend` can be "up", "down", or "neutral"

---

## 2. Revenue Chart API

**Endpoint:** `GET /api/dashboard/revenue-chart`

**Description:** Fetches revenue and transaction data for the chart visualization.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `period` (optional): "week" | "month" | "year" (default: "week")
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response:**
```json
{
  "period": "week",
  "data": [
    {
      "day": "Mon",
      "revenue": 38000,
      "transactions": 32
    },
    {
      "day": "Tue",
      "revenue": 42000,
      "transactions": 38
    },
    {
      "day": "Wed",
      "revenue": 35000,
      "transactions": 29
    },
    {
      "day": "Thu",
      "revenue": 48000,
      "transactions": 42
    },
    {
      "day": "Fri",
      "revenue": 52000,
      "transactions": 45
    },
    {
      "day": "Sat",
      "revenue": 68000,
      "transactions": 58
    },
    {
      "day": "Sun",
      "revenue": 45000,
      "transactions": 38
    }
  ],
  "totalRevenue": 328000,
  "totalTransactions": 282,
  "percentageChange": 18.2
}
```

**Notes:**
- For "week" period: return 7 days of data
- For "month" period: return data grouped by days/weeks
- For "year" period: return data grouped by months
- `revenue` should be in KES (number)

---

## 3. Recent Transactions API

**Endpoint:** `GET /api/dashboard/recent-transactions`

**Description:** Fetches the most recent service transactions.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `limit` (optional): number of transactions to return (default: 5)

**Response:**
```json
{
  "transactions": [
    {
      "id": "C001",
      "customer": {
        "phoneNumber": "0722123456",
        "name": "John Doe"
      },
      "service": "Haircut + Beard",
      "staff": {
        "id": "staff_123",
        "name": "John"
      },
      "amount": 500,
      "paymentMethod": "M-Pesa",
      "status": "completed",
      "createdAt": "2025-12-03T10:30:00Z"
    }
  ]
}
```

**Notes:**
- `paymentMethod` can be: "M-Pesa", "Cash", or "Loyalty"
- `status` can be: "completed" or "pending"
- `amount` should be in KES (number)
- Frontend will format the time display

---

## 4. Staff Performance API

**Endpoint:** `GET /api/dashboard/staff-performance`

**Description:** Fetches staff performance metrics for the dashboard.

**Authentication:** Required (Bearer token)

**Query Parameters:**
- `limit` (optional): number of staff members to return (default: 4)
- `sortBy` (optional): "revenue" | "services" | "performance" (default: "performance")
- `period` (optional): "today" | "week" | "month" (default: "today")

**Response:**
```json
{
  "staff": [
    {
      "id": "staff_123",
      "name": "John",
      "role": "Barber",
      "avatar": "JM",
      "statistics": {
        "servicesCount": 18,
        "totalRevenue": 8400,
        "commission": 2520,
        "performance": 95
      }
    }
  ]
}
```

**Notes:**
- `avatar` should be initials (2 characters) or URL to profile image
- `performance` is a percentage (0-100) based on targets/goals
- `commission` should be calculated based on shop's commission rate
- All revenue values in KES (numbers)

---

## Implementation Priority

1. **High Priority (Required for dashboard to function):**
   - Dashboard Metrics API
   - Recent Transactions API

2. **Medium Priority (Enhance dashboard value):**
   - Revenue Chart API
   - Staff Performance API

3. **Low Priority (Can use mock data temporarily):**
   - Advanced filtering and date range options

---

## Error Handling

All APIs should follow this error response format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication

All dashboard APIs require authentication via Bearer token:

```
Authorization: Bearer <access_token>
```

The APIs should also respect the user's role and tenant:
- `OWNER` - Can see all shop data
- `ADMIN` - Can see all tenant data
- `RECEPTIONIST` - Can see basic metrics
- `BARBER/SERVICE_GIRL` - Can see own performance data

---

## Notes for Backend Implementation

1. **Caching:** Consider caching dashboard metrics for 5-10 minutes to reduce database load
2. **Permissions:** Ensure proper role-based access control
3. **Tenant Isolation:** All queries must filter by the authenticated user's tenant
4. **Date Ranges:** All date/time values should be in UTC and converted to shop's timezone
5. **Currency:** All monetary values should be in KES (Kenyan Shillings)
6. **Performance:** Optimize queries with proper indexes on:
   - `transactions.createdAt`
   - `transactions.tenantId`
   - `staff.tenantId`
   - `services.createdAt`

---

## Frontend Integration

The frontend uses React Query for data fetching. Example service file structure:

```typescript
// src/services/dashboardService.ts
export const fetchDashboardMetrics = async () => {
  const response = await api.get('/api/dashboard/metrics');
  return response.data;
};

export const fetchRevenueChart = async (period: string) => {
  const response = await api.get('/api/dashboard/revenue-chart', {
    params: { period }
  });
  return response.data;
};
```

---

## Testing Checklist

- [ ] Dashboard loads without errors
- [ ] Metrics display correct values
- [ ] Revenue chart renders properly
- [ ] Recent transactions show latest data
- [ ] Staff performance displays correctly
- [ ] Quick actions navigate to correct pages
- [ ] Responsive design works on mobile/tablet
- [ ] Loading states display properly
- [ ] Error states handled gracefully
- [ ] Role-based permissions work correctly
