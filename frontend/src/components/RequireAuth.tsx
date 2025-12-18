import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from './ui/spinner';

const ProtectedRoute: React.FC = () => {
    const { isLoggedIn, isHydrating } = useAuth();

    if (isHydrating) {
        // Show a loader while we’re restoring auth state
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner className="w-16 h-16" />
            </div>
        );
    }

    // If logged in, render the child routes
    // If not, redirect to login
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;