import React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authAPI } from '../../../utils/api/authAPI';

// Mock the authAPI
jest.mock('../../../utils/api/authAPI');
jest.spyOn(Storage.prototype, 'getItem');
jest.spyOn(Storage.prototype, 'removeItem');

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, isAuthenticated, login, logout } = useAuth();
  const [loginError, setLoginError] = React.useState(null);
  const [logoutError, setLogoutError] = React.useState(null);

  const handleLogin = async () => {
    try {
      await login({ email: 'test@test.com', password: 'password' });
    } catch (error) {
      setLoginError(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      setLogoutError(error);
    }
  };

  return (
    <div>
      <div data-testid="user">{JSON.stringify(user)}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
      {loginError && <div data-testid="login-error">{loginError.message}</div>}
      {logoutError && <div data-testid="logout-error">{logoutError.message}</div>}
      <button onClick={handleLogin} data-testid="login-button">
        Login
      </button>
      <button onClick={handleLogout} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
};

const renderAuthProvider = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('bootstrap', () => {
    it('should set user to null when no token exists', async () => {
      localStorage.getItem.mockReturnValue(null);
      renderAuthProvider();
      
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });
    });

    it('should set user when token exists and getProfile succeeds', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      localStorage.getItem.mockReturnValue('test-token');
      authAPI.getProfile.mockResolvedValue(mockUser);
      
      renderAuthProvider();
      
      await waitFor(() => {
        expect(authAPI.getProfile).toHaveBeenCalled();
        expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });
    });

    it('should handle getProfile error by removing token and setting user to null', async () => {
      localStorage.getItem.mockReturnValue('invalid-token');
      authAPI.getProfile.mockRejectedValue(new Error('Invalid token'));
      
      renderAuthProvider();
      
      await waitFor(() => {
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        expect(screen.getByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      });
    });
  });

  describe('login', () => {
    it('should update user state on successful login', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      authAPI.login.mockResolvedValue({ user: mockUser });
      
      renderAuthProvider();
      
      await act(async () => {
        screen.getByTestId('login-button').click();
      });
      
      expect(authAPI.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password'
      });
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });

    it('should handle login error', async () => {
      const error = new Error('Login failed');
      authAPI.login.mockRejectedValue(error);
      
      renderAuthProvider();
      
      await act(async () => {
        screen.getByTestId('login-button').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toHaveTextContent('Login failed');
      });
    });
  });

  describe('logout', () => {
    it('should clear user state and token on logout', async () => {
      authAPI.logout.mockResolvedValue();
      
      renderAuthProvider();
      
      await act(async () => {
        screen.getByTestId('logout-button').click();
      });
      
      expect(authAPI.logout).toHaveBeenCalled();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });

    it('should still clear user state even if logout API fails', async () => {
      const error = new Error('Network error');
      authAPI.logout.mockRejectedValue(error);
      
      renderAuthProvider();
      
      await act(async () => {
        screen.getByTestId('logout-button').click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('logout-error')).toHaveTextContent('Network error');
      });
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });
  });

  describe('useAuth', () => {
    it('should throw an error when used outside of AuthProvider', () => {
      const originalError = console.error;
      console.error = jest.fn();
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');
      
      console.error = originalError;
    });
  });
});