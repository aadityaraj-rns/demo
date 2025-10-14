import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Factory,
  MapPin,
  Package,
  UserCog,
  FileText,
  Users,
  UserCheck,
  Shield,
  ChevronRight,
  ChevronLeft,
  Menu,
  Building2,
} from "lucide-react";
import { useUI } from "@/contexts/UIContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Dashboard section
const dashboardItems: MenuItem[] = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
];

// Administration section
const administrationItems: MenuItem[] = [
  { label: "Industries", path: "/admin/industries", icon: Factory },
  { label: "States", path: "/admin/states", icon: MapPin },
  { label: "Cities", path: "/admin/cities", icon: MapPin },
  { label: "Categories", path: "/admin/categories", icon: Package },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Service Forms", path: "/admin/service-forms", icon: FileText },
  { label: "Plants", path: "/admin/plants", icon: Factory },
  { label: "Floorplan", path: "/admin/floorplans", icon: Building2 },
  { label: "Managers", path: "/admin/managers", icon: Users },
  { label: "Technicians", path: "/admin/technicians", icon: UserCog },
  { label: "Assets", path: "/admin/assets", icon: Package },
  { label: "Roles", path: "/admin/roles", icon: Shield },
  { label: "Users", path: "/admin/users", icon: UserCheck },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const location = useLocation();

  const sections = [
    { title: "", items: dashboardItems },
    { title: "Administration", items: administrationItems },
  ];

  // When collapsed, return null - the expand button will be in the navbar
  if (sidebarCollapsed) {
    return null;
  }

  return (
    <div
      className={cn(
        "h-screen flex flex-col transition-all duration-300 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700",
        "w-56 shadow-2xl"
      )}
    >
      {/* Header */}
      <div className="border-b border-slate-700 flex items-center justify-between p-4 bg-slate-900/50">
        <img
          src="/firedesklogo.png"
          alt="FireDesk Logo"
          className="h-8 w-auto object-contain"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-slate-700/50 w-8 h-8 flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {section.title && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1 px-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/admin" &&
                    location.pathname.startsWith(item.path));

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/admin"}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-700/50 hover:text-white hover:translate-x-1",
                        isActive
                          ? "bg-slate-700 text-white shadow-md"
                          : "text-slate-300"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-3 text-slate-400" />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

// Enhanced Navbar component with integrated expand button
export const Navbar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUI();

  return (
    <div className={cn(
      "h-16 border-b transition-all duration-300 flex items-center",
      sidebarCollapsed 
        ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500 shadow-lg px-4" 
        : "bg-white border-gray-200 px-6"
    )}>
      {/* Left section with expand button */}
      <div className="flex items-center">
        {sidebarCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-white hover:bg-white/20 flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Menu className="h-5 w-5" />
            <span className="text-sm font-medium">Menu</span>
          </Button>
        )}
        
        {/* Page title */}
        <h1 className={cn(
          "text-xl font-semibold ml-4",
          sidebarCollapsed ? "text-white" : "text-gray-800"
        )}>
          Admin Dashboard
        </h1>
      </div>
      
      {/* Right section with user menu */}
      <div className="flex-1 flex items-center justify-end">
        <div className="flex items-center space-x-4">
          {/* Add other navbar items here */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "transition-colors",
              sidebarCollapsed 
                ? "text-white hover:bg-white/20" 
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            Notifications
          </Button>
          
          {/* User avatar */}
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all",
            sidebarCollapsed 
              ? "bg-white/20 text-white hover:bg-white/30" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          )}>
            A
          </div>
        </div>
      </div>
    </div>
  );
};

// Main layout component
export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarCollapsed } = useUI();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main 
        className={cn(
          "flex-1 transition-all duration-300 overflow-hidden flex flex-col",
          sidebarCollapsed 
            ? "bg-gradient-to-br from-blue-50 via-white to-purple-50" 
            : "bg-white"
        )}
      >
        <Navbar />
        
        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};