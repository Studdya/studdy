
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudyProvider } from "./context/StudyContext";
import AppLayout from "./components/layout/AppLayout";

// Pages
import TimerPage from "./pages/TimerPage";
import ReportsPage from "./pages/ReportsPage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // For now, we'll use a simple state to determine if user is authenticated
  // This will be replaced with actual Supabase auth check later
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // Determine which routes should be inside the AppLayout
  const AuthenticatedRoutes = () => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return (
      <AppLayout>
        <Routes>
          <Route path="/" element={<TimerPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </AppLayout>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <StudyProvider>
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
              />
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
              } />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/dashboard/*" element={<AuthenticatedRoutes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </StudyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
