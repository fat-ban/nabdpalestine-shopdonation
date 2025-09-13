import { useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  Heart, 
  TrendingUp, 
  DollarSign, 
  Package, 
  MessageSquare, 
  Settings,
  BarChart3,
  PieChart,
  Activity,
  UserCheck,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface DashboardPageProps {
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'news' | 'support' | 'login' | 'register' | 'dashboard' | 'profile') => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { language } = useTheme();
  const { user } = useAuth();

  // Mock data for dashboard
  const stats = [
    {
      title: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users',
      value: '12,543',
      change: '+12%',
      icon: Users,
      color: 'text-palestine-green'
    },
    {
      title: language === 'ar' ? 'المبيعات الشهرية' : 'Monthly Sales',
      value: '$45,231',
      change: '+8%',
      icon: ShoppingBag,
      color: 'text-palestine-red'
    },
    {
      title: language === 'ar' ? 'إجمالي التبرعات' : 'Total Donations',
      value: '$187,650',
      change: '+23%',
      icon: Heart,
      color: 'text-palestine-green'
    },
    {
      title: language === 'ar' ? 'المنتجات النشطة' : 'Active Products',
      value: '156',
      change: '+5%',
      icon: Package,
      color: 'text-palestine-black'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'أحمد محمد',
      action: language === 'ar' ? 'قام بتبرع جديد' : 'Made a new donation',
      amount: '$250',
      time: language === 'ar' ? 'منذ ساعتين' : '2 hours ago',
      type: 'donation'
    },
    {
      id: 2,
      user: 'فاطمة أحمد',
      action: language === 'ar' ? 'اشترت منتج تراثي' : 'Purchased traditional product',
      amount: '$85',
      time: language === 'ar' ? 'منذ 4 ساعات' : '4 hours ago',
      type: 'purchase'
    },
    {
      id: 3,
      user: 'محمد علي',
      action: language === 'ar' ? 'انضم كعضو جديد' : 'Joined as new member',
      amount: '',
      time: language === 'ar' ? 'منذ 6 ساعات' : '6 hours ago',
      type: 'registration'
    }
  ];

  const topProducts = [
    {
      name: language === 'ar' ? 'خزفيات تراثية' : 'Traditional Pottery',
      sales: 124,
      revenue: '$3,450'
    },
    {
      name: language === 'ar' ? 'تطريز فلسطيني' : 'Palestinian Embroidery',
      sales: 98,
      revenue: '$2,890'
    },
    {
      name: language === 'ar' ? 'زيت زيتون طبيعي' : 'Natural Olive Oil',
      sales: 87,
      revenue: '$2,340'
    }
  ];

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">
              {language === 'ar' ? 'وصول غير مسموح' : 'Access Denied'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'هذه الصفحة مخصصة للإدارة فقط'
                : 'This page is only accessible to administrators'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onNavigate('home')} 
              className="w-full bg-palestine-red hover:bg-palestine-red-dark"
            >
              {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'ar' 
                  ? `مرحباً ${user?.name}، إليك نظرة شاملة على أداء المنصة`
                  : `Welcome ${user?.name}, here's your platform overview`
                }
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'الإشعارات' : 'Notifications'}
                <Badge variant="destructive" className="ml-2">5</Badge>
              </Button>
              <Button variant="outline" size="sm" onClick={() => onNavigate('profile')}>
                <Settings className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'الإعدادات' : 'Settings'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              {language === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="users">
              {language === 'ar' ? 'المستخدمين' : 'Users'}
            </TabsTrigger>
            <TabsTrigger value="products">
              {language === 'ar' ? 'المنتجات' : 'Products'}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              {language === 'ar' ? 'التحليلات' : 'Analytics'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activities */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-palestine-red" />
                    {language === 'ar' ? 'الأنشطة الأخيرة' : 'Recent Activities'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'donation' ? 'bg-palestine-green' :
                            activity.type === 'purchase' ? 'bg-palestine-red' : 'bg-palestine-black'
                          }`} />
                          <div>
                            <p className="font-medium text-foreground">{activity.user}</p>
                            <p className="text-sm text-muted-foreground">{activity.action}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {activity.amount && (
                            <p className="font-medium text-palestine-green">{activity.amount}</p>
                          )}
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-palestine-green" />
                    {language === 'ar' ? 'المنتجات الأكثر مبيعاً' : 'Top Products'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{product.name}</span>
                          <span className="text-palestine-green font-medium">{product.revenue}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{product.sales} {language === 'ar' ? 'مبيعة' : 'sales'}</span>
                          <span>{Math.round((product.sales / 150) * 100)}%</span>
                        </div>
                        <Progress value={(product.sales / 150) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-palestine-red" />
                  {language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'عرض وإدارة جميع المستخدمين المسجلين في المنصة'
                    : 'View and manage all registered users on the platform'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'ar' ? 'سيتم إضافة إدارة المستخدمين قريباً' : 'User management coming soon'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-palestine-green" />
                  {language === 'ar' ? 'إدارة المنتجات' : 'Product Management'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'إضافة وتعديل وحذف المنتجات في المتجر'
                    : 'Add, edit, and remove products from the store'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'ar' ? 'سيتم إضافة إدارة المنتجات قريباً' : 'Product management coming soon'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-palestine-red" />
                    {language === 'ar' ? 'تحليلات المبيعات' : 'Sales Analytics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {language === 'ar' ? 'الرسوم البيانية قيد التطوير' : 'Charts under development'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-palestine-green" />
                    {language === 'ar' ? 'تحليلات التبرعات' : 'Donation Analytics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {language === 'ar' ? 'الرسوم البيانية قيد التطوير' : 'Charts under development'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}