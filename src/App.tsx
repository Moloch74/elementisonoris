import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { LangProvider } from "@/contexts/LangContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import StreetAnimations from "@/components/StreetAnimations";
import VinylCursor from "@/components/VinylCursor";
import LanguageToggle from "@/components/LanguageToggle";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index.tsx";
import ChiSiamo from "./pages/ChiSiamo.tsx";
import Catalogo from "./pages/Catalogo.tsx";
import Eventi from "./pages/Eventi.tsx";
import Contatti from "./pages/Contatti.tsx";
import Shop from "./pages/Shop.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LangProvider>
          <AuthProvider>
            <CartProvider>
              <ScrollToTop />
              <StreetAnimations />
              <VinylCursor />
              <Navbar />
              <LanguageToggle />
              <main>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/chi-siamo" element={<ChiSiamo />} />
                  <Route path="/catalogo" element={<Catalogo />} />
                  <Route path="/eventi" element={<Eventi />} />
                  <Route path="/contatti" element={<Contatti />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </LangProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
