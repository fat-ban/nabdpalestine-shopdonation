import { useEffect, useState } from 'react';
import { PageType } from '../App';

interface NavigationState {
  currentPage: PageType;
  previousPage: PageType | null;
  history: PageType[];
}

interface NavigationManagerProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  children: (navigationProps: NavigationControlProps) => React.ReactNode;
}

interface NavigationControlProps {
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  goHome: () => void;
  navigationHistory: PageType[];
}

export function NavigationManager({ 
  currentPage, 
  onNavigate, 
  children 
}: NavigationManagerProps) {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentPage,
    previousPage: null,
    history: [currentPage],
  });

  const [historyIndex, setHistoryIndex] = useState(0);

  // Update navigation state when page changes
  useEffect(() => {
    if (currentPage !== navigationState.currentPage) {
      setNavigationState(prev => {
        const newHistory = [...prev.history];
        
        // If we're not at the end of history, remove everything after current position
        if (historyIndex < newHistory.length - 1) {
          newHistory.splice(historyIndex + 1);
        }
        
        // Add new page to history
        newHistory.push(currentPage);
        setHistoryIndex(newHistory.length - 1);
        
        return {
          currentPage,
          previousPage: prev.currentPage,
          history: newHistory.slice(-10), // Keep only last 10 pages
        };
      });
    }
  }, [currentPage, navigationState.currentPage, historyIndex]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < navigationState.history.length - 1;

  const goBack = () => {
    if (canGoBack) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onNavigate(navigationState.history[newIndex]);
    }
  };

  const goForward = () => {
    if (canGoForward) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onNavigate(navigationState.history[newIndex]);
    }
  };

  const goHome = () => {
    onNavigate('home');
  };

  const navigationProps: NavigationControlProps = {
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    goHome,
    navigationHistory: navigationState.history,
  };

  return <>{children(navigationProps)}</>;
}

// Breadcrumb component
export function Breadcrumb({ 
  currentPage, 
  onNavigate 
}: { 
  currentPage: PageType; 
  onNavigate: (page: PageType) => void; 
}) {
  const getBreadcrumbPath = (page: PageType): { page: PageType; label: string }[] => {
    const breadcrumbs = [{ page: 'home' as PageType, label: 'Home' }];
    
    switch (page) {
      case 'store':
        breadcrumbs.push({ page: 'store', label: 'Store' });
        break;
      case 'product-detail':
        breadcrumbs.push(
          { page: 'store', label: 'Store' },
          { page: 'product-detail', label: 'Product' }
        );
        break;
      case 'cart':
        breadcrumbs.push({ page: 'cart', label: 'Cart' });
        break;
      case 'donate':
        breadcrumbs.push({ page: 'donate', label: 'Donate' });
        break;
      case 'organizations':
        breadcrumbs.push({ page: 'organizations', label: 'Organizations' });
        break;
      case 'about':
        breadcrumbs.push({ page: 'about', label: 'About' });
        break;
      case 'support':
        breadcrumbs.push({ page: 'support', label: 'Support' });
        break;
      case 'profile':
        breadcrumbs.push({ page: 'profile', label: 'Profile' });
        break;
      case 'dashboard':
        breadcrumbs.push({ page: 'dashboard', label: 'Dashboard' });
        break;
      case 'admin-dashboard':
        breadcrumbs.push({ page: 'admin-dashboard', label: 'Admin' });
        break;
      case 'user-account':
        breadcrumbs.push({ page: 'user-account', label: 'Account' });
        break;
      default:
        break;
    }
    
    return breadcrumbs;
  };

  const breadcrumbPath = getBreadcrumbPath(currentPage);
  
  if (breadcrumbPath.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      {breadcrumbPath.map((crumb, index) => (
        <div key={crumb.page} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          <button
            onClick={() => onNavigate(crumb.page)}
            className={`hover:text-foreground transition-colors ${
              index === breadcrumbPath.length - 1
                ? 'text-foreground font-medium'
                : 'hover:underline'
            }`}
            disabled={index === breadcrumbPath.length - 1}
          >
            {crumb.label}
          </button>
        </div>
      ))}
    </nav>
  );
}

// Quick navigation component
export function QuickNavigation({ 
  onNavigate 
}: { 
  onNavigate: (page: PageType) => void; 
}) {
  const quickLinks: { page: PageType; label: string; shortcut?: string }[] = [
    { page: 'home', label: 'Home', shortcut: 'Alt+H' },
    { page: 'store', label: 'Store', shortcut: 'Alt+S' },
    { page: 'donate', label: 'Donate', shortcut: 'Alt+D' },
    { page: 'organizations', label: 'Organizations', shortcut: 'Alt+O' },
  ];

  return (
    <div className="hidden lg:flex items-center space-x-4 text-xs">
      <span className="text-muted-foreground">Quick:</span>
      {quickLinks.map((link) => (
        <button
          key={link.page}
          onClick={() => onNavigate(link.page)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title={link.shortcut}
        >
          {link.label}
        </button>
      ))}
    </div>
  );
}