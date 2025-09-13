import React, { useState } from 'react';
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
import { useGetUserDonationsQuery } from '../../features/donations/donationsApiSlice';
import { Donation, DonationStatus } from '../../features/donations/types';
import { LoadingSpinner } from '../LoadingSpinner';

interface UserAccountPageProps {
  onNavigate: (page: string) => void;
}

export function UserAccountPage({ onNavigate }: UserAccountPageProps) {
  const { language } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('donations');

  const { data: donationHistory, isLoading: isLoadingDonations, isError: isErrorDonations } = useGetUserDonationsQuery({}, { skip: !user });

  const userStats = {
    totalDonations: donationHistory?.reduce((acc, d) => acc + d.amount, 0) || 0,
    totalPurchases: 1250,
    donationCount: donationHistory?.length || 0,
    purchaseCount: 8,
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
    impactScore: 95,
    donationGoal: 1000,
    loyaltyPoints: 2840
  };

  const purchaseHistory: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case DonationStatus.COMPLETED: return 'bg-palestine-green text-white';
      case DonationStatus.PENDING: return 'bg-yellow-500 text-white';
      case DonationStatus.FAILED: return 'bg-palestine-red text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: DonationStatus) => {
    const statusTexts = {
      [DonationStatus.PENDING]: { ar: 'معلق', en: 'Pending' },
      [DonationStatus.COMPLETED]: { ar: 'مكتمل', en: 'Completed' },
      [DonationStatus.FAILED]: { ar: 'فشل', en: 'Failed' },
    };
    return language === 'ar' ? statusTexts[status]?.ar || status : statusTexts[status]?.en || status;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light">
        <Card className="max-w-md mx-auto shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2">{language === 'ar' ? 'مطلوب تسجيل الدخول' : 'Login Required'}</h2>
            <p className="text-muted-foreground mb-6">{language === 'ar' ? 'الرجاء تسجيل الدخول لعرض حسابك.' : 'Please login to view your account.'}</p>
            <Button onClick={() => onNavigate('login')} className="w-full bg-palestine-green hover:bg-palestine-green-dark">
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderDonationsTab = () => {
    if (isLoadingDonations) return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    if (isErrorDonations) return <div className="text-center text-red-500 p-4">Error loading donation history.</div>;

    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-palestine-red to-red-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Heart className="h-5 w-5" />
              <span>{language === 'ar' ? 'سجل التبرعات' : 'Donation History'}</span>
            </CardTitle>
            <Button variant="secondary" size="sm"><Download className="h-4 w-4 mr-2" />{language === 'ar' ? 'تصدير' : 'Export'}</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ar' ? 'المبلغ' : 'Amount'}</TableHead>
                  <TableHead>{language === 'ar' ? 'المنظمة' : 'Organization'}</TableHead>
                  <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                  <TableHead>TxID</TableHead>
                  <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead className="text-right">{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donationHistory && donationHistory.map((donation: Donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-bold text-palestine-green">
                      ${donation.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{donation.organization?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="truncate max-w-[100px] text-xs">
                      {donation.blockchain_tx_id}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(donation.status)}>
                        {getStatusText(donation.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light">
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
              <h1 className="text-2xl font-bold text-palestine-green">{language === 'ar' ? 'حسابي' : 'My Account'}</h1>
            </div>
            <Button onClick={() => onNavigate('profile')} className="bg-palestine-green hover:bg-palestine-green-dark">
              {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-white dark:bg-palestine-black-light shadow-lg">
            <TabsTrigger value="overview" className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4" />
              <span>{language === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
            </TabsTrigger>
            <TabsTrigger value="donations" className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-red data-[state=active]:text-white">
              <Heart className="h-4 w-4" />
              <span>{language === 'ar' ? 'التبرعات' : 'Donations'}</span>
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <ShoppingBag className="h-4 w-4" />
              <span>{language === 'ar' ? 'المشتريات' : 'Purchases'}</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              <Star className="h-4 w-4" />
              <span>{language === 'ar' ? 'التأثير' : 'Impact'}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">{/* Placeholder for Overview tab */}</TabsContent>
          <TabsContent value="donations">
            {renderDonationsTab()}
          </TabsContent>
          <TabsContent value="purchases">{/* Placeholder for Purchases tab */}</TabsContent>
          <TabsContent value="impact">{/* Placeholder for Impact tab */}</TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
