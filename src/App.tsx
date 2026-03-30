import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import QuotationForm from './components/QuotationForm';
import QuotationResultModal from './components/QuotationResultModal';
import QuotationHistory from './components/QuotationHistory';
import AnalyticsPage from './components/AnalyticsPage';
import NotFound from './pages/NotFound';
import PoweredByFooter from './components/PoweredByFooter';
import Navigation from './components/Navigation';
import { useClient } from './hooks/useClient';

const queryClient = new QueryClient();

const ProtectedRoute = () => {
  const client = useClient();
  const stored = localStorage.getItem('wuru_active_client');
  if (!stored || !client) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen bg-app-background">
      <Navigation />
      <Outlet />
      <QuotationResultModal />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<QuotationForm />} />
            <Route path="/history" element={<QuotationHistory />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <PoweredByFooter />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
