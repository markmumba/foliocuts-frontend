# Tenant Context Usage Guide

This guide explains how to use the Tenant Context to access tenant details throughout the application.

## Overview

The Tenant Context provides access to the currently logged-in user's tenant information, including:
- Business name
- Subdomain
- Contact information (phone, email)
- M-Pesa payment details
- Subscription plan
- Status
- And more...

## Setup

The `TenantProvider` is already set up in the application root (`src/App.tsx`) and wraps the entire app:

```tsx
<AuthProvider>
  <TenantProvider>
    <NotificationProvider>
      {/* App routes */}
    </NotificationProvider>
  </TenantProvider>
</AuthProvider>
```

**Note:** `TenantProvider` must be inside `AuthProvider` because it depends on authentication data.

## Usage

### Basic Usage

Import and use the `useTenantContext` hook in any component:

```tsx
import { useTenantContext } from '@/context/TenantContext';

function MyComponent() {
  const { tenant, isLoading, error } = useTenantContext();

  if (isLoading) {
    return <div>Loading tenant data...</div>;
  }

  if (error) {
    return <div>Error loading tenant: {error.message}</div>;
  }

  if (!tenant) {
    return <div>No tenant data available</div>;
  }

  return (
    <div>
      <h1>{tenant.businessName}</h1>
      <p>Subdomain: @{tenant.subdomain}</p>
      <p>Phone: {tenant.phoneNumber}</p>
      <p>Email: {tenant.email}</p>
    </div>
  );
}
```

### Context Properties

The `useTenantContext` hook returns:

```typescript
{
  tenant: Tenant | null;     // The tenant object or null if not available
  isLoading: boolean;         // True while fetching tenant data
  error: Error | null;        // Error object if fetch failed
}
```

### Tenant Object Structure

```typescript
interface Tenant {
  tenantId: string;
  businessName: string;
  subdomain: string;
  phoneNumber: string;
  email: string;
  mpesaTillNo: string;
  mpesaBusinessShortCode: string;
  status: string;
  subscriptionPlan: string;
  numberOfUsers: string;
  numberOfServices: string;
  numberOfBarberServices: string;
  numberOfServiceGirlServices: string;
  users: PaginatedTenantUsers;
  services: TenantServices[];
  createdAt: string;
  updatedAt: string;
}
```

## Examples

### Example 1: Sidebar (Already Implemented)

The sidebar now displays the tenant's business name instead of hardcoded "FolioCuts":

```tsx
// src/components/layout/SideBar.tsx
import { useTenantContext } from '@/context/TenantContext';

export function AppSidebar() {
  const { tenant } = useTenantContext();

  const tenantName = tenant?.businessName || 'FolioCuts';
  const tenantSubtitle = tenant?.subdomain
    ? `@${tenant.subdomain}`
    : tenant?.phoneNumber || 'Barbershop Platform';

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="font-bold">{tenantName}</span>
        <span className="text-xs">{tenantSubtitle}</span>
      </SidebarHeader>
      {/* ... */}
    </Sidebar>
  );
}
```

### Example 2: Payment Invoice

Use tenant data in payment invoices or receipts:

```tsx
import { useTenantContext } from '@/context/TenantContext';

export function PaymentInvoice({ transaction }) {
  const { tenant } = useTenantContext();

  return (
    <div className="invoice">
      <div className="invoice-header">
        <h1>{tenant?.businessName || 'FolioCuts'}</h1>
        <p>{tenant?.phoneNumber}</p>
        <p>{tenant?.email}</p>
      </div>

      <div className="invoice-body">
        <h2>Payment Receipt</h2>
        <p>Transaction ID: {transaction.id}</p>
        <p>Amount: KES {transaction.amount}</p>
        {/* ... */}
      </div>

      <div className="invoice-footer">
        <p>M-Pesa Till Number: {tenant?.mpesaTillNo}</p>
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
}
```

### Example 3: Dashboard Header

Display tenant info in the dashboard:

```tsx
import { useTenantContext } from '@/context/TenantContext';

export function DashboardHeader() {
  const { tenant } = useTenantContext();

  return (
    <header>
      <h1>Welcome to {tenant?.businessName || 'FolioCuts'}</h1>
      <p>Subscription Plan: {tenant?.subscriptionPlan}</p>
      <p>Status: {tenant?.status}</p>
    </header>
  );
}
```

### Example 4: Contact Footer

Use tenant contact info in footers or contact sections:

```tsx
import { useTenantContext } from '@/context/TenantContext';

export function ContactFooter() {
  const { tenant } = useTenantContext();

  if (!tenant) return null;

  return (
    <footer>
      <h3>Contact Us</h3>
      <p>Phone: {tenant.phoneNumber}</p>
      <p>Email: {tenant.email}</p>
      <p>Visit us: {tenant.subdomain}.foliocuts.com</p>
    </footer>
  );
}
```

### Example 5: Settings Page

Display and allow editing of tenant settings:

```tsx
import { useTenantContext } from '@/context/TenantContext';

export function TenantSettings() {
  const { tenant, isLoading, error } = useTenantContext();

  if (isLoading) return <Spinner />;
  if (error) return <Alert>Error: {error.message}</Alert>;
  if (!tenant) return <Alert>No tenant data</Alert>;

  return (
    <div>
      <h1>Business Settings</h1>
      <form>
        <input
          type="text"
          defaultValue={tenant.businessName}
          placeholder="Business Name"
        />
        <input
          type="tel"
          defaultValue={tenant.phoneNumber}
          placeholder="Phone Number"
        />
        <input
          type="email"
          defaultValue={tenant.email}
          placeholder="Email"
        />
        {/* ... */}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
```

## Best Practices

### 1. Always Provide Fallbacks

Always provide fallback values when tenant data might not be available:

```tsx
const displayName = tenant?.businessName || 'FolioCuts';
const displayPhone = tenant?.phoneNumber || 'N/A';
```

### 2. Handle Loading States

Show appropriate loading states while tenant data is being fetched:

```tsx
if (isLoading) {
  return <Skeleton />;
}
```

### 3. Handle Errors Gracefully

Display user-friendly error messages when tenant data fails to load:

```tsx
if (error) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Failed to load business information</AlertTitle>
      <AlertDescription>
        Please try refreshing the page. If the problem persists, contact support.
      </AlertDescription>
    </Alert>
  );
}
```

### 4. Check for Null Tenant

Always check if tenant data exists before using it:

```tsx
if (!tenant) {
  return <div>No business information available</div>;
}

// Safe to use tenant data here
return <div>{tenant.businessName}</div>;
```

### 5. Optional Chaining

Use optional chaining for safer property access:

```tsx
// Good
const name = tenant?.businessName;

// Bad (can throw error if tenant is null)
const name = tenant.businessName;
```

## Common Use Cases

### Where to Use Tenant Context

1. **Sidebar/Header** - Display business name and branding
2. **Invoices/Receipts** - Show business details on payment documents
3. **Email Templates** - Include business contact information
4. **Reports** - Add business details to generated reports
5. **Settings Pages** - Display and edit business settings
6. **Footer** - Show contact information
7. **Customer Communications** - Include business details in messages
8. **Branding** - Use tenant colors, logos, or themes (future enhancement)

### When NOT to Use Tenant Context

1. **Public Pages** - Login, register pages don't need tenant data
2. **Before Authentication** - Tenant data is only available after login
3. **Admin Operations on Multiple Tenants** - Use specific tenant queries instead

## TypeScript Types

All tenant-related types are available from `@/types/tenant`:

```typescript
import type { Tenant, TenantForList, TenantUsers, TenantServices } from '@/types/tenant';
```

## Troubleshooting

### Issue: "useTenantContext must be used within a TenantProvider"

**Solution:** Make sure the component is rendered inside the `TenantProvider`. Check that your component is within the app routes in `App.tsx`.

### Issue: Tenant is always null

**Possible causes:**
1. User is not authenticated - Tenant data only loads after login
2. User doesn't have a `tenantId` - Check that the user object has a valid `tenantId`
3. API endpoint is not returning data - Check backend API and network requests

**Solution:** Verify authentication and check browser console for errors.

### Issue: Tenant data is stale

**Solution:** The tenant data is cached by React Query. To refetch:

```tsx
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Manually refetch tenant data
queryClient.invalidateQueries({ queryKey: ['tenant'] });
```

## API Integration

The Tenant Context automatically fetches data from:

**Endpoint:** `GET /api/tenants/:tenantId`

**Parameters:**
- `tenantId`: Taken from the authenticated user's `tenantId` field
- `userPage`: Default 1
- `userPageSize`: Default 10

**Response:** Returns a `Tenant` object with all business information.

## Future Enhancements

Potential features to add to Tenant Context:

1. **Tenant Branding** - Custom colors, logos, themes
2. **Multi-tenant Support** - Switch between multiple tenants
3. **Tenant Settings** - Update tenant details through context
4. **Tenant Permissions** - Role-based access to tenant features
5. **Tenant Analytics** - Business performance metrics
6. **Tenant Notifications** - Business-specific notifications

## Related Files

- Context: `src/context/TenantContext.tsx`
- Types: `src/types/tenant.ts`
- Service: `src/services/tenantService.ts`
- Hook: `src/hooks/useTenants.ts`
- Example Usage: `src/components/layout/SideBar.tsx`

## Support

For questions or issues with the Tenant Context:

1. Check this documentation
2. Review the example implementations
3. Check the TypeScript types in `src/types/tenant.ts`
4. Examine the context implementation in `src/context/TenantContext.tsx`
