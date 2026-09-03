import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ResumeProvider } from './contexts/ResumeContext';
import { ToastProvider } from './contexts/ToastContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ResumeWizardPage from './pages/ResumeWizardPage';
import PortfolioBuilderPage from './pages/PortfolioBuilderPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ResumeProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/builder" element={<ProtectedRoute><ResumeWizardPage /></ProtectedRoute>} />
            <Route path="/portfolio-builder" element={<ProtectedRoute><PortfolioBuilderPage /></ProtectedRoute>} />
            <Route path="/portfolio/:username" element={<PublicPortfolioPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ResumeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
