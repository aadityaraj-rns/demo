import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Pencil, Plus, Trash2, ArrowLeft, MessageSquare } from 'lucide-react';

interface City {
  id: string;
  cityName: string;
  stateId: string;
  status: 'Active' | 'Deactive';
  State?: { stateName: string };
}

interface State {
  id: string;
  stateName: string;
}

type ViewType = 'list' | 'create' | 'edit';

export default function Cities() {
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    cityName: '',
    stateId: '',
    status: 'Active' as 'Active' | 'Deactive',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading cities and states...');
      
      // FIXED: Use direct response access like in States component
      const [citiesResponse, statesResponse] = await Promise.all([
        api.get('/city'),
        api.get('/state/active'),
      ]);

      console.log('📡 Cities response:', citiesResponse);
      console.log('📡 States response:', statesResponse);

      // FIXED: Access response directly, not through .data
      const citiesData = citiesResponse.allCity || citiesResponse.data?.allCity || [];
      const statesData = statesResponse.allState || statesResponse.data?.allState || [];

      console.log('✅ Cities loaded:', citiesData);
      console.log('✅ States loaded:', statesData);

      setCities(citiesData);
      setStates(statesData);
    } catch (error: any) {
      console.error('❌ Error loading data:', error);
      toast({ 
        title: 'Error', 
        description: error.message || error.response?.data?.message || 'Failed to load data', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🔄 Submitting city form:', formData);
      
      if (editingCity) {
        await api.put('/city', { 
          id: editingCity.id, 
          cityName: formData.cityName, 
          stateId: formData.stateId, 
          status: formData.status 
        });
        toast({ title: 'Success', description: 'City updated successfully' });
      } else {
        await api.post('/city', { 
          cityName: formData.cityName, 
          stateId: formData.stateId 
        });
        toast({ title: 'Success', description: 'City created successfully' });
      }
      
      setFormData({ cityName: '', stateId: '', status: 'Active' });
      setEditingCity(null);
      setCurrentView('list');
      loadData();
      
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Operation failed';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!cityToDelete) return;
    
    try {
      console.log('🗑️ Deleting city:', cityToDelete.id);
      
      await api.delete(`/city/${cityToDelete.id}`);
      toast({ 
        title: 'Success', 
        description: 'City deleted successfully' 
      });
      
      setDeleteDialogOpen(false);
      setCityToDelete(null);
      loadData();
      
    } catch (error: any) {
      console.error('❌ Delete error:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Delete operation failed';
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    }
  };

  const openEditView = (city: City) => {
    setEditingCity(city);
    setFormData({ 
      cityName: city.cityName, 
      stateId: city.stateId, 
      status: city.status 
    });
    setCurrentView('edit');
  };

  const openDeleteDialog = (city: City) => {
    setCityToDelete(city);
    setDeleteDialogOpen(true);
  };

  const openCreateView = () => {
    setEditingCity(null);
    setFormData({ cityName: '', stateId: '', status: 'Active' });
    setCurrentView('create');
  };

  const backToList = () => {
    setCurrentView('list');
  };

  if (loading && currentView === 'list') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading cities...</span>
      </div>
    );
  }

  // List View
  if (currentView === 'list') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cities</h1>
            <p className="text-muted-foreground">
              Manage cities - {cities.length} city(s) loaded
            </p>
          </div>
          <Button onClick={openCreateView}>
            <Plus className="mr-2 h-4 w-4" />
            Add City
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the city{" "}
                <strong>{cityToDelete?.cityName}</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[130px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.length > 0 ? (
                cities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell className="font-medium">{city.cityName}</TableCell>
                    <TableCell>{city.State?.stateName || 'N/A'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          city.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {city.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditView(city)}
                          title="Edit city"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDeleteDialog(city)}
                          title="Delete city"
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No cities found. Create your first city above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Create/Edit View with the same UI as Industries and States
  return (
    <div className="p-8">
      {/* Header with Back button and History & Comments */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={backToList}
          className="text-sm hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cities
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageSquare className="h-4 w-4 mr-2" />
          History & Comments
        </Button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-6"></div>

      {/* Section Header */}
      <div>
        <div className="flex items-center border-b border-gray-200 mb-6">
          <button className="text-sm font-medium text-orange-600 border-b-2 border-orange-500 pb-2">
            City Information
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
          <div className="space-y-3">
            <Label
              htmlFor="cityName"
              className="text-sm font-medium text-gray-700"
            >
              City Name
            </Label>
            <Input
              id="cityName"
              value={formData.cityName}
              onChange={(e) =>
                setFormData({ ...formData, cityName: e.target.value })
              }
              placeholder="Enter city name"
              className="h-10"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="stateId" className="text-sm font-medium text-gray-700">
              State
            </Label>
            <Select
              value={formData.stateId}
              onValueChange={(value) => setFormData({ ...formData, stateId: value })}
              required
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    {state.stateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Only show status when editing */}
          {currentView === "edit" && (
            <div className="space-y-3">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "Active" | "Deactive") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Deactive">Deactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action Buttons - Pushed to the right */}
          <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white min-w-[140px]"
            >
              Save & Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}