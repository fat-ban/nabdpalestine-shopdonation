import { useEffect, useState, useCallback } from 'react';

// Hook for lazy loading images
export function useLazyImage(src: string, threshold = 0.1) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setIsError(true);
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { imageSrc, isLoaded, isError };
}

// Hook for intersection observer
export function useIntersectionObserver(
  threshold = 0.1,
  rootMargin = '0px'
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  const observer = useCallback((node: Element | null) => {
    if (node) setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observerInstance = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observerInstance.observe(element);

    return () => {
      observerInstance.disconnect();
    };
  }, [element, threshold, rootMargin]);

  return { ref: observer, isIntersecting };
}

// Hook for debouncing values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for throttling functions
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [throttledCallback, setThrottledCallback] = useState<T>(callback);
  const [isThrottled, setIsThrottled] = useState(false);

  useEffect(() => {
    if (!isThrottled) {
      setThrottledCallback(callback);
      setIsThrottled(true);
      
      const timeout = setTimeout(() => {
        setIsThrottled(false);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [callback, delay, isThrottled]);

  return throttledCallback;
}

// Hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16.67) { // More than one frame (60fps)
        console.warn(
          `Performance Warning: ${componentName} took ${renderTime.toFixed(2)}ms to render`
        );
      }
    };
  });
}

// Component for lazy loading sections
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyComponent({ 
  children, 
  fallback, 
  threshold = 0.1, 
  rootMargin = '100px',
  className = ''
}: LazyComponentProps) {
  const { ref, isIntersecting } = useIntersectionObserver(threshold, rootMargin);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isIntersecting && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isIntersecting, hasLoaded]);

  return (
    <div ref={ref} className={className}>
      {hasLoaded ? children : (fallback || <div className="h-32 animate-pulse bg-muted rounded-md" />)}
    </div>
  );
}

// Optimized image component
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  threshold?: number;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  fallback = 'https://images.unsplash.com/photo-1572012335207-96e9fcb7c214?w=400&h=300&fit=crop',
  loading = 'lazy',
  threshold = 0.1
}: OptimizedImageProps) {
  const { ref, isIntersecting } = useIntersectionObserver(threshold);
  const { imageSrc, isLoaded, isError } = useLazyImage(
    loading === 'lazy' ? (isIntersecting ? src : '') : src
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 bg-muted-foreground/20 rounded-full"></div>
        </div>
      )}
      
      {isLoaded && imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={loading}
        />
      )}
      
      {isError && (
        <img
          src={fallback}
          alt={alt}
          className="w-full h-full object-cover opacity-60"
          loading={loading}
        />
      )}
    </div>
  );
}

// Memory usage monitor (development only)
export function useMemoryMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const used = memory.usedJSHeapSize / 1048576; // Convert to MB
        const total = memory.totalJSHeapSize / 1048576;
        
        if (used > 50) { // Alert if using more than 50MB
          console.warn(`Memory Usage: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB`);
        }
      }
    };

    const interval = setInterval(checkMemory, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, []);
}

// Prefetch component for critical resources
export function ResourcePrefetcher({ resources }: { resources: string[] }) {
  useEffect(() => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    });
  }, [resources]);

  return null;
}