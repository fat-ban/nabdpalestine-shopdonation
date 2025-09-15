import { Heart, Loader2 } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'palestine' | 'minimal';
  message?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'palestine',
  message,
  className = '' 
}: LoadingSpinnerProps) {
  const { language } = useTheme();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const messageSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-muted-foreground`} />
        {message && (
          <span className={`ml-2 ${messageSizeClasses[size]} text-muted-foreground`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'default') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        {message && (
          <p className={`${messageSizeClasses[size]} text-muted-foreground text-center max-w-xs`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  // Palestine variant (default)
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Palestine Flag Loading Animation */}
      <div className="relative">
        {/* Main heart container */}
        <div className="relative">
          <Heart 
            className={`${sizeClasses[size]} text-palestine-red animate-pulse`}
            fill="currentColor"
          />
          
          {/* Animated stripes overlay */}
          <div className="absolute inset-0">
            <div className="w-full h-full overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-palestine-black via-palestine-white via-palestine-green to-palestine-red opacity-60 animate-flag-wave"></div>
            </div>
          </div>
        </div>
        
        {/* Pulsing outer ring */}
        <div className="absolute -inset-2 border-2 border-palestine-green/30 rounded-full animate-ping"></div>
        <div className="absolute -inset-1 border border-palestine-red/40 rounded-full animate-pulse"></div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-1">
        <p className={`${messageSizeClasses[size]} font-medium text-foreground`}>
          {message || (language === 'ar' ? 'جاري التحميل...' : 'Loading...')}
        </p>
        <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse">
          <div className="w-2 h-2 bg-palestine-red rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-palestine-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-palestine-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      {/* Platform branding */}
      {size !== 'sm' && (
        <p className="text-xs text-muted-foreground opacity-60">
          {language === 'ar' ? 'نبض فلسطين' : 'Palestine Pulse'}
        </p>
      )}
    </div>
  );
}

// Skeleton loader for content
export function SkeletonLoader({ 
  lines = 3, 
  avatar = false,
  className = '' 
}: { 
  lines?: number; 
  avatar?: boolean;
  className?: string;
}) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="flex items-start space-x-3 rtl:space-x-reverse">
        {avatar && (
          <div className="w-10 h-10 bg-muted rounded-full flex-shrink-0"></div>
        )}
        <div className="flex-1 space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`h-4 bg-muted rounded-md ${
                index === lines - 1 ? 'w-3/4' : 'w-full'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Page loading overlay
export function PageLoader({ message }: { message?: string }) {
  const { language } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-palestine-green-50 to-palestine-red-50 dark:from-palestine-black dark:to-palestine-black-light z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner 
          size="xl" 
          variant="palestine"
          message={message || (language === 'ar' ? 'جاري تحميل الصفحة...' : 'Loading page...')}
        />
      </div>
    </div>
  );
}

// Button loading state
export function ButtonSpinner({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <Loader2 className={`${sizeClass} animate-spin`} />
  );
}