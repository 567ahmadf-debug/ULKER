import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/common/ScrollToTop";
import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import AdminPage from "@/pages/AdminPage";
import OffersPage from "@/pages/OffersPage";
import OfferDetailPage from "@/pages/OfferDetailPage";
import CategoriesPage from "@/pages/CategoriesPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function AdminLayout() {
  return (
    <Switch>
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/:rest*" component={AdminPage} />
    </Switch>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/products" component={ProductsPage} />
        <Route path="/products/:id" component={ProductDetailPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/offers" component={OffersPage} />
        <Route path="/offers/:id" component={OfferDetailPage} />
        <Route path="/categories" component={CategoriesPage} />
        <Route component={NotFound} />
      </Switch>
      <MobileBottomNav />
    </>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Switch>
              <Route path="/admin/:rest*" component={AdminLayout} />
              <Route path="/admin" component={AdminPage} />
              <Route component={Router} />
            </Switch>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
