import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import Tools from "./pages/Tools.tsx";
import ToolPage from "./pages/ToolPage.tsx";
import FolderPage from "./pages/FolderPage.tsx";
import Daily from "./pages/Daily.tsx";
import DailyToolPage from "./pages/DailyToolPage.tsx";
import PresentationPage from "./pages/PresentationPage.tsx";
import PdfBuilder from "./pages/PdfBuilder.tsx";
import Assistant from "./pages/Assistant.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import Auth from "./pages/Auth.tsx";
import About from "./pages/About.tsx";
import AdminAccess from "./pages/AdminAccess.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import { Learn, Earn, Grow, Build } from "./pages/sections.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/folder/:slug" element={<FolderPage />} />
            <Route path="/tool/:slug" element={<ToolPage />} />
            <Route path="/daily" element={<Daily />} />
            <Route path="/daily/:slug" element={<DailyToolPage />} />
            <Route path="/presentation" element={<PresentationPage />} />
            <Route path="/pdf" element={<PdfBuilder />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin-access" element={<AdminAccess />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/earn" element={<Earn />} />
            <Route path="/grow" element={<Grow />} />
            <Route path="/build" element={<Build />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
