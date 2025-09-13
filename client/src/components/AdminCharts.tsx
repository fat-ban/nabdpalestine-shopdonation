import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTheme } from './contexts/ThemeContext';

interface AdminChartsProps {
  type: 'revenue' | 'users' | 'donations' | 'products';
}

export function AdminCharts({ type }: AdminChartsProps) {
  const { language } = useTheme();

  const revenueData = [
    { month: language === 'ar' ? 'يناير' : 'Jan', revenue: 45678, orders: 234 },
    { month: language === 'ar' ? 'فبراير' : 'Feb', revenue: 52341, orders: 278 },
    { month: language === 'ar' ? 'مارس' : 'Mar', revenue: 48923, orders: 245 },
    { month: language === 'ar' ? 'أبريل' : 'Apr', revenue: 61245, orders: 312 },
    { month: language === 'ar' ? 'مايو' : 'May', revenue: 67890, orders: 345 },
    { month: language === 'ar' ? 'يونيو' : 'Jun', revenue: 73456, orders: 389 },
  ];

  const userData = [
    { month: language === 'ar' ? 'يناير' : 'Jan', newUsers: 1200, activeUsers: 8500 },
    { month: language === 'ar' ? 'فبراير' : 'Feb', newUsers: 1450, activeUsers: 9200 },
    { month: language === 'ar' ? 'مارس' : 'Mar', newUsers: 1320, activeUsers: 9800 },
    { month: language === 'ar' ? 'أبريل' : 'Apr', newUsers: 1680, activeUsers: 10500 },
    { month: language === 'ar' ? 'مايو' : 'May', newUsers: 1890, activeUsers: 11200 },
    { month: language === 'ar' ? 'يونيو' : 'Jun', newUsers: 2100, activeUsers: 12000 },
  ];

  const donationData = [
    { project: language === 'ar' ? 'دعم الأطفال' : 'Child Support', value: 28500, color: '#38A169' },
    { project: language === 'ar' ? 'إعادة الإعمار' : 'Reconstruction', value: 21300, color: '#E53E3E' },
    { project: language === 'ar' ? 'التعليم' : 'Education', value: 18400, color: '#3182CE' },
    { project: language === 'ar' ? 'الصحة' : 'Healthcare', value: 15200, color: '#D69E2E' },
    { project: language === 'ar' ? 'الطوارئ' : 'Emergency', value: 5834, color: '#9F7AEA' },
  ];

  const productData = [
    { category: language === 'ar' ? 'تراث' : 'Heritage', sales: 145, stock: 2800 },
    { category: language === 'ar' ? 'طعام' : 'Food', sales: 298, stock: 1200 },
    { category: language === 'ar' ? 'جمال' : 'Beauty', sales: 178, stock: 890 },
    { category: language === 'ar' ? 'فنون' : 'Arts', sales: 89, stock: 450 },
    { category: language === 'ar' ? 'ملابس' : 'Clothing', sales: 234, stock: 1500 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  switch (type) {
    case 'revenue':
      return (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-palestine-green to-blue-500 text-white">
            <CardTitle>
              {language === 'ar' ? 'الإيرادات والطلبات الشهرية' : 'Monthly Revenue & Orders'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38A169" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#38A169" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E53E3E" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#E53E3E" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#38A169" 
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#E53E3E" 
                  fill="url(#ordersGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );

    case 'users':
      return (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardTitle>
              {language === 'ar' ? 'نمو المستخدمين' : 'User Growth'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="newUsers" 
                  stroke="#3182CE" 
                  strokeWidth={3}
                  dot={{ fill: '#3182CE', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke="#38A169" 
                  strokeWidth={3}
                  dot={{ fill: '#38A169', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );

    case 'donations':
      return (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-palestine-red to-red-500 text-white">
            <CardTitle>
              {language === 'ar' ? 'توزيع التبرعات حسب المشروع' : 'Donations by Project'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ project, percent }) => `${project} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {donationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );

    case 'products':
      return (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardTitle>
              {language === 'ar' ? 'المبيعات والمخزون حسب الفئة' : 'Sales & Stock by Category'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="#38A169" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stock" fill="#E53E3E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
}