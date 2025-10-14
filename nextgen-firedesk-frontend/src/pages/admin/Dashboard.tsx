import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Factory, Users, UserCog, MapPin, Package, Eye, UserCheck, Building2 } from 'lucide-react';

interface DashboardStats {
  totalIndustries?: number;
  totalPlants?: number;
  totalManagers?: number;
  totalTechnicians?: number;
  totalCategories?: number;
  totalProducts?: number;
  recentActivities?: Array<{
    id: string;
    action: string;
    description: string;
    timestamp: string;
    type: string;
  }>;
  [key: string]: any;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await api.get<DashboardStats>('/dashboard');
      console.log('Dashboard data:', data); // Debug log
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stat cards with updated design
  const statCards = [
    {
      title: 'Industries',
      value: stats.totalIndustries || 0,
      icon: Building2,
      description: 'Total industries',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Categories',
      value: stats.totalCategories || 0,
      icon: Package,
      description: 'Total categories',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Products',
      value: stats.totalProducts || 0,
      icon: Package,
      description: 'Total products',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Plants',
      value: stats.totalPlants || 0,
      icon: Factory,
      description: 'Total plants',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Managers',
      value: stats.totalManagers || 0,
      icon: Users,
      description: 'Total managers',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Technicians',
      value: stats.totalTechnicians || 0,
      icon: UserCog,
      description: 'Total technicians',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your FireDesk system
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system activities and admin actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.slice(0, 3).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {activity.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">{activity.type}</Badge>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>{new Date(activity.timestamp).toLocaleDateString()}</p>
                        <p>{new Date(activity.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback placeholder activities
                [1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          System Update
                        </p>
                        <p className="text-sm text-muted-foreground">
                          New features added to the platform
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary">Info</Badge>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>2 hours ago</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/admin/industries")}
              >
                <Eye className="mr-2 h-4 w-4" />
                View All Activities
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
              onClick={() => navigate("/admin/industries")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Manage Industries
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/admin/plants")}
            >
              <Factory className="mr-2 h-4 w-4" />
              Manage Plants
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/admin/states")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Manage States
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/admin/products")}
            >
              <Package className="mr-2 h-4 w-4" />
              Manage Products
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/admin/service-forms")}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Service Forms
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/admin/categories")}
            >
              <Users className="mr-2 h-4 w-4" />
              Categories
            </Button> 
          </CardContent>
        </Card>
      </div>
    </div>
  );
}