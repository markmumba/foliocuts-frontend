# Frontend Analytics Migration Guide

## Overview
Updated frontend to use the new `/api/v1/analytics` endpoints instead of scattered analytics endpoints across `/transactions` and `/users`.

## What Changed

### New Analytics Service
Created a centralized `analyticsService.ts` that handles all analytics/metrics API calls.

**Location:** `src/services/analyticsService.ts`

---

## API Endpoint Changes

### Records Analytics
```typescript
// OLD
import { recordService } from '@/services/recordService';
const summary = await recordService.getRecordSummary();

// NEW (Recommended)
import { analyticsService } from '@/services/analyticsService';
const summary = await analyticsService.getRecordsSummary();

// BACKWARD COMPATIBLE (Still works)
import { recordService } from '@/services/recordService';
const summary = await recordService.getRecordSummary(); // Delegates to analyticsService
```

### Staff Performance Analytics
```typescript
// OLD
import { userService } from '@/services/userService';
const performance = await userService.getEmployeesPerformanceSummary();
const daily = await userService.getEmployeeDailyPerformance(employeeId);
const overview = await userService.getEmployeePerformanceOverview(employeeId);
const weekly = await userService.getEmployeeWeeklyPerformance(employeeId, start, end);

// NEW (Recommended)
import { analyticsService } from '@/services/analyticsService';
const performance = await analyticsService.getStaffPerformanceSummary();
const daily = await analyticsService.getStaffDailyPerformance(employeeId);
const overview = await analyticsService.getStaffPerformanceOverview(employeeId);
const weekly = await analyticsService.getStaffWeeklyPerformance(employeeId, start, end);

// BACKWARD COMPATIBLE (Still works)
import { userService } from '@/services/userService';
// All performance methods delegate to analyticsService
```

---

## React Query Hooks

### New Analytics Hooks
Created dedicated analytics hooks in `src/hooks/useAnalytics.ts`:

```typescript
// Records Analytics
import { useRecordsSummary } from '@/hooks/useAnalytics';
const { data, isLoading } = useRecordsSummary();

// Staff Performance Analytics
import {
    useStaffPerformanceSummary,
    useStaffDailyPerformance,
    useStaffPerformanceOverview,
    useStaffWeeklyPerformance
} from '@/hooks/useAnalytics';

const { data: summary } = useStaffPerformanceSummary();
const { data: daily } = useStaffDailyPerformance(employeeId);
const { data: overview } = useStaffPerformanceOverview(employeeId);
const { data: weekly } = useStaffWeeklyPerformance(employeeId, startDate, endDate);
```

### Existing Hooks (Backward Compatible)
Old hooks still work and delegate to analytics service:

```typescript
// These still work but are deprecated
import { useRecordSummary } from '@/hooks/useRecord';
import {
    useEmployeesPerformanceSummary,
    useEmployeeDailyPerformance,
    useEmployeePerformanceOverview,
    useEmployeeWeeklyPerformance
} from '@/hooks/userUser';
```

---

## Migration Strategy

### Option 1: Gradual Migration (Recommended)
Keep using existing hooks/services - they automatically use new endpoints via delegation.

**Benefits:**
- ✅ No immediate changes needed
- ✅ Everything works automatically
- ✅ Migrate components at your own pace

### Option 2: Full Migration
Update all components to use new analytics hooks/services.

**Benefits:**
- ✅ Cleaner, more semantic code
- ✅ Better organization
- ✅ Easier to understand analytics usage

---

## Component Migration Examples

### Dashboard Component

**Before:**
```typescript
import { useRecordSummary } from '@/hooks/useRecord';
import { useEmployeesPerformanceSummary } from '@/hooks/userUser';

export function Dashboard() {
    const { data: recordSummary } = useRecordSummary();
    const { data: staffPerformance } = useEmployeesPerformanceSummary();

    // ... render
}
```

**After:**
```typescript
import {
    useRecordsSummary,
    useStaffPerformanceSummary
} from '@/hooks/useAnalytics';

export function Dashboard() {
    const { data: recordSummary } = useRecordsSummary();
    const { data: staffPerformance } = useStaffPerformanceSummary();

    // ... render
}
```

### Staff Detail Component

**Before:**
```typescript
import {
    useEmployeeDailyPerformance,
    useEmployeePerformanceOverview
} from '@/hooks/userUser';

export function StaffDetail({ employeeId }: Props) {
    const { data: daily } = useEmployeeDailyPerformance(employeeId);
    const { data: overview } = useEmployeePerformanceOverview(employeeId);

    // ... render
}
```

**After:**
```typescript
import {
    useStaffDailyPerformance,
    useStaffPerformanceOverview
} from '@/hooks/useAnalytics';

export function StaffDetail({ employeeId }: Props) {
    const { data: daily } = useStaffDailyPerformance(employeeId);
    const { data: overview } = useStaffPerformanceOverview(employeeId);

    // ... render
}
```

---

## Backward Compatibility

All old service methods and hooks still work! They automatically delegate to the new analytics service:

```typescript
// recordService.getRecordSummary()
// internally calls: analyticsService.getRecordsSummary()

// userService.getEmployeesPerformanceSummary()
// internally calls: analyticsService.getStaffPerformanceSummary()
```

This means:
- ✅ No breaking changes
- ✅ Existing components work without modification
- ✅ Can migrate gradually
- ✅ New endpoints are used automatically

---

## Benefits of New Structure

### Before (Scattered)
```
/api/v1/transactions/records/summary  ← Records analytics here
/api/v1/users/employees-performance-summary  ← Staff analytics there
/api/v1/users/employee/{id}/daily-performance  ← More staff analytics
```

### After (Centralized)
```
/api/v1/analytics/records-summary  ← All analytics
/api/v1/analytics/staff-performance-summary  ← in one
/api/v1/analytics/staff/{id}/daily-performance  ← place
```

**Advantages:**
- ✅ Single source of truth for analytics
- ✅ Easier to discover analytics endpoints
- ✅ Better organization and maintainability
- ✅ Clear separation from domain logic
- ✅ Easy to add new analytics types

---

## Query Key Changes

New analytics hooks use different query keys for better cache separation:

```typescript
// Old query keys
['record-summary']
['employees-performance-summary']
['employee-daily-performance', employeeId]

// New query keys
['analytics-records-summary']
['analytics-staff-performance-summary']
['analytics-staff-daily-performance', employeeId]
```

**Important:** If you're using `queryClient.invalidateQueries()`, update your keys:

```typescript
// OLD
queryClient.invalidateQueries(['record-summary']);

// NEW
queryClient.invalidateQueries(['analytics-records-summary']);
```

---

## Testing

### Test New Endpoints
```typescript
// In your tests
import { analyticsService } from '@/services/analyticsService';

test('fetches records summary', async () => {
    const summary = await analyticsService.getRecordsSummary();
    expect(summary.data).toBeDefined();
});

test('fetches staff performance', async () => {
    const performance = await analyticsService.getStaffPerformanceSummary();
    expect(performance.data).toBeDefined();
});
```

---

## Future Analytics

The new structure makes it easy to add new analytics types:

```typescript
// Customer Analytics (Future)
export const analyticsService = {
    // ... existing methods

    // Future additions
    getCustomerGrowth: async () => { /* ... */ },
    getCustomerRetention: async () => { /* ... */ },
    getTopCustomers: async () => { /* ... */ },

    // Revenue Analytics
    getRevenueTrends: async (period: 'daily' | 'weekly' | 'monthly') => { /* ... */ },
    getRevenueByService: async () => { /* ... */ },
    getRevenueByPaymentMethod: async () => { /* ... */ },

    // Service Analytics
    getPopularServices: async () => { /* ... */ },
    getServiceUtilization: async () => { /* ... */ },
};
```

---

## Checklist

### Immediate (Required) - ✅ Done
- [x] Create `analyticsService.ts`
- [x] Update `recordService.ts` to delegate
- [x] Update `userService.ts` to delegate
- [x] Create `useAnalytics.ts` hooks
- [x] Add `@deprecated` comments

### Short-term (Recommended)
- [ ] Update dashboard components to use new hooks
- [ ] Update staff components to use new hooks
- [ ] Update any query invalidation to use new keys
- [ ] Test all analytics features work correctly

### Long-term (Optional)
- [ ] Remove deprecated methods from old services
- [ ] Remove old hooks from useRecord and userUser
- [ ] Add new analytics types (customer, revenue, services)

---

## Need Help?

- Check `src/services/analyticsService.ts` for available methods
- Check `src/hooks/useAnalytics.ts` for available hooks
- All old methods still work via delegation
- Backend docs: `backend/ANALYTICS_MODULE.md`
