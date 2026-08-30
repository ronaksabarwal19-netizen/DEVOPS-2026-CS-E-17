import { createContext, useContext, useState } from 'react';
import { getItem, setItem, KEYS } from '../utils/localStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getItem(KEYS.CURRENT_USER));

  function login(id, password) {
    const users = getItem(KEYS.USERS, []);
    const found = users.find((u) => u.id === id && u.password === password);
    if (!found) return { success: false, error: 'Invalid ID or password' };

    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      loggedIn: true,
    };
    setItem(KEYS.CURRENT_USER, sessionUser);
    setUser(sessionUser);
    return { success: true };
  }

  function logout() {
    localStorage.removeItem(KEYS.CURRENT_USER);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
