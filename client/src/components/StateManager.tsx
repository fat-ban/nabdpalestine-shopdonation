import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { PageType } from '../App';

// App State Interface
interface AppState {
  currentPage: PageType;
  previousPage: PageType | null;
  selectedProductId: string;
  isChatOpen: boolean;
  isLoading: boolean;
  searchQuery: string;
  filters: Record<string, any>;
  notifications: Notification[];
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
}

// Action Types
type AppAction =
  | { type: 'SET_PAGE'; payload: PageType }
  | { type: 'SET_PRODUCT'; payload: string }
  | { type: 'TOGGLE_CHAT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_FILTERS'; payload: Record<string, any> }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: 'ar' | 'en' }
  | { type: 'RESET_STATE' };

// Initial State
const initialState: AppState = {
  currentPage: 'home',
  previousPage: null,
  selectedProductId: '',
  isChatOpen: false,
  isLoading: false,
  searchQuery: '',
  filters: {},
  notifications: [],
  theme: 'light',
  language: 'ar',
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      return {
        ...state,
        previousPage: state.currentPage,
        currentPage: action.payload,
        isLoading: false,
      };
    
    case 'SET_PRODUCT':
      return {
        ...state,
        selectedProductId: action.payload,
      };
    
    case 'TOGGLE_CHAT':
      return {
        ...state,
        isChatOpen: !state.isChatOpen,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_SEARCH':
      return {
        ...state,
        searchQuery: action.payload,
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
        isRead: false,
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications].slice(0, 20), // Keep only last 20
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context
const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider Component
export function StateManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('palestine-pulse-theme') as 'light' | 'dark';
    const savedLanguage = localStorage.getItem('palestine-pulse-language') as 'ar' | 'en';
    
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }
    
    if (savedLanguage) {
      dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
    }
  }, []);

  // Save theme and language to localStorage
  useEffect(() => {
    localStorage.setItem('palestine-pulse-theme', state.theme);
    localStorage.setItem('palestine-pulse-language', state.language);
  }, [state.theme, state.language]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  // Apply language direction to document
  useEffect(() => {
    document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = state.language;
  }, [state.language]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

// Hook to use the state manager
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within a StateManagerProvider');
  }
  return context;
}

// Specific hooks for common operations
export function useNavigation() {
  const { state, dispatch } = useAppState();
  
  const navigate = (page: PageType) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    setTimeout(() => {
      dispatch({ type: 'SET_PAGE', payload: page });
    }, 100);
  };
  
  const goBack = () => {
    if (state.previousPage) {
      navigate(state.previousPage);
    }
  };
  
  return {
    currentPage: state.currentPage,
    previousPage: state.previousPage,
    navigate,
    goBack,
    isLoading: state.isLoading,
  };
}

export function useNotifications() {
  const { state, dispatch } = useAppState();
  
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };
  
  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };
  
  const clearAll = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };
  
  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter(n => !n.isRead).length,
    addNotification,
    markAsRead,
    clearAll,
  };
}

export function useSearch() {
  const { state, dispatch } = useAppState();
  
  const setSearch = (query: string) => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  };
  
  const setFilters = (filters: Record<string, any>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };
  
  const clearFilters = () => {
    dispatch({ type: 'SET_FILTERS', payload: {} });
  };
  
  return {
    searchQuery: state.searchQuery,
    filters: state.filters,
    setSearch,
    setFilters,
    clearFilters,
  };
}

export function useThemeAndLanguage() {
  const { state, dispatch } = useAppState();
  
  const toggleTheme = () => {
    dispatch({ 
      type: 'SET_THEME', 
      payload: state.theme === 'light' ? 'dark' : 'light' 
    });
  };
  
  const toggleLanguage = () => {
    dispatch({ 
      type: 'SET_LANGUAGE', 
      payload: state.language === 'ar' ? 'en' : 'ar' 
    });
  };
  
  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };
  
  const setLanguage = (language: 'ar' | 'en') => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };
  
  return {
    theme: state.theme,
    language: state.language,
    toggleTheme,
    toggleLanguage,
    setTheme,
    setLanguage,
  };
}

export function useChat() {
  const { state, dispatch } = useAppState();
  
  const toggleChat = () => {
    dispatch({ type: 'TOGGLE_CHAT' });
  };
  
  const openChat = () => {
    if (!state.isChatOpen) {
      dispatch({ type: 'TOGGLE_CHAT' });
    }
  };
  
  const closeChat = () => {
    if (state.isChatOpen) {
      dispatch({ type: 'TOGGLE_CHAT' });
    }
  };
  
  return {
    isChatOpen: state.isChatOpen,
    toggleChat,
    openChat,
    closeChat,
  };
}