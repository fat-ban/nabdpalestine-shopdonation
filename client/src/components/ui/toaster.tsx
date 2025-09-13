import { Toaster as Sonner } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme === 'dark' ? 'dark' : 'light'}
      className="toaster group"
      position="bottom-right"
      {...props}
    />
  );
};

export { Toaster };