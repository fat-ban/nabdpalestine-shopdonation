import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  joinedDate: string;
  location?: string;
  donationTotal?: number;
  purchaseTotal?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock users for demonstration
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'admin@palestine-pulse.com',
      role: 'admin',
      joinedDate: '2024-01-15',
      location: 'رام الله، فلسطين',
      donationTotal: 5000,
      purchaseTotal: 2500
    },
    {
      id: '2',
      name: 'فاطمة أحمد',
      email: 'user@example.com',
      role: 'user',
      joinedDate: '2024-03-20',
      location: 'غزة، فلسطين',
      donationTotal: 1200,
      purchaseTotal: 800
    }
  ];

  useEffect(() => {
    // We are no longer persisting auth state in localStorage to treat it like a session.
    // A page refresh will log the user out.
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      // No longer persisting to localStorage
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
      joinedDate: new Date().toISOString().split('T')[0],
      donationTotal: 0,
      purchaseTotal: 0
    };
    
    setUser(newUser);
    // No longer persisting to localStorage
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    // No longer removing from localStorage
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      // No longer persisting to localStorage
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}