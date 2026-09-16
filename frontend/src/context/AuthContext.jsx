import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return localStorage.getItem('med_inventory_auth') === 'true';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('med_inventory_auth', String(isAuthenticated));
    }
  }, [isAuthenticated]);

  const login = (username, password) => {
    if (username === 'pharmacist' && password === 'med123') {
      setIsAuthenticated(true);
      return true;
    }

    setIsAuthenticated(false);
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
