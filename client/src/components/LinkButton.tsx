import { forwardRef } from 'react';
import { Button } from './ui/button';
import { useScrollTo } from './ScrollManager';

interface LinkButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  scrollToTop?: boolean;
  smoothScroll?: boolean;
  preventDefault?: boolean;
  'aria-label'?: string;
  role?: string;
}

export const LinkButton = forwardRef<HTMLButtonElement, LinkButtonProps>(
  ({
    children,
    onClick,
    href,
    target,
    rel,
    className = '',
    variant = 'ghost',
    size = 'default',
    disabled = false,
    scrollToTop = false,
    smoothScroll = true,
    preventDefault = true,
    'aria-label': ariaLabel,
    role,
    ...props
  }, ref) => {
    const { scrollToTop: scrollToTopFunction } = useScrollTo();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent default behavior if specified
      if (preventDefault) {
        e.preventDefault();
      }

      // Handle scroll to top if requested
      if (scrollToTop) {
        scrollToTopFunction(smoothScroll);
      }

      // Call the custom onClick handler
      if (onClick) {
        onClick();
      }

      // Handle external links
      if (href && !onClick) {
        if (target === '_blank') {
          window.open(href, target, rel ? `rel="${rel}"` : '');
        } else {
          window.location.href = href;
        }
      }
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={`cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 focus-visible-outline ${className}`}
        onClick={handleClick}
        disabled={disabled}
        aria-label={ariaLabel}
        role={role || (href ? 'link' : 'button')}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

LinkButton.displayName = 'LinkButton';

// Navigation Link Component for internal routing
interface NavLinkProps {
  children: React.ReactNode;
  to: string;
  onNavigate: (page: string) => void;
  isActive?: boolean;
  className?: string;
  activeClassName?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  scrollToTop?: boolean;
  smoothScroll?: boolean;
  preserveScroll?: boolean;
  'aria-label'?: string;
}

export function NavLink({
  children,
  to,
  onNavigate,
  isActive = false,
  className = '',
  activeClassName = 'text-palestine-green',
  variant = 'ghost',
  size = 'default',
  scrollToTop = true,
  smoothScroll = true,
  preserveScroll = false,
  'aria-label': ariaLabel,
  ...props
}: NavLinkProps) {
  const { scrollToTop: scrollToTopFunction } = useScrollTo();

  const handleClick = () => {
    // Handle navigation
    onNavigate(to);

    // Handle scroll behavior
    if (!preserveScroll && scrollToTop) {
      setTimeout(() => {
        scrollToTopFunction(smoothScroll);
      }, 150); // Small delay to ensure page content is updated
    }
  };

  return (
    <LinkButton
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`relative transition-colors duration-200 ${
        isActive ? activeClassName : ''
      } ${className}`}
      scrollToTop={false} // We handle scrolling manually
      preventDefault={true}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {children}
      {isActive && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-current rounded-full animate-scale-in" />
      )}
    </LinkButton>
  );
}

// Anchor Link Component for scrolling to sections within a page
interface AnchorLinkProps {
  children: React.ReactNode;
  to: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  offset?: number;
  behavior?: 'smooth' | 'instant';
  'aria-label'?: string;
}

export function AnchorLink({
  children,
  to,
  className = '',
  variant = 'ghost',
  size = 'default',
  offset = -80, // Account for fixed header
  behavior = 'smooth',
  'aria-label': ariaLabel,
  ...props
}: AnchorLinkProps) {
  const { scrollTo } = useScrollTo();

  const handleClick = () => {
    const targetElement = document.querySelector(to);
    if (targetElement) {
      scrollTo(targetElement, {
        behavior,
        offset
      });
    }
  };

  return (
    <LinkButton
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`transition-colors duration-200 ${className}`}
      preventDefault={true}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </LinkButton>
  );
}

// External Link Component for opening external URLs
interface ExternalLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  'aria-label'?: string;
}

export function ExternalLink({
  children,
  href,
  className = '',
  variant = 'ghost',
  size = 'default',
  target = '_blank',
  rel = 'noopener noreferrer',
  'aria-label': ariaLabel,
  ...props
}: ExternalLinkProps) {
  return (
    <LinkButton
      href={href}
      target={target}
      rel={rel}
      variant={variant}
      size={size}
      className={`transition-colors duration-200 ${className}`}
      preventDefault={false}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
      {target === '_blank' && (
        <span className="sr-only">(opens in new tab)</span>
      )}
    </LinkButton>
  );
}