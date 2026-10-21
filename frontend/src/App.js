
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page Components
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import AddProperty from './pages/AddProperty';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const SiteFrame = ({ children }) => {
  const { pathname } = useLocation();
  const isAuthPage = ['/login', '/register', '/admin/login'].includes(pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  const appContent = (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PropertyProvider>
          <Router>
            <SiteFrame>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  
                  {/* Auth Routes (only accessible when not logged in) */}
                  <Route path="/login" element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } />
                  <Route path="/register" element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  } />
                  <Route path="/admin/login" element={
                    <PublicRoute>
                      <AdminLogin />
                    </PublicRoute>
                  } />
                  
                  {/* Public property browsing and contact routes */}
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/:id" element={<PropertyDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* User specific protected routes */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/add-property" element={
                    <ProtectedRoute requiredRole={['seller', 'admin']}>
                      <AddProperty />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/*" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes (require admin role) */}
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/*" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* 404 Page */}
                  <Route path="*" element={
                    <div className="container-custom section text-center">
                      <div className="max-w-md mx-auto">
                        <h1 className="heading-2 mb-4">404 - Page Not Found</h1>
                        <p className="text-gray-600 mb-8">
                          The page you're looking for doesn't exist.
                        </p>
                        <a href="/" className="btn btn-primary">
                          Go Home
                        </a>
                      </div>
                    </div>
                  } />
                </Routes>
            </SiteFrame>
            
            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              className="z-50"
            />
          </Router>
        </PropertyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );

  return appContent;
}

export default App;