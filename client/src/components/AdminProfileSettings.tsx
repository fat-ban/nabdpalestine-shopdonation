import { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Key, Shield, Bell, Globe, Palette, Save, Upload, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface AdminProfileSettingsProps {
  onClose: () => void;
}

export function AdminProfileSettings({ onClose }: AdminProfileSettingsProps) {
  const { language } = useTheme();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const [formData, setFormData] = useState({
    name: 'مدير النظام',
    nameEn: 'System Administrator',
    email: 'admin@palestinepulse.org',
    phone: '+970-599-123456',
    location: 'رام الله، فلسطين',
    locationEn: 'Ramallah, Palestine',
    bio: 'مدير منصة نبض فلسطين - نعمل معاً لدعم القضية الفلسطينية من خلال التكنولوجيا',
    bioEn: 'Palestine Pulse Platform Administrator - Working together to support the Palestinian cause through technology',
    role: 'Super Admin',
    department: 'الإدارة العليا',
    departmentEn: 'Top Management',
    joinDate: '2024-01-01',
    lastLogin: '2024-01-15 14:30:22'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    dataExportAccess: true,
    userManagement: true,
    financialAccess: true
  });

  const [preferences, setPreferences] = useState({
    language: 'ar',
    theme: 'system',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Jerusalem',
    defaultView: 'overview'
  });

  const handleSave = () => {
    toast.success(language === 'ar' ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully');
    setIsEditing(false);
  };

  const handleImageUpload = () => {
    toast.success(language === 'ar' ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully');
  };

  const sections = [
    { id: 'profile', label: language === 'ar' ? 'المعلومات الشخصية' : 'Profile Info', icon: User },
    { id: 'security', label: language === 'ar' ? 'الأمان والصلاحيات' : 'Security & Permissions', icon: Shield },
    { id: 'notifications', label: language === 'ar' ? 'الإشعارات' : 'Notifications', icon: Bell },
    { id: 'preferences', label: language === 'ar' ? 'التفضيلات' : 'Preferences', icon: Palette },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-palestine-green">
            {language === 'ar' ? 'إعدادات الإدارة' : 'Admin Settings'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'ar' ? 'إدارة بروفيل الإدارة والصلاحيات' : 'Manage admin profile and permissions'}
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          {language === 'ar' ? 'إغلاق' : 'Close'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-palestine-green text-white'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-palestine-green to-blue-500 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <User className="h-5 w-5" />
                    <span>{language === 'ar' ? 'المعلومات الشخصية' : 'Profile Information'}</span>
                  </CardTitle>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (language === 'ar' ? 'إلغاء' : 'Cancel') : (language === 'ar' ? 'تعديل' : 'Edit')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6 rtl:space-x-reverse">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-2xl bg-palestine-green text-white">
                          {(language === 'ar' ? formData.name : formData.nameEn).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          onClick={handleImageUpload}
                          className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-palestine-green hover:bg-palestine-green-dark"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">
                        {language === 'ar' ? formData.name : formData.nameEn}
                      </h3>
                      <Badge className="bg-palestine-red text-white">
                        {formData.role}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? formData.department : formData.departmentEn}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'الاسم' : 'Name'}</Label>
                      <Input
                        value={language === 'ar' ? formData.name : formData.nameEn}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [language === 'ar' ? 'name' : 'nameEn']: e.target.value
                        }))}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'الموقع' : 'Location'}</Label>
                      <Input
                        value={language === 'ar' ? formData.location : formData.locationEn}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [language === 'ar' ? 'location' : 'locationEn']: e.target.value
                        }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'النبذة التعريفية' : 'Bio'}</Label>
                    <Textarea
                      value={language === 'ar' ? formData.bio : formData.bioEn}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [language === 'ar' ? 'bio' : 'bioEn']: e.target.value
                      }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  {/* Account Info */}
                  <div className="grid md:grid-cols-2 gap-6 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {language === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}
                      </Label>
                      <p className="mt-1">{formData.joinDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {language === 'ar' ? 'آخر دخول' : 'Last Login'}
                      </Label>
                      <p className="mt-1">{formData.lastLogin}</p>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end">
                      <Button onClick={handleSave} className="bg-palestine-green hover:bg-palestine-green-dark">
                        <Save className="h-4 w-4 mr-2" />
                        {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-palestine-red to-red-500 text-white">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Shield className="h-5 w-5" />
                  <span>{language === 'ar' ? 'الأمان والصلاحيات' : 'Security & Permissions'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Password Change */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">{language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="ltr"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</Label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="ltr"
                        />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
                    </Button>
                  </div>

                  <Separator />

                  {/* Security Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">{language === 'ar' ? 'إعدادات الأمان' : 'Security Settings'}</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'twoFactorAuth', label: language === 'ar' ? 'المصادقة الثنائية' : 'Two-Factor Auth', description: language === 'ar' ? 'حماية إضافية لحسابك' : 'Extra protection for your account' },
                        { key: 'loginAlerts', label: language === 'ar' ? 'تنبيهات تسجيل الدخول' : 'Login Alerts', description: language === 'ar' ? 'إشعار عند تسجيل الدخول من جهاز جديد' : 'Notify when logging in from new device' },
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <Label className="font-medium">{setting.label}</Label>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                          <Switch
                            checked={securitySettings[setting.key as keyof typeof securitySettings]}
                            onCheckedChange={(checked) => 
                              setSecuritySettings(prev => ({ ...prev, [setting.key]: checked }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Admin Permissions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">{language === 'ar' ? 'صلاحيات الإدارة' : 'Admin Permissions'}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { key: 'userManagement', label: language === 'ar' ? 'إدارة المستخدمين' : 'User Management' },
                        { key: 'financialAccess', label: language === 'ar' ? 'الوصول المالي' : 'Financial Access' },
                        { key: 'dataExportAccess', label: language === 'ar' ? 'تصدير البيانات' : 'Data Export Access' }
                      ].map((permission) => (
                        <div key={permission.key} className="flex items-center justify-between p-3 border rounded-lg">
                          <Label className="font-medium">{permission.label}</Label>
                          <Switch
                            checked={securitySettings[permission.key as keyof typeof securitySettings]}
                            onCheckedChange={(checked) => 
                              setSecuritySettings(prev => ({ ...prev, [permission.key]: checked }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other sections can be added similarly */}
          {activeSection === 'notifications' && (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Bell className="h-5 w-5" />
                  <span>{language === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: language === 'ar' ? 'إشعارات البريد الإلكتروني' : 'Email Notifications', description: language === 'ar' ? 'تلقي الإشعارات عبر البريد الإلكتروني' : 'Receive notifications via email' },
                    { key: 'smsNotifications', label: language === 'ar' ? 'إشعارات الرسائل النصية' : 'SMS Notifications', description: language === 'ar' ? 'تلقي الإشعارات عبر الرسائل النصية' : 'Receive notifications via SMS' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <Label className="font-medium">{setting.label}</Label>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <Switch
                        checked={securitySettings[setting.key as keyof typeof securitySettings]}
                        onCheckedChange={(checked) => 
                          setSecuritySettings(prev => ({ ...prev, [setting.key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'preferences' && (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Palette className="h-5 w-5" />
                  <span>{language === 'ar' ? 'التفضيلات' : 'Preferences'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'اللغة' : 'Language'}</Label>
                      <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'المظهر' : 'Theme'}</Label>
                      <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">{language === 'ar' ? 'فاتح' : 'Light'}</SelectItem>
                          <SelectItem value="dark">{language === 'ar' ? 'داكن' : 'Dark'}</SelectItem>
                          <SelectItem value="system">{language === 'ar' ? 'تلقائي' : 'System'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'تنسيق التاريخ' : 'Date Format'}</Label>
                      <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences(prev => ({ ...prev, dateFormat: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'المنطقة الزمنية' : 'Timezone'}</Label>
                      <Select value={preferences.timezone} onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Jerusalem">Jerusalem (GMT+2)</SelectItem>
                          <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                          <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}