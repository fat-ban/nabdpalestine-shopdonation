import { useState } from 'react';
import { Heart, ShoppingBag, Calendar, TrendingUp, Download, Eye, CheckCircle, Clock, MapPin, Package, CreditCard, Gift, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface UserAccountPageProps {
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'organizations' | 'support' | 'login' | 'register' | 'dashboard' | 'profile' | 'product-detail' | 'admin-dashboard' | 'user-account' | 'cart') => void;
}

export function UserAccountPage({ onNavigate }: UserAccountPageProps) {
  const { language } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data - in real app this would come from API
  const userStats = {
    totalDonations: 750,
    totalPurchases: 1250,
    donationCount: 12,
    purchaseCount: 8,
    memberSince: '2024-01-15',
    impactScore: 95,
    donationGoal: 1000,
    loyaltyPoints: 2840
  };

  const donationHistory = [
    {
      id: 1,
      amount: 100,
      currency: 'USD',
      project: 'دعم الأطفال',
      projectEn: 'Child Support',
      date: '2024-01-15',
      status: 'completed',
      impact: 'تم توفير وجبات لـ 25 طفل',
      impactEn: 'Provided meals for 25 children',
      receipt: 'RC001234'
    },
    {
      id: 2,
      amount: 75,
      currency: 'USD',
      project: 'إعادة الإعمار',
      projectEn: 'Reconstruction',
      date: '2024-01-10',
      status: 'completed',
      impact: 'ساهم في بناء 3 غرف دراسية',
      impactEn: 'Contributed to building 3 classrooms',
      receipt: 'RC001235'
    },
    {
      id: 3,
      amount: 150,
      currency: 'USD',
      project: 'التعليم',
      projectEn: 'Education',
      date: '2024-01-05',
      status: 'completed',
      impact: 'دعم 5 طلاب بالكتب والأدوات',
      impactEn: 'Supported 5 students with books and supplies',
      receipt: 'RC001236'
    },
    {
      id: 4,
      amount: 200,
      currency: 'USD',
      project: 'الصحة',
      projectEn: 'Healthcare',
      date: '2023-12-28',
      status: 'completed',
      impact: 'تمويل 40 استشارة طبية',
      impactEn: 'Funded 40 medical consultations',
      receipt: 'RC001237'
    },
    {
      id: 5,
      amount: 50,
      currency: 'USD',
      project: 'الطوارئ',
      projectEn: 'Emergency',
      date: '2023-12-20',
      status: 'processing',
      impact: 'قيد المعالجة',
      impactEn: 'Processing',
      receipt: 'RC001238'
    }
  ];

  const purchaseHistory = [
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      products: [
        { name: 'كوفية فلسطينية أصلية', nameEn: 'Authentic Palestinian Keffiyeh', quantity: 2, price: 45 }
      ],
      total: 90,
      date: '2024-01-12',
      status: 'delivered',
      tracking: 'TRK123456789'
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-002',
      products: [
        { name: 'زيت زيتون فلسطيني', nameEn: 'Palestinian Olive Oil', quantity: 3, price: 25 },
        { name: 'صابون زيت الزيتون', nameEn: 'Olive Oil Soap', quantity: 5, price: 12 }
      ],
      total: 135,
      date: '2024-01-08',
      status: 'shipped',
      tracking: 'TRK123456790'
    },
    {
      id: 3,
      orderNumber: 'ORD-2024-003',
      products: [
        { name: 'تطريز فلسطيني يدوي', nameEn: 'Handmade Palestinian Embroidery', quantity: 1, price: 85 }
      ],
      total: 85,
      date: '2024-01-03',
      status: 'delivered',
      tracking: 'TRK123456791'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'delivered': return 'bg-palestine-green text-white';
      case 'processing': case 'shipped': return 'bg-yellow-500 text-white';
      case 'pending': return 'bg-orange-500 text-white';
      case 'cancelled': return 'bg-palestine-red text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      completed: { ar: 'مكتمل', en: 'Completed' },
      delivered: { ar: 'تم التسليم', en: 'Delivered' },
      shipped: { ar: 'قيد الشحن', en: 'Shipped' },
      processing: { ar: 'قيد المعالجة', en: 'Processing' },
      pending: { ar: 'معلق', en: 'Pending' },
      cancelled: { ar: 'ملغي', en: 'Cancelled' }
    };
    return language === 'ar' ? statusTexts[status as keyof typeof statusTexts]?.ar || status : statusTexts[status as keyof typeof statusTexts]?.en || status;
  };

  const impactAchievements = [
    {
      title: language === 'ar' ? 'متبرع ذهبي' : 'Gold Donor',
      description: language === 'ar' ? 'تبرع بأكثر من $500' : 'Donated over $500',
      icon: <Gift className="h-6 w-6 text-yellow-500" />,
      achieved: true
    },
    {
      title: language === 'ar' ? 'مؤثر اجتماعي' : 'Social Impact',
      description: language === 'ar' ? 'ساعد أكثر من 100 شخص' : 'Helped over 100 people',
      icon: <Heart className="h-6 w-6 text-palestine-red" />,
      achieved: true
    },
    {
      title: language === 'ar' ? 'عضو مخلص' : 'Loyal Member',
      description: language === 'ar' ? 'عضو لأكثر من سنة' : 'Member for over a year',
      icon: <Star className="h-6 w-6 text-palestine-green" />,
      achieved: false
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light">
        <Card className="max-w-md mx-auto shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-palestine-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-palestine-red" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              {language === 'ar' ? 'تسجيل الدخول مطلوب' : 'Login Required'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'ar' ? 'يجب تسجيل الدخول لمراجعة حسابك' : 'Please login to view your account'}
            </p>
            <div className="space-y-3">
              <Button onClick={() => onNavigate('login')} className="w-full bg-palestine-green hover:bg-palestine-green-dark">
                {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Button>
              <Button variant="outline" onClick={() => onNavigate('home')} className="w-full">
                {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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
                {language === 'ar' ? 'حسابي' : 'My Account'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'تصدير البيانات' : 'Export Data'}
              </Button>
              <Button onClick={() => onNavigate('profile')} className="bg-palestine-green hover:bg-palestine-green-dark">
                {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* User Profile Header */}
        <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-palestine-green to-palestine-red text-white">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-white text-palestine-green">
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{user.name || user.email}</h2>
                <p className="text-white/90 mb-4">
                  {language === 'ar' ? `عضو منذ ${userStats.memberSince}` : `Member since ${userStats.memberSince}`}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">${userStats.totalDonations}</div>
                    <div className="text-sm text-white/80">{language === 'ar' ? 'إجمالي التبرعات' : 'Total Donations'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">${userStats.totalPurchases}</div>
                    <div className="text-sm text-white/80">{language === 'ar' ? 'إجمالي المشتريات' : 'Total Purchases'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userStats.impactScore}%</div>
                    <div className="text-sm text-white/80">{language === 'ar' ? 'نقاط التأثير' : 'Impact Score'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userStats.loyaltyPoints}</div>
                    <div className="text-sm text-white/80">{language === 'ar' ? 'نقاط الولاء' : 'Loyalty Points'}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-white dark:bg-palestine-black-light shadow-lg">
            <TabsTrigger 
              value="overview" 
              className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{language === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="donations" 
              className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-red data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4" />
              <span>{language === 'ar' ? 'التبرعات' : 'Donations'}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="purchases" 
              className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{language === 'ar' ? 'المشتريات' : 'Purchases'}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="impact" 
              className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
            >
              <Star className="h-4 w-4" />
              <span>{language === 'ar' ? 'التأثير' : 'Impact'}</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Donation Progress */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-palestine-red to-red-500 text-white">
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Heart className="h-5 w-5" />
                    <span>{language === 'ar' ? 'هدف التبرع' : 'Donation Goal'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-palestine-red">${userStats.totalDonations}</span>
                      <span className="text-muted-foreground">/ ${userStats.donationGoal}</span>
                    </div>
                    <Progress value={(userStats.totalDonations / userStats.donationGoal) * 100} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' 
                        ? `${userStats.donationGoal - userStats.totalDonations} دولار متبقي لتحقيق الهدف`
                        : `$${userStats.donationGoal - userStats.totalDonations} remaining to reach goal`
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-palestine-green to-green-500 text-white">
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Calendar className="h-5 w-5" />
                    <span>{language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-palestine-red rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">
                          {language === 'ar' ? 'تبرع بـ $100 لدعم الأطفال' : 'Donated $100 for Child Support'}
                        </p>
                        <p className="text-xs text-muted-foreground">2024-01-15</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">
                          {language === 'ar' ? 'تم شراء كوفية فلسطينية' : 'Purchased Palestinian Keffiyeh'}
                        </p>
                        <p className="text-xs text-muted-foreground">2024-01-12</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-palestine-green rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">
                          {language === 'ar' ? 'تبرع بـ $75 لإعادة الإعمار' : 'Donated $75 for Reconstruction'}
                        </p>
                        <p className="text-xs text-muted-foreground">2024-01-10</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <TrendingUp className="h-5 w-5" />
                    <span>{language === 'ar' ? 'إحصائيات سريعة' : 'Quick Stats'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{language === 'ar' ? 'عدد التبرعات' : 'Donations Count'}</span>
                      <span className="font-bold">{userStats.donationCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{language === 'ar' ? 'عدد المشتريات' : 'Purchases Count'}</span>
                      <span className="font-bold">{userStats.purchaseCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{language === 'ar' ? 'متوسط التبرع' : 'Avg Donation'}</span>
                      <span className="font-bold">${Math.round(userStats.totalDonations / userStats.donationCount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{language === 'ar' ? 'متوسط الشراء' : 'Avg Purchase'}</span>
                      <span className="font-bold">${Math.round(userStats.totalPurchases / userStats.purchaseCount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-6">
            {/* Donation Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-gradient-to-br from-palestine-red to-red-500 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">{language === 'ar' ? 'إجمالي التبرعات' : 'Total Donated'}</p>
                      <p className="text-3xl font-bold">${userStats.totalDonations}</p>
                    </div>
                    <Heart className="h-12 w-12 text-white/70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-palestine-green to-green-500 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">{language === 'ar' ? 'عدد التبرعات' : 'Donations Count'}</p>
                      <p className="text-3xl font-bold">{userStats.donationCount}</p>
                    </div>
                    <Gift className="h-12 w-12 text-white/70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-1">{language === 'ar' ? 'متوسط التبرع' : 'Average Donation'}</p>
                      <p className="text-3xl font-bold">${Math.round(userStats.totalDonations / userStats.donationCount)}</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-white/70" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-palestine-red to-red-500 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Heart className="h-5 w-5" />
                    <span>{language === 'ar' ? 'تاريخ التبرعات - الشفافية الكاملة' : 'Donation History - Full Transparency'}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {donationHistory.length} {language === 'ar' ? 'تبرع' : 'donations'}
                    </Badge>
                    <Button variant="secondary" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'تصدير التبرعات' : 'Export Donations'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'ar' ? 'المبلغ' : 'Amount'}</TableHead>
                        <TableHead>{language === 'ar' ? 'المشروع' : 'Project'}</TableHead>
                        <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                        <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                        <TableHead>{language === 'ar' ? 'التأثير' : 'Impact'}</TableHead>
                        <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donationHistory.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell className="font-bold text-palestine-green">
                            ${donation.amount} {donation.currency}
                          </TableCell>
                          <TableCell>
                            {language === 'ar' ? donation.project : donation.projectEn}
                          </TableCell>
                          <TableCell>{donation.date}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(donation.status)}>
                              {getStatusText(donation.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-muted-foreground truncate">
                              {language === 'ar' ? donation.impact : donation.impactEn}
                            </p>
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

                {/* Transparency Section */}
                <div className="mt-8 p-6 bg-gradient-to-r from-palestine-green-50 to-palestine-red-50 dark:from-palestine-green/10 dark:to-palestine-red/10 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-palestine-green mr-2" />
                    {language === 'ar' ? 'ضمان الشفافية' : 'Transparency Guarantee'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">{language === 'ar' ? 'كيف نضمن الشفافية:' : 'How we ensure transparency:'}</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-palestine-green rounded-full mr-2"></div>
                          {language === 'ar' ? 'تتبع مباشر لكل دولار متبرع به' : 'Direct tracking of every donated dollar'}
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-palestine-green rounded-full mr-2"></div>
                          {language === 'ar' ? 'تقارير شهرية مفصلة عن استخدام التبرعات' : 'Detailed monthly reports on donation usage'}
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-palestine-green rounded-full mr-2"></div>
                          {language === 'ar' ? 'صور ومقاطع فيديو من المشاريع الممولة' : 'Photos and videos from funded projects'}
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-palestine-green rounded-full mr-2"></div>
                          {language === 'ar' ? 'إيصالات رقمية لكل تبرع' : 'Digital receipts for every donation'}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{language === 'ar' ? 'إحصائيات شفافيتك:' : 'Your transparency stats:'}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{language === 'ar' ? 'التبرعات المتتبعة' : 'Tracked Donations'}</span>
                          <span className="font-bold">100%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{language === 'ar' ? 'الإيصالات المتاحة' : 'Available Receipts'}</span>
                          <span className="font-bold">{donationHistory.filter(d => d.status === 'completed').length}/{donationHistory.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{language === 'ar' ? 'تقارير التأثير' : 'Impact Reports'}</span>
                          <span className="font-bold">{donationHistory.filter(d => d.status === 'completed').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent value="purchases" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <ShoppingBag className="h-5 w-5" />
                    <span>{language === 'ar' ? 'تاريخ المشتريات' : 'Purchase History'}</span>
                  </CardTitle>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {purchaseHistory.length} {language === 'ar' ? 'طلب' : 'orders'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {purchaseHistory.map((order) => (
                    <Card key={order.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">{order.orderNumber}</h4>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">${order.total}</div>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {order.products.map((product, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                              <div>
                                <span className="font-medium">
                                  {language === 'ar' ? product.name : product.nameEn}
                                </span>
                                <span className="text-muted-foreground ml-2">x{product.quantity}</span>
                              </div>
                              <span className="font-medium">${product.price * product.quantity}</span>
                            </div>
                          ))}
                        </div>
                        
                        {order.tracking && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {language === 'ar' ? 'رقم التتبع:' : 'Tracking:'} {order.tracking}
                            </span>
                            <Button variant="ghost" size="sm">
                              {language === 'ar' ? 'تتبع الطلب' : 'Track Order'}
                              <ArrowUpRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Star className="h-5 w-5" />
                    <span>{language === 'ar' ? 'إنجازات التأثير' : 'Impact Achievements'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {impactAchievements.map((achievement, index) => (
                      <div key={index} className={`flex items-center space-x-4 rtl:space-x-reverse p-4 rounded-lg border ${achievement.achieved ? 'bg-palestine-green/10 border-palestine-green/20' : 'bg-muted/50 border-border'}`}>
                        <div className={`p-2 rounded-full ${achievement.achieved ? 'bg-palestine-green/20' : 'bg-muted'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        {achievement.achieved && (
                          <CheckCircle className="h-5 w-5 text-palestine-green" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <TrendingUp className="h-5 w-5" />
                    <span>{language === 'ar' ? 'إحصائيات التأثير' : 'Impact Statistics'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-palestine-green mb-2">{userStats.impactScore}%</div>
                      <p className="text-muted-foreground">{language === 'ar' ? 'نقاط التأثير الإجمالية' : 'Total Impact Score'}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{language === 'ar' ? 'الأشخاص المدعومون' : 'People Supported'}</span>
                        <span className="font-bold">127</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{language === 'ar' ? 'الوجبات المقدمة' : 'Meals Provided'}</span>
                        <span className="font-bold">85</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{language === 'ar' ? 'الطلاب المدعومون' : 'Students Supported'}</span>
                        <span className="font-bold">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{language === 'ar' ? 'الاستشارات الطبية' : 'Medical Consultations'}</span>
                        <span className="font-bold">40</span>
                      </div>
                    </div>
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