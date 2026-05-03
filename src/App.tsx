import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Tools from "./pages/Tools.tsx";
import ToolPage from "./pages/ToolPage.tsx";
import { Learn, Earn, Grow, Build } from "./pages/sections.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tool/:slug" element={<ToolPage />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/grow" element={<Grow />} />
          <Route path="/build" element={<Build />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
