import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReceiptsList from './pages/ReceiptsList';
import UploadReceipt from './pages/UploadReceipt';
import ReceiptDetail from './pages/ReceiptDetail';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Layout Wrapper Component
const AppLayout = () => {
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* App Routes with Layout */}
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/receipts" element={<ReceiptsList />} />
                    <Route path="/upload" element={<UploadReceipt />} />
                    <Route path="/receipts/:id" element={<ReceiptDetail />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/reports" element={<Reports />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;