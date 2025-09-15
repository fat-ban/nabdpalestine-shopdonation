import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Users, Activity, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useTheme } from './contexts/ThemeContext';

interface QuickStat {
  id: string;
  label: string;
  labelAr: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  status: 'good' | 'warning' | 'danger';
  icon: React.ComponentType<any>;
}

export function AdminQuickStats() {
  const { language } = useTheme();
  const [stats, setStats] = useState<QuickStat[]>([]);

  useEffect(() => {
    // Mock real-time data
    const updateStats = () => {
      const newStats: QuickStat[] = [
        {
          id: 'security_score',
          label: 'Security Score',
          labelAr: 'نقاط الأمان',
          value: '94%',
          change: 2.5,
          changeType: 'increase',
          status: 'good',
          icon: Shield
        },
        {
          id: 'active_threats',
          label: 'Active Threats',
          labelAr: 'التهديدات النشطة',
          value: 3,
          change: -1,
          changeType: 'decrease',
          status: 'warning',
          icon: AlertTriangle
        },
        {
          id: 'online_users',
          label: 'Online Users',
          labelAr: 'المستخدمين المتصلين',
          value: 1247,
          change: 15.2,
          changeType: 'increase',
          status: 'good',
          icon: Users
        },
        {
          id: 'system_uptime',
          label: 'System Uptime',
          labelAr: 'وقت تشغيل النظام',
          value: '99.8%',
          change: 0.1,
          changeType: 'increase',
          status: 'good',
          icon: Activity
        }
      ];
      setStats(newStats);
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'danger': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getChangeIcon = (changeType: string, change: number) => {
    if (change === 0) return null;
    
    if (changeType === 'increase') {
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    } else if (changeType === 'decrease') {
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    }
    return null;
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600 dark:text-green-400';
      case 'decrease': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-palestine-black border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className={`p-2 rounded-lg ${
                  stat.status === 'good' ? 'bg-green-100 dark:bg-green-900/20' :
                  stat.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  'bg-red-100 dark:bg-red-900/20'
                }`}>
                  <IconComponent className={`h-4 w-4 ${getStatusColor(stat.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">
                    {language === 'ar' ? stat.labelAr : stat.label}
                  </p>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="font-medium text-sm">{stat.value}</span>
                    {stat.change !== 0 && (
                      <div className={`flex items-center space-x-1 rtl:space-x-reverse ${getChangeColor(stat.changeType)}`}>
                        {getChangeIcon(stat.changeType, stat.change)}
                        <span className="text-xs">
                          {Math.abs(stat.change)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}