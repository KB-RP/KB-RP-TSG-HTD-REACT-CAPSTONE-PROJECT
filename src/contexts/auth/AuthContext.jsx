import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../../utils/api/authAPI';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
          // Set the token in your API client if needed
          // authAPI.setAuthToken(token);
        }
      } catch (err) {
        console.error('Failed to load auth state:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authAPI.login(credentials);
      
      // Store the token and user data in localStorage
      localStorage.setItem('token', userData.accessToken);
      localStorage.setItem('user', JSON.stringify(userData.user));
      setUser(userData.user);
      setUser(userData.user || userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authAPI.register(userData);
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
