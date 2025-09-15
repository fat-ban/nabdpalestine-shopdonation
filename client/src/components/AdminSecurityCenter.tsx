import { useState, useEffect } from 'react';
import { Shield, Activity, AlertTriangle, Users, Lock, Eye, Download, RefreshCw, Bell, Settings, Database, Server, Globe, Wifi, HardDrive, Cpu, Monitor, Calendar, Clock, Map, UserCheck, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { useTheme } from './contexts/ThemeContext';

interface SecurityLog {
  id: string;
  timestamp: Date;
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user?: string;
  ip: string;
  details: string;
  status: 'resolved' | 'investigating' | 'blocked';
}

interface SystemMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  lastCheck: Date;
}

interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  isRead: boolean;
}

export function AdminSecurityCenter() {
  const { language } = useTheme();
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      updateMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const initializeMockData = () => {
    // Mock security logs
    const logs: SecurityLog[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        event: 'Failed Admin Login',
        severity: 'high',
        user: 'unknown@example.com',
        ip: '192.168.1.100',
        details: 'Multiple failed login attempts detected',
        status: 'investigating'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        event: 'Successful Admin Access',
        severity: 'low',
        user: 'admin@palestine-pulse.com',
        ip: '192.168.1.50',
        details: 'Admin dashboard accessed successfully',
        status: 'resolved'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        event: 'Suspicious File Upload',
        severity: 'critical',
        ip: '10.0.0.45',
        details: 'Attempted upload of potentially malicious file',
        status: 'blocked'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
        event: 'Rate Limit Exceeded',
        severity: 'medium',
        ip: '203.45.67.89',
        details: 'API rate limit exceeded from external IP',
        status: 'resolved'
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1500000), // 25 minutes ago
        event: 'Database Access',
        severity: 'low',
        user: 'system',
        ip: 'localhost',
        details: 'Automated database backup completed',
        status: 'resolved'
      }
    ];

    // Mock system metrics
    const metrics: SystemMetric[] = [
      {
        name: language === 'ar' ? 'استخدام المعالج' : 'CPU Usage',
        value: 35,
        status: 'healthy',
        lastCheck: new Date()
      },
      {
        name: language === 'ar' ? 'استخدام الذاكرة' : 'Memory Usage',
        value: 68,
        status: 'warning',
        lastCheck: new Date()
      },
      {
        name: language === 'ar' ? 'مساحة التخزين' : 'Disk Space',
        value: 45,
        status: 'healthy',
        lastCheck: new Date()
      },
      {
        name: language === 'ar' ? 'اتصال قاعدة البيانات' : 'Database Connection',
        value: 100,
        status: 'healthy',
        lastCheck: new Date()
      },
      {
        name: language === 'ar' ? 'استجابة الخادم' : 'Server Response',
        value: 95,
        status: 'healthy',
        lastCheck: new Date()
      },
      {
        name: language === 'ar' ? 'الأمان' : 'Security Status',
        value: 88,
        status: 'warning',
        lastCheck: new Date()
      }
    ];

    // Mock security alerts
    const alerts: SecurityAlert[] = [
      {
        id: '1',
        title: language === 'ar' ? 'محاولات دخول مشبوهة' : 'Suspicious Login Attempts',
        description: language === 'ar' ? 'تم رصد محاولات دخول متعددة من عناوين IP مختلفة' : 'Multiple login attempts detected from different IP addresses',
        severity: 'high',
        timestamp: new Date(Date.now() - 120000),
        isRead: false
      },
      {
        id: '2',
        title: language === 'ar' ? 'تحديث أمني متاح' : 'Security Update Available',
        description: language === 'ar' ? 'يوجد تحديث أمني مهم للنظام' : 'Important security update available for the system',
        severity: 'medium',
        timestamp: new Date(Date.now() - 3600000),
        isRead: false
      },
      {
        id: '3',
        title: language === 'ar' ? 'نسخ احتياطي مجدول' : 'Backup Scheduled',
        description: language === 'ar' ? 'سيتم إنشاء نسخة احتياطية خلال ساعة' : 'Automated backup will start in 1 hour',
        severity: 'low',
        timestamp: new Date(Date.now() - 7200000),
        isRead: true
      }
    ];

    setSecurityLogs(logs);
    setSystemMetrics(metrics);
    setSecurityAlerts(alerts);
  };

  const updateMetrics = () => {
    setSystemMetrics(prev => prev.map(metric => ({
      ...metric,
      value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10)),
      lastCheck: new Date()
    })));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <Shield className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <Ban className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">
                  {language === 'ar' ? 'الحالة الأمنية' : 'Security Status'}
                </p>
                <p className="text-2xl font-bold">
                  {language === 'ar' ? 'آمن' : 'Secure'}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">
                  {language === 'ar' ? 'الجلسات النشطة' : 'Active Sessions'}
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">
                  {language === 'ar' ? 'التنبيهات المعلقة' : 'Pending Alerts'}
                </p>
                <p className="text-2xl font-bold">{securityAlerts.filter(a => !a.isRead).length}</p>
              </div>
              <Bell className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">
                  {language === 'ar' ? 'النشاط اليومي' : 'Daily Activity'}
                </p>
                <p className="text-2xl font-bold">89%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Center Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-white dark:bg-palestine-black-light shadow-lg">
          <TabsTrigger 
            value="overview" 
            className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
          >
            <Monitor className="h-4 w-4" />
            <span>{language === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="logs" 
            className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
          >
            <Activity className="h-4 w-4" />
            <span>{language === 'ar' ? 'السجلات' : 'Logs'}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="alerts" 
            className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4" />
            <span>{language === 'ar' ? 'التنبيهات' : 'Alerts'}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="system" 
            className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
          >
            <Server className="h-4 w-4" />
            <span>{language === 'ar' ? 'النظام' : 'System'}</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* System Health */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Database className="h-5 w-5" />
                  <span>{language === 'ar' ? 'صحة النظام' : 'System Health'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {systemMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-sm text-muted-foreground">{metric.value}%</span>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(metric.status)}`}></div>
                        </div>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Security Events */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-palestine-red to-orange-500 text-white">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Shield className="h-5 w-5" />
                  <span>{language === 'ar' ? 'الأحداث الأمنية الأخيرة' : 'Recent Security Events'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {securityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-muted/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(log.severity)}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{log.event}</p>
                        <p className="text-xs text-muted-foreground">{log.timestamp.toLocaleString()}</p>
                      </div>
                      <Badge 
                        className={`text-xs ${
                          log.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                          log.status === 'investigating' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}
                      >
                        {language === 'ar' ? 
                          (log.status === 'resolved' ? 'محلول' : log.status === 'investigating' ? 'قيد التحقيق' : 'محظور') :
                          log.status
                        }
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-palestine-green to-blue-500 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Activity className="h-5 w-5" />
                  <span>{language === 'ar' ? 'سجل الأحداث الأمنية' : 'Security Event Logs'}</span>
                </CardTitle>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button variant="secondary" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'تحديث' : 'Refresh'}
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'تصدير' : 'Export'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ar' ? 'الحدث' : 'Event'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الخطورة' : 'Severity'}</TableHead>
                      <TableHead>{language === 'ar' ? 'المستخدم' : 'User'}</TableHead>
                      <TableHead>{language === 'ar' ? 'عنوان IP' : 'IP Address'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الوقت' : 'Time'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            {getSeverityIcon(log.severity)}
                            <span className="font-medium">{log.event}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getSeverityColor(log.severity)} text-white`}>
                            {language === 'ar' ? 
                              (log.severity === 'low' ? 'منخفض' : 
                               log.severity === 'medium' ? 'متوسط' : 
                               log.severity === 'high' ? 'عالي' : 'حرج') :
                              log.severity
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>{log.user || '-'}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                        <TableCell>{log.timestamp.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`${
                              log.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                              log.status === 'investigating' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                            }`}
                          >
                            {language === 'ar' ? 
                              (log.status === 'resolved' ? 'محلول' : log.status === 'investigating' ? 'قيد التحقيق' : 'محظور') :
                              log.status
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Bell className="h-5 w-5" />
                <span>{language === 'ar' ? 'التنبيهات الأمنية' : 'Security Alerts'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <Alert key={alert.id} className={`${alert.isRead ? 'opacity-75' : ''}`}>
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <div className={`mt-1 w-2 h-2 rounded-full ${getSeverityColor(alert.severity)}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{alert.title}</h4>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Badge className={`${getSeverityColor(alert.severity)} text-white text-xs`}>
                              {language === 'ar' ? 
                                (alert.severity === 'low' ? 'منخفض' : 
                                 alert.severity === 'medium' ? 'متوسط' : 
                                 alert.severity === 'high' ? 'عالي' : 'حرج') :
                                alert.severity
                              }
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {alert.timestamp.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <AlertDescription className="text-sm">
                          {alert.description}
                        </AlertDescription>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse mt-3">
                          <Button variant="outline" size="sm">
                            {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                          </Button>
                          {!alert.isRead && (
                            <Button variant="ghost" size="sm">
                              {language === 'ar' ? 'تم القراءة' : 'Mark as Read'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Status Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Server Status */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Server className="h-5 w-5" />
                  <span>{language === 'ar' ? 'حالة الخادم' : 'Server Status'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { name: language === 'ar' ? 'الويب سيرفر' : 'Web Server', status: 'online', uptime: '99.9%' },
                    { name: language === 'ar' ? 'قاعدة البيانات' : 'Database', status: 'online', uptime: '99.7%' },
                    { name: language === 'ar' ? 'التخزين السحابي' : 'Cloud Storage', status: 'online', uptime: '99.8%' },
                    { name: language === 'ar' ? 'البريد الإلكتروني' : 'Email Service', status: 'maintenance', uptime: '98.5%' },
                    { name: language === 'ar' ? 'نظام الدفع' : 'Payment Gateway', status: 'online', uptime: '100%' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className={`w-3 h-3 rounded-full ${
                          service.status === 'online' ? 'bg-green-500' :
                          service.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                        } animate-pulse`}></div>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{service.uptime}</div>
                        <div className="text-xs text-muted-foreground">
                          {language === 'ar' ? 'وقت التشغيل' : 'Uptime'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resource Usage */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Cpu className="h-5 w-5" />
                  <span>{language === 'ar' ? 'استخدام الموارد' : 'Resource Usage'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {systemMetrics.slice(0, 4).map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <span className="text-sm text-muted-foreground">{metric.value}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            metric.value < 50 ? 'bg-green-500' :
                            metric.value < 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}