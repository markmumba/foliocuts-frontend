# Staff Page API Requirements

This document outlines all the backend APIs required to fully integrate the new staff page design with card view and detailed staff profiles.

## 1. Staff Performance Summary API

**Endpoint:** `GET /api/staff/performance-summary`

**Description:** Fetches aggregated performance statistics for all staff members for the current day.

**Authentication:** Required (Bearer token)

**Query Parameters:** None

**Response:**
```json
{
  "totalStaff": 6,
  "activeStaff": 5,
  "inactiveStaff": 1,
  "todayTotals": {
    "services": 42,
    "revenue": 20800,
    "commission": 6240
  }
}
```

**Notes:**
- Should aggregate data for the authenticated tenant
- `revenue` and `commission` should be in KES (numbers)

---

## 2. Individual Staff Performance API

**Endpoint:** `GET /api/staff/:id/performance`

**Description:** Fetches detailed performance data for a specific staff member.

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `id` (required): Staff member ID

**Query Parameters:**
- `period` (optional): "today" | "week" | "month" (default: "all")

**Response:**
```json
{
  "staffId": 123,
  "today": {
    "services": 12,
    "revenue": 6000,
    "commission": 1800
  },
  "week": {
    "services": 68,
    "revenue": 34000,
    "commission": 10200
  },
  "month": {
    "services": 285,
    "revenue": 142500,
    "commission": 42750
  },
  "performance": 95,
  "assignedServices": [
    "Regular Haircut",
    "Premium Haircut",
    "Beard Trim",
    "Beard Shaping"
  ]
}
```

**Notes:**
- `performance` is a calculated percentage based on targets/goals
- All monetary values in KES (numbers)

---

## 3. Staff Weekly Chart Data API

**Endpoint:** `GET /api/staff/:id/weekly-chart`

**Description:** Fetches weekly performance data for chart visualization on staff detail page.

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `id` (required): Staff member ID

**Query Parameters:**
- `startDate` (optional): ISO date string for week start
- `endDate` (optional): ISO date string for week end

**Response:**
```json
{
  "data": [
    {
      "day": "Mon",
      "services": 8,
      "revenue": 4000,
      "commission": 1200
    },
    {
      "day": "Tue",
      "services": 10,
      "revenue": 5000,
      "commission": 1500
    },
    {
      "day": "Wed",
      "services": 7,
      "revenue": 3500,
      "commission": 1050
    },
    {
      "day": "Thu",
      "services": 11,
      "revenue": 5500,
      "commission": 1650
    },
    {
      "day": "Fri",
      "services": 12,
      "revenue": 6000,
      "commission": 1800
    },
    {
      "day": "Sat",
      "services": 15,
      "revenue": 7500,
      "commission": 2250
    },
    {
      "day": "Sun",
      "services": 9,
      "revenue": 4500,
      "commission": 1350
    }
  ]
}
```

**Notes:**
- Should return 7 days of data for the specified week
- All monetary values in KES (numbers)

---

## 4. Staff Services & Commission Rates API

**Endpoint:** `GET /api/staff/:id/services`

**Description:** Fetches assigned services and commission rates for a staff member.

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `id` (required): Staff member ID

**Response:**
```json
{
  "assignedServices": [
    "Regular Haircut",
    "Premium Haircut",
    "Beard Trim",
    "Beard Shaping"
  ],
  "commissionRates": [
    {
      "service": "Regular Haircut",
      "rate": 30
    },
    {
      "service": "Premium Haircut",
      "rate": 35
    },
    {
      "service": "Beard Trim",
      "rate": 30
    },
    {
      "service": "Beard Shaping",
      "rate": 30
    }
  ]
}
```

**Notes:**
- `rate` is a percentage (0-100)

---

## 5. Staff Recent Activity API

**Endpoint:** `GET /api/staff/:id/recent-activity`

**Description:** Fetches recent services performed by a staff member.

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `id` (required): Staff member ID

**Query Parameters:**
- `limit` (optional): number of activities to return (default: 5)

**Response:**
```json
{
  "activities": [
    {
      "id": "act_123",
      "customer": "0722123456",
      "service": "Regular Haircut",
      "amount": 300,
      "commission": 90,
      "time": "10:30 AM",
      "createdAt": "2025-12-03T10:30:00Z"
    }
  ]
}
```

**Notes:**
- All monetary values in KES (numbers)
- Frontend will format the time display

---

## 6. Add/Update Service Assignment API

**Endpoint:** `POST /api/staff/:id/services`

**Description:** Assigns a service to a staff member with commission rate.

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `id` (required): Staff member ID

**Request Body:**
```json
{
  "service": "Regular Haircut",
  "commissionRate": 30
}
```

**Response:**
```json
{
  "message": "Service assigned successfully",
  "staffId": 123,
  "service": "Regular Haircut",
  "commissionRate": 30
}
```

---

## 7. Remove Service Assignment API

**Endpoint:** `DELETE /api/staff/:id/services/:serviceId`

**Description:** Removes a service assignment from a staff member.

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `id` (required): Staff member ID
- `serviceId` (required): Service ID to remove

**Response:**
```json
{
  "message": "Service removed successfully",
  "staffId": 123,
  "serviceId": 456
}
```

---

## 8. Update Commission Rate API

**Endpoint:** `PATCH /api/staff/:id/services/:serviceId/commission`

**Description:** Updates the commission rate for a specific service assignment.

**Authentication:** Required (Bearer token)

**Path Parameters:**
- `id` (required): Staff member ID
- `serviceId` (required): Service ID

**Request Body:**
```json
{
  "rate": 35
}
```

**Response:**
```json
{
  "message": "Commission rate updated successfully",
  "staffId": 123,
  "serviceId": 456,
  "newRate": 35
}
```

---

## Implementation Priority

1. **High Priority (Required for card view to function):**
   - Staff Performance Summary API
   - Individual Staff Performance API

2. **Medium Priority (Enhance staff detail view):**
   - Staff Weekly Chart Data API
   - Staff Services & Commission Rates API
   - Staff Recent Activity API

3. **Low Priority (Can use mock data temporarily):**
   - Add/Update Service Assignment API
   - Remove Service Assignment API
   - Update Commission Rate API

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
- `201` - Created (for POST requests)
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (staff member doesn't exist)
- `500` - Internal Server Error

---

## Authentication

All staff APIs require authentication via Bearer token:

```
Authorization: Bearer <access_token>
```

The APIs should also respect the user's role and tenant:
- `OWNER` - Can see all shop staff data and manage staff
- `ADMIN` - Can see all tenant staff data
- `RECEPTIONIST` - Can see basic staff information
- `BARBER/SERVICE_GIRL` - Can only see own performance data

---

## Notes for Backend Implementation

1. **Caching:** Consider caching staff performance data for 5-10 minutes to reduce database load
2. **Permissions:** Ensure proper role-based access control
3. **Tenant Isolation:** All queries must filter by the authenticated user's tenant
4. **Date Ranges:** All date/time values should be in UTC and converted to shop's timezone
5. **Currency:** All monetary values should be in KES (Kenyan Shillings)
6. **Performance Calculation:** Define clear criteria for calculating performance percentage:
   - Could be based on targets vs actual
   - Could be based on customer satisfaction
   - Could be based on revenue generated
7. **Performance Optimization:** Optimize queries with proper indexes on:
   - `users.tenantId`
   - `users.status`
   - `services.staffId`
   - `services.createdAt`
   - `commissions.staffId`

---

## Data Models

### Staff Member Extended
The existing User model should be extended with performance data when fetching for the card view:

```typescript
interface StaffMemberWithPerformance extends User {
  todayServices: number;
  todayRevenue: number;
  todayCommission: number;
  performance: number;
  assignedServices: string[];
}
```

### Service Assignment
```typescript
interface ServiceAssignment {
  id: number;
  staffId: number;
  serviceId: number;
  serviceName: string;
  commissionRate: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## Testing Checklist

- [ ] Staff list loads correctly in both card and table views
- [ ] Staff performance summary displays accurate totals
- [ ] Individual staff detail page shows correct data
- [ ] Weekly chart renders properly with real data
- [ ] Service assignments display correctly
- [ ] Commission rates can be viewed and edited
- [ ] Recent activity shows latest services
- [ ] Search and filter work correctly
- [ ] Add staff modal integrates with backend
- [ ] Edit staff redirects to edit page
- [ ] Delete staff works correctly
- [ ] Role-based permissions work correctly
- [ ] Responsive design works on mobile/tablet
- [ ] Loading states display properly
- [ ] Error states handled gracefully

---

## Frontend Integration Notes

The frontend components are located at:
- `src/components/staff/StaffList.tsx` - Card-based staff list view
- `src/components/staff/StaffDetail.tsx` - Detailed staff profile view
- `src/components/staff/AddStaffModal.tsx` - Modal for adding new staff
- `src/pages/staff/staff.tsx` - Main staff page with view toggle

All components have TODO comments marking where API integration is needed.

Example service file structure:

```typescript
// src/services/staffService.ts
export const fetchStaffPerformanceSummary = async () => {
  const response = await api.get('/api/staff/performance-summary');
  return response.data;
};

export const fetchStaffPerformance = async (staffId: number) => {
  const response = await api.get(`/api/staff/${staffId}/performance`);
  return response.data;
};

export const fetchStaffWeeklyChart = async (staffId: number) => {
  const response = await api.get(`/api/staff/${staffId}/weekly-chart`);
  return response.data;
};
```
