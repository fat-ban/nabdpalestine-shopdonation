import { Shield, Eye, TrendingUp, Users, DollarSign, CheckCircle, ArrowRight, BarChart3, PieChart, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useTheme } from './contexts/ThemeContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Project {
  id: number;
  title: string;
  description: string;
  category: 'education' | 'medical' | 'housing' | 'food';
  totalAmount: number;
  currentAmount: number;
  beneficiaries: number;
  location: string;
  image: string;
  completionDate?: string;
  status: 'active' | 'completed' | 'planned';
}

interface TransparencySectionProps {
  onNavigate?: (page: 'donate') => void;
}

export function TransparencySection({ onNavigate }: TransparencySectionProps) {
  const { t, language } = useTheme();

  const transparencyStats = [
    {
      icon: DollarSign,
      title: language === 'ar' ? 'إجمالي التبرعات' : 'Total Donations',
      value: '$2.4M',
      change: language === 'ar' ? '+15% هذا الشهر' : '+15% this month',
      color: 'text-palestine-green',
      bgColor: 'bg-palestine-green-50'
    },
    {
      icon: Users,
      title: language === 'ar' ? 'المستفيدون' : 'Beneficiaries',
      value: '12,450',
      change: language === 'ar' ? '+280 هذا الأسبوع' : '+280 this week',
      color: 'text-palestine-red',
      bgColor: 'bg-palestine-red-50'
    },
    {
      icon: CheckCircle,
      title: language === 'ar' ? 'المشاريع المكتملة' : 'Completed Projects',
      value: '87',
      change: language === 'ar' ? '5 مشاريع جديدة' : '5 new projects',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: language === 'ar' ? 'نسبة الشفافية' : 'Transparency Rate',
      value: '100%',
      change: language === 'ar' ? 'تتبع بلوك تشين' : 'Blockchain tracked',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const projects: Project[] = [
    {
      id: 1,
      title: language === 'ar' ? 'مدرسة الأمل - غزة' : 'Al-Amal School - Gaza',
      description: language === 'ar' 
        ? 'إعادة تأهيل مدرسة الأمل لتوفير التعليم لـ 500 طالب'
        : 'Rehabilitating Al-Amal School to provide education for 500 students',
      category: 'education',
      totalAmount: 50000,
      currentAmount: 45000,
      beneficiaries: 500,
      location: language === 'ar' ? 'غزة، فلسطين' : 'Gaza, Palestine',
      image: 'https://images.unsplash.com/photo-1603040555239-b38bdd348a0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHNjaG9vbCUyMGVkdWNhdGlvbiUyMHBhbGVzdGluZXxlbnwxfHx8fDE3NTUzNDMxMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      completionDate: '2024-09-15',
      status: 'active'
    },
    {
      id: 2,
      title: language === 'ar' ? 'مركز الرعاية الصحية' : 'Healthcare Center',
      description: language === 'ar'
        ? 'توفير المعدات الطبية والأدوية للمرضى'
        : 'Providing medical equipment and medicines for patients',
      category: 'medical',
      totalAmount: 75000,
      currentAmount: 75000,
      beneficiaries: 1200,
      location: language === 'ar' ? 'الضفة الغربية، فلسطين' : 'West Bank, Palestine',
      image: 'https://images.unsplash.com/photo-1595054103602-b61d4c10c660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwYWlkJTIwaHVtYW5pdGFyaWFuJTIwaGVscHxlbnwxfHx8fDE3NTUzNDMxMjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      completionDate: '2024-07-20',
      status: 'completed'
    },
    {
      id: 3,
      title: language === 'ar' ? 'إعادة بناء المنازل' : 'Housing Reconstruction',
      description: language === 'ar'
        ? 'إعادة بناء 20 منزل للعائلات المتضررة'
        : 'Rebuilding 20 homes for affected families',
      category: 'housing',
      totalAmount: 120000,
      currentAmount: 85000,
      beneficiaries: 80,
      location: language === 'ar' ? 'غزة، فلسطين' : 'Gaza, Palestine',
      image: 'https://images.unsplash.com/photo-1695509098533-e4b1ba1479f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBidWlsZGluZyUyMGhvdXNlc3xlbnwxfHx8fDE3NTUzNDMxMjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      status: 'active'
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      education: 'bg-blue-500',
      medical: 'bg-palestine-red',
      housing: 'bg-palestine-green',
      food: 'bg-orange-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      education: BarChart3,
      medical: Activity,
      housing: Users,
      food: PieChart
    };
    return icons[category as keyof typeof icons] || Shield;
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-palestine-flag"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-palestine-green text-white px-6 py-2 text-lg">
            <Shield className="h-5 w-5 mr-2" />
            {language === 'ar' ? 'شفافية 100%' : '100% Transparency'}
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {language === 'ar' ? 'تتبع شفاف لكل تبرع' : 'Transparent Tracking of Every Donation'}
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {language === 'ar'
              ? 'نستخدم تقنية البلوك تشين لضمان وصول كل ريال لمستحقيه مع إمكانية التتبع الكامل والشفافية المطلقة'
              : 'We use blockchain technology to ensure every dollar reaches its recipients with full tracking and absolute transparency'
            }
          </p>

          {/* Blockchain Visualization */}
          <div className="relative mb-12">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1660836709423-9e82461f957a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc3BhcmVuY3klMjBibG9ja2NoYWluJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTUzNDMxMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Blockchain Technology"
              className="w-full h-64 object-cover rounded-lg opacity-20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-8">
                <Eye className="h-16 w-16 text-palestine-green animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {transparencyStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <TrendingUp className={`h-5 w-5 ${stat.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                <p className={`text-sm font-medium ${stat.color}`}>{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Projects Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-foreground">
              {language === 'ar' ? 'المشاريع المدعومة حالياً' : 'Currently Supported Projects'}
            </h3>
            <Button 
              variant="outline" 
              className="border-palestine-green text-palestine-green hover:bg-palestine-green hover:text-white"
              onClick={() => onNavigate?.('donate')}
            >
              {language === 'ar' ? 'عرض جميع المشاريع' : 'View All Projects'}
              <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const CategoryIcon = getCategoryIcon(project.category);
              const progress = (project.currentAmount / project.totalAmount) * 100;

              return (
                <Card key={project.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="h-48 relative">
                    <ImageWithFallback 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getCategoryColor(project.category)} text-white`}>
                        <CategoryIcon className="h-4 w-4 mr-1" />
                        {project.category === 'education' && (language === 'ar' ? 'تعليم' : 'Education')}
                        {project.category === 'medical' && (language === 'ar' ? 'طبي' : 'Medical')}
                        {project.category === 'housing' && (language === 'ar' ? 'إسكان' : 'Housing')}
                        {project.category === 'food' && (language === 'ar' ? 'غذاء' : 'Food')}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                        {project.status === 'completed' && (language === 'ar' ? 'مكتمل' : 'Completed')}
                        {project.status === 'active' && (language === 'ar' ? 'نشط' : 'Active')}
                        {project.status === 'planned' && (language === 'ar' ? 'مخطط' : 'Planned')}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg mb-1">{project.title}</h4>
                      <p className="text-sm opacity-90">{project.location}</p>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>${project.currentAmount.toLocaleString()}</span>
                          <span>${project.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-palestine-green" />
                          <span>{project.beneficiaries} {language === 'ar' ? 'مستفيد' : 'beneficiaries'}</span>
                        </div>
                        {project.completionDate && (
                          <div className="text-muted-foreground">
                            {language === 'ar' ? 'الإنجاز: ' : 'Due: '}
                            {new Date(project.completionDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-palestine-green to-palestine-red rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-palestine-flag opacity-10"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'كن جزءاً من التغيير' : 'Be Part of the Change'}
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'تبرعك اليوم سيصل مباشرة للمحتاجين مع ضمان الشفافية الكاملة والتتبع المستمر'
                : 'Your donation today will reach those in need directly with guaranteed full transparency and continuous tracking'
              }
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-palestine-red hover:bg-gray-100 px-8 py-3 text-lg"
              onClick={() => onNavigate?.('donate')}
            >
              {language === 'ar' ? 'تبرع الآن' : 'Donate Now'}
              <ArrowRight className={`h-5 w-5 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}