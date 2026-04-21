import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('study_user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());
        
        const backendRes = await api.post('/auth/google', {
            idToken: tokenResponse.access_token
        });
        
        const userData = {
            id: backendRes.data.id || userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
            avatar: userInfo.picture,
            token: backendRes.data.token
        };
        setUser(userData);
        localStorage.setItem('study_user', JSON.stringify(userData));
        toast.success(`Welcome back, ${userInfo.name}! ready to master some subjects?`);
      } catch (err) {
        console.error("Login failed:", err);
        toast.error("Authentication failed. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('study_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login: loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
