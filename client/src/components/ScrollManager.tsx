import { useEffect, useRef, useState } from 'react';

export interface ScrollPosition {
  x: number;
  y: number;
}

export interface ScrollManagerProps {
  currentPage: string;
  preserveScroll?: boolean;
  smoothScroll?: boolean;
  resetScrollOnPageChange?: boolean;
  onScrollPositionChange?: (position: ScrollPosition) => void;
}

export class ScrollPositionManager {
  private static positions: Map<string, ScrollPosition> = new Map();
  private static isScrolling = false;

  static savePosition(page: string, position: ScrollPosition) {
    this.positions.set(page, position);
  }

  static getPosition(page: string): ScrollPosition {
    return this.positions.get(page) || { x: 0, y: 0 };
  }

  static clearPosition(page: string) {
    this.positions.delete(page);
  }

  static clearAllPositions() {
    this.positions.clear();
  }

  static isCurrentlyScrolling(): boolean {
    return this.isScrolling;
  }

  static setScrolling(scrolling: boolean) {
    this.isScrolling = scrolling;
  }
}

export function ScrollManager({
  currentPage,
  preserveScroll = false,
  smoothScroll = true,
  resetScrollOnPageChange = true,
  onScrollPositionChange
}: ScrollManagerProps) {
  const previousPage = useRef<string>('');
  const scrollTimeout = useRef<NodeJS.Timeout>();

  // Save scroll position when page changes
  useEffect(() => {
    const saveCurrentPosition = () => {
      if (previousPage.current && previousPage.current !== currentPage) {
        const currentPosition = {
          x: window.scrollX || window.pageXOffset,
          y: window.scrollY || window.pageYOffset
        };
        
        ScrollPositionManager.savePosition(previousPage.current, currentPosition);
        
        if (onScrollPositionChange) {
          onScrollPositionChange(currentPosition);
        }
      }
      previousPage.current = currentPage;
    };

    saveCurrentPosition();
  }, [currentPage, onScrollPositionChange]);

  // Handle scroll behavior when page changes
  useEffect(() => {
    const handlePageScroll = () => {
      // Clear any existing scroll timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      ScrollPositionManager.setScrolling(true);

      // Small delay to ensure content is rendered
      scrollTimeout.current = setTimeout(() => {
        if (preserveScroll) {
          // Restore saved position for current page
          const savedPosition = ScrollPositionManager.getPosition(currentPage);
          
          if (smoothScroll) {
            window.scrollTo({
              left: savedPosition.x,
              top: savedPosition.y,
              behavior: 'smooth'
            });
          } else {
            window.scrollTo(savedPosition.x, savedPosition.y);
          }
        } else if (resetScrollOnPageChange) {
          // Scroll to top for new page
          if (smoothScroll) {
            window.scrollTo({
              left: 0,
              top: 0,
              behavior: 'smooth'
            });
          } else {
            window.scrollTo(0, 0);
          }
        }

        // Reset scrolling state after animation completes
        setTimeout(() => {
          ScrollPositionManager.setScrolling(false);
        }, smoothScroll ? 1000 : 100);
      }, 100);
    };

    handlePageScroll();

    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [currentPage, preserveScroll, smoothScroll, resetScrollOnPageChange]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Don't interfere with browser's natural scroll restoration
      ScrollPositionManager.setScrolling(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Add smooth scroll CSS when component mounts
  useEffect(() => {
    if (smoothScroll) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }

    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, [smoothScroll]);

  return null; // This component doesn't render anything
}

// Hook for programmatic scrolling
export function useScrollTo() {
  const scrollTo = (
    target: number | string | Element,
    options: {
      behavior?: 'smooth' | 'instant';
      block?: 'start' | 'center' | 'end' | 'nearest';
      inline?: 'start' | 'center' | 'end' | 'nearest';
      offset?: number;
    } = {}
  ) => {
    const { behavior = 'smooth', block = 'start', inline = 'nearest', offset = 0 } = options;

    ScrollPositionManager.setScrolling(true);

    if (typeof target === 'number') {
      // Scroll to Y position
      window.scrollTo({
        left: 0,
        top: target + offset,
        behavior
      });
    } else if (typeof target === 'string') {
      // Scroll to element by selector
      const element = document.querySelector(target);
      if (element) {
        const rect = element.getBoundingClientRect();
        const targetY = window.scrollY + rect.top + offset;
        
        window.scrollTo({
          left: 0,
          top: targetY,
          behavior
        });
      }
    } else if (target instanceof Element) {
      // Scroll to element
      const rect = target.getBoundingClientRect();
      const targetY = window.scrollY + rect.top + offset;
      
      window.scrollTo({
        left: 0,
        top: targetY,
        behavior
      });
    }

    // Reset scrolling state after animation
    setTimeout(() => {
      ScrollPositionManager.setScrolling(false);
    }, behavior === 'smooth' ? 1000 : 100);
  };

  const scrollToTop = (smooth: boolean = true) => {
    scrollTo(0, { behavior: smooth ? 'smooth' : 'instant' });
  };

  const scrollToBottom = (smooth: boolean = true) => {
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    
    scrollTo(documentHeight, { behavior: smooth ? 'smooth' : 'instant' });
  };

  return {
    scrollTo,
    scrollToTop,
    scrollToBottom
  };
}

// Hook for scroll position tracking
export function useScrollPosition() {
  const getCurrentPosition = (): ScrollPosition => ({
    x: window.scrollX || window.pageXOffset,
    y: window.scrollY || window.pageYOffset
  });

  const isAtTop = (): boolean => {
    return getCurrentPosition().y <= 10;
  };

  const isAtBottom = (): boolean => {
    const position = getCurrentPosition();
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    
    return position.y + window.innerHeight >= documentHeight - 10;
  };

  return {
    getCurrentPosition,
    isAtTop,
    isAtBottom
  };
}

// Enhanced scroll-to-top button component
export function ScrollToTopButton({
  className = '',
  showThreshold = 300,
  smoothScroll = true
}: {
  className?: string;
  showThreshold?: number;
  smoothScroll?: boolean;
}) {
  const { scrollToTop } = useScrollTo();
  const { getCurrentPosition } = useScrollPosition();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = getCurrentPosition();
      setIsVisible(position.y > showThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showThreshold, getCurrentPosition]);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => scrollToTop(smoothScroll)}
      className={`fixed bottom-4 right-4 z-50 w-12 h-12 bg-palestine-green hover:bg-palestine-green-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${className}`}
      aria-label="Scroll to top"
    >
      <svg
        className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}