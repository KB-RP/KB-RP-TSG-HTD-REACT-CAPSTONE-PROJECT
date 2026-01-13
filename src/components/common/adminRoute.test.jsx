import React from 'react';
import { render, screen } from '@testing-library/react';

import { AdminRoute } from './adminRoute';
import { useAuth } from '../../contexts';

jest.mock('../../contexts', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Navigate: (props) => (
      <div data-testid="navigate" data-to={props.to} data-replace={String(!!props.replace)} />
    ),
  };
});

describe('AdminRoute', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders children when user is admin', () => {
    useAuth.mockReturnValue({ user: { role: 'admin' } });

    render(
      <AdminRoute>
        <div>admin-content</div>
      </AdminRoute>
    );

    expect(screen.getByText('admin-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  test('redirects to /dashboard when user is not admin', () => {
    useAuth.mockReturnValue({ user: { role: 'student' } });

    render(
      <AdminRoute>
        <div>admin-content</div>
      </AdminRoute>
    );

    const nav = screen.getByTestId('navigate');
    expect(nav).toHaveAttribute('data-to', '/dashboard');
    expect(nav).toHaveAttribute('data-replace', 'true');
  });

  test('redirects to /dashboard when user is missing', () => {
    useAuth.mockReturnValue({ user: null });

    render(
      <AdminRoute>
        <div>admin-content</div>
      </AdminRoute>
    );

    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/dashboard');
  });
});
