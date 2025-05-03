
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudyProvider } from "./context/StudyContext";
import AppLayout from "./components/layout/AppLayout";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

// Pages
import TimerPage from "./pages/TimerPage";
import ReportsPage from "./pages/ReportsPage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if there's an active session
        const { data } = await supabase.auth.getSession();
        
        // Set authentication state based on session
        if (data.session) {
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('isAuthenticated');
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setIsAuthenticated(!!session);
        if (session) {
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          localStorage.removeItem('isAuthenticated');
        }
      }
    );

    checkAuth();

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Determine which routes should be inside the AppLayout
  const AuthenticatedRoutes = () => {
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

  if (isLoading) {
    // Show a loading state while checking authentication
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <StudyProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
              } />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/dashboard/*" element={
                isAuthenticated ? <AuthenticatedRoutes /> : <Navigate to="/login" />
              } />
              <Route path="/" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </StudyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
