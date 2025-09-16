import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import logoImage from '../../assets/logo.png';

interface RegisterPageProps {
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'news' | 'support' | 'login' | 'register' | 'dashboard' | 'profile') => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  
  const { register, isLoading } = useAuth();
  const { language } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError(language === 'ar' ? 'جميع الحقول مطلوبة' : 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    if (!agreeToTerms) {
      setError(language === 'ar' ? 'يجب الموافقة على الشروط والأحكام' : 'You must agree to the terms and conditions');
      return;
    }

    const success = await register(name, email, password);
    if (success) {
      onNavigate('home');
    } else {
      setError(language === 'ar' ? 'حدث خطأ أثناء إنشاء الحساب' : 'Error creating account');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Background Image Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1643052599840-f2598b82ba8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxlc3RpbmUlMjBqZXJ1c2FsZW0lMjBtb3NxdWUlMjB0cmFkaXRpb25hbCUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NTc1NDUxMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Jerusalem Traditional Architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-palestine-green/60 via-palestine-black/40 to-palestine-red/60"></div>
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center text-white">
            <div className="mb-8">
              <img 
                src={logoImage}
                alt="Palestine Pulse Logo"
                className="h-20 w-20 mx-auto mb-4 logo-hero animate-dome-glow"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-shadow-lg">
              {language === 'ar' ? 'انضم إلى عائلة نبض فلسطين' : 'Join the Palestine Pulse Family'}
            </h2>
            <p className="text-lg opacity-90 text-shadow max-w-md">
              {language === 'ar' 
                ? 'كن جزءاً من حركة التضامن الرقمي وساهم في دعم القضية الفلسطينية'
                : 'Be part of the digital solidarity movement and help support the Palestinian cause'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Register Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="mb-4"
          >
            <ArrowLeft className={`h-4 w-4 ${language === 'ar' ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src={logoImage}
              alt="Palestine Pulse Logo"
              className="h-16 w-16 mx-auto mb-4 logo-hero"
            />
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'ar' ? 'نبض فلسطين' : 'Palestine Pulse'}
            </h1>
          </div>

          <Card className="border-palestine-green/20 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                {language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-center">
                {language === 'ar' 
                  ? 'أدخل بياناتك لإنشاء حساب جديد'
                  : 'Enter your information to create a new account'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">
                    {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm your password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={setAgreeToTerms}
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    {language === 'ar' 
                      ? 'أوافق على الشروط والأحكام وسياسة الخصوصية'
                      : 'I agree to the terms and conditions and privacy policy'
                    }
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-palestine-green hover:bg-palestine-green-dark"
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (language === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...') 
                    : (language === 'ar' ? 'إنشاء حساب' : 'Create Account')
                  }
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
                  </span>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-palestine-green hover:text-palestine-green-dark"
                    onClick={() => onNavigate('login')}
                  >
                    {language === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}