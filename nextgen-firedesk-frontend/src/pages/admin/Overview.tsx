import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package,
  Building2,
  MapPin,
  Factory,
  Users,
  Eye,
  Settings,
  FileText,
  BarChart3,
  Bell,
  Mail,
  UserCog,
  Shield,
  Ticket,
  Wrench,
  ClipboardList,
  Box
} from 'lucide-react';
import { api } from '@/lib/api';

interface AdminStats {
  totalIndustries?: number;
  totalStates?: number;
  totalCities?: number;
  totalCategories?: number;
  totalProducts?: number;
  totalPlants?: number;
  totalAssets?: number;
  totalUsers?: number;
  totalManagers?: number;
  totalTechnicians?: number;
  totalForms?: number;
  totalRoles?: number;
}

interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityName: string;
  userName: string;
  userType: string;
  description: string;
  createdAt: string;
}

interface SystemStatus {
  system: {
    status: 'operational' | 'degraded' | 'warning' | 'error' | 'unknown';
    message: string;
    lastChecked: string;
  };
  database: {
    status: 'operational' | 'degraded' | 'warning' | 'error' | 'unknown';
    message: string;
    lastChecked: string;
  };
  api: {
    status: 'operational' | 'degraded' | 'warning' | 'error' | 'unknown';
    message: string;
    lastChecked: string;
  };
}

export default function Overview() {
  const [stats, setStats] = useState<AdminStats>({});
  const [activities, setActivities] = useState<Activity[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('🔄 Fetching overview statistics...');

        // Fetch all APIs in parallel
        const [
          industriesResponse,
          statesResponse,
          citiesResponse,
          categoriesResponse,
          productsResponse,
          plantsResponse,
          assetsResponse,
          managersResponse,
          techniciansResponse,
          formsResponse,
          usersResponse,
          rolesResponse
        ] = await Promise.all([
          api.get('/industry'),
          api.get('/state'),
          api.get('/city'),
          api.get('/category'),
          api.get('/product'),
          api.get('/organisation/plant'),
          api.get('/asset'),
          api.get('/manager'),
          api.get('/technician'),
          api.get('/form'),
          api.get('/admin/users'),
          api.get('/role')
        ]);

        console.log('📊 API Responses:', {
          industries: industriesResponse,
          states: statesResponse,
          cities: citiesResponse,
          categories: categoriesResponse,
          products: productsResponse,
          plants: plantsResponse,
          assets: assetsResponse,
          managers: managersResponse,
          technicians: techniciansResponse,
          forms: formsResponse,
          users: usersResponse,
          roles: rolesResponse
        });

        // Extract data with proper error handling - updated to match actual backend response structure
        const industries = (industriesResponse as any)?.allIndustry || [];
        const states = (statesResponse as any)?.allState || [];
        const cities = (citiesResponse as any)?.allCity || [];
        const categories = (categoriesResponse as any)?.allCategory || [];
        const products = (productsResponse as any)?.products || [];
        const plants = (plantsResponse as any)?.plants || [];
        const assets = (assetsResponse as any)?.assets || [];
        const managers = (managersResponse as any)?.allManager || [];
        const technicians = (techniciansResponse as any)?.technicians || [];
        const forms = (formsResponse as any)?.allForm || [];
        const users = (usersResponse as any)?.users || []; // Fixed: backend returns 'users' not 'allUser'
        const roles = (rolesResponse as any)?.roles || []; // Fixed: backend returns 'roles' not 'allRole'

        setStats({
          totalIndustries: industries.length,
          totalStates: states.length,
          totalCities: cities.length,
          totalCategories: categories.length,
          totalProducts: products.length,
          totalPlants: plants.length,
          totalAssets: assets.length,
          totalUsers: users.length,
          totalManagers: managers.length,
          totalTechnicians: technicians.length,
          totalForms: forms.length,
          totalRoles: roles.length,
        });

        console.log('✅ Stats set successfully:', {
          totalIndustries: industries.length,
          totalStates: states.length,
          totalCities: cities.length,
          totalCategories: categories.length,
          totalProducts: products.length,
          totalPlants: plants.length,
          totalUsers: users.length,
          totalManagers: managers.length,
          totalTechnicians: technicians.length,
          totalForms: forms.length,
          totalRoles: roles.length,
        });

      } catch (error) {
        console.error('❌ Failed to fetch stats:', error);
        // Log the full error for debugging
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        // Don't set fallback data - let it show 0 or undefined so we know there's an issue
        setStats({
          totalIndustries: 0,
          totalStates: 0,
          totalCities: 0,
          totalCategories: 0,
          totalProducts: 0,
          totalPlants: 0,
          totalUsers: 0,
          totalManagers: 0,
          totalTechnicians: 0,
          totalForms: 0,
          totalRoles: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const response = await api.get('/activity/recent?limit=5');
        if ((response as any).success) {
          setActivities((response as any).activities || []);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      }
    };

    const fetchSystemStatus = async () => {
      try {
        const response = await api.get('/system/status');
        if ((response as any).success) {
          setSystemStatus((response as any).status);
        }
      } catch (error) {
        console.error('Failed to fetch system status:', error);
        // Set error status if API call fails
        setSystemStatus({
          system: { status: 'error', message: 'Unable to connect to backend', lastChecked: new Date().toISOString() },
          database: { status: 'unknown', message: 'Unable to check', lastChecked: new Date().toISOString() },
          api: { status: 'error', message: 'Connection failed', lastChecked: new Date().toISOString() }
        });
      }
    };

    fetchStats();
    fetchActivities();
    fetchSystemStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Helper function to get status color classes
  const getStatusColors = (status: string) => {
    switch (status) {
      case 'operational':
        return {
          border: 'border-green-300',
          bg: 'bg-green-50',
          hover: 'hover:bg-green-100',
          dot: 'bg-green-500',
          text: 'text-green-800',
          subtext: 'text-green-600',
          animate: true
        };
      case 'warning':
        return {
          border: 'border-yellow-300',
          bg: 'bg-yellow-50',
          hover: 'hover:bg-yellow-100',
          dot: 'bg-yellow-500',
          text: 'text-yellow-800',
          subtext: 'text-yellow-600',
          animate: false
        };
      case 'degraded':
        return {
          border: 'border-orange-300',
          bg: 'bg-orange-50',
          hover: 'hover:bg-orange-100',
          dot: 'bg-orange-500',
          text: 'text-orange-800',
          subtext: 'text-orange-600',
          animate: false
        };
      case 'error':
        return {
          border: 'border-red-300',
          bg: 'bg-red-50',
          hover: 'hover:bg-red-100',
          dot: 'bg-red-500',
          text: 'text-red-800',
          subtext: 'text-red-600',
          animate: false
        };
      default: // unknown
        return {
          border: 'border-gray-300',
          bg: 'bg-gray-50',
          hover: 'hover:bg-gray-100',
          dot: 'bg-gray-500',
          text: 'text-gray-800',
          subtext: 'text-gray-600',
          animate: false
        };
    }
  };

  const overviewCards = [
    {
      title: "Industries",
      description: "Manage business industries",
      icon: Factory,
      path: "/admin/industries",
      count: stats.totalIndustries,
      color: "from-orange-50 to-orange-100 border-orange-200"
    },
    {
      title: "States",
      description: "Manage states and regions",
      icon: MapPin,
      path: "/admin/states",
      count: stats.totalStates,
      color: "from-sky-50 to-sky-100 border-sky-200"
    },
    {
      title: "Cities",
      description: "Manage cities and locations",
      icon: Building2,
      path: "/admin/cities",
      count: stats.totalCities,
      color: "from-slate-50 to-slate-100 border-slate-200"
    },
    {
      title: "Categories",
      description: "Manage service categories",
      icon: Package,
      path: "/admin/categories",
      count: stats.totalCategories,
      color: "from-emerald-50 to-emerald-100 border-emerald-200"
    },
    {
      title: "Products",
      description: "Manage products and variants",
      icon: Package,
      path: "/admin/products",
      count: stats.totalProducts,
      color: "from-orange-50 to-orange-100 border-orange-200"
    },
    {
      title: "Plants",
      description: "Manage plants and facilities",
      icon: Factory,
      path: "/admin/plants",
      count: stats.totalPlants,
      color: "from-sky-50 to-sky-100 border-sky-200"
    },
    {
      title: "Assets",
      description: "Manage assets and equipment",
      icon: Box,
      path: "/admin/assets",
      count: stats.totalAssets,
      color: "from-purple-50 to-purple-100 border-purple-200"
    },
    {
      title: "Users",
      description: "Manage user access and permissions",
      icon: UserCog,
      path: "/admin/users",
      count: stats.totalUsers,
      color: "from-slate-50 to-slate-100 border-slate-200"
    },
    {
      title: "Managers",
      description: "Manage plant managers",
      icon: Users,
      path: "/admin/managers",
      count: stats.totalManagers,
      color: "from-emerald-50 to-emerald-100 border-emerald-200"
    },
    {
      title: "Technicians",
      description: "Manage technicians and assignments",
      icon: Wrench,
      path: "/admin/technicians",
      count: stats.totalTechnicians,
      color: "from-orange-50 to-orange-100 border-orange-200"
    },
    {
      title: "Service Forms",
      description: "Create and manage service forms",
      icon: ClipboardList,
      path: "/admin/service-forms",
      count: stats.totalForms,
      color: "from-sky-50 to-sky-100 border-sky-200"
    },
    {
      title: "Roles & Permissions",
      description: "Manage system roles and permissions",
      icon: Shield,
      path: "/admin/roles",
      count: stats.totalRoles,
      color: "from-slate-50 to-slate-100 border-slate-200"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome to FireDesk!</h1>
            <p className="text-orange-100 text-lg">Complete system overview and quick access to all modules</p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <BarChart3 className="h-12 w-12" />
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-orange-600">Industries</p>
              <p className="text-2xl font-bold text-orange-800">{stats.totalIndustries}</p>
            </div>
            <Factory className="h-8 w-8 text-orange-600" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-sky-600">States</p>
              <p className="text-2xl font-bold text-sky-800">{stats.totalStates}</p>
            </div>
            <MapPin className="h-8 w-8 text-sky-600" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-600">Cities</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalCities}</p>
            </div>
            <Building2 className="h-8 w-8 text-slate-600" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-emerald-600">Categories</p>
              <p className="text-2xl font-bold text-emerald-800">{stats.totalCategories}</p>
            </div>
            <Package className="h-8 w-8 text-emerald-600" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-orange-600">Plants</p>
              <p className="text-2xl font-bold text-orange-800">{stats.totalPlants}</p>
            </div>
            <Factory className="h-8 w-8 text-orange-600" />
          </CardContent>
        </Card>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-sky-600">Users</p>
              <p className="text-2xl font-bold text-sky-800">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-sky-600" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-slate-600">Managers</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalManagers}</p>
            </div>
            <UserCog className="h-8 w-8 text-slate-600" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-emerald-600">Technicians</p>
              <p className="text-2xl font-bold text-emerald-800">{stats.totalTechnicians}</p>
            </div>
            <Wrench className="h-8 w-8 text-emerald-600" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-orange-600">Service Forms</p>
              <p className="text-2xl font-bold text-orange-800">{stats.totalForms}</p>
            </div>
            <ClipboardList className="h-8 w-8 text-orange-600" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-sky-600">Roles</p>
              <p className="text-2xl font-bold text-sky-800">{stats.totalRoles}</p>
            </div>
            <Shield className="h-8 w-8 text-sky-600" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Quick Access</h2>
          <p className="text-muted-foreground">
            Direct access to all system management modules
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {overviewCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className={`card-elevated hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-current bg-gradient-to-br ${card.color}`}
                onClick={() => navigate(card.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-white/50`}>
                      <Icon className={`h-6 w-6 text-current`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {card.count}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="lg:col-span-2 card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest system activities and admin actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => {
                const getActionIcon = (entityType: string) => {
                  switch (entityType.toLowerCase()) {
                    case 'technician':
                      return <Wrench className="h-5 w-5 text-blue-600" />;
                    case 'plant':
                      return <Factory className="h-5 w-5 text-green-600" />;
                    case 'user':
                      return <Users className="h-5 w-5 text-purple-600" />;
                    case 'manager':
                      return <UserCog className="h-5 w-5 text-orange-600" />;
                    default:
                      return <FileText className="h-5 w-5 text-gray-600" />;
                  }
                };

                const getActionBadgeVariant = (action: string): "default" | "secondary" | "destructive" | "outline" => {
                  switch (action.toLowerCase()) {
                    case 'created':
                      return 'default';
                    case 'updated':
                      return 'secondary';
                    case 'deleted':
                      return 'destructive';
                    default:
                      return 'outline';
                  }
                };

                const getTimeAgo = (dateString: string) => {
                  const date = new Date(dateString);
                  const now = new Date();
                  const diffMs = now.getTime() - date.getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMins / 60);
                  const diffDays = Math.floor(diffHours / 24);

                  if (diffMins < 1) return 'Just now';
                  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
                  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                };

                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        {getActionIcon(activity.entityType)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {activity.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          by {activity.userName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getActionBadgeVariant(activity.action)}>
                        {activity.action}
                      </Badge>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>{getTimeAgo(activity.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/admin/activities")}
            >
              <Eye className="mr-2 h-4 w-4" />
              View All Activities
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className={`card-elevated bg-white ${systemStatus ? getStatusColors(systemStatus.system.status).border : 'border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${systemStatus ? getStatusColors(systemStatus.system.status).text : 'text-gray-600'}`}>
            <Settings className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system health and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* System Status */}
            {systemStatus?.system ? (
              <div className={`text-center p-6 border-2 rounded-xl transition-colors ${getStatusColors(systemStatus.system.status).border} ${getStatusColors(systemStatus.system.status).bg} ${getStatusColors(systemStatus.system.status).hover}`}>
                <div className={`w-4 h-4 rounded-full mx-auto mb-3 ${getStatusColors(systemStatus.system.status).dot} ${getStatusColors(systemStatus.system.status).animate ? 'animate-pulse' : ''}`}></div>
                <p className={`text-lg font-semibold mb-1 ${getStatusColors(systemStatus.system.status).text}`}>
                  {systemStatus.system.status === 'operational' ? 'System Operational' : 
                   systemStatus.system.status === 'warning' ? 'System Warning' :
                   systemStatus.system.status === 'degraded' ? 'System Degraded' :
                   systemStatus.system.status === 'error' ? 'System Error' : 'System Unknown'}
                </p>
                <p className={`text-sm ${getStatusColors(systemStatus.system.status).subtext}`}>
                  {systemStatus.system.message}
                </p>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-gray-300 rounded-xl bg-gray-50">
                <div className="w-4 h-4 bg-gray-500 rounded-full mx-auto mb-3"></div>
                <p className="text-lg font-semibold text-gray-800 mb-1">Checking...</p>
                <p className="text-sm text-gray-600">Loading status</p>
              </div>
            )}

            {/* Database Status */}
            {systemStatus?.database ? (
              <div className={`text-center p-6 border-2 rounded-xl transition-colors ${getStatusColors(systemStatus.database.status).border} ${getStatusColors(systemStatus.database.status).bg} ${getStatusColors(systemStatus.database.status).hover}`}>
                <div className={`w-4 h-4 rounded-full mx-auto mb-3 ${getStatusColors(systemStatus.database.status).dot} ${getStatusColors(systemStatus.database.status).animate ? 'animate-pulse' : ''}`}></div>
                <p className={`text-lg font-semibold mb-1 ${getStatusColors(systemStatus.database.status).text}`}>
                  {systemStatus.database.status === 'operational' ? 'Database Connected' : 
                   systemStatus.database.status === 'warning' ? 'Database Warning' :
                   systemStatus.database.status === 'degraded' ? 'Database Degraded' :
                   systemStatus.database.status === 'error' ? 'Database Error' : 'Database Unknown'}
                </p>
                <p className={`text-sm ${getStatusColors(systemStatus.database.status).subtext}`}>
                  {systemStatus.database.message}
                </p>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-gray-300 rounded-xl bg-gray-50">
                <div className="w-4 h-4 bg-gray-500 rounded-full mx-auto mb-3"></div>
                <p className="text-lg font-semibold text-gray-800 mb-1">Checking...</p>
                <p className="text-sm text-gray-600">Loading status</p>
              </div>
            )}

            {/* API Status */}
            {systemStatus?.api ? (
              <div className={`text-center p-6 border-2 rounded-xl transition-colors ${getStatusColors(systemStatus.api.status).border} ${getStatusColors(systemStatus.api.status).bg} ${getStatusColors(systemStatus.api.status).hover}`}>
                <div className={`w-4 h-4 rounded-full mx-auto mb-3 ${getStatusColors(systemStatus.api.status).dot} ${getStatusColors(systemStatus.api.status).animate ? 'animate-pulse' : ''}`}></div>
                <p className={`text-lg font-semibold mb-1 ${getStatusColors(systemStatus.api.status).text}`}>
                  {systemStatus.api.status === 'operational' ? 'API Working' : 
                   systemStatus.api.status === 'warning' ? 'API Warning' :
                   systemStatus.api.status === 'degraded' ? 'API Degraded' :
                   systemStatus.api.status === 'error' ? 'API Error' : 'API Unknown'}
                </p>
                <p className={`text-sm ${getStatusColors(systemStatus.api.status).subtext}`}>
                  {systemStatus.api.message}
                </p>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-gray-300 rounded-xl bg-gray-50">
                <div className="w-4 h-4 bg-gray-500 rounded-full mx-auto mb-3"></div>
                <p className="text-lg font-semibold text-gray-800 mb-1">Checking...</p>
                <p className="text-sm text-gray-600">Loading status</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}