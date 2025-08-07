import React, { useEffect, useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Main from './components/Main';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Evaluate from './pages/Evaluate';
import Purchase from './pages/Purchase';
import Product from './pages/Products';
import Supplier from './pages/Suppliers';
import Department from './pages/Departments';
import PurchaseList from './pages/PurchaseList';
import EvaluateList from './pages/EvaluateList';
import Damage from './pages/Damage';
import Inventory from './pages/Inventory';
import Maintenance from './pages/Maintenance';
import ProductSupplier from './pages/ProductSupplier';
import DepartmentRequest from './pages/DepartmentRequest';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';

// API Base URL - Consistent across all requests
const API_BASE_URL = 'http://localhost:5000';

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    console.log('🔍 checkAuth called');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response headers:', response.headers);
      
      const data = await response.json();
      console.log('🔍 Response data:', data);
  
      if (response.ok) {
        if (data.success && data.authenticated) {
          console.log('✅ User authenticated:', data.user);
          setUser(data.user);
        } else {
          console.log('❌ User not authenticated');
          setUser(null);
        }
      } else {
        console.log('❌ Bad response:', response.status);
        setUser(null);
      }
    } catch (error) {
      console.error('💥 Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log('🔍 Login attempt:', email);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('🔍 Login response status:', response.status);
      console.log('🔍 Login response headers:', response.headers);
      
      const data = await response.json();
      console.log('🔍 Login response data:', data);

      if (data.success) {
        console.log('✅ Login successful, setting user:', data.user);
        setUser(data.user);
        
        // Immediately check auth after successful login
        setTimeout(() => {
          console.log('🔍 Re-checking auth after login...');
          checkAuth();
        }, 100);
        
        return { success: true };
      } else {
        console.log('❌ Login failed:', data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    console.log('🔍 Starting logout process...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🔍 Logout response:', response.status);
    } catch (error) {
      console.error('💥 Logout error:', error);
    } finally {
      console.log('🔍 Setting user to null...');
      setUser(null);
      
      // Don't immediately check auth after logout!
      console.log('🔍 Logout complete - NOT checking auth');
    }
  };

  const updateUser = (updatedUser) => {
    console.log('🔍 Updating user:', updatedUser);
    setUser(updatedUser);
  };

  // Check auth on component mount
  useEffect(() => {
    console.log('🔍 AuthProvider mounted, checking auth...');
    checkAuth();
  }, []);

  // Debug user state changes
  useEffect(() => {
    console.log('🔍 User state changed:', user ? `${user.email} (${user.is_admin ? 'admin' : 'user'})` : 'null');
  }, [user]);

  const value = {
    user,
    login,
    logout,
    updateUser,
    checkAuth, // Expose checkAuth for manual refresh
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  console.log('🔍 ProtectedRoute check:', { isAuthenticated, loading, userEmail: user?.email });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-2 text-white-600">Checking authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ User authenticated, showing protected content');
  return children;
};

// Admin Route wrapper component
const AdminRoute = ({ children }) => {
  const { isAdmin, loading, isAuthenticated, user } = useAuth();

  console.log('🔍 AdminRoute check:', { isAdmin, loading, isAuthenticated, userEmail: user?.email });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-2 text-white-600">Checking admin access...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ User not authenticated for admin route');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log('❌ User not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ Admin access granted');
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        >
          {/* Default route - redirect to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard Route */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Profile Route */}
          <Route path="profile" element={<Profile />} />

          {/* Admin Only Routes */}
          <Route 
            path="users" 
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } 
          />
          
          {/* Evaluate Route */}
          <Route path="evaluate" element={<Evaluate />} />

          {/* EvaluateList Route */}
          <Route path="evaluate-list" element={<EvaluateList />} />

          {/* Damage Route */}
          <Route path="damage" element={<Damage />} />

          {/* Purchase Route */}
          <Route path="purchase-request" element={<Purchase />} />

          {/* PurchaseList Route */}
          <Route path="purchase-request-list" element={<PurchaseList />} />

          {/* Inventory Route */}
          <Route path="inventory" element={<Inventory />} />

          {/* Maintenance Route */}
          <Route path="maintenance" element={<Maintenance />} />

          {/* ProductSupplier Route */}
          <Route path="product-supplier" element={<ProductSupplier />} />

          {/* Products Route */}
          <Route path="products" element={<Product />} />

          {/* Supplier Route */}
          <Route path="suppliers" element={<Supplier />} />

          {/* Departments Route */}
          <Route path="departments" element={<Department />} />
          
          {/* Department Request Route */}
          <Route path="department-request" element={<DepartmentRequest />} />
        </Route>

        {/* Redirect all ologout ther paths to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;