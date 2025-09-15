import { useState } from 'react';
import { Bell, X, AlertTriangle, CheckCircle, Info, Calendar, Gift, Heart, Truck, User } from 'lucide-react';
import { Button } from './ui/button';
//import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useTheme } from './contexts/ThemeContext';
import notificationBg from '../assets/shoppalestine.png';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'urgent';
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  time: string;
  icon: React.ReactNode;
  color: string;
  isRead: boolean;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { language } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'success',
      title: 'تم قبول طلب التبرع',
      titleEn: 'Donation Request Approved',
      description: 'تم قبول طلب التبرع الخاص بك بقيمة 100$ لدعم العائلات في غزة',
      descriptionEn: 'Your donation request of $100 to support families in Gaza has been approved',
      time: 'منذ دقيقتين',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'palestine-green',
      isRead: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'تحديث حالة الشحنة',
      titleEn: 'Shipment Status Update',
      description: 'شارف طلبك على الوصول - كوفية فلسطينية أصلية من الخليل',
      descriptionEn: 'Your order is about to arrive - Authentic Palestinian Keffiyeh from Hebron',
      time: 'منذ 15 دقيقة',
      icon: <Truck className="h-5 w-5" />,
      color: 'yellow-500',
      isRead: false
    },
    {
      id: 3,
      type: 'info',
      title: 'معرض التراث الفلسطيني',
      titleEn: 'Palestinian Heritage Exhibition',
      description: 'انضم إلينا في معرض التراث الفلسطيني الافتراضي يوم الجمعة',
      descriptionEn: 'Join us at the virtual Palestinian Heritage Exhibition on Friday',
      time: 'منذ ساعة',
      icon: <Calendar className="h-5 w-5" />,
      color: 'blue-500',
      isRead: true
    },
    {
      id: 4,
      type: 'urgent',
      title: 'تحديث حالة الطلبية',
      titleEn: 'Order Status Update',
      description: 'طلبيتك جاهزة للاستلام من مركز التوزيع في رام الله',
      descriptionEn: 'Your order is ready for pickup from the distribution center in Ramallah',
      time: 'منذ ساعتين',
      icon: <Gift className="h-5 w-5" />,
      color: 'palestine-red',
      isRead: true
    },
    {
      id: 5,
      type: 'success',
      title: 'شكراً لمشاركة القصة',
      titleEn: 'Thank You for Sharing the Story',
      description: 'تم نشر قصتك عن المقاومة الثقافية وحصلت على 50 إعجاب',
      descriptionEn: 'Your story about cultural resistance has been published and received 50 likes',
      time: 'منذ 3 ساعات',
      icon: <Heart className="h-5 w-5" />,
      color: 'palestine-green',
      isRead: true
    },
    {
      id: 6,
      type: 'info',
      title: 'عضو جديد في المجتمع',
      titleEn: 'New Community Member',
      description: 'مرحباً بالعضو الجديد أحمد محمد من القدس في مجتمع نبض فلسطين',
      descriptionEn: 'Welcome new member Ahmed Mohammed from Jerusalem to Palestine Pulse community',
      time: 'منذ 4 ساعات',
      icon: <User className="h-5 w-5" />,
      color: 'blue-500',
      isRead: true
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    donations: true,
    orders: true,
    community: false,
    marketing: true,
    security: true
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'palestine-green': return 'text-palestine-green';
      case 'palestine-red': return 'text-palestine-red';
      case 'yellow-500': return 'text-yellow-500';
      case 'blue-500': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getBgColor = (color: string) => {
    switch (color) {
      case 'palestine-green': return 'bg-palestine-green-50';
      case 'palestine-red': return 'bg-palestine-red-50';
      case 'yellow-500': return 'bg-yellow-50';
      case 'blue-500': return 'bg-blue-50';
      default: return 'bg-muted';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div 
        className="fixed right-4 top-16 w-96 max-h-[80vh] bg-background border border-border rounded-xl notification-center overflow-hidden animate-in slide-in-from-top-2 duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: `url(${notificationBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'soft-light'
        }}
      >
        {/* Header */}
        <div className="bg-background/95 backdrop-blur-md border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-6 w-6 text-palestine-green" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-palestine-red"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <h2 className="text-lg font-semibold">
                {language === 'ar' ? 'مركز الإشعارات' : 'Notification Center'}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  {language === 'ar' ? 'قراءة الكل' : 'Mark All Read'}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="text-xs text-destructive"
              >
                {language === 'ar' ? 'مسح الكل' : 'Clear All'}
              </Button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96 bg-background/90 backdrop-blur-sm">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">
                {language === 'ar' ? 'لا توجد إشعارات' : 'No Notifications'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'سنعلمك عند وصول إشعارات جديدة' : 'We\'ll notify you when new notifications arrive'}
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`relative cursor-pointer transition-all duration-200 hover:bg-muted/50 rounded-lg p-3 border-l-4 ${
                    notification.color === 'palestine-green' ? 'border-l-palestine-green' :
                    notification.color === 'palestine-red' ? 'border-l-palestine-red' :
                    notification.color === 'yellow-500' ? 'border-l-yellow-500' :
                    'border-l-blue-500'
                  } ${!notification.isRead ? 'bg-background/95 shadow-sm' : 'bg-background/70'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Indicator Circle */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-3 h-3 rounded-full ${
                        notification.color === 'palestine-green' ? 'bg-palestine-green' :
                        notification.color === 'palestine-red' ? 'bg-palestine-red' :
                        notification.color === 'yellow-500' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      } ${!notification.isRead ? 'animate-pulse' : 'opacity-50'}`}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm text-foreground">
                          {language === 'ar' ? notification.title : notification.titleEn}
                        </h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {notification.time}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                        {language === 'ar' ? notification.description : notification.descriptionEn}
                      </p>
                      
                      {/* Action Indicators */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`p-1 rounded ${getBgColor(notification.color)}`}>
                          <div className={`${getIconColor(notification.color)} opacity-80`}>
                            {notification.icon}
                          </div>
                        </div>
                        {!notification.isRead && (
                          <Badge variant="secondary" className="text-xs py-0 px-2">
                            {language === 'ar' ? 'جديد' : 'New'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-background/95 backdrop-blur-md border-t border-border p-4">
          <h3 className="font-medium mb-3 text-sm">
            {language === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}
          </h3>
          
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-palestine-green to-palestine-red p-4 rounded-lg text-white">
              <h4 className="text-sm font-medium mb-2">
                {language === 'ar' ? 'إحصائيات الإشعارات' : 'Notification Statistics'}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Statistics with Icons */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Gift className="h-4 w-4 mr-1" />
                    <span className="text-lg font-bold">5</span>
                  </div>
                  <div className="text-xs opacity-90">
                    {language === 'ar' ? 'تبرعاتك' : 'Your Donations'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-lg font-bold">7</span>
                  </div>
                  <div className="text-xs opacity-90">
                    {language === 'ar' ? 'الرسائل المرسلة' : 'Messages Sent'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Truck className="h-4 w-4 mr-1" />
                    <span className="text-lg font-bold">6</span>
                  </div>
                  <div className="text-xs opacity-90">
                    {language === 'ar' ? 'طلبات' : 'Orders'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <div className="text-xs opacity-90">
                    {language === 'ar' ? 'فعاليات' : 'Events'}
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Quick Settings */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'تنبيهات التبرعات' : 'Donation Alerts'}</span>
                <Switch 
                  checked={notificationSettings.donations}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, donations: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'تحديثات الطلبات' : 'Order Updates'}</span>
                <Switch 
                  checked={notificationSettings.orders}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, orders: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span>{language === 'ar' ? 'أخبار المجتمع' : 'Community News'}</span>
                <Switch 
                  checked={notificationSettings.community}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, community: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}