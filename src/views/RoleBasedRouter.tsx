import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../components/Context/AuthContext';

const RoleBasedRouter: React.FC = () => {
  const { role } = useAuth();

  if (!role) return <Navigate to="/login" />;
  return <Navigate to={role === 'agent' ? '/agent' : '/user'} />;
};

export default RoleBasedRouter;
