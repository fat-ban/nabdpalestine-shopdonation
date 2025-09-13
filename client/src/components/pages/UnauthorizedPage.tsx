import React from 'react';
import { Button } from '../ui/button';
import { useTheme } from '../contexts/ThemeContext';

interface UnauthorizedPageProps {
  onNavigate: (page: string) => void;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({ onNavigate }) => {
  const { language } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-4">
      <h1 className="text-4xl font-bold text-red-500 mb-4">{
        language === 'ar' ? 'غير مصرح لك بالدخول' : 'Unauthorized Access'
      }</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">{
        language === 'ar' ? 'ليس لديك الصلاحية لعرض هذه الصفحة.' : 'You do not have permission to view this page.'
      }</p>
      <Button onClick={() => onNavigate('home')}>{
        language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Go to Homepage'
      }</Button>
    </div>
  );
};
