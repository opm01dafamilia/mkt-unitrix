import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import AdGenerator from "./pages/AdGenerator";
import CopyGenerator from "./pages/CopyGenerator";
import SalesFunnel from "./pages/SalesFunnel";
import CampaignAnalysis from "./pages/CampaignAnalysis";
import ContentIdeas from "./pages/ContentIdeas";
import History from "./pages/History";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (session) {
    if (profile && !profile.onboarding_completed) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (profile?.onboarding_completed) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      }
    />
    <Route path="/anuncios" element={<ProtectedRoute><AppLayout><AdGenerator /></AppLayout></ProtectedRoute>} />
    <Route path="/copy" element={<ProtectedRoute><AppLayout><CopyGenerator /></AppLayout></ProtectedRoute>} />
    <Route path="/funis" element={<ProtectedRoute><AppLayout><SalesFunnel /></AppLayout></ProtectedRoute>} />
    <Route path="/analise" element={<ProtectedRoute><AppLayout><CampaignAnalysis /></AppLayout></ProtectedRoute>} />
    <Route path="/ideias" element={<ProtectedRoute><AppLayout><ContentIdeas /></AppLayout></ProtectedRoute>} />
    <Route path="/historico" element={<ProtectedRoute><AppLayout><History /></AppLayout></ProtectedRoute>} />
    <Route path="/perfil" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
    <Route path="/configuracoes" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
