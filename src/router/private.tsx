import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

const SearchResults = lazy(() => import('../pages/SearchResults'));

export const privateRoutes = [
    <Route
        key="search"
        path="/search"
        element={
            <ProtectedRoute>
                <SearchResults />
            </ProtectedRoute>
        }
    />,
];
