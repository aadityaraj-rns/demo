// components/managers/ManagersPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Edit2, Trash2, Plus, ArrowLeft, MessageSquare, Building2, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Plant {
  id: string;
  plantName: string;
  plantId: string;
  industry: {
    industryName: string;
  };
}

interface Manager {
  id: string;
  managerId: string;
  userId: string;
  user: User;
  plants: Plant[];
  createdAt: string;
}

type ViewType = 'list' | 'create' | 'edit';
type WizardStep = 'managerInfo' | 'plantAssignments';

export const ManagersPage: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [currentStep, setCurrentStep] = useState<WizardStep>('managerInfo');
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const [formData, setFormData] = useState({
    userId: '',
    plantIds: [] as string[],
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [managersResponse, usersResponse, plantsResponse] = await Promise.all([
        api.get('/manager'),
        api.get('/admin/users'),
        api.get('/organisation/plant')
      ]);

      setManagers(managersResponse.allManager || []);
      setUsers(usersResponse.users || usersResponse.allUser || []);
      setPlants(plantsResponse.plants || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Unique industry list
  const industries = Array.from(new Set(plants.map(plant => plant.industry?.industryName).filter(Boolean)));

  // Filter managers
  const filteredManagers = managers.filter(manager => {
    const matchesSearch =
      manager.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.managerId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry = selectedIndustry !== 'all'
      ? manager.plants.some(plant => plant.industry?.industryName === selectedIndustry)
      : true;

    return matchesSearch && matchesIndustry;
  });

  const resetForm = () => {
    setFormData({ userId: '', plantIds: [] });
    setEditingManager(null);
    setCurrentStep('managerInfo');
  };

  const handleEdit = (manager: Manager) => {
    setEditingManager(manager);
    setFormData({
      userId: manager.userId,
      plantIds: manager.plants.map(p => p.id)
    });
    setCurrentView('edit');
    setCurrentStep('managerInfo');
  };

  const handleDelete = async (managerId: string) => {
    if (!window.confirm('Are you sure you want to delete this manager?')) return;
    try {
      await api.delete(`/manager/${managerId}`);
      toast({ title: "Success", description: "Manager deleted successfully" });
      loadData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete manager", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId) {
      toast({ title: "Validation", description: "Please select a user for the manager", variant: "destructive" });
      return;
    }

    try {
      if (editingManager) {
        await api.put('/manager', {
          id: editingManager.id,
          plantIds: formData.plantIds
        });
        toast({ title: "Success", description: "Manager updated successfully" });
      } else {
        await api.post('/manager', {
          userId: formData.userId,
          plantIds: formData.plantIds
        });
        toast({ title: "Success", description: "Manager created successfully" });
      }
      resetForm();
      setCurrentView('list');
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save manager",
        variant: "destructive",
      });
    }
  };

  const openCreateView = () => {
    resetForm();
    setCurrentView('create');
  };

  const backToList = () => {
    setCurrentView('list');
  };

  const nextStep = () => {
    if (currentStep === 'managerInfo') {
      setCurrentStep('plantAssignments');
    }
  };

  const prevStep = () => {
    if (currentStep === 'plantAssignments') {
      setCurrentStep('managerInfo');
    }
  };

  const addPlant = (plantId: string) => {
    if (!formData.plantIds.includes(plantId)) {
      setFormData(prev => ({ ...prev, plantIds: [...prev.plantIds, plantId] }));
    }
  };

  const removePlant = (plantId: string) => {
    setFormData(prev => ({ ...prev, plantIds: prev.plantIds.filter(id => id !== plantId) }));
  };

  const availableUsers = users.filter(user =>
    !managers.some(manager => manager.userId === user.id)
  );

  const userOptions = React.useMemo(() => {
    if (editingManager && editingManager.user) {
      const exists = availableUsers.some(u => u.id === editingManager.user.id);
      return exists ? availableUsers : [editingManager.user, ...availableUsers];
    }
    return availableUsers;
  }, [availableUsers, editingManager]);

  if (isLoading && currentView === 'list') {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  // List View
  if (currentView === 'list') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Managers</h1>
            <p className="text-muted-foreground">
              Manage managers - {filteredManagers.length} manager(s) loaded
            </p>
          </div>
          <Button onClick={openCreateView}>
            <Plus className="mr-2 h-4 w-4" />
            Add Manager
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search managers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by Industry" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedIndustry('all'); }}>
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Manager ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Assigned Plants</TableHead>
                <TableHead>Industries</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredManagers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No managers found. Create your first manager.
                  </TableCell>
                </TableRow>
              ) : (
                filteredManagers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell className="font-medium">{manager.managerId}</TableCell>
                    <TableCell>{manager.user.name}</TableCell>
                    <TableCell>{manager.user.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {manager.plants.slice(0, 3).map((plant, i) => (
                          <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">
                            {plant.plantName}
                          </span>
                        ))}
                        {manager.plants.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{manager.plants.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {Array.from(new Set(manager.plants.map(p => p.industry?.industryName).filter(Boolean))).slice(0, 2).map((ind, i) => (
                          <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">
                            {ind}
                          </span>
                        ))}
                        {Array.from(new Set(manager.plants.map(p => p.industry?.industryName).filter(Boolean))).length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{Array.from(new Set(manager.plants.map(p => p.industry?.industryName).filter(Boolean))).length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(manager.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(manager)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(manager.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
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

  // Create/Edit View with Wizard
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
          Back to Managers
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageSquare className="h-4 w-4 mr-2" />
          History & Comments
        </Button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-6"></div>

      {/* Step Navigation */}
      <div className="flex items-center border-b border-gray-200 mb-6">
        <button 
          className={`text-sm font-medium pb-2 mr-8 ${
            currentStep === 'managerInfo' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('managerInfo')}
        >
          Manager Information
        </button>
        <button 
          className={`text-sm font-medium pb-2 ${
            currentStep === 'plantAssignments' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('plantAssignments')}
        >
          Plant Assignments
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Step 1: Manager Information */}
        {currentStep === 'managerInfo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="userId" className="text-sm font-medium text-gray-700">
                  Select User <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) => setFormData({ ...formData, userId: value })}
                  required
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {userOptions.length === 0 && <SelectItem value="">No users available</SelectItem>}
                    {userOptions.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} — {u.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.userId && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">User Details</Label>
                  <div className="p-3 bg-gray-50 rounded border">
                    {(() => {
                      const selectedUser = users.find(u => u.id === formData.userId);
                      return selectedUser ? (
                        <div className="space-y-1">
                          <p className="font-medium">{selectedUser.name}</p>
                          <p className="text-sm text-gray-600">{selectedUser.email}</p>
                          {selectedUser.phone && (
                            <p className="text-sm text-gray-600">{selectedUser.phone}</p>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={backToList}
                className="min-w-[120px]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                className="bg-orange-500 hover:bg-orange-600 text-white min-w-[140px]"
              >
                Save & Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Plant Assignments */}
        {currentStep === 'plantAssignments' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Assign Plants (optional)</h3>
              
              <div className="space-y-4">
                {plants.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                    No plants available
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plants.map((plant) => {
                      const isSelected = formData.plantIds.includes(plant.id);
                      return (
                        <div
                          key={plant.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => isSelected ? removePlant(plant.id) : addPlant(plant.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => isSelected ? removePlant(plant.id) : addPlant(plant.id)}
                                className="mt-1 w-4 h-4"
                              />
                              <div>
                                <p className="font-medium">{plant.plantName}</p>
                                <p className="text-sm text-gray-600">ID: {plant.plantId}</p>
                                <p className="text-sm text-gray-600">{plant.industry?.industryName || '-'}</p>
                              </div>
                            </div>
                            <Building2 className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {formData.plantIds.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Plants ({formData.plantIds.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.plantIds.map(pid => {
                      const plant = plants.find(p => p.id === pid);
                      return (
                        <Badge key={pid} variant="secondary" className="cursor-pointer" onClick={() => removePlant(pid)}>
                          {plant?.plantName ?? pid}
                          <button className="ml-2 hover:text-red-500">×</button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 pt-8 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="min-w-[120px]"
              >
                Previous
              </Button>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={backToList}
                  className="min-w-[120px]"
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white min-w-[140px]"
                >
                  {currentView === 'create' ? 'Create' : 'Update'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};