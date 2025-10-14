import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Factory, Pencil, Trash2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Plant {
  id: string;
  plantId: string;
  plantName: string;
  address: string;
  status: string;
  city?: {
    cityName: string;
  };
  state?: {
    stateName: string;
  };
  industry?: {
    industryName: string;
  };
}

export default function Plants() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/plant') as any;
      
      if (response.success) {
        setPlants(response.plants || []);
      }
    } catch (error: any) {
      console.error('Failed to fetch plants:', error);
      toast({
        title: "Error",
        description: "Failed to load plants. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      Active: "bg-green-500/10 text-green-700 border-green-500/20",
      Deactive: "bg-red-500/10 text-red-700 border-red-500/20",
      Draft: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    };

    return (
      <Badge 
        variant="outline" 
        className={statusColors[status as keyof typeof statusColors] || ""}
      >
        {status}
      </Badge>
    );
  };

  const handleDelete = async (plantId: string, plantName: string) => {
    if (!confirm(`Are you sure you want to delete plant "${plantName}"?`)) {
      return;
    }

    try {
      await api.delete(`/plant/${plantId}`);
      toast({
        title: "Success",
        description: "Plant deleted successfully!",
      });
      fetchPlants(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to delete plant:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete plant",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-1">Plants</h1>
            <p className="text-sm text-muted-foreground">Manage plants in your system</p>
          </div>
          <Button onClick={() => navigate('/admin/plants/create')} size="lg">
            + Add Plant
          </Button>
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/50">
                <TableHead className="font-semibold">Plant ID</TableHead>
                <TableHead className="font-semibold">Plant Name</TableHead>
                <TableHead className="font-semibold">Address</TableHead>
                <TableHead className="font-semibold">City</TableHead>
                <TableHead className="font-semibold">State</TableHead>
                <TableHead className="font-semibold">Industry</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <p className="text-muted-foreground">Loading plants...</p>
                  </TableCell>
                </TableRow>
              ) : plants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-96">
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <Factory className="h-20 w-20 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-1">No plants found</h3>
                      <p className="text-sm text-muted-foreground mb-4">Create your first plant to get started</p>
                      <Button onClick={() => navigate('/admin/plants/create')}>
                        + Create Plant
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                plants.map((plant) => (
                  <TableRow key={plant.id}>
                    <TableCell className="font-medium">{plant.plantId}</TableCell>
                    <TableCell>{plant.plantName}</TableCell>
                    <TableCell className="max-w-xs truncate">{plant.address}</TableCell>
                    <TableCell>{plant.city?.cityName || '-'}</TableCell>
                    <TableCell>{plant.state?.stateName || '-'}</TableCell>
                    <TableCell>{plant.industry?.industryName || '-'}</TableCell>
                    <TableCell>{getStatusBadge(plant.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/plants/${plant.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/plants/${plant.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(plant.id, plant.plantName)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
