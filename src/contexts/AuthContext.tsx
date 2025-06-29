import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (provider: 'facebook' | 'discord' | 'google') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (provider: 'facebook' | 'discord' | 'google') => {
    setLoading(true);
    try {
      // Simulate authentication process
      // In a real app, you would integrate with Auth0, Firebase, or your own auth service
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: `user@${provider}.com`,
        name: `User from ${provider}`,
        picture: `https://via.placeholder.com/150/3b82f6/ffffff?text=${provider.charAt(0).toUpperCase()}`,
        provider,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 