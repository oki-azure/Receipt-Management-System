import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import RequireAuth from './components/RequireAuth';
import Dashboard from './pages/Dashboard';
import ReceiptsList from './pages/ReceiptsList';
import UploadReceipt from './pages/UploadReceipt';
import ReceiptDetail from './pages/ReceiptDetail';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Notifications from './pages/Notifications';
import HelpCenter from './pages/HelpCenter';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <NotificationProvider>
                <Router>
                    <Routes>
                        {/* Auth Routes */}
                        <Route element={<AuthLayout />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                        </Route>

                        {/* Protected App Routes with Main Layout */}
                        <Route element={<RequireAuth />}>
                            <Route element={<Layout />}>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/receipts" element={<ReceiptsList />} />
                                <Route path="/upload" element={<UploadReceipt />} />
                                <Route path="/receipts/:id/edit" element={<UploadReceipt />} />
                                <Route path="/receipts/:id" element={<ReceiptDetail />} />
                                <Route path="/categories" element={<Categories />} />
                                <Route path="/notifications" element={<Notifications />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/help" element={<HelpCenter />} />
                            </Route>
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
};

export default App;