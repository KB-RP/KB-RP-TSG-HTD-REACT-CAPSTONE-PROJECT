import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { useAuth } from './contexts';

/* ---------------- mocks ---------------- */

jest.mock('./contexts', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }) => <>{children}</>,
}));

jest.mock('./components/common/adminRoute', () => ({
  AdminRoute: ({ children }) => <>{children}</>,
}));

// lazy-loaded pages
jest.mock('./pages/signIn', () => () => <div>Sign In Page</div>);
jest.mock('./pages/signUp', () => () => <div>Sign Up Page</div>);
jest.mock('./pages/dashboard', () => () => <div>Dashboard Home</div>);
jest.mock('./pages/myCourses', () => () => <div>My Courses</div>);
jest.mock('./pages/adminSettings', () => () => <div>Admin Settings</div>);
jest.mock('./pages/layout', () => {
  const React = require('react');
  const { Outlet } = require('react-router-dom');
  return () => (
    <div>
      Layout
      <Outlet />
    </div>
  );
});
jest.mock('./pages/CourseDetail', () => () => <div>Course Detail</div>);

/* ---------------- helper ---------------- */

const renderAtRoute = (route) => {
  window.history.pushState({}, 'Test page', route);
  return render(<App />);
};

/* ---------------- tests ---------------- */

describe('App routing & lazy loading', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading fallback when auth is loading', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
    });

    renderAtRoute('/dashboard');

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('redirects unauthenticated user to signin', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    renderAtRoute('/dashboard');

    expect(await screen.findByText('Sign In Page')).toBeInTheDocument();
  });

  test('allows authenticated user to access dashboard', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    renderAtRoute('/dashboard');

    expect(await screen.findByText('Layout')).toBeInTheDocument();
    expect(await screen.findByText('Dashboard Home')).toBeInTheDocument();
  });

  test('public route redirects authenticated user away from signin', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    renderAtRoute('/signin');

    expect(await screen.findByText('Dashboard Home')).toBeInTheDocument();
  });

  test('allows unauthenticated user to see signin page', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    renderAtRoute('/signin');

    expect(await screen.findByText('Sign In Page')).toBeInTheDocument();
  });

  test('renders signup page', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    renderAtRoute('/signup');

    expect(await screen.findByText('Sign Up Page')).toBeInTheDocument();
  });

  test('renders admin settings for authenticated user', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    renderAtRoute('/dashboard/admin-settings');

    expect(await screen.findByText('Admin Settings')).toBeInTheDocument();
  });

  test('renders course detail page for authenticated user', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    renderAtRoute('/courses/123');

    expect(await screen.findByText('Course Detail')).toBeInTheDocument();
  });

  test('unknown route redirects to signin', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    renderAtRoute('/random');

    expect(await screen.findByText('Sign In Page')).toBeInTheDocument();
  });
});
