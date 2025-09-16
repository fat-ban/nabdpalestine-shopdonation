import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Heart, 
  ShoppingBag, 
  Edit, 
  Save, 
  X,
  Camera,
  Award,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface UserAccountPageProps {
  onNavigate: (page: 'home' | 'store' | 'donate' | 'chatbot' | 'about' | 'news' | 'support' | 'login' | 'register' | 'dashboard' | 'profile' | 'user-account') => void;
}

export function UserAccountPage({ onNavigate }: UserAccountPageProps) {
  const { language } = useTheme();
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {language === 'ar' ? 'تسجيل الدخول مطلوب' : 'Login Required'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'يجب تسجيل الدخول للوصول إلى صفحة الملف الشخصي'
                : 'Please login to access your profile page'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => onNavigate('login')} 
              className="w-full bg-palestine-red hover:bg-palestine-red-dark"
            >
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => onNavigate('home')} 
              className="w-full"
            >
              {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    if (editedUser) {
      updateProfile(editedUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const donations = [
    {
      id: 1,
      amount: 250,
      date: '2024-01-15',
      cause: language === 'ar' ? 'دعم التعليم' : 'Education Support'
    },
    {
      id: 2,
      amount: 150,
      date: '2024-01-10',
      cause: language === 'ar' ? 'مساعدات طبية' : 'Medical Aid'
    },
    {
      id: 3,
      amount: 300,
      date: '2024-01-05',
      cause: language === 'ar' ? 'إغاثة عاجلة' : 'Emergency Relief'
    }
  ];

  const purchases = [
    {
      id: 1,
      product: language === 'ar' ? 'خزفيات تراثية' : 'Traditional Pottery',
      amount: 85,
      date: '2024-01-12'
    },
    {
      id: 2,
      product: language === 'ar' ? 'تطريز فلسطيني' : 'Palestinian Embroidery',
      amount: 120,
      date: '2024-01-08'
    }
  ];

  const achievements = [
    {
      title: language === 'ar' ? 'متضامن ذهبي' : 'Gold Supporter',
      description: language === 'ar' ? 'تبرع بأكثر من $1000' : 'Donated over $1000',
      icon: Award,
      color: 'text-yellow-500'
    },
    {
      title: language === 'ar' ? 'صديق المتجر' : 'Store Friend',
      description: language === 'ar' ? 'اشترى أكثر من 10 منتجات' : 'Purchased over 10 products',
      icon: ShoppingBag,
      color: 'text-palestine-green'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">
              {language === 'ar' ? 'حسابي' : 'My Account'}
            </h1>
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  logout();
                  onNavigate('home');
                }}
              >
                {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <Card className="relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1589652715594-9daf0fc98d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHBlcnNvbiUyMHBhbGVzdGluZXxlbnwxfHx8fDE3NTc1NDUyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Profile Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-palestine-red/20 to-palestine-green/20"></div>
              </div>

              <CardHeader className="text-center relative z-10">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-palestine-red/20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-palestine-red text-white text-2xl">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full p-2 h-8 w-8"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
                
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editedUser?.name || ''}
                      onChange={(e) => setEditedUser(prev => prev ? {...prev, name: e.target.value} : null)}
                      className="text-center"
                    />
                  </div>
                ) : (
                  <div>
                    <CardTitle className="text-xl mb-2">{user.name}</CardTitle>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role === 'admin' 
                        ? (language === 'ar' ? 'مدير' : 'Admin') 
                        : (language === 'ar' ? 'عضو' : 'Member')
                      }
                    </Badge>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4 relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    {isEditing ? (
                      <Input
                        value={editedUser?.email || ''}
                        onChange={(e) => setEditedUser(prev => prev ? {...prev, email: e.target.value} : null)}
                        className="text-sm"
                      />
                    ) : (
                      <span>{user.email}</span>
                    )}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {isEditing ? (
                      <Input
                        value={editedUser?.location || ''}
                        onChange={(e) => setEditedUser(prev => prev ? {...prev, location: e.target.value} : null)}
                        placeholder={language === 'ar' ? 'الموقع' : 'Location'}
                        className="text-sm"
                      />
                    ) : (
                      <span>{user.location || (language === 'ar' ? 'غير محدد' : 'Not specified')}</span>
                    )}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {language === 'ar' ? 'انضم في ' : 'Joined '}
                      {new Date(user.joinedDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm" className="flex-1 bg-palestine-green hover:bg-palestine-green-dark">
                        <Save className="h-3 w-3 mr-1" />
                        {language === 'ar' ? 'حفظ' : 'Save'}
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                        <X className="h-3 w-3 mr-1" />
                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'تعديل الملف' : 'Edit Profile'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-palestine-green" />
                  {language === 'ar' ? 'إحصائيات شخصية' : 'Personal Stats'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'إجمالي التبرعات' : 'Total Donations'}
                  </span>
                  <span className="font-bold text-palestine-green">
                    ${user.donationTotal?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'إجمالي المشتريات' : 'Total Purchases'}
                  </span>
                  <span className="font-bold text-palestine-red">
                    ${user.purchaseTotal?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'مستوى التضامن' : 'Solidarity Level'}
                    </span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="activity" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activity">
                  {language === 'ar' ? 'النشاط' : 'Activity'}
                </TabsTrigger>
                <TabsTrigger value="donations">
                  {language === 'ar' ? 'التبرعات' : 'Donations'}
                </TabsTrigger>
                <TabsTrigger value="achievements">
                  {language === 'ar' ? 'الإنجازات' : 'Achievements'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="space-y-6">
                {/* Recent Donations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-palestine-red" />
                      {language === 'ar' ? 'التبرعات الأخيرة' : 'Recent Donations'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {donations.map((donation) => (
                        <div key={donation.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{donation.cause}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(donation.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                            </p>
                          </div>
                          <span className="font-bold text-palestine-green">
                            ${donation.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Purchases */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2 text-palestine-green" />
                      {language === 'ar' ? 'المشتريات الأخيرة' : 'Recent Purchases'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {purchases.map((purchase) => (
                        <div key={purchase.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{purchase.product}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(purchase.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                            </p>
                          </div>
                          <span className="font-bold text-palestine-red">
                            ${purchase.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="donations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'ar' ? 'سجل التبرعات' : 'Donation History'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'ar' 
                        ? 'جميع تبرعاتك مع تفاصيل الشفافية'
                        : 'All your donations with transparency details'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {donations.map((donation) => (
                        <div key={donation.id} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{donation.cause}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(donation.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                              </p>
                            </div>
                            <span className="font-bold text-palestine-green text-lg">
                              ${donation.amount}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {language === 'ar' ? 'تم التأكيد' : 'Confirmed'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'ar' ? 'شارات الإنجاز' : 'Achievement Badges'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'ar' 
                        ? 'إنجازاتك في دعم القضية الفلسطينية'
                        : 'Your achievements in supporting the Palestinian cause'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center p-4 border border-border rounded-lg">
                          <div className={`p-3 rounded-full bg-muted mr-4 ${achievement.color}`}>
                            <achievement.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}