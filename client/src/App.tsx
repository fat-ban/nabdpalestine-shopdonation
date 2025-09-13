import { useState, Suspense, lazy, useEffect } from "react";
import { ThemeProvider } from "./components/contexts/ThemeContext";
import { AuthProvider } from "./components/contexts/AuthContext";
import { CartProvider } from "./components/contexts/CartContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { FloatingChatBot } from "./components/FloatingChatBot";
import { Toaster } from "./components/ui/sonner";
import { LoadingSpinner } from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import { Role } from "./features/users/types";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./components/pages/HomePage").then(module => ({ default: module.HomePage })));
const StorePage = lazy(() => import("./components/pages/StorePage").then(module => ({ default: module.StorePage })));
const ProductDetailPage = lazy(() => import("./components/pages/ProductDetailPage").then(module => ({ default: module.ProductDetailPage })));
const DonatePage = lazy(() => import("./components/pages/DonatePage").then(module => ({ default: module.DonatePage })));
const ChatBotPage = lazy(() => import("./components/pages/ChatBotPage").then(module => ({ default: module.ChatBotPage })));
const AboutPage = lazy(() => import("./components/pages/AboutPage").then(module => ({ default: module.AboutPage })));
const OrganizationsPage = lazy(() => import("./components/pages/OrganizationsPage").then(module => ({ default: module.OrganizationsPage })));
const SupportPage = lazy(() => import("./components/pages/SupportPage").then(module => ({ default: module.SupportPage })));
const LoginPage = lazy(() => import("./components/pages/LoginPage").then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("./components/pages/RegisterPage").then(module => ({ default: module.RegisterPage })));
const DashboardPage = lazy(() => import("./components/pages/DashboardPage").then(module => ({ default: module.DashboardPage })));
const ProfilePage = lazy(() => import("./components/pages/ProfilePage").then(module => ({ default: module.ProfilePage })));
const AdminDashboardPage = lazy(() => import("./components/pages/AdminDashboardPage").then(module => ({ default: module.AdminDashboardPage })));
const UserAccountPage = lazy(() => import("./components/pages/UserAccountPage").then(module => ({ default: module.UserAccountPage })));
const CartPage = lazy(() => import("./components/pages/CartPage").then(module => ({ default: module.CartPage })));
const UserProfile = lazy(() => import("./features/users/components/UserProfile"));

export type PageType =
  | "home"
  | "store"
  | "donate"
  | "chatbot"
  | "about"
  | "organizations"
  | "support"
  | "login"
  | "register"
  | "dashboard"
  | "profile"
  | "product-detail"
  | "admin-dashboard"
  | "user-account"
  | "cart"
  | "user-profile";

interface AppState {
  currentPage: PageType;
  selectedProductId: string;
  isChatOpen: boolean;
  isLoading: boolean;
}

const INITIAL_STATE: AppState = {
  currentPage: "home",
  selectedProductId: "",
  isChatOpen: false,
  isLoading: false,
};

// Pages that should hide header and footer
const MINIMAL_LAYOUT_PAGES: PageType[] = [
  "login",
  "register",
  "product-detail",
  "user-account",
];

// Pages that should hide only the floating chat
const NO_CHAT_PAGES: PageType[] = [
  "chatbot",
  "login",
  "register",
];

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  // Handle page navigation with loading state
  const handleNavigate = (page: PageType) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate loading for better UX (remove in production if not needed)
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        currentPage: page, 
        isLoading: false,
        // Close chat when navigating to chat page or minimal pages
        isChatOpen: NO_CHAT_PAGES.includes(page) ? false : prev.isChatOpen
      }));
    }, 100);
  };

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    setState(prev => ({ ...prev, selectedProductId: productId }));
  };

  // Handle chat toggle
  const handleChatToggle = () => {
    setState(prev => ({ ...prev, isChatOpen: !prev.isChatOpen }));
  };

  // Handle back to store from product detail
  const handleBackToStore = () => {
    handleNavigate("store");
  };

  // Check if current page should have minimal layout
  const isMinimalLayout = MINIMAL_LAYOUT_PAGES.includes(state.currentPage);
  const shouldShowChat = !NO_CHAT_PAGES.includes(state.currentPage) && !isMinimalLayout;

  // Page component renderer with error boundary
  const renderPage = () => {
    const pageProps = {
      onNavigate: handleNavigate,
    };

    const storePageProps = {
      ...pageProps,
      onProductSelect: handleProductSelect,
    };

    const productDetailProps = {
      ...pageProps,
      productId: state.selectedProductId,
      onBackToStore: handleBackToStore,
    };

    switch (state.currentPage) {
      case "home":
        return <HomePage {...pageProps} />;
      case "store":
        return <StorePage {...storePageProps} />;
      case "product-detail":
        return <ProductDetailPage {...productDetailProps} />;
      case "donate":
        return <DonatePage />;
      case "chatbot":
        return <ChatBotPage />;
      case "about":
        return <AboutPage />;
      case "organizations":
        return <OrganizationsPage />;
      case "support":
        return <SupportPage />;
      case "login":
        return <LoginPage {...pageProps} />;
      case "register":
        return <RegisterPage {...pageProps} />;
      case "dashboard":
        return <DashboardPage {...pageProps} />;
      case "profile":
        return <ProfilePage {...pageProps} />;
      case "admin-dashboard":
        return <AdminDashboardPage {...pageProps} />;
      case "user-account":
        return <UserAccountPage {...pageProps} />;
      case "cart":
        return <CartPage {...pageProps} />;
      case "user-profile":
        return <ProtectedRoute roles={[Role.User]}><UserProfile /></ProtectedRoute>;
      default:
        return <HomePage {...pageProps} />;
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Alt + H for Home
      if (event.altKey && event.key === 'h') {
        event.preventDefault();
        handleNavigate('home');
      }
      // Alt + S for Store  
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        handleNavigate('store');
      }
      // Alt + C for Chat
      if (event.altKey && event.key === 'c' && shouldShowChat) {
        event.preventDefault();
        handleChatToggle();
      }
      // Escape to close chat
      if (event.key === 'Escape' && state.isChatOpen) {
        event.preventDefault();
        handleChatToggle();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.isChatOpen, shouldShowChat]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-background">
            {/* Header */}
            {!isMinimalLayout && (
              <Header
                currentPage={state.currentPage}
                onNavigate={handleNavigate}
              />
            )}

            {/* Main Content */}
            <main
              id="main-content"
              className={`relative ${
                isMinimalLayout ? "min-h-screen" : "min-h-screen"
              }`}
            >
              {/* Loading Overlay */}
              {state.isLoading && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              )}

              {/* Page Content with Suspense */}
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                }
              >
                <ErrorBoundary>
                  {renderPage()}
                </ErrorBoundary>
              </Suspense>
            </main>

            {/* Footer */}
            {!isMinimalLayout && (
              <Footer onNavigate={handleNavigate} />
            )}

            {/* Floating Chat Bot */}
            {shouldShowChat && (
              <FloatingChatBot
                isOpen={state.isChatOpen}
                onToggle={handleChatToggle}
              />
            )}

            {/* Toast Notifications */}
            <Toaster />

            {/* Skip to main content for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-palestine-green text-white px-4 py-2 rounded-md z-50"
            >
              Skip to main content
            </a>
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}