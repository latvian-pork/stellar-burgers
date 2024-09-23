import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { isAuthCheckedSelector } from '../../services/slices/user';

type ProtectedRouteProps = {
  onlyOnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyOnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const location = useLocation();

  if (!onlyOnAuth && !isAuthChecked) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyOnAuth && isAuthChecked) {
    const fromPage = location.state?.from || { pathname: '/' };
    return <Navigate replace to={fromPage} />;
  }
  return children;
};
