import React from 'react';
import { useAuth } from '../../../components/contexts/AuthContext';
import { Role } from '../../users/types';

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: Role[];
  onNavigate: (page: string) => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles, onNavigate }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    onNavigate('login');
    return null;
  }

  if (roles && roles.length > 0 && (!user || !roles.includes(user.role))) {
    onNavigate('unauthorized');
    return null;
  }

  return React.cloneElement(children, { onNavigate });
};

export default ProtectedRoute;
