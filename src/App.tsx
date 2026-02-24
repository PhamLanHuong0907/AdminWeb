import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import Dashboard from "@/pages/admin/Dashboard";
import NavigationPage from "@/pages/admin/NavigationPage";
import ServicesPage from "@/pages/admin/ServicesPage";
import HeroSectionsPage from "@/pages/admin/HeroSectionsPage";
import ProductServicesPage from "@/pages/admin/ProductServicesPage";
import ProductsPage from "@/pages/admin/ProductsPage";
import ProjectsPage from "@/pages/admin/ProjectsPage";
import PrizesPage from "@/pages/admin/PrizesPage";
import BlogsPage from "@/pages/admin/BlogsPage";
import TestimonialsPage from "@/pages/admin/TestimonialsPage";
import LoginPage from "@/pages/auth/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Route */}
            <Route path="/auth" element={<LoginPage />} />
            
            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/navigation" element={<NavigationPage />} />
                <Route path="/admin/services" element={<ServicesPage />} />
                <Route path="/admin/hero-sections" element={<HeroSectionsPage />} />
                <Route path="/admin/product-services" element={<ProductServicesPage />} />
                <Route path="/admin/products" element={<ProductsPage />} />
                <Route path="/admin/projects" element={<ProjectsPage />} />
                <Route path="/admin/prizes" element={<PrizesPage />} />
                <Route path="/admin/blogs" element={<BlogsPage />} />
                <Route path="/admin/testimonials" element={<TestimonialsPage />} />
              </Route>
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
