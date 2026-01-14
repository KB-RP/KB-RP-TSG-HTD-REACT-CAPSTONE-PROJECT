import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authAPI } from '../../../utils/api/authAPI';

jest.mock('../../../utils/api/authAPI');

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  /* ----------------------- Test Component ----------------------- */
  const TestComponent = () => {
    const {
      user,
      loading,
      error,
      isAuthenticated,
      login,
      logout,
      register,
    } = useAuth();

    const handleLogin = async () => {
      try {
        await login({ email: 'test@test.com', password: 'password' });
      } catch (_) {}
    };

    const handleRegister = async () => {
      try {
        await register({ email: 'new@test.com', password: 'password' });
      } catch (_) {}
    };

    return (
      <div>
        <div data-testid="user">{JSON.stringify(user)}</div>
        <div data-testid="loading">{loading.toString()}</div>
        <div data-testid="error">{error}</div>
        <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>

        <button data-testid="login-btn" onClick={handleLogin}>
          Login
        </button>

        <button data-testid="register-btn" onClick={handleRegister}>
          Register
        </button>

        <button data-testid="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    );
  };

  const renderWithProvider = () =>
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

  /* ----------------------- Bootstrap ----------------------- */
  it('loads user from localStorage on init', async () => {
    const mockUser = { id: 1, email: 'test@test.com' };
    localStorage.setItem('token', 'token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify(mockUser)
      );
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
    });
  });

  it('handles corrupted localStorage gracefully', async () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('user', '{invalid-json');

    renderWithProvider();

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(null);
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });
  });

  /* ----------------------- Login ----------------------- */
  it('logs in successfully and sets user', async () => {
    const mockUser = { id: 1, email: 'test@test.com' };

    authAPI.login.mockResolvedValue({
      accessToken: 'token',
      user: mockUser,
    });

    renderWithProvider();

    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    expect(authAPI.login).toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBe('token');
    expect(screen.getByTestId('user')).toHaveTextContent(
      JSON.stringify(mockUser)
    );
  });

  it('handles login failure safely', async () => {
    authAPI.login.mockRejectedValue(new Error('Login failed'));

    renderWithProvider();

    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Login failed');
    });
  });

  /* ----------------------- Register ----------------------- */
  it('registers successfully', async () => {
    authAPI.register.mockResolvedValue({ success: true });

    renderWithProvider();

    await act(async () => {
      screen.getByTestId('register-btn').click();
    });

    expect(authAPI.register).toHaveBeenCalled();
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('handles register failure safely', async () => {
    authAPI.register.mockRejectedValue(new Error('Registration failed'));

    renderWithProvider();

    await act(async () => {
      screen.getByTestId('register-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(
        'Registration failed'
      );
    });
  });

  /* ----------------------- Logout ----------------------- */
  it('logs out and clears storage', async () => {
    const mockUser = { id: 1 };
    localStorage.setItem('token', 'token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    renderWithProvider();

    await act(async () => {
      screen.getByTestId('logout-btn').click();
    })

    expect(localStorage.getItem('token')).toBe(null);
    expect(screen.getByTestId('user')).toHaveTextContent('null');
  });

  /* ----------------------- Hook Guard ----------------------- */
  it('throws error when useAuth is used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const BrokenComponent = () => {
      useAuth();
      return null;
    };

    expect(() => render(<BrokenComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    spy.mockRestore();
  });
});
