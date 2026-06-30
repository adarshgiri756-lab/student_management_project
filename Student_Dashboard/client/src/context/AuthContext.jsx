import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { changePassword, getCurrentUser, loginUser, logoutUser } from '../services/authService';
import { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Token may already be expired; local cleanup is still the desired outcome.
    }
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  const updatePassword = (payload) => changePassword(payload);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, logout, updatePassword }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
