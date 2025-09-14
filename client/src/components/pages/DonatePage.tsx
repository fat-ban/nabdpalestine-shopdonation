import React from 'react';
import { useState, useEffect } from 'react';
import { Heart, Shield, Users, BookOpen, Home, Activity, DollarSign, CreditCard, Smartphone, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTheme } from '../contexts/ThemeContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useCreateDonationMutation, useGetDonationCausesQuery } from '../../features/donations/donationsApiSlice';
import { DonationType } from '../../features/donations/types';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function DonatePage() {
  const { t, language } = useTheme();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState<DonationType>(DonationType.PURCHASE);
  const [activeTab, setActiveTab] = useState('donate');

  const [createDonation, { isLoading: isCreatingDonation, isSuccess, isError, error }] = useCreateDonationMutation();
  const { data: donationCauses, isLoading: isLoadingCauses, isError: isErrorCauses } = useGetDonationCausesQuery();


  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const currentAmount = selectedAmount || parseFloat(customAmount) || 0;

  const handleDonate = async () => {
    if (currentAmount > 0) {
      try {
        await createDonation({
          amount: currentAmount,
          type: donationType,
          organizationId: 1 // Example organizationId
        }).unwrap();
      } catch (err) {
        // Error is handled by isError and error state
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(language === 'ar' ? 'شكراً لتبرعك!' : 'Thank you for your donation!');
      setSelectedAmount(null);
      setCustomAmount('');
    }
    if (isError) {
      toast.error(language === 'ar' ? 'حدث خطأ ما.' : 'An error occurred.');
      console.error(error);
    }
  }, [isSuccess, isError, error, language]);

  const paymentMethods = [
    { id: 'card', name: language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card', icon: CreditCard },
    { id: 'paypal', name: 'PayPal', icon: DollarSign },
    { id: 'mobile', name: language === 'ar' ? 'محفظة إلكترونية' : 'Mobile Wallet', icon: Smartphone },
  ];

  const handleCauseDonate = (causeId: DonationType) => {
    setDonationType(causeId);
    setActiveTab('donate');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-palestine-red via-palestine-white to-palestine-green py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-palestine-flag opacity-10"></div>

        {/* Hero Background Image */}
        <div className="absolute inset-0 opacity-15">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1637866482875-55ef85ca771d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzb2xpZGFyaXR5JTIwaGFuZHN8ZW58MXx8fHwxNzU1MzQyNjExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Community Solidarity"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/70 to-background/85"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-palestine-red text-white px-4 py-2">
              <Heart className="h-4 w-4 mr-2 animate-heartbeat" />
              {language === 'ar' ? 'تبرع شفاف 100%' : '100% Transparent Donations'}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-palestine-black">
              {t('donateTitle')}
            </h1>

            <p className="text-xl text-palestine-black mb-8 max-w-3xl mx-auto">
              {t('donateDescription')}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-palestine-red">$250K+</div>
                <div className="text-sm text-palestine-black/70">
                  {language === 'ar' ? 'تم جمعه' : 'Raised'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-palestine-green">5K+</div>
                <div className="text-sm text-palestine-black/70">
                  {language === 'ar' ? 'متبرع' : 'Donors'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-palestine-red">15</div>
                <div className="text-sm text-palestine-black/70">
                  {language === 'ar' ? 'مشروع' : 'Projects'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-palestine-green">95%</div>
                <div className="text-sm text-palestine-black/70">
                  {language === 'ar' ? 'شفافية' : 'Transparency'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="donate" className="text-lg">
              {language === 'ar' ? 'تبرع الآن' : 'Donate Now'}
            </TabsTrigger>
            <TabsTrigger value="causes" className="text-lg">
              {language === 'ar' ? 'الأسباب' : 'Causes'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donate" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Donation Form */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Heart className="h-6 w-6 text-palestine-red animate-heartbeat" />
                    {language === 'ar' ? 'اختر مبلغ التبرع' : 'Choose Donation Amount'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar'
                      ? 'كل ريال يصل مباشرة للمحتاجين مع ضمان الشفافية الكاملة'
                      : 'Every dollar goes directly to those in need with full transparency guaranteed'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quick Amount Selection */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      {language === 'ar' ? 'مبالغ سريعة' : 'Quick Amounts'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={selectedAmount === amount ? "default" : "outline"}
                          className={`h-12 ${
                            selectedAmount === amount
                              ? 'bg-palestine-red hover:bg-palestine-red-dark text-white'
                              : 'hover:border-palestine-red hover:text-palestine-red'
                          }`}
                          onClick={() => handleAmountSelect(amount)}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {language === 'ar' ? 'مبلغ مخصص' : 'Custom Amount'}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10'} h-12 text-lg`}
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Donation Type */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {language === 'ar' ? 'نوع التبرع' : 'Donation Type'}
                    </label>
                    <Select value={donationType} onValueChange={(value) => setDonationType(value as DonationType)}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={DonationType.PURCHASE}>{language === 'ar' ? 'شراء' : 'Purchase'}</SelectItem>
                        <SelectItem value={DonationType.DIRECT}>{language === 'ar' ? 'مباشر' : 'Direct'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {paymentMethods.map((method) => (
                        <Button
                          key={method.id}
                          variant="outline"
                          className="h-12 flex flex-col gap-1 hover:border-palestine-red hover:text-palestine-red"
                        >
                          <method.icon className="h-4 w-4" />
                          <span className="text-xs">{method.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Donate Button */}
                  <Button
                    className="w-full h-12 bg-palestine-red hover:bg-palestine-red-dark text-white text-lg"
                    disabled={currentAmount === 0 || isCreatingDonation}
                    onClick={handleDonate}
                  >
                    {isCreatingDonation
                      ? (language === 'ar' ? 'جارٍ التبرع...' : 'Donating...')
                      : (language === 'ar'
                        ? `تبرع بمبلغ $${currentAmount.toFixed(2)}`
                        : `Donate $${currentAmount.toFixed(2)}`)
                    }
                  </Button>

                  {/* Security Note */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Shield className="h-4 w-4 text-palestine-green" />
                    <span>
                      {language === 'ar'
                        ? 'تبرعك آمن ومشفر بتقنية البلوك تشين'
                        : 'Your donation is secure and encrypted with blockchain technology'
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Preview */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {language === 'ar' ? 'أثر تبرعك' : 'Your Impact'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar'
                      ? 'اعرف كيف سيساعد تبرعك الفلسطينيين'
                      : 'See how your donation will help Palestinians'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentAmount > 0 && (
                    <div className="bg-palestine-green-50 dark:bg-palestine-green-dark/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-palestine-green-dark mb-3">
                        {language === 'ar'
                          ? `تبرعك بمبلغ $${currentAmount.toFixed(2)} سيوفر:`
                          : `Your $${currentAmount.toFixed(2)} donation will provide:`
                        }
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-palestine-red rounded-full"></div>
                          {language === 'ar'
                            ? `${Math.floor(currentAmount / 5)} وجبات للأطفال`
                            : `${Math.floor(currentAmount / 5)} meals for children`
                          }
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-palestine-green rounded-full"></div>
                          {language === 'ar'
                            ? `${Math.floor(currentAmount / 10)} كتب مدرسية`
                            : `${Math.floor(currentAmount / 10)} school books`
                          }
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-palestine-black rounded-full"></div>
                          {language === 'ar'
                            ? `${Math.floor(currentAmount / 15)} أدوية طبية` : `${Math.floor(currentAmount / 15)} medical supplies`}
                        </li>
                      </ul>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-semibold">
                      {language === 'ar' ? 'توزيع التبرعات' : 'Donation Distribution'}
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{language === 'ar' ? 'المساعدات المباشرة' : 'Direct Aid'}</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{language === 'ar' ? 'التعليم والصحة' : 'Education & Health'}</span>
                          <span>20%</span>
                        </div>
                        <Progress value={20} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{language === 'ar' ? 'تشغيل المنصة' : 'Platform Operations'}</span>
                          <span>5%</span>
                        </div>
                        <Progress value={5} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">
                      {language === 'ar' ? 'ضمان الشفافية' : 'Transparency Guarantee'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar'
                        ? 'نستخدم تقنية البلوك تشين لضمان وصول كل ريال لمستحقيه مع إمكانية التتبع الكامل'
                        : 'We use blockchain technology to ensure every dollar reaches its recipients with full tracking capability'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="causes">
            {isLoadingCauses ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : isErrorCauses ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{language === 'ar' ? 'خطأ' : 'Error'}</AlertTitle>
                <AlertDescription>
                  {language === 'ar' ? 'فشل تحميل أسباب التبرع. يرجى المحاولة مرة أخرى في وقت لاحق.' : 'Failed to load donation causes. Please try again later.'}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {donationCauses?.map((cause) => (
                  <Card key={cause.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 ${cause.color} rounded-full flex items-center justify-center text-white`}>

                          <IconComponent iconName={cause.icon} className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{cause.title}</CardTitle>
                          <CardDescription>{cause.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>
                            {language === 'ar' ? 'تم جمع' : 'Raised'}: ${cause.raised.toLocaleString()}
                          </span>
                          <span>
                            {language === 'ar' ? 'الهدف' : 'Goal'}: ${cause.goal.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={(cause.raised / cause.goal) * 100} className="h-3" />
                        <div className="text-sm text-muted-foreground mt-1">
                          {Math.round((cause.raised / cause.goal) * 100)}% {language === 'ar' ? 'مكتمل' : 'completed'}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm text-muted-foreground">
                          {cause.supporters.toLocaleString()} {language === 'ar' ? 'متبرع' : 'supporters'}
                        </div>
                        <Button
                          className="bg-palestine-red hover:bg-palestine-red-dark text-white"
                          onClick={() => handleCauseDonate(cause.id as DonationType)}
                        >
                          {language === 'ar' ? 'تبرع الآن' : 'Donate Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// A helper component to dynamically render icons
const IconComponent = ({ iconName, ...props }) => {
  const Icon = {
    BookOpen,
    Users,
    Home,
    Activity,
  }[iconName];

  return Icon ? <Icon {...props} /> : null;
};
