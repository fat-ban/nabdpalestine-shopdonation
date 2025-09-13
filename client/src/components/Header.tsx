import { useState } from 'react';
import { Sun, Moon, Globe, User, LogOut, Settings, ShoppingBag, Bell, Menu, X, Shield, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { useCart } from './contexts/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NotificationCenter } from './NotificationCenter';
import logo from '../assets/logo.png';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'organizations' | 'support' | 'login' | 'register' | 'dashboard' | 'profile' | 'product-detail' | 'admin-dashboard' | 'user-account' | 'cart') => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { theme, language, toggleTheme, toggleLanguage, t } = useTheme();
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const navItems = [
    { key: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
    { key: 'about', labelAr: 'من نحن', labelEn: 'About Us' },
    { key: 'store', labelAr: 'المتجر', labelEn: 'Store' },
    { key: 'donate', labelAr: 'تبرع', labelEn: 'Donate' },
    { key: 'organizations', labelAr: 'الجمعيات', labelEn: 'Organizations' },
    { key: 'support', labelAr: 'الدعم', labelEn: 'Support' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-palestine-black shadow-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-3 rtl:space-x-reverse hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src={logo}
                  alt="Palestine Pulse Logo"
                  className="h-10 w-10 logo-clean"
                />
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-palestine-green">
                  {language === 'ar' ? 'نبض فلسطين' : 'Palestine Pulse'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'منصة التضامن الرقمية' : 'Digital Solidarity Platform'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key as any)}
                className={`relative text-base font-medium transition-colors hover:text-palestine-green ${
                  currentPage === item.key
                    ? 'text-palestine-green'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {language === 'ar' ? item.labelAr : item.labelEn}
                {currentPage === item.key && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-palestine-green rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="h-9 w-9 p-0 hidden md:flex"
            >
              <Globe className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0 hidden md:flex"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsNotificationOpen(true)}
              className="h-9 w-9 p-0 relative"
            >
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-palestine-red animate-pulse"
              >
                2
              </Badge>
            </Button>

            {/* Shopping Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('cart')}
              className="h-9 w-9 p-0 relative"
            >
              <ShoppingBag className="h-4 w-4" />
              {getCartItemsCount() > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-palestine-red"
                >
                  {getCartItemsCount()}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onNavigate('user-account')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {language === 'ar' ? 'حسابي' : 'My Account'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('dashboard')}>
                    <Settings className="mr-2 h-4 w-4" />
                    {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                  </DropdownMenuItem>
                  {user?.email === 'admin@palestinepulse.org' && (
                    <DropdownMenuItem onClick={() => onNavigate('admin-dashboard')}>
                      <Shield className="mr-2 h-4 w-4" />
                      {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('login')}
                >
                  {language === 'ar' ? 'دخول' : 'Login'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => onNavigate('register')}
                  className="bg-palestine-green hover:bg-palestine-green-dark"
                >
                  {language === 'ar' ? 'انضم إلينا' : 'Join Us'}
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-9 w-9 p-0 lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left text-base font-medium transition-colors hover:text-palestine-green ${
                    currentPage === item.key
                      ? 'text-palestine-green'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {language === 'ar' ? item.labelAr : item.labelEn}
                </button>
              ))}

              <div className="flex items-center space-x-4 rtl:space-x-reverse pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">
                    {language === 'ar' ? 'English' : 'العربية'}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-4 w-4" />
                      <span className="text-sm">{language === 'ar' ? 'داكن' : 'Dark'}</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      <span className="text-sm">{language === 'ar' ? 'فاتح' : 'Light'}</span>
                    </>
                  )}
                </Button>
              </div>

              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onNavigate('login');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {language === 'ar' ? 'دخول' : 'Login'}
                  </Button>
                  <Button
                    onClick={() => {
                      onNavigate('register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-palestine-green hover:bg-palestine-green-dark"
                  >
                    {language === 'ar' ? 'انضم إلينا' : 'Join Us'}
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </header>
  );
}
