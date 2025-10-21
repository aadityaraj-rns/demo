import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Pencil, Plus, Trash2, Factory } from 'lucide-react';

interface Plant {
  id: string;
  plantName: string;
  address: string;
  cityId: string;
  stateId: string;
  industryId: string;
  status: 'Active' | 'Deactive';
  city?: {
    id: string;
    cityName: string;
    state?: { stateName: string };
  };
  state?: {
    id: string;
    stateName: string;
  };
  industry?: {
    id: string;
    industryName: string;
  };
  manager?: {
    id: string;
    user?: {
      name: string;
      email: string;
    };
  };
}

interface StateType {
  id: string;
  stateName: string;
}

interface City {
  id: string;
  cityName: string;
  stateId: string;
}

interface Industry {
  id: string;
  industryName: string;
}

export default function Plants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [states, setStates] = useState<StateType[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [formData, setFormData] = useState({
    plantName: '',
    address: '',
    stateId: '',
    cityId: '',
    industryId: '',
    status: 'Active' as 'Active' | 'Deactive',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.stateId) {
      const filtered = cities.filter((city) => city.stateId === formData.stateId);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [formData.stateId, cities]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [plantsRes, statesRes, citiesRes, industriesRes] = await Promise.all([
        api.get('/plant').catch((err: any) => ({ __error: err })),
        api.get('/state/active').catch((err: any) => ({ __error: err })),
        api.get('/city/active').catch((err: any) => ({ __error: err })),
        api.get('/industry/active').catch((err: any) => ({ __error: err })),
      ]);

      const normalize = (res: any) => {
        if (!res) return undefined;
        if (res.__error) return { __error: res.__error };
        if (res.data !== undefined) return res.data;
        return res;
      };

      const plantsData = normalize(plantsRes);
      const statesData = normalize(statesRes);
      const citiesData = normalize(citiesRes);
      const industriesData = normalize(industriesRes);

      const plantsArray =
        plantsData?.plants ?? plantsData?.data ?? (Array.isArray(plantsData) ? plantsData : []);
      const statesArray =
        statesData?.allState ?? statesData?.states ?? statesData?.data ?? (Array.isArray(statesData) ? statesData : []);
      const citiesArray =
        citiesData?.allCity ?? citiesData?.cities ?? citiesData?.data ?? (Array.isArray(citiesData) ? citiesData : []);
      const industriesArray =
        industriesData?.allIndustry ?? industriesData?.industries ?? industriesData?.data ?? (Array.isArray(industriesData) ? industriesData : []);

      setPlants(Array.isArray(plantsArray) ? plantsArray : []);
      setStates(Array.isArray(statesArray) ? statesArray : []);
      setCities(Array.isArray(citiesArray) ? citiesArray : []);
      setIndustries(Array.isArray(industriesArray) ? industriesArray : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error?.message || 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        plantName: formData.plantName,
        address: formData.address,
        cityId: formData.cityId,
        stateId: formData.stateId,
        industryId: formData.industryId,
        status: formData.status,
      };

      if (editingPlant) {
        await api.put(`/plant/${editingPlant.id}`, {
          ...payload,
        });
        toast({ title: 'Success', description: 'Plant updated successfully' });
      } else {
        await api.post('/plant', payload);
        toast({ title: 'Success', description: 'Plant created successfully' });
      }

      setDialogOpen(false);
      resetForm();
      await loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Operation failed',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (plantId: string) => {
    if (!confirm('Are you sure you want to delete this plant?')) return;

    try {
      await api.delete(`/plant/${plantId}`);
      toast({ title: 'Success', description: 'Plant deleted successfully' });
      await loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to delete plant',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      plantName: '',
      address: '',
      stateId: '',
      cityId: '',
      industryId: '',
      status: 'Active',
    });
    setEditingPlant(null);
  };

  const openEditDialog = (plant: Plant) => {
    setEditingPlant(plant);
    setFormData({
      plantName: plant.plantName || '',
      address: plant.address || '',
      stateId: plant.stateId || '',
      cityId: plant.cityId || '',
      industryId: plant.industryId || '',
      status: (plant.status as 'Active' | 'Deactive') || 'Active',
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plants</h1>
          <p className="text-muted-foreground">Manage plants in your system</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Plant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] overflow-hidden p-0">
            <div className="relative bg-white rounded-xl shadow-2xl border-0">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Factory className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold">
                      {editingPlant ? 'Edit Plant' : 'Add New Plant'}
                    </DialogTitle>
                    <DialogDescription className="text-orange-100">
                      {editingPlant ? 'Update plant details' : 'Create a new plant'}
                    </DialogDescription>
                  </div>
                </div>
              </div>
              
              {/* Form content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="plantName" className="text-sm font-semibold text-gray-700">Plant Name *</Label>
                    <Input
                      id="plantName"
                      value={formData.plantName}
                      onChange={(e) => setFormData({ ...formData, plantName: e.target.value })}
                      required
                      className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-semibold text-gray-700">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'Active' | 'Deactive') => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Deactive">Deactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="min-h-[100px] border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="stateId" className="text-sm font-semibold text-gray-700">State *</Label>
                    <Select
                      value={formData.stateId}
                      onValueChange={(value) => setFormData({ ...formData, stateId: value, cityId: '' })}
                      required
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg transition-all">
                        <SelectValue placeholder={states.length === 0 ? 'Loading states...' : 'Select state'} />
                      </SelectTrigger>
                      <SelectContent>
                        {states.length === 0 ? (
                          <SelectItem value="loading" disabled>
                            Loading states...
                          </SelectItem>
                        ) : (
                          states.map((state) => (
                            <SelectItem key={state.id} value={state.id}>
                              {state.stateName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cityId" className="text-sm font-semibold text-gray-700">City *</Label>
                    <Select
                      value={formData.cityId}
                      onValueChange={(value) => setFormData({ ...formData, cityId: value })}
                      disabled={!formData.stateId || filteredCities.length === 0}
                      required
                    >
                      <SelectTrigger className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg transition-all">
                        <SelectValue
                          placeholder={!formData.stateId ? 'Select state first' : filteredCities.length === 0 ? 'No cities available' : 'Select city'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.cityName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industryId" className="text-sm font-semibold text-gray-700">Industry *</Label>
                  <Select
                    value={formData.industryId}
                    onValueChange={(value) => setFormData({ ...formData, industryId: value })}
                    required
                  >
                    <SelectTrigger className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg transition-all">
                      <SelectValue placeholder={industries.length === 0 ? 'Loading industries...' : 'Select industry'} />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.length === 0 ? (
                        <SelectItem value="loading" disabled>
                          Loading industries...
                        </SelectItem>
                      ) : (
                        industries.map((industry) => (
                          <SelectItem key={industry.id} value={industry.id}>
                            {(industry.industryName || '').trim()}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                    className="h-12 px-6 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="h-12 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-md transition-all"
                    disabled={!formData.stateId || !formData.cityId || !formData.industryId}
                  >
                    {editingPlant ? 'Update Plant' : 'Create Plant'}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-orange-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-700">Plant Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Address</TableHead>
              <TableHead className="font-semibold text-gray-700">City</TableHead>
              <TableHead className="font-semibold text-gray-700">State</TableHead>
              <TableHead className="font-semibold text-gray-700">Industry</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <Factory className="h-12 w-12 text-gray-300" />
                    <p className="text-lg font-medium">No plants found</p>
                    <p className="text-sm">Create your first plant above</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              plants.map((plant) => (
                <TableRow key={plant.id} className="hover:bg-orange-50">
                  <TableCell className="font-medium">{plant.plantName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{plant.address}</TableCell>
                  <TableCell>{plant.city?.cityName || 'N/A'}</TableCell>
                  <TableCell>{plant.state?.stateName || 'N/A'}</TableCell>
                  <TableCell>{(plant.industry?.industryName || '').trim() || 'N/A'}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        plant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {plant.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditDialog(plant)}
                        className="h-9 w-9 p-0 rounded-lg hover:bg-orange-50 hover:text-orange-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(plant.id)}
                        className="h-9 w-9 p-0 rounded-lg hover:bg-red-50 hover:text-red-600"
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
  );
}