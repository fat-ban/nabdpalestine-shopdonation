import { useState } from 'react';
import { Users, Shield, Key, Lock, Plus, Edit3, Trash2, Eye, Check, X, Crown, UserCheck, Settings, AlertTriangle, Save, BarChart3, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { useTheme } from './contexts/ThemeContext';

interface Permission {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'users' | 'products' | 'donations' | 'analytics' | 'system' | 'security';
}

interface Role {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  color: string;
  level: number;
  permissions: string[];
  isSystem: boolean;
  usersCount: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
}

export function AdminRoleManager() {
  const { language } = useTheme();
  const [activeTab, setActiveTab] = useState('roles');
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mock permissions data
  const permissions: Permission[] = [
    { id: 'users_view', name: 'View Users', nameAr: 'عرض المستخدمين', description: 'Can view user list', descriptionAr: 'يمكن عرض قائمة المستخدمين', category: 'users' },
    { id: 'users_create', name: 'Create Users', nameAr: 'إنشاء المستخدمين', description: 'Can create new users', descriptionAr: 'يمكن إنشاء مستخدمين جدد', category: 'users' },
    { id: 'users_edit', name: 'Edit Users', nameAr: 'تعديل المستخدمين', description: 'Can modify user data', descriptionAr: 'يمكن تعديل بيانات المستخدمين', category: 'users' },
    { id: 'users_delete', name: 'Delete Users', nameAr: 'حذف المستخدمين', description: 'Can delete users', descriptionAr: 'يمكن حذف المستخدمين', category: 'users' },
    
    { id: 'products_view', name: 'View Products', nameAr: 'عرض المنتجات', description: 'Can view product list', descriptionAr: 'يمكن عرض قائمة المنتجات', category: 'products' },
    { id: 'products_create', name: 'Create Products', nameAr: 'إنشاء المنتجات', description: 'Can create new products', descriptionAr: 'يمكن إنشاء منتجات جديدة', category: 'products' },
    { id: 'products_edit', name: 'Edit Products', nameAr: 'تعديل المنتجات', description: 'Can modify product data', descriptionAr: 'يمكن تعديل بيانات المنتجات', category: 'products' },
    { id: 'products_delete', name: 'Delete Products', nameAr: 'حذف المنتجات', description: 'Can delete products', descriptionAr: 'يمكن حذف المنتجات', category: 'products' },
    
    { id: 'donations_view', name: 'View Donations', nameAr: 'عرض التبرعات', description: 'Can view donation records', descriptionAr: 'يمكن عرض سجلات التبرعات', category: 'donations' },
    { id: 'donations_manage', name: 'Manage Donations', nameAr: 'إدارة التبرعات', description: 'Can manage donation campaigns', descriptionAr: 'يمكن إدارة حملات التبرع', category: 'donations' },
    
    { id: 'analytics_view', name: 'View Analytics', nameAr: 'عرض التحليلات', description: 'Can view analytics and reports', descriptionAr: 'يمكن عرض التحليلات والتقارير', category: 'analytics' },
    { id: 'analytics_export', name: 'Export Data', nameAr: 'تصدير البيانات', description: 'Can export system data', descriptionAr: 'يمكن تصدير بيانات النظام', category: 'analytics' },
    
    { id: 'system_settings', name: 'System Settings', nameAr: 'إعدادات النظام', description: 'Can modify system settings', descriptionAr: 'يمكن تعديل إعدادات النظام', category: 'system' },
    { id: 'system_backup', name: 'System Backup', nameAr: 'نسخ احتياطي', description: 'Can create system backups', descriptionAr: 'يمكن إنشاء نسخ احتياطية', category: 'system' },
    
    { id: 'security_logs', name: 'Security Logs', nameAr: 'سجلات الأمان', description: 'Can view security logs', descriptionAr: 'يمكن عرض سجلات الأمان', category: 'security' },
    { id: 'security_manage', name: 'Security Management', nameAr: 'إدارة الأمان', description: 'Can manage security settings', descriptionAr: 'يمكن إدارة إعدادات الأمان', category: 'security' },
    { id: 'roles_manage', name: 'Role Management', nameAr: 'إدارة الأدوار', description: 'Can manage roles and permissions', descriptionAr: 'يمكن إدارة الأدوار والصلاحيات', category: 'security' }
  ];

  // Mock roles data
  const roles: Role[] = [
    {
      id: 'super_admin',
      name: 'Super Administrator',
      nameAr: 'مدير النظام الأعلى',
      description: 'Full system access with all permissions',
      descriptionAr: 'وصول كامل للنظام مع جميع الصلاحيات',
      color: 'bg-red-500',
      level: 10,
      permissions: permissions.map(p => p.id),
      isSystem: true,
      usersCount: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'admin',
      name: 'Administrator',
      nameAr: 'مدير',
      description: 'Administrative access with most permissions',
      descriptionAr: 'وصول إداري مع معظم الصلاحيات',
      color: 'bg-orange-500',
      level: 8,
      permissions: ['users_view', 'users_create', 'users_edit', 'products_view', 'products_create', 'products_edit', 'donations_view', 'donations_manage', 'analytics_view'],
      isSystem: false,
      usersCount: 3,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-15'
    },
    {
      id: 'manager',
      name: 'Manager',
      nameAr: 'مسؤول',
      description: 'Management access with limited permissions',
      descriptionAr: 'وصول إدارة مع صلاحيات محدودة',
      color: 'bg-blue-500',
      level: 6,
      permissions: ['users_view', 'products_view', 'products_create', 'products_edit', 'donations_view', 'analytics_view'],
      isSystem: false,
      usersCount: 5,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-20'
    },
    {
      id: 'moderator',
      name: 'Moderator',
      nameAr: 'منسق',
      description: 'Content moderation and basic management',
      descriptionAr: 'إشراف على المحتوى والإدارة الأساسية',
      color: 'bg-green-500',
      level: 4,
      permissions: ['users_view', 'products_view', 'donations_view'],
      isSystem: false,
      usersCount: 8,
      createdAt: '2024-01-04',
      updatedAt: '2024-01-25'
    },
    {
      id: 'user',
      name: 'User',
      nameAr: 'مستخدم',
      description: 'Basic user access',
      descriptionAr: 'وصول مستخدم أساسي',
      color: 'bg-gray-500',
      level: 1,
      permissions: [],
      isSystem: true,
      usersCount: 12534,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  // Mock users data
  const users: User[] = [
    {
      id: '1',
      name: 'أحمد محمد الأدمن',
      email: 'admin@palestine-pulse.com',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-01-15 14:30',
      permissions: []
    },
    {
      id: '2',
      name: 'فاطمة أحمد',
      email: 'fatima@palestine-pulse.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15 12:15',
      permissions: ['analytics_export']
    },
    {
      id: '3',
      name: 'محمد حسن',
      email: 'mohammed@palestine-pulse.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-14 16:45',
      permissions: []
    },
    {
      id: '4',
      name: 'سارة علي',
      email: 'sarah@palestine-pulse.com',
      role: 'moderator',
      status: 'inactive',
      lastLogin: '2024-01-10 09:20',
      permissions: ['products_edit']
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'users': return <Users className="h-4 w-4" />;
      case 'products': return <Shield className="h-4 w-4" />;
      case 'donations': return <Heart className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      case 'security': return <Lock className="h-4 w-4" />;
      default: return <Key className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'users': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'products': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'donations': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'analytics': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'system': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'security': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getRoleByTitle = (roleId: string) => {
    return roles.find(r => r.id === roleId);
  };

  const CreateRoleDialog = () => (
    <Dialog open={showCreateRole} onOpenChange={setShowCreateRole}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Plus className="h-5 w-5 text-palestine-green" />
            <span>{language === 'ar' ? 'إنشاء دور جديد' : 'Create New Role'}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium">{language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{language === 'ar' ? 'اسم الدور (إنجليزي)' : 'Role Name (English)'}</label>
                <Input placeholder={language === 'ar' ? 'أدخل اسم الدور' : 'Enter role name'} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{language === 'ar' ? 'اسم الدور (عربي)' : 'Role Name (Arabic)'}</label>
                <Input placeholder={language === 'ar' ? 'أدخل اسم الدور' : 'Enter role name'} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{language === 'ar' ? 'الوصف' : 'Description'}</label>
              <Textarea placeholder={language === 'ar' ? 'وصف الدور وصلاحياته' : 'Describe the role and its permissions'} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{language === 'ar' ? 'مستوى الدور' : 'Role Level'}</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ar' ? 'اختر المستوى' : 'Select level'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - {language === 'ar' ? 'أساسي' : 'Basic'}</SelectItem>
                    <SelectItem value="3">3 - {language === 'ar' ? 'متوسط' : 'Intermediate'}</SelectItem>
                    <SelectItem value="5">5 - {language === 'ar' ? 'متقدم' : 'Advanced'}</SelectItem>
                    <SelectItem value="7">7 - {language === 'ar' ? 'إداري' : 'Administrative'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{language === 'ar' ? 'لون الدور' : 'Role Color'}</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ar' ? 'اختر اللون' : 'Select color'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-blue-500">{language === 'ar' ? 'أزرق' : 'Blue'}</SelectItem>
                    <SelectItem value="bg-green-500">{language === 'ar' ? 'أخضر' : 'Green'}</SelectItem>
                    <SelectItem value="bg-purple-500">{language === 'ar' ? 'بنفسجي' : 'Purple'}</SelectItem>
                    <SelectItem value="bg-orange-500">{language === 'ar' ? 'برتقالي' : 'Orange'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="font-medium">{language === 'ar' ? 'الصلاحيات' : 'Permissions'}</h3>
            <div className="space-y-4">
              {['users', 'products', 'donations', 'analytics', 'system', 'security'].map(category => (
                <Card key={category} className="border">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center space-x-2 rtl:space-x-reverse">
                      {getCategoryIcon(category)}
                      <span>
                        {language === 'ar' ? 
                          (category === 'users' ? 'المستخدمين' :
                           category === 'products' ? 'المنتجات' :
                           category === 'donations' ? 'التبرعات' :
                           category === 'analytics' ? 'التحليلات' :
                           category === 'system' ? 'النظام' : 'الأمان') :
                          category.charAt(0).toUpperCase() + category.slice(1)
                        }
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {permissions.filter(p => p.category === category).map(permission => (
                        <div key={permission.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {language === 'ar' ? permission.nameAr : permission.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {language === 'ar' ? permission.descriptionAr : permission.description}
                            </p>
                          </div>
                          <Switch />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateRole(false)}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button className="bg-palestine-green hover:bg-palestine-green-dark">
              <Save className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'إنشاء الدور' : 'Create Role'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {language === 'ar' ? 'إدارة الأدوار والصلاحيات' : 'Role & Permission Management'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'إدارة أدوار المستخدمين وصلاحيات الوصول للنظام'
              : 'Manage user roles and system access permissions'
            }
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateRole(true)}
          className="bg-palestine-green hover:bg-palestine-green-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          {language === 'ar' ? 'إنشاء دور جديد' : 'Create New Role'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">{language === 'ar' ? 'إجمالي الأدوار' : 'Total Roles'}</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
              <Crown className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">{language === 'ar' ? 'إجمالي الصلاحيات' : 'Total Permissions'}</p>
                <p className="text-2xl font-bold">{permissions.length}</p>
              </div>
              <Key className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">{language === 'ar' ? 'المستخدمين النشطين' : 'Active Users'}</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">{language === 'ar' ? 'الأدوار المخصصة' : 'Custom Roles'}</p>
                <p className="text-2xl font-bold">{roles.filter(r => !r.isSystem).length}</p>
              </div>
              <Settings className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 h-auto p-1 bg-white dark:bg-palestine-black-light shadow-lg">
          <TabsTrigger 
            value="roles" 
            className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
          >
            <Crown className="h-4 w-4" />
            <span>{language === 'ar' ? 'الأدوار' : 'Roles'}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="permissions" 
            className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
          >
            <Key className="h-4 w-4" />
            <span>{language === 'ar' ? 'الصلاحيات' : 'Permissions'}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="user-roles" 
            className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white"
          >
            <Users className="h-4 w-4" />
            <span>{language === 'ar' ? 'أدوار المستخدمين' : 'User Roles'}</span>
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid gap-6">
            {roles.map((role) => (
              <Card key={role.id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className={`w-4 h-4 rounded-full ${role.color}`}></div>
                      <div>
                        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span>{language === 'ar' ? role.nameAr : role.name}</span>
                          {role.isSystem && (
                            <Badge variant="secondary" className="text-xs">
                              {language === 'ar' ? 'نظام' : 'System'}
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? role.descriptionAr : role.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Badge variant="outline" className="text-xs">
                        {language === 'ar' ? `المستوى ${role.level}` : `Level ${role.level}`}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {role.usersCount} {language === 'ar' ? 'مستخدم' : 'users'}
                      </Badge>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!role.isSystem && (
                          <>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        {language === 'ar' ? 'الصلاحيات المفعلة:' : 'Active Permissions:'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.slice(0, 6).map((permId) => {
                          const permission = permissions.find(p => p.id === permId);
                          if (!permission) return null;
                          return (
                            <Badge 
                              key={permId} 
                              className={`text-xs ${getCategoryColor(permission.category)}`}
                            >
                              {language === 'ar' ? permission.nameAr : permission.name}
                            </Badge>
                          );
                        })}
                        {role.permissions.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 6} {language === 'ar' ? 'المزيد' : 'more'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {language === 'ar' ? 'تم الإنشاء:' : 'Created:'} {role.createdAt}
                      </span>
                      <span>
                        {language === 'ar' ? 'آخر تحديث:' : 'Updated:'} {role.updatedAt}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="space-y-6">
            {['users', 'products', 'donations', 'analytics', 'system', 'security'].map(category => (
              <Card key={category} className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-palestine-green to-blue-500 text-white">
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    {getCategoryIcon(category)}
                    <span>
                      {language === 'ar' ? 
                        (category === 'users' ? 'إدارة المستخدمين' :
                         category === 'products' ? 'إدارة المنتجات' :
                         category === 'donations' ? 'إدارة التبرعات' :
                         category === 'analytics' ? 'التحليلات والتقارير' :
                         category === 'system' ? 'إدارة النظام' : 'الأمان والحماية') :
                        category.charAt(0).toUpperCase() + category.slice(1) + ' Management'
                      }
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {permissions.filter(p => p.category === category).map(permission => (
                      <div key={permission.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {language === 'ar' ? permission.nameAr : permission.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ar' ? permission.descriptionAr : permission.description}
                          </p>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                            <Badge className={`text-xs ${getCategoryColor(permission.category)}`}>
                              {permission.id}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {language === 'ar' ? 'مستخدم في' : 'Used in'} {roles.filter(r => r.permissions.includes(permission.id)).length} {language === 'ar' ? 'أدوار' : 'roles'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* User Roles Tab */}
        <TabsContent value="user-roles" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Users className="h-5 w-5" />
                <span>{language === 'ar' ? 'تخصيص أدوار المستخدمين' : 'User Role Assignment'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ar' ? 'المستخدم' : 'User'}</TableHead>
                      <TableHead>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الدور الحالي' : 'Current Role'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead>{language === 'ar' ? 'آخر دخول' : 'Last Login'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الصلاحيات الإضافية' : 'Additional Permissions'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const userRole = getRoleByTitle(user.role);
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <div className="w-8 h-8 bg-palestine-green text-white rounded-full flex items-center justify-center">
                                {user.name.charAt(0)}
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <div className={`w-3 h-3 rounded-full ${userRole?.color}`}></div>
                              <span>{language === 'ar' ? userRole?.nameAr : userRole?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                              user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                            }>
                              {language === 'ar' ? 
                                (user.status === 'active' ? 'نشط' : user.status === 'inactive' ? 'غير نشط' : 'موقوف') :
                                user.status
                              }
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{user.lastLogin}</TableCell>
                          <TableCell>
                            {user.permissions.length > 0 ? (
                              <Badge variant="outline" className="text-xs">
                                +{user.permissions.length} {language === 'ar' ? 'صلاحية' : 'permissions'}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                {language === 'ar' ? 'لا توجد' : 'None'}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Button variant="ghost" size="sm">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Role Dialog */}
      <CreateRoleDialog />
    </div>
  );
}