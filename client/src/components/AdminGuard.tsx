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
  const [showSecurityPrompt, setShowSecurityPrompt] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const [securityAttempts, setSecurityAttempts] = useState<SecurityAttempt[]>([]);
  const [sessionStartTime] = useState(new Date());
  const [lastActivity, setLastActivity] = useState(new Date());

  // Mock security configurations
  const ADMIN_SECURITY_CODE = '123456'; // في البيئة الحقيقية، يجب أن يكون هذا مشفر ومخزن بشكل آمن
  const MAX_ATTEMPTS = 3;
  const BLOCK_DURATION = 300000; // 5 minutes in milliseconds
  const SESSION_TIMEOUT = 3600000; // 1 hour in milliseconds

  useEffect(() => {
    // Check if user is admin
    if (!isLoading && user && user.role === 'admin') {
      setShowSecurityPrompt(true);
    }

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

  useEffect(() => {
    // Block countdown timer
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setBlockTimeRemaining(prev => prev - 1000);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isBlocked && blockTimeRemaining <= 0) {
      setIsBlocked(false);
      setAttempts(0);
    }
  }, [isBlocked, blockTimeRemaining]);

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

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) return;

    if (securityCode === ADMIN_SECURITY_CODE) {
      logSecurityAttempt(true);
      setShowSecurityPrompt(false);
      setSecurityCode('');
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      logSecurityAttempt(false, 'Invalid security code');

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        setBlockTimeRemaining(BLOCK_DURATION);
      }

      setSecurityCode('');
    }
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

  // Security prompt for admin
  if (showSecurityPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-palestine-green to-blue-500 text-white">
            <CardTitle className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <Key className="h-6 w-6" />
              <span>{language === 'ar' ? 'التحقق الأمني' : 'Security Verification'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Security Info */}
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المستخدم:' : 'User:'}
                  </span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}
                  </span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'الدور:' : 'Role:'}
                  </span>
                  <Badge className="bg-palestine-green text-white">
                    {language === 'ar' ? 'مدير' : 'Admin'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'مدة الجلسة:' : 'Session Duration:'}
                  </span>
                  <span className="font-medium">{getSessionDuration()}</span>
                </div>
              </div>

              {/* Security Alerts */}
              {isBlocked && (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    {language === 'ar' 
                      ? `تم حظر الوصول لمدة ${formatTime(blockTimeRemaining)} بسبب المحاولات الفاشلة`
                      : `Access blocked for ${formatTime(blockTimeRemaining)} due to failed attempts`
                    }
                  </AlertDescription>
                </Alert>
              )}

              {attempts > 0 && !isBlocked && (
                <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                    {language === 'ar' 
                      ? `محاولات فاشلة: ${attempts}/${MAX_ATTEMPTS}`
                      : `Failed attempts: ${attempts}/${MAX_ATTEMPTS}`
                    }
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Security Code Form */}
            <form onSubmit={handleSecuritySubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'ar' ? 'رمز الأمان:' : 'Security Code:'}
                </label>
                <div className="relative">
                  <Input
                    type={showCode ? 'text' : 'password'}
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل رمز الأمان' : 'Enter security code'}
                    className="pr-10"
                    disabled={isBlocked}
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowCode(!showCode)}
                    disabled={isBlocked}
                  >
                    {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' 
                    ? 'أدخل الرمز المكون من 6 أرقام للوصول إلى لوحة التحكم'
                    : 'Enter the 6-digit code to access the dashboard'
                  }
                </p>
              </div>

              <div className="flex space-x-3 rtl:space-x-reverse">
                <Button
                  type="submit"
                  className="flex-1 bg-palestine-green hover:bg-palestine-green-dark"
                  disabled={!securityCode || securityCode.length !== 6 || isBlocked}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'تحقق' : 'Verify'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onNavigate('home')}
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </form>

            {/* Recent Security Attempts */}
            {securityAttempts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'المحاولات الأخيرة:' : 'Recent Attempts:'}
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {securityAttempts.slice(0, 3).map((attempt) => (
                    <div
                      key={attempt.id}
                      className={`text-xs p-2 rounded border ${
                        attempt.success
                          ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                          : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>
                          {attempt.success 
                            ? (language === 'ar' ? 'نجحت' : 'Success')
                            : (language === 'ar' ? 'فشلت' : 'Failed')
                          }
                        </span>
                        <span>{attempt.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                {language === 'ar' ? 'نصائح أمنية:' : 'Security Tips:'}
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• {language === 'ar' ? 'لا تشارك رمز الأمان مع أي شخص' : 'Never share your security code'}</li>
                <li>• {language === 'ar' ? 'قم بتسجيل الخروج عند الانتهاء' : 'Always log out when finished'}</li>
                <li>• {language === 'ar' ? 'استخدم شبكة آمنة' : 'Use a secure network connection'}</li>
              </ul>
            </div>
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