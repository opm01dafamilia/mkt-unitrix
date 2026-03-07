import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/anuncios" element={<AdGenerator />} />
            <Route path="/copy" element={<CopyGenerator />} />
            <Route path="/funis" element={<SalesFunnel />} />
            <Route path="/analise" element={<CampaignAnalysis />} />
            <Route path="/ideias" element={<ContentIdeas />} />
            <Route path="/historico" element={<History />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
