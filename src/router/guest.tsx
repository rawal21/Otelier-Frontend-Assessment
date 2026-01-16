import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useSelector((state: RootState) => state.auth);

    if (loading) return null;
    if (user) return <Navigate to="/" replace />;

    return <>{children}</>;
};

export const guestRoutes = [
    <Route key="login" path="/login" element={<GuestRoute><Login /></GuestRoute>} />,
    <Route key="signup" path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />,
];
