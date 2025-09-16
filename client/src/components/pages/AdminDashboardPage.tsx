import { useState } from 'react';
import { Users, Package, Heart, TrendingUp, Settings, Plus, Edit3, Trash2, Eye, Search, Filter, Download, Upload, BarChart3, PieChart, DollarSign, ShoppingBag, UserCheck, UserX, Calendar, Bell, Shield, Globe, Database, Activity, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { useTheme } from '../contexts/ThemeContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { AdminCharts } from '../AdminCharts';
import { AdminProfileSettings } from '../AdminProfileSettings';
import { AdminGuard } from '../AdminGuard';
import { AdminSecurityCenter } from '../AdminSecurityCenter';
import { AdminRoleManager } from '../AdminRoleManager';
import { AdminQuickStats } from '../AdminQuickStats';

interface AdminDashboardPageProps {
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'organizations' | 'support' | 'login' | 'register' | 'dashboard' | 'profile' | 'product-detail' | 'admin-dashboard' | 'user-account' | 'cart') => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const { language } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showSecurityCenter, setShowSecurityCenter] = useState(false);
  const [showRoleManager, setShowRoleManager] = useState(false);

  // Mock data للعرض
  const stats = {
    totalUsers: 12547,
    totalProducts: 456,
    totalDonations: 89234,
    monthlyRevenue: 45678,
    activeOrders: 123,
    pendingApprovals: 8
  };

  const recentUsers = [
    { id: 1, name: 'أحمد محمد', nameEn: 'Ahmed Mohammed', email: 'ahmed@example.com', location: ' العاصمةالجزائر', locationEn: 'algeria', status: 'active', joinDate: '2024-01-15', donations: 250 },
    { id: 2, name: 'فاطمة علي', nameEn: 'Fatima Ali', email: 'fatima@example.com', location: 'تيبازة', locationEn: 'Tunisia', status: 'active', joinDate: '2024-01-14', donations: 150 },
    { id: 3, name: 'محمد حسن', nameEn: 'Mohammed Hassan', email: 'mohammed@example.com', location: 'مستغانم', locationEn: 'Libya', status: 'pending', joinDate: '2024-01-13', donations: 0 },
    { id: 4, name: 'عائشة أحمد', nameEn: 'Aisha Ahmed', email: 'aisha@example.com', location: 'البليدة', locationEn: 'Nablus', status: 'active', joinDate: '2024-01-12', donations: 300 },
    { id: 5, name: 'يوسف عبدالله', nameEn: 'Youssef Abdullah', email: 'youssef@example.com', location: 'الخليل', locationEn: 'Hebron', status: 'suspended', joinDate: '2024-01-11', donations: 75 }
  ];

  const recentProducts = [
    { id: 1, name: 'كوفية فلسطينية أصلية', nameEn: 'Authentic Palestinian Keffiyeh', category: 'تراث', categoryEn: 'Heritage', price: 45, stock: 120, status: 'active', sales: 89 },
    { id: 2, name: 'زيت زيتون فلسطيني', nameEn: 'Palestinian Olive Oil', category: 'طعام', categoryEn: 'Food', price: 25, stock: 45, status: 'active', sales: 156 },
    { id: 3, name: 'صابون زيت الزيتون', nameEn: 'Olive Oil Soap', category: 'جمال', categoryEn: 'Beauty', price: 12, stock: 89, status: 'active', sales: 234 },
    { id: 4, name: 'تطريز فلسطيني يدوي', nameEn: 'Handmade Palestinian Embroidery', category: 'تراث', categoryEn: 'Heritage', price: 85, stock: 12, status: 'low_stock', sales: 67 },
    { id: 5, name: 'معجون الزيتون', nameEn: 'Olive Paste', category: 'طعام', categoryEn: 'Food', price: 18, stock: 0, status: 'out_of_stock', sales: 98 }
  ];

  const recentDonations = [
    { id: 1, donor: 'أحمد علي', donorEn: 'Ahmed Ali', amount: 100, currency: 'USD', project: 'دعم الأطفال', projectEn: 'Child Support', date: '2024-01-15', status: 'completed' },
    { id: 2, donor: 'سارة محمد', donorEn: 'Sarah Mohammed', amount: 50, currency: 'USD', project: 'إعادة الإعمار', projectEn: 'Reconstruction', date: '2024-01-14', status: 'completed' },
    { id: 3, donor: 'محمد حسن', donorEn: 'Mohammed Hassan', amount: 200, currency: 'USD', project: 'التعليم', projectEn: 'Education', date: '2024-01-13', status: 'pending' },
    { id: 4, donor: 'فاطمة أحمد', donorEn: 'Fatima Ahmed', amount: 75, currency: 'USD', project: 'الصحة', projectEn: 'Healthcare', date: '2024-01-12', status: 'completed' },
    { id: 5, donor: 'يوسف علي', donorEn: 'Youssef Ali', amount: 150, currency: 'USD', project: 'الطوارئ', projectEn: 'Emergency', date: '2024-01-11', status: 'completed' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'completed': return 'bg-palestine-green text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'suspended': case 'out_of_stock': return 'bg-palestine-red text-white';
      case 'low_stock': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      active: { ar: 'نشط', en: 'Active' },
      pending: { ar: 'معلق', en: 'Pending' },
      suspended: { ar: 'موقوف', en: 'Suspended' },
      completed: { ar: 'مكتمل', en: 'Completed' },
      out_of_stock: { ar: 'نفد المخزون', en: 'Out of Stock' },
      low_stock: { ar: 'مخزون قليل', en: 'Low Stock' }
    };
    return language === 'ar' ? statusTexts[status as keyof typeof statusTexts]?.ar || status : statusTexts[status as keyof typeof statusTexts]?.en || status;
  };

  return (
    <AdminGuard onNavigate={onNavigate}>
      {showRoleManager ? (
        <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light">
          {/* Role Manager Header */}
          <div className="bg-white dark:bg-palestine-black border-b border-border shadow-sm">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Button
                    variant="ghost"
                    onClick={() => setShowRoleManager(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ← {language === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
                  </Button>
                  <div className="h-6 w-px bg-border"></div>
                  <h1 className="text-2xl font-bold text-purple-600 flex items-center space-x-2 rtl:space-x-reverse">
                    <UserCheck className="h-6 w-6" />
                    <span>{language === 'ar' ? 'إدارة الأدوار والصلاحيات' : 'Role & Permission Manager'}</span>
                  </h1>
                </div>
                
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'تصدير تقرير الأدوار' : 'Export Role Report'}
                  </Button>
                  <Button 
                    onClick={() => setShowProfileSettings(true)}
                    className="bg-palestine-green hover:bg-palestine-green-dark"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'إعدادات المتقدمة' : 'Advanced Settings'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Role Manager Content */}
          <div className="container mx-auto px-4 py-8">
            <AdminRoleManager />
          </div>
        </div>
      ) : showSecurityCenter ? (
        <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light">
          {/* Security Center Header */}
          <div className="bg-white dark:bg-palestine-black border-b border-border shadow-sm">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Button
                    variant="ghost"
                    onClick={() => setShowSecurityCenter(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ← {language === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
                  </Button>
                  <div className="h-6 w-px bg-border"></div>
                  <h1 className="text-2xl font-bold text-palestine-red flex items-center space-x-2 rtl:space-x-reverse">
                    <Shield className="h-6 w-6" />
                    <span>{language === 'ar' ? 'مركز الأمان' : 'Security Center'}</span>
                  </h1>
                </div>
                
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
                  </Button>
                  <Button 
                    onClick={() => setShowProfileSettings(true)}
                    className="bg-palestine-green hover:bg-palestine-green-dark"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'إعدادات الأمان' : 'Security Settings'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Center Content */}
          <div className="container mx-auto px-4 py-8">
            <AdminSecurityCenter />
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light">
          {/* Header */}
          <div className="bg-white dark:bg-palestine-black border-b border-border shadow-sm">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate('home')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ← {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                  </Button>
                  <div className="h-6 w-px bg-border"></div>
                  <h1 className="text-2xl font-bold text-palestine-green">
                    {language === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
                  </h1>
                </div>
                
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowRoleManager(true)}
                    className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'إدارة الأدوار' : 'Role Manager'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowSecurityCenter(true)}
                    className="border-palestine-red text-palestine-red hover:bg-palestine-red hover:text-white"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'مركز الأمان' : 'Security Center'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'تصدير البيانات' : 'Export Data'}
                  </Button>
                  <Button 
                    onClick={() => setShowProfileSettings(true)}
                    className="bg-palestine-green hover:bg-palestine-green-dark"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'إعدادات الإدارة' : 'Admin Settings'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <AdminQuickStats />

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-palestine-green to-palestine-green-dark text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">
                        {language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
                      </p>
                      <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-white/70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">
                        {language === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}
                      </p>
                      <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    </div>
                    <Package className="h-8 w-8 text-white/70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-palestine-red to-palestine-red-dark text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">
                        {language === 'ar' ? 'إجمالي التبرعات' : 'Total Donations'}
                      </p>
                      <p className="text-2xl font-bold">${stats.totalDonations.toLocaleString()}</p>
                    </div>
                    <Heart className="h-8 w-8 text-white/70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">
                        {language === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
                      </p>
                      <p className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-white/70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">
                        {language === 'ar' ? 'الطلبات النشطة' : 'Active Orders'}
                      </p>
                      <p className="text-2xl font-bold">{stats.activeOrders}</p>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-white/70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">
                        {language === 'ar' ? 'في انتظار الموافقة' : 'Pending Approvals'}
                      </p>
                      <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                    </div>
                    <Bell className="h-8 w-8 text-white/70" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Dashboard Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 h-auto p-1 bg-white dark:bg-palestine-black-light shadow-lg">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>{language === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
                >
                  <Users className="h-4 w-4" />
                  <span>{language === 'ar' ? 'المستخدمين' : 'Users'}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="products" 
                  className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
                >
                  <Package className="h-4 w-4" />
                  <span>{language === 'ar' ? 'المنتجات' : 'Products'}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="donations" 
                  className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
                >
                  <Heart className="h-4 w-4" />
                  <span>{language === 'ar' ? 'التبرعات' : 'Donations'}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>{language === 'ar' ? 'التحليلات' : 'Analytics'}</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-palestine-green to-palestine-red text-white">
                      <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Activity className="h-5 w-5" />
                        <span>{language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          { type: 'user', message: language === 'ar' ? 'انضم مستخدم جديد: أحمد محمد' : 'New user joined: Ahmed Mohammed', time: '5 دقائق', timeEn: '5 minutes ago' },
                          { type: 'product', message: language === 'ar' ? 'تم إضافة منتج جديد: كوفية فلسطينية' : 'New product added: Palestinian Keffiyeh', time: '15 دقيقة', timeEn: '15 minutes ago' },
                          { type: 'donation', message: language === 'ar' ? 'تبرع جديد بقيمة $100' : 'New donation of $100', time: '30 دقيقة', timeEn: '30 minutes ago' },
                          { type: 'order', message: language === 'ar' ? 'طلب جديد من سارة أحمد' : 'New order from Sarah Ahmed', time: '1 ساعة', timeEn: '1 hour ago' },
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-muted/50 rounded-lg">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.type === 'user' ? 'bg-palestine-green' :
                              activity.type === 'product' ? 'bg-blue-500' :
                              activity.type === 'donation' ? 'bg-palestine-red' :
                              'bg-yellow-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm">{activity.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {language === 'ar' ? `منذ ${activity.time}` : activity.timeEn}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Status */}
                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Database className="h-5 w-5" />
                        <span>{language === 'ar' ? 'حالة النظام' : 'System Status'}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[
                          { name: language === 'ar' ? 'خادم الويب' : 'Web Server', nameEn: 'Web Server', status: 98, color: 'bg-palestine-green' },
                          { name: language === 'ar' ? 'قاعدة البيانات' : 'Database', nameEn: 'Database', status: 95, color: 'bg-blue-500' },
                          { name: language === 'ar' ? 'نظام الدفع' : 'Payment System', nameEn: 'Payment System', status: 100, color: 'bg-palestine-green' },
                          { name: language === 'ar' ? 'التخزين السحابي' : 'Cloud Storage', nameEn: 'Cloud Storage', status: 87, color: 'bg-yellow-500' },
                        ].map((service, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{service.name}</span>
                              <span className="text-sm text-muted-foreground">{service.status}%</span>
                            </div>
                            <Progress value={service.status} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-palestine-green to-blue-500 text-white">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Users className="h-5 w-5" />
                        <span>{language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}</span>
                      </CardTitle>
                      <Button variant="secondary" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        {language === 'ar' ? 'إضافة مستخدم' : 'Add User'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="flex-1">
                        <Input
                          placeholder={language === 'ar' ? 'البحث عن المستخدمين...' : 'Search users...'}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-background"
                        />
                      </div>
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder={language === 'ar' ? 'الحالة' : 'Status'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                          <SelectItem value="active">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                          <SelectItem value="pending">{language === 'ar' ? 'معلق' : 'Pending'}</SelectItem>
                          <SelectItem value="suspended">{language === 'ar' ? 'موقوف' : 'Suspended'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{language === 'ar' ? 'المستخدم' : 'User'}</TableHead>
                            <TableHead>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</TableHead>
                            <TableHead>{language === 'ar' ? 'الموقع' : 'Location'}</TableHead>
                            <TableHead>{language === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}</TableHead>
                            <TableHead>{language === 'ar' ? 'التبرعات' : 'Donations'}</TableHead>
                            <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                            <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                  <div className="w-8 h-8 bg-palestine-green text-white rounded-full flex items-center justify-center">
                                    {(language === 'ar' ? user.name : user.nameEn).charAt(0)}
                                  </div>
                                  <span className="font-medium">
                                    {language === 'ar' ? user.name : user.nameEn}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{language === 'ar' ? user.location : user.locationEn}</TableCell>
                              <TableCell>{user.joinDate}</TableCell>
                              <TableCell>${user.donations}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(user.status)}>
                                  {getStatusText(user.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Package className="h-5 w-5" />
                        <span>{language === 'ar' ? 'إدارة المنتجات' : 'Product Management'}</span>
                      </CardTitle>
                      <Button variant="secondary" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        {language === 'ar' ? 'إضافة منتج' : 'Add Product'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{language === 'ar' ? 'المنتج' : 'Product'}</TableHead>
                            <TableHead>{language === 'ar' ? 'الفئة' : 'Category'}</TableHead>
                            <TableHead>{language === 'ar' ? 'السعر' : 'Price'}</TableHead>
                            <TableHead>{language === 'ar' ? 'المخزون' : 'Stock'}</TableHead>
                            <TableHead>{language === 'ar' ? 'المبيعات' : 'Sales'}</TableHead>
                            <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                            <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                  <div className="w-10 h-10 bg-palestine-green-50 dark:bg-palestine-green/20 rounded-lg flex items-center justify-center">
                                    <Package className="h-5 w-5 text-palestine-green" />
                                  </div>
                                  <span className="font-medium">
                                    {language === 'ar' ? product.name : product.nameEn}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{language === 'ar' ? product.category : product.categoryEn}</TableCell>
                              <TableCell>${product.price}</TableCell>
                              <TableCell>{product.stock}</TableCell>
                              <TableCell>{product.sales}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(product.status)}>
                                  {getStatusText(product.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Donations Tab */}
              <TabsContent value="donations" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-palestine-red to-orange-500 text-white">
                    <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Heart className="h-5 w-5" />
                      <span>{language === 'ar' ? 'إدارة التبرعات' : 'Donation Management'}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{language === 'ar' ? 'المتبرع' : 'Donor'}</TableHead>
                            <TableHead>{language === 'ar' ? 'المبلغ' : 'Amount'}</TableHead>
                            <TableHead>{language === 'ar' ? 'المشروع' : 'Project'}</TableHead>
                            <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                            <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                            <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentDonations.map((donation) => (
                            <TableRow key={donation.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                  <div className="w-8 h-8 bg-palestine-red text-white rounded-full flex items-center justify-center">
                                    {(language === 'ar' ? donation.donor : donation.donorEn).charAt(0)}
                                  </div>
                                  <span className="font-medium">
                                    {language === 'ar' ? donation.donor : donation.donorEn}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>${donation.amount} {donation.currency}</TableCell>
                              <TableCell>{language === 'ar' ? donation.project : donation.projectEn}</TableCell>
                              <TableCell>{donation.date}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(donation.status)}>
                                  {getStatusText(donation.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <AdminCharts />
              </TabsContent>
            </Tabs>
          </div>

          {/* Profile Settings Modal */}
          {showProfileSettings && (
            <AdminProfileSettings onClose={() => setShowProfileSettings(false)} />
          )}
        </div>
      )}
    </AdminGuard>
  );
}