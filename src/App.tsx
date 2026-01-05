import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import Dashboard from './pages/common/Dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Register from './pages/auth/register'
import { NotificationProvider } from './context/NotificationContext'
import { AuthProvider } from './context/AuthContext'
import { TenantProvider } from './context/TenantContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Toaster } from './components/ui/sonner'
import { ThemeProvider } from './components/theme-provider'
import ServiceType from './pages/services/service-type'
import CreateService from './pages/services/create-service'
import { Role } from './types/enums'
import SingleService from './pages/services/single-service'
import ServiceTypeServices from './pages/services/service-type-services'
import Services from './pages/services/services'
import Staff from './pages/staff/staff'
import CreateStaff from './pages/staff/create-staff'
import Records from './pages/records/records'
import CreateRecord from './pages/records/create-record'
import SingleRecord from './pages/records/single-record'
import SubscriptionPlanTemplate from './pages/subscription/subscription-template'
import CreateSubscriptionPlanTemplate from './pages/subscription/create-subscription'
import EditSubscriptionTemplate from './pages/subscription/edit-subscription-template'
import Tenant from './pages/tenant/tenant'
import Settings from './pages/common/settings'
import SingleTenant from './pages/tenant/singletenant'
import MyShop from './pages/tenant/myshop'
import Login from './pages/auth/login'
import Customer from './pages/customers/customer'
import SingleCustomer from './pages/customers/single-customer'
import Reports from './pages/reports/reports'



function App() {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          const status = (error as unknown as { response?: { status: number } })?.response?.status
          if (status === 401 || status === 403) return false;
          return failureCount < 1;
        },
      },
      mutations: {
        retry: false,
      }
    }
  })

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TenantProvider>
            <NotificationProvider>
              <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/my-shop"
                element={
                  <ProtectedRoute allowedRoles={[Role.OWNER]}>
                    <MyShop />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/tenants"
                element={
                  <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                    <Tenant />
                  </ProtectedRoute>
                }
              >
                <Route
                  path=":tenantId"
                  element={
                    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.OWNER, Role.RECEPTIONIST]}>
                      <SingleTenant />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route
                path="/dashboard/staff"
                element={
                  <ProtectedRoute allowedRoles={[Role.OWNER]}>
                    <Staff />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="create"
                  element={
                    <ProtectedRoute allowedRoles={[Role.ADMIN, Role.OWNER]} requireLayout={false}>
                      <CreateStaff />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="/dashboard/service-types"
                element={
                  <ProtectedRoute allowedRoles={[Role.ADMIN, Role.OWNER, Role.RECEPTIONIST]}>
                    <ServiceType />
                  </ProtectedRoute>
                }
              >
                <Route
                  path=":serviceTypeId/services"
                  element={
                    <ProtectedRoute allowedRoles={[Role.OWNER, Role.RECEPTIONIST, Role.ADMIN]} requireLayout={false}>
                      <ServiceTypeServices />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="/dashboard/services"
                element={
                  <ProtectedRoute allowedRoles={[Role.OWNER, Role.RECEPTIONIST]}>
                    <Services />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="new"
                  element={
                    <ProtectedRoute allowedRoles={[Role.OWNER]} requireLayout={false}>
                      <CreateService />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path=":serviceId"
                  element={
                    <ProtectedRoute allowedRoles={[Role.OWNER, Role.RECEPTIONIST, Role.ADMIN]} requireLayout={false}>
                      <SingleService />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="/dashboard/customers"
                element={
                  <ProtectedRoute allowedRoles={[Role.OWNER, Role.RECEPTIONIST]}>
                    <Customer />
                  </ProtectedRoute>
                }
              >
                <Route
                  path=":customerId"
                  element={
                    <ProtectedRoute allowedRoles={[Role.OWNER, Role.RECEPTIONIST]} requireLayout={false}>
                      <SingleCustomer />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="/dashboard/records"
                element={
                  <ProtectedRoute allowedRoles={[Role.OWNER,Role.RECEPTIONIST]}>
                    <Records />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="create"
                  element={
                    <ProtectedRoute allowedRoles={[Role.OWNER,Role.RECEPTIONIST]} requireLayout={false}>
                      <CreateRecord />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path=":recordId"
                  element={
                    <ProtectedRoute allowedRoles={[Role.OWNER,Role.RECEPTIONIST]} requireLayout={false}>
                      <SingleRecord />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="/dashboard/subscription-templates"
                element={
                  <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                    <SubscriptionPlanTemplate />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="new"
                  element={
                    <ProtectedRoute allowedRoles={[Role.ADMIN]} requireLayout={false}>
                      <CreateSubscriptionPlanTemplate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path=":templateId/edit"
                  element={
                    <ProtectedRoute allowedRoles={[Role.ADMIN]} requireLayout={false}>
                      <EditSubscriptionTemplate />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute allowedRoles={[Role.ADMIN, Role.OWNER]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/reports"
                element={
                  <ProtectedRoute allowedRoles={[Role.OWNER]}>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </NotificationProvider>
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
