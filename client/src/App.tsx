import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import Botes from "./pages/Botes";
import Nosotros from "./pages/Nosotros";
import Login from "./pages/admin/Login";
import AdminTours from "./pages/admin/Tours";
import AdminCategories from "./pages/admin/Categories";
import TourEditor from "./pages/admin/TourEditor";
import { useAuth } from "./hooks/use-auth";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-sand/30">
        <div className="w-8 h-8 rounded-full border-4 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) {
    window.location.href = "/admin/login";
    return null;
  }
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tours" component={Tours} />
      <Route path="/tour/:id" component={TourDetail} />
      <Route path="/botes" component={Botes} />
      <Route path="/nosotros" component={Nosotros} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={Login} />
      <Route path="/admin">
        {(params) => <ProtectedRoute component={AdminTours} {...params} />}
      </Route>
      <Route path="/admin/tours">
        {(params) => <ProtectedRoute component={AdminTours} {...params} />}
      </Route>
      <Route path="/admin/tours/new">
        {(params) => <ProtectedRoute component={TourEditor} {...params} />}
      </Route>
      <Route path="/admin/tours/edit/:id">
        {(params) => <ProtectedRoute component={TourEditor} {...params} />}
      </Route>
      <Route path="/admin/categories">
        {(params) => <ProtectedRoute component={AdminCategories} {...params} />}
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster />
              <ScrollToTop />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
