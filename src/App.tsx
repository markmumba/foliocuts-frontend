import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Dashboard from './pages/Dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/Login'
import Register from './pages/Register'
import { NotificationProvider } from './context/NotificationContext'
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
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </NotificationProvider>
    </QueryClientProvider>
  )
}

export default App
