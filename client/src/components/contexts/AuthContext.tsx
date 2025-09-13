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
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('palestine-pulse-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('palestine-pulse-user');
      }
    }
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
      localStorage.setItem('palestine-pulse-user', JSON.stringify(foundUser));
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
    localStorage.setItem('palestine-pulse-user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('palestine-pulse-user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('palestine-pulse-user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isLoading,
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