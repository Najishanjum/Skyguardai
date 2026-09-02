import React, { useState, useCallback, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';

// Lazy-loaded pages — each becomes its own chunk, loaded on-demand
const LandingPage = React.lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const LiveMonitoringPage = React.lazy(() => import('./pages/LiveMonitoringPage').then(m => ({ default: m.LiveMonitoringPage })));
const MapPage = React.lazy(() => import('./pages/MapPage').then(m => ({ default: m.MapPage })));
const StationsPage = React.lazy(() => import('./pages/StationsPage').then(m => ({ default: m.StationsPage })));
const StationDetailPage = React.lazy(() => import('./pages/StationDetailPage').then(m => ({ default: m.StationDetailPage })));
const AnomaliesPage = React.lazy(() => import('./pages/AnomaliesPage').then(m => ({ default: m.AnomaliesPage })));
const AnomalyDetailPage = React.lazy(() => import('./pages/AnomalyDetailPage').then(m => ({ default: m.AnomalyDetailPage })));
const SensorHealthPage = React.lazy(() => import('./pages/SensorHealthPage').then(m => ({ default: m.SensorHealthPage })));
const MaintenancePage = React.lazy(() => import('./pages/MaintenancePage').then(m => ({ default: m.MaintenancePage })));
const SelfHealingPage = React.lazy(() => import('./pages/SelfHealingPage').then(m => ({ default: m.SelfHealingPage })));
const ExplainableAIPage = React.lazy(() => import('./pages/ExplainableAIPage').then(m => ({ default: m.ExplainableAIPage })));
const DataExplorerPage = React.lazy(() => import('./pages/DataExplorerPage').then(m => ({ default: m.DataExplorerPage })));
const SimulationLabPage = React.lazy(() => import('./pages/SimulationLabPage').then(m => ({ default: m.SimulationLabPage })));
const GuidedDemoPage = React.lazy(() => import('./pages/GuidedDemoPage').then(m => ({ default: m.GuidedDemoPage })));
const AlertsPage = React.lazy(() => import('./pages/AlertsPage').then(m => ({ default: m.AlertsPage })));
const AuditLedgerPage = React.lazy(() => import('./pages/AuditLedgerPage').then(m => ({ default: m.AuditLedgerPage })));
const ReportsPage = React.lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));

// Branded loading skeleton shown while lazy chunks download
const PageLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-pulse">
    <div className="w-12 h-12 border-4 border-[#11110F] border-t-[#C8FF2E] rounded-full animate-spin" />
    <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#11110F]/60">
      Loading module...
    </div>
  </div>
);

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  // Memoize callbacks to prevent child re-renders
  const handleToggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1E8] text-[#11110F] font-sans relative selection:bg-[#C8FF2E] selection:text-[#11110F]">
      <Navbar onToggleSidebar={handleToggleSidebar} />
      
      <div className="flex-1 flex w-full relative z-10">
        {!isLanding && (
          <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        )}
        
        <main className={`flex-1 ${isLanding ? 'w-full' : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full'}`}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/live" element={<LiveMonitoringPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/stations" element={<StationsPage />} />
              <Route path="/stations/:id" element={<StationDetailPage />} />
              <Route path="/anomalies" element={<AnomaliesPage />} />
              <Route path="/anomalies/:id" element={<AnomalyDetailPage />} />
              <Route path="/health" element={<SensorHealthPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/self-healing" element={<SelfHealingPage />} />
              <Route path="/explain" element={<ExplainableAIPage />} />
              <Route path="/explorer" element={<DataExplorerPage />} />
              <Route path="/simulation" element={<SimulationLabPage />} />
              <Route path="/demo" element={<GuidedDemoPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/audit" element={<AuditLedgerPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WebSocketProvider>
          <Router>
            <AppLayout />
          </Router>
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

