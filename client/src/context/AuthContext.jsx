import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

// 1. Create the context itself — an empty "box" that will hold our auth data
const AuthContext = createContext();

// 2. Create a Provider component — this wraps your app and supplies the actual data
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // null means "not logged in yet / unknown"
  const [loading, setLoading] = useState(true);  // true while we're checking login status

  // On app load, check if the user is already logged in (valid cookie from a previous visit)
  useEffect(() => {
    axiosInstance.get('/auth/me')
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null); // no valid session — that's fine, just means logged out
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    axiosInstance.post('/auth/logout')
      .then(() => {
        setUser(null);
      })
      .catch((err) => {
        console.error('Logout failed', err);
      });
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. A custom hook — a shortcut so components don't need to import useContext + AuthContext separately
export function useAuth() {
  return useContext(AuthContext);
}