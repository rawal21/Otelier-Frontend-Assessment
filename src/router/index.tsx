import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { guestRoutes } from './guest';
import { privateRoutes } from './private';

const Home = lazy(() => import('../pages/Home'));

const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            {/* Guest Routes (Login/Signup) */}
            {guestRoutes}

            {/* Private Routes */}
            {privateRoutes}

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;
