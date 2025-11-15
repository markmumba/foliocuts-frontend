import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import Dashboard from './pages/Dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { NotificationProvider } from './context/NotificationContext'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Toaster } from './components/ui/sonner'
import ServiceType from './pages/services/ServiceType'
import Services from './pages/services/services'
import CreateService from './pages/services/CreateService'
import { Role } from './types/enums'
import SingleService from './pages/services/SingleService'



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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
                path="/dashboard/service-types"
                element={
                  <ProtectedRoute allowedRoles={[Role.ADMIN, Role.OWNER]}>
                    <ServiceType />
                  </ProtectedRoute>
                }
              />
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

              {/* Example: Admin-only route */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                    <div>Admin Panel</div>
                  </ProtectedRoute>
                }
              />

              {/* Example: Owner/Admin routes */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={[Role.ADMIN, Role.OWNER]}>
                    <div>Settings</div>
                  </ProtectedRoute>
                }
              />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
