import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useTheme } from '../contexts/ThemeContext';

interface UnauthorizedPageProps {
  onNavigate: (page: 'home') => void;
}

export function UnauthorizedPage({ onNavigate }: UnauthorizedPageProps) {
  const { language } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-destructive">
            {language === 'ar' ? 'وصول غير مسموح' : 'Access Denied'}
          </CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'ليس لديك الصلاحية لعرض هذه الصفحة'
              : 'You do not have permission to view this page'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => onNavigate('home')} 
            className="w-full bg-palestine-red hover:bg-palestine-red-dark"
          >
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
