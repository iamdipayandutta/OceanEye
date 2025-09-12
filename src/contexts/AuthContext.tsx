import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'analyst' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'citizen' | 'analyst') => Promise<void>;
  logout: () => void;
  loading: boolean;
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
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on email
      let mockUser: User;
      if (email.includes('admin')) {
        mockUser = {
          id: '1',
          name: 'Admin User',
          email: email,
          role: 'admin'
        };
      } else if (email.includes('analyst')) {
        mockUser = {
          id: '2',
          name: 'Dr. Sarah Chen',
          email: email,
          role: 'analyst'
        };
      } else {
        mockUser = {
          id: '3',
          name: 'Local Citizen',
          email: email,
          role: 'citizen'
        };
      }
      
      setUser(mockUser);
      localStorage.setItem('oceaneye_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'citizen' | 'analyst'): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role
      };
      
      setUser(newUser);
      localStorage.setItem('oceaneye_user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oceaneye_user');
  };

  // Initialize auth state from localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem('oceaneye_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('oceaneye_user');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};