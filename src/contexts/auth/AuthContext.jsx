import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI } from '../../utils/api/authAPI';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const bootstrap = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      const profile = await authAPI.getProfile();
      setUser(profile || null);
    } catch (e) {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      setLoading(true);
      await bootstrap();
      if (!mounted) return;
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [bootstrap]);

  const login = useCallback(async (credentials) => {
    const result = await authAPI.login(credentials);
    if (result?.user) setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      setUser,
    }),
    [user, loading, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
