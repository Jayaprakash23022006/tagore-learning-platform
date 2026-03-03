import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import BPLDashboard from './pages/BPLDashboard';
import HIDashboard from './pages/HIDashboard';
import VIDashboard from './pages/VIDashboard';
import GeneralDashboard from './pages/GeneralDashboard';

/* Route guard: redirects to login if not authenticated */
function ProtectedRoute({ children, allowedType }) {
    const { user, userType, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/" replace />;
    if (allowedType && userType !== allowedType) return <Navigate to="/" replace />;

    return children;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route
                path="/bpl"
                element={
                    <ProtectedRoute allowedType="bpl">
                        <BPLDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/hi"
                element={
                    <ProtectedRoute allowedType="hi">
                        <HIDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/vi"
                element={
                    <ProtectedRoute allowedType="vi">
                        <VIDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/general"
                element={
                    <ProtectedRoute allowedType="general">
                        <GeneralDashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
