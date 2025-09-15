import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Here you could send error to logging service
    // logErrorToService(error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-palestine-red-50 to-palestine-green-50 dark:from-palestine-black dark:to-palestine-black-light flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-lg border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl text-destructive mb-2">
                عذراً، حدث خطأ!
              </CardTitle>
              <p className="text-muted-foreground">
                Sorry, something went wrong!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  نعتذر عن هذا الإزعاج. حدث خطأ غير متوقع أثناء تحميل الصفحة.
                </p>
                <p className="text-xs text-muted-foreground">
                  We apologize for the inconvenience. An unexpected error occurred while loading the page.
                </p>
              </div>

              {/* Error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-xs bg-muted p-3 rounded-md">
                  <summary className="cursor-pointer font-medium mb-2">
                    Technical Details (Development Only)
                  </summary>
                  <div className="space-y-2 text-muted-foreground">
                    <div>
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 text-xs overflow-auto">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </div>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleRefresh}
                  className="flex-1 bg-palestine-green hover:bg-palestine-green-dark"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  إعادة المحاولة / Retry
                </Button>
                <Button 
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  الصفحة الرئيسية / Home
                </Button>
              </div>

              {/* Support contact */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  إذا استمر الخطأ، يرجى التواصل معنا
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  If the error persists, please contact us
                </p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = 'mailto:support@palestinepulse.org'}
                  className="text-xs"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  support@palestinepulse.org
                </Button>
              </div>

              {/* Palestine branding */}
              <div className="text-center pt-2">
                <div className="inline-flex items-center text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-palestine-red rounded-full mr-1"></div>
                  <div className="w-2 h-2 bg-palestine-white rounded-full mr-1"></div>
                  <div className="w-2 h-2 bg-palestine-green rounded-full mr-2"></div>
                  نبض فلسطين - Palestine Pulse
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // Here you could send error to logging service
    // logErrorToService(error, errorInfo);
  };
}

// Simple error fallback component
export function ErrorFallback({ 
  error, 
  resetError 
}: { 
  error: Error; 
  resetError: () => void; 
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={resetError} variant="outline">
          Try again
        </Button>
      </div>
    </div>
  );
}