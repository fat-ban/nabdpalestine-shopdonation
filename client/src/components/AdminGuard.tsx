import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Lock, Key, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface AdminGuardProps {
  children: React.ReactNode;
  onNavigate: (page: any) => void;
}

interface SecurityAttempt {
  id: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
  success: boolean;
}

export function AdminGuard({ children, onNavigate }: AdminGuardProps) {
  const { user, isLoading } = useAuth();
  const { language } = useTheme();
  
  // Security prompt is no longer shown, so this state is not needed.
  // const [showSecurityPrompt, setShowSecurityPrompt] = useState(false);

  const [securityAttempts, setSecurityAttempts] = useState<SecurityAttempt[]>([]);
  const [sessionStartTime] = useState(new Date());
  const [lastActivity, setLastActivity] = useState(new Date());

  // Mock security configurations
  const SESSION_TIMEOUT = 3600000; // 1 hour in milliseconds

  useEffect(() => {
    // Track user activity
    const trackActivity = () => {
      setLastActivity(new Date());
    };

    // Session timeout check
    const sessionCheck = setInterval(() => {
      const now = new Date();
      const timeSinceLastActivity = now.getTime() - lastActivity.getTime();
      
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        handleSessionTimeout();
      }
    }, 60000); // Check every minute

    // Add activity listeners
    document.addEventListener('click', trackActivity);
    document.addEventListener('keypress', trackActivity);
    document.addEventListener('scroll', trackActivity);

    return () => {
      clearInterval(sessionCheck);
      document.removeEventListener('click', trackActivity);
      document.removeEventListener('keypress', trackActivity);
      document.removeEventListener('scroll', trackActivity);
    };
  }, [user, isLoading, lastActivity]);

  const handleSessionTimeout = () => {
    // Log security event
    logSecurityAttempt(false, 'Session timeout');
    
    // Redirect to login
    onNavigate('login');
  };

  const logSecurityAttempt = (success: boolean, reason?: string) => {
    const attempt: SecurityAttempt = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ip: '192.168.1.100', // Mock IP
      userAgent: navigator.userAgent,
      success,
    };

    setSecurityAttempts(prev => [attempt, ...prev.slice(0, 9)]); // Keep last 10 attempts
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSessionDuration = () => {
    const now = new Date();
    const duration = now.getTime() - sessionStartTime.getTime();
    return formatTime(duration);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-palestine-green text-white rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Shield className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-48 mx-auto animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-32 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-palestine-red to-palestine-green text-white">
            <CardTitle className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <AlertTriangle className="h-6 w-6" />
              <span>{language === 'ar' ? 'وصول غير مسموح' : 'Access Denied'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'يجب تسجيل الدخول للوصول إلى لوحة تحكم الإدارة'
                : 'You must be logged in to access the admin dashboard'
              }
            </p>
            <Button 
              onClick={() => onNavigate('login')}
              className="w-full bg-palestine-green hover:bg-palestine-green-dark"
            >
              <Lock className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not admin
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-palestine-red to-orange-500 text-white">
            <CardTitle className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <Shield className="h-6 w-6" />
              <span>{language === 'ar' ? 'صلاحيات غير كافية' : 'Insufficient Permissions'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'ليس لديك الصلاحيات اللازمة للوصول إلى لوحة تحكم الإدارة'
                  : 'You do not have the necessary permissions to access the admin dashboard'
                }
              </p>
              <Badge variant="secondary" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                {language === 'ar' ? `الدور الحالي: ${user.role}` : `Current Role: ${user.role}`}
              </Badge>
            </div>
            <Button 
              onClick={() => onNavigate('home')}
              className="w-full bg-palestine-green hover:bg-palestine-green-dark"
            >
              {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success - render protected content
  return (
    <div className="admin-protected">
      {/* Security Status Bar */}
      <div className="bg-gradient-to-r from-palestine-green to-blue-500 text-white text-xs py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Shield className="h-3 w-3" />
              <span>{language === 'ar' ? 'جلسة محمية' : 'Secure Session'}</span>
            </div>
            <div className="h-3 w-px bg-white/30"></div>
            <span>{language === 'ar' ? `المدة: ${getSessionDuration()}` : `Duration: ${getSessionDuration()}`}</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span>{language === 'ar' ? `مرحباً، ${user.name}` : `Welcome, ${user.name}`}</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
}
