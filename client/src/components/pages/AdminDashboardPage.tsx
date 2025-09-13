import React from 'react';
import { useState, useMemo } from 'react';
import { Users, Package, Heart, TrendingUp, Settings, Plus, Edit3, Trash2, Eye, Search, Filter, Download, Upload, BarChart3, PieChart, DollarSign, ShoppingBag, UserCheck, UserX, Calendar, Bell, Shield, Globe, Database, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { useTheme } from '../contexts/ThemeContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { AdminCharts } from '../AdminCharts';
import { AdminProfileSettings } from '../AdminProfileSettings';
import {
  useGetDonationsQuery,
  useUpdateDonationStatusMutation,
  useDeleteDonationMutation,
  useConfirmBlockchainTransactionMutation,
} from '../../features/donations/donationsApiSlice';
import { Donation, DonationStatus } from '../../features/donations/types';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../LoadingSpinner';

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const { language } = useTheme();
  const [activeTab, setActiveTab] = useState('donations');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', page: 1, limit: 10 });

  const { data: donationsData, isLoading: isLoadingDonations, isError: isErrorDonations, error: donationsError } = useGetDonationsQuery({
    status: filters.status === 'all' ? undefined : filters.status as DonationStatus,
    page: filters.page,
    limit: filters.limit,
  });

  const [updateDonationStatus] = useUpdateDonationStatusMutation();
  const [deleteDonation] = useDeleteDonationMutation();
  const [confirmBlockchainTransaction] = useConfirmBlockchainTransactionMutation();

  const handleUpdateStatus = async (id: number, status: DonationStatus) => {
    try {
      await updateDonationStatus({ id, body: { status } }).unwrap();
      toast.success('Donation status updated.');
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      try {
        await deleteDonation(id).unwrap();
        toast.success('Donation deleted.');
      } catch (error) {
        toast.error('Failed to delete donation.');
      }
    }
  };

  const handleConfirmTx = async (id: number) => {
    const txId = prompt('Enter blockchain transaction ID:');
    if (txId) {
      try {
        await confirmBlockchainTransaction({ id, blockchainTxId: txId }).unwrap();
        toast.success('Blockchain transaction confirmed.');
      } catch (error) {
        toast.error('Failed to confirm transaction.');
      }
    }
  };

  const filteredDonations = useMemo(() => {
    if (!donationsData) return [];
    return donationsData.filter(d => 
      (d.user?.name.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (d.user?.email.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [donationsData, searchTerm]);

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

  const renderDonationsTab = () => {
    if (isLoadingDonations) return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    if (isErrorDonations) return <div className="text-center text-red-500 p-4">Error loading donations.</div>;

    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-palestine-red to-red-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Heart className="h-5 w-5" />
              <span>{language === 'ar' ? 'إدارة التبرعات' : 'Donation Management'}</span>
            </CardTitle>
            <Button variant="secondary" size="sm"><Download className="h-4 w-4 mr-2" />{language === 'ar' ? 'تصدير' : 'Export'}</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder={language === 'ar' ? 'البحث بالاسم أو البريد الإلكتروني...' : 'Search by name or email...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background flex-1"
            />
            <Select 
              value={filters.status}
              onValueChange={(value) => setFilters(f => ({ ...f, status: value, page: 1 }))}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder={language === 'ar' ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value={DonationStatus.PENDING}>{language === 'ar' ? 'معلق' : 'Pending'}</SelectItem>
                <SelectItem value={DonationStatus.COMPLETED}>{language === 'ar' ? 'مكتمل' : 'Completed'}</SelectItem>
                <SelectItem value={DonationStatus.FAILED}>{language === 'ar' ? 'فشل' : 'Failed'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ar' ? 'المتبرع' : 'Donor'}</TableHead>
                  <TableHead>{language === 'ar' ? 'المبلغ' : 'Amount'}</TableHead>
                  <TableHead>{language === 'ar' ? 'النوع' : 'Type'}</TableHead>
                  <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                  <TableHead>TxID</TableHead>
                  <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead className="text-right">{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.map((donation: Donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      <div className="font-medium">{donation.user?.name || 'Anonymous'}</div>
                      <div className="text-sm text-muted-foreground">{donation.user?.email}</div>
                    </TableCell>
                    <TableCell className="font-semibold text-palestine-green">
                      ${donation.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{donation.type}</TableCell>
                    <TableCell>{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="truncate max-w-[100px] text-xs">
                      {donation.blockchain_tx_id}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(donation.status)}>
                        {getStatusText(donation.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                        <Select onValueChange={(value) => handleUpdateStatus(donation.id, value as DonationStatus)} defaultValue={donation.status}>
                           <SelectTrigger className="w-32 h-8 text-xs">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value={DonationStatus.PENDING}>Pending</SelectItem>
                             <SelectItem value={DonationStatus.COMPLETED}>Complete</SelectItem>
                             <SelectItem value={DonationStatus.FAILED}>Fail</SelectItem>
                           </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => handleConfirmTx(donation.id)} disabled={!!donation.blockchain_tx_id}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(donation.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* TODO: Add pagination controls */}
        </CardContent>
      </Card>
    );
  }

  // Keep other tabs as they are, just replace the content of the donations tab.
  const recentUsers: any[] = []; // Placeholder
  const recentProducts: any[] = []; // Placeholder
  const stats = { totalUsers: 0, totalProducts: 0, totalDonations: 0, monthlyRevenue: 0, activeOrders: 0, pendingApprovals: 0 }; // Placeholder

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
              <h1 className="text-2xl font-bold text-palestine-green">
                {language === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'تصدير البيانات' : 'Export Data'}
              </Button>
              <Button 
                onClick={() => setShowProfileSettings(true)}
                className="bg-palestine-green hover:bg-palestine-green-dark"
              >
                <Settings className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'إعدادات الإدارة' : 'Admin Settings'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 h-auto p-1 bg-white dark:bg-palestine-black-light shadow-lg">
            <TabsTrigger value="overview" className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              <span>{language === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              <span>{language === 'ar' ? 'المستخدمين' : 'Users'}</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white">
              <Package className="h-4 w-4" />
              <span>{language === 'ar' ? 'المنتجات' : 'Products'}</span>
            </TabsTrigger>
            <TabsTrigger value="donations" className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white">
              <Heart className="h-4 w-4" />
              <span>{language === 'ar' ? 'التبرعات' : 'Donations'}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 rtl:space-x-reverse data-[state=active]:bg-palestine-green data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4" />
              <span>{language === 'ar' ? 'التحليلات' : 'Analytics'}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">{/* Placeholder for Overview tab */}</TabsContent>
          <TabsContent value="users">{/* Placeholder for Users tab */}</TabsContent>
          <TabsContent value="products">{/* Placeholder for Products tab */}</TabsContent>
          <TabsContent value="donations">
            {renderDonationsTab()}
          </TabsContent>
          <TabsContent value="analytics">{/* Placeholder for Analytics tab */}</TabsContent>

        </Tabs>
      </div>

      {showProfileSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <AdminProfileSettings onClose={() => setShowProfileSettings(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
