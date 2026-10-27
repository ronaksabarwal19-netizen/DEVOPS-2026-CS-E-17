import { createContext, useContext, useState } from 'react';
import { api, getToken, setToken } from '../utils/api';

const AuthContext = createContext(null);
const USER_KEY = 'bd_current_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return getToken() ? JSON.parse(localStorage.getItem(USER_KEY) || 'null') : null; } catch { return null; }
  });

  async function login(username, password) {
    try {
      const result = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        token: '',
      });
      setToken(result.token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      setUser(result.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Unable to sign in.' };
    }
  }

  async function register(details) {
    try {
      const result = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify(details),
        token: '',
      });
      setToken(result.token);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      setUser(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message || 'Unable to create account.' };
    }
  }

  function logout() {
    setToken('');
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
