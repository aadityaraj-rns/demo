import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UIProvider } from "./contexts/UIContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./components/AdminLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Dashboard from "./pages/admin/Dashboard";
import Overview from "./pages/admin/Overview";
import States from "./pages/admin/States";
import Cities from "./pages/admin/Cities";
import Industries from "./pages/admin/Industries";
import Plants from "./pages/admin/PlantsPage";
import PlantCreate from "./pages/admin/PlantCreate";
import PlantEdit from "./pages/admin/PlantEdit";
import PlantView from "./pages/admin/PlantView";
import NotFound from "./pages/NotFound";
import ServiceForms from "./pages/admin/ServiceForms";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
import { UsersPage } from "./pages/admin/UsersPage";
import { RolesPage } from "./pages/admin/RolesPage";
import { ServiceFormPage } from "./pages/admin/ServiceFormPage";
import { ManagersPage } from "./pages/admin/ManagersPage";
import { TechniciansPage } from "./pages/admin/TechniciansPage";
import ProfileSettings from "./pages/admin/ProfileSettings"; // Add this import
import ActivitiesPage from "./pages/admin/ActivitiesPage"; // Add this import
import Assets from "./pages/admin/Assets"; // Add this import
import AssetCreate from "./pages/admin/AssetCreate";
import AssetView from "./pages/admin/AssetView";
import AssetEdit from "./pages/admin/AssetEdit";
import FloorplanDashboard from "./pages/admin/floorplan/FloorplanDashboard";
import FloorplanViewer from "./pages/admin/floorplan/FloorplanViewer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UIProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="overview" element={<Overview />} />
                <Route path="states" element={<States />} />
                <Route path="cities" element={<Cities />} />
                <Route path="industries" element={<Industries />} />
                <Route path="plants" element={<Plants />} />
                <Route path="plants/create" element={<PlantCreate />} />
                <Route path="plants/:id" element={<PlantView />} />
                <Route path="plants/:id/edit" element={<PlantEdit />} />
                <Route path="categories" element={<Categories />} />
                <Route path="products" element={<Products />} />
                <Route path="service-forms" element={<ServiceForms />} />
                <Route path="service-forms/:id" element={<ServiceFormPage />} />
                <Route path="managers" element={<ManagersPage />} />
                <Route path="technicians" element={<TechniciansPage />} />
                <Route path="assets" element={<Assets />} />
                <Route path="assets/create" element={<AssetCreate />} />
                <Route path="assets/:id" element={<AssetView />} />
                <Route path="assets/:id/edit" element={<AssetEdit />} />
                <Route path="floorplans" element={<FloorplanDashboard />} />
                <Route path="floorplans/manufacturing-facility" element={<FloorplanViewer />} />
                <Route path="roles" element={<RolesPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="activities" element={<ActivitiesPage />} /> {/* Add this route */}
                <Route path="profile-settings" element={<ProfileSettings />} /> {/* Add this route */}
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UIProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;