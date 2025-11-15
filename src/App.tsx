import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import Dashboard from './pages/Dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/Login'
import Register from './pages/Register'
import { NotificationProvider } from './context/NotificationContext'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Toaster } from './components/ui/sonner'

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

              {/* Example: Admin-only route */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <div>Admin Panel</div>
                  </ProtectedRoute>
                }
              />

              {/* Example: Owner/Admin routes */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN", "OWNER"]}>
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
