import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts';
import { AdminRoute } from './components/common/adminRoute';
import { Spin } from 'antd';

const SignIn = lazy(() => import('./pages/signIn'));
const SignUp = lazy(() => import('./pages/signUp'));
const DashboardHome = lazy(() => import('./pages/dashboard'));
const MyCourses = lazy(() => import('./pages/myCourses'));
const AdminSettings = lazy(() => import('./pages/adminSettings'));
const Layout = lazy(() => import('./pages/layout'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));

const LoadingFallback = () => (
  <div
      role="status"
    aria-live="polite"
    style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Spin size="large" tip="Loading content…" />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingFallback />;

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children || <Outlet />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children || <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* 2. Wrap Routes in Suspense to handle the loading state */}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />

            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<DashboardHome />} />
                <Route path="my-course" element={<MyCourses />} />
                <Route
                  path="admin-settings"
                  element={
                    <AdminRoute>
                      <AdminSettings />
                    </AdminRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
              <Route path="/courses/:id" element={<CourseDetail />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;