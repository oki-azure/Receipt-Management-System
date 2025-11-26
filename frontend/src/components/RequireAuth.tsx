import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
    const { isLoggedIn, isHydrating } = useAuth();

    if (isHydrating) {
        // Show a loader while we’re restoring auth state from LocalStorage
        return (
            <div className="flex h-screen items-center justify-center text-gray-500">
                Loading…
            </div>
        );
    }

    // If logged in, render the child routes
    // If not, redirect to login
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;