import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit2, Trash2, Building2, Filter, Phone, Mail, Wrench, User, ArrowLeft, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface TechnicianUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: {
    id: string;
    name: string;
  };
}

interface Plant {
  id: string;
  plantName: string;
  plantId: string;
}

interface Category {
  id: string;
  categoryName: string;
}

interface Manager {
  id: string;
  user: {
    name: string;
  };
}

interface Role {
  id: string;
  name: string;
}

interface Technician {
  id: string;
  technicianId: string;
  userId: string;
  user: TechnicianUser;
  plant?: Plant;
  manager?: Manager;
  category?: Category;
  experience: string;
  specialization: string;
  technicianType: 'In House' | 'Third Party';
  venderName?: string;
  venderNumber?: string;
  venderEmail?: string;
  venderAddress?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

type ViewType = 'list' | 'create' | 'edit';
type WizardStep = 'basicInfo' | 'assignments' | 'vendorDetails';

export const TechniciansPage: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [currentStep, setCurrentStep] = useState<WizardStep>('basicInfo');
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [selectedManager, setSelectedManager] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plantId: 'none',
    managerId: 'none',
    categoryId: 'none',
    technicianType: 'In House' as 'In House' | 'Third Party',
    experience: '',
    specialization: '',
    venderName: '',
    venderNumber: '',
    venderEmail: '',
    venderAddress: '',
    status: 'Active' as 'Active' | 'Inactive',
    roleId: ''
  });

  // Fetch data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [techniciansResponse, plantsResponse, categoriesResponse, managersResponse, rolesResponse] = await Promise.all([
        api.get('/technician'),
        api.get('/plants'),
        api.get('/category/active'),
        api.get('/manager/active'),
        api.get('/role')
      ]);

      if (techniciansResponse && techniciansResponse.success) {
        setTechnicians(techniciansResponse.technicians);
      }

      setPlants(plantsResponse.plants || []);
      setCategories((categoriesResponse as any).activeCategories || []);
      setManagers(managersResponse.allManager || []);
      setRoles(rolesResponse.roles || []);
      
      console.log('Available roles:', rolesResponse.roles);
      
      // Auto-select Technician role when roles are loaded
      const technicianRole = rolesResponse.roles.find((role: Role) => role.name === 'Technician');
      console.log('Found Technician role:', technicianRole);
      
      if (technicianRole) {
        setFormData(prev => ({ ...prev, roleId: technicianRole.id }));
      } else {
        console.warn('No Technician role found in database. Available roles:', rolesResponse.roles.map((r: Role) => r.name));
        toast({
          title: 'Warning',
          description: 'No "Technician" role found. Please create one in the Roles section.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter technicians
  const filteredTechnicians = technicians.filter(technician => {
    const matchesSearch = 
      technician.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.technicianId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (technician.specialization && technician.specialization.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPlant = selectedPlant !== 'all' ? 
      technician.plant?.id === selectedPlant : true;

    const matchesManager = selectedManager !== 'all' ?
      technician.manager?.id === selectedManager : true;

    const matchesStatus = selectedStatus !== 'all' ?
      technician.status === selectedStatus : true;

    return matchesSearch && matchesPlant && matchesManager && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.roleId) {
        toast({
          title: "Validation Error",
          description: "Role is required. Please ensure a 'Technician' role exists in your system.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Clean up form data - convert 'none' to null for optional fields
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        plantId: (formData.plantId === 'none' || !formData.plantId) ? '' : formData.plantId,
        managerId: (formData.managerId === 'none' || !formData.managerId) ? '' : formData.managerId,
        categoryId: (formData.categoryId === 'none' || !formData.categoryId) ? '' : formData.categoryId,
        technicianType: formData.technicianType,
        experience: formData.experience || '',
        specialization: formData.specialization || '',
        venderName: formData.venderName || '',
        venderNumber: formData.venderNumber || '',
        venderEmail: formData.venderEmail || '',
        venderAddress: formData.venderAddress || '',
        status: formData.status,
        roleId: formData.roleId
      };

      if (editingTechnician) {
        await api.put(`/technician/${editingTechnician.id}`, submitData);
        toast({
          title: "Success",
          description: "Technician updated successfully"
        });
      } else {
        console.log('Submitting technician data:', submitData);
        await api.post('/technician', submitData);
        toast({
          title: "Success",
          description: "Technician created successfully"
        });
      }
      
      resetForm();
      setCurrentView('list');
      loadData();
    } catch (error: any) {
      console.error('Technician creation error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.message || error.response?.data?.message || "Operation failed";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (technician: Technician) => {
    setEditingTechnician(technician);
    setFormData({
      name: technician.user.name,
      email: technician.user.email,
      phone: technician.user.phone,
      plantId: technician.plant?.id || 'none',
      managerId: technician.manager?.id || 'none',
      categoryId: technician.category?.id || 'none',
      technicianType: technician.technicianType,
      experience: technician.experience || '',
      specialization: technician.specialization || '',
      venderName: technician.venderName || '',
      venderNumber: technician.venderNumber || '',
      venderEmail: technician.venderEmail || '',
      venderAddress: technician.venderAddress || '',
      status: technician.status,
      roleId: technician.user.role?.id || ''
    });
    setCurrentView('edit');
    setCurrentStep('basicInfo');
  };

  const handleDelete = async (technicianId: string) => {
    if (!window.confirm('Are you sure you want to delete this technician?')) return;

    try {
      await api.delete(`/technician/${technicianId}`);
      toast({
        title: "Success",
        description: "Technician deleted successfully"
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete technician",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingTechnician(null);
    console.log('All roles:', roles);
    const technicianRole = roles.find(role => role.name === 'Technician');
    console.log('Found technician role in resetForm:', technicianRole);
    
    if (!technicianRole) {
      toast({
        title: 'Error',
        description: 'No "Technician" role found. Please create a role named "Technician" (case-sensitive).',
        variant: 'destructive',
      });
    }
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      plantId: 'none',
      managerId: 'none',
      categoryId: 'none',
      technicianType: 'In House',
      experience: '',
      specialization: '',
      venderName: '',
      venderNumber: '',
      venderEmail: '',
      venderAddress: '',
      status: 'Active',
      roleId: technicianRole?.id || ''
    });
    setCurrentStep('basicInfo');
  };

  const openCreateView = () => {
    resetForm();
    setCurrentView('create');
  };

  const backToList = () => {
    setCurrentView('list');
  };

  const nextStep = () => {
    if (currentStep === 'basicInfo') {
      setCurrentStep('assignments');
    } else if (currentStep === 'assignments') {
      if (formData.technicianType === 'Third Party') {
        setCurrentStep('vendorDetails');
      } else {
        // For In House technicians, submit the form
        const formEvent = new Event('submit', { cancelable: true }) as any;
        formEvent.preventDefault = () => {};
        handleSubmit(formEvent);
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 'vendorDetails') {
      setCurrentStep('assignments');
    } else if (currentStep === 'assignments') {
      setCurrentStep('basicInfo');
    }
  };

  if (isLoading && currentView === 'list') {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  // List View
  if (currentView === 'list') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Technicians</h1>
            <p className="text-muted-foreground">
              Manage technicians - {filteredTechnicians.length} technician(s) loaded
            </p>
          </div>
          <Button onClick={openCreateView}>
            <Plus className="mr-2 h-4 w-4" />
            Add Technician
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search technicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedPlant} onValueChange={setSelectedPlant}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <SelectValue placeholder="Filter by Plant" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plants</SelectItem>
                {plants.map((plant) => (
                  <SelectItem key={plant.id} value={plant.id}>
                    {plant.plantName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedManager} onValueChange={setSelectedManager}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <SelectValue placeholder="Filter by Manager" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Managers</SelectItem>
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.user?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedPlant('all');
                setSelectedManager('all');
                setSelectedStatus('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tech ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Plant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnicians.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No technicians found. Create your first technician.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTechnicians.map((technician) => (
                  <TableRow key={technician.id}>
                    <TableCell className="font-medium">{technician.technicianId}</TableCell>
                    <TableCell>{technician.user.name}</TableCell>
                    <TableCell>{technician.user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          technician.technicianType === 'In House'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {technician.technicianType}
                      </span>
                    </TableCell>
                    <TableCell>{technician.specialization || 'N/A'}</TableCell>
                    <TableCell>
                      {technician.plant ? (
                        <span className="text-xs bg-secondary px-2 py-1 rounded">
                          {technician.plant.plantName}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          technician.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {technician.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(technician)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(technician.id)}
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
          Back to Technicians
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
            currentStep === 'basicInfo' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('basicInfo')}
        >
          Basic Information
        </button>
        <button 
          className={`text-sm font-medium pb-2 mr-8 ${
            currentStep === 'assignments' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('assignments')}
        >
          Assignments
        </button>
        {/* Only show Vendor Details tab when Third Party is selected */}
        {formData.technicianType === 'Third Party' && (
          <button 
            className={`text-sm font-medium pb-2 ${
              currentStep === 'vendorDetails' 
                ? 'text-orange-600 border-b-2 border-orange-500' 
                : 'text-gray-500'
            }`}
            onClick={() => setCurrentStep('vendorDetails')}
          >
            Vendor Details
          </button>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Step 1: Basic Information */}
        {currentStep === 'basicInfo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Contact Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                  Experience
                </Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g., 5 years"
                  className="h-10"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="specialization" className="text-sm font-medium text-gray-700">
                  Specialization
                </Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g., Electrical Systems"
                  className="h-10"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="technicianType" className="text-sm font-medium text-gray-700">
                  Technician Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.technicianType}
                  onValueChange={(value: 'In House' | 'Third Party') => setFormData({ ...formData, technicianType: value })}
                  required
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In House">In House</SelectItem>
                    <SelectItem value="Third Party">Third Party</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'Active' | 'Inactive') => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

        {/* Step 2: Assignments */}
        {currentStep === 'assignments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="plantId" className="text-sm font-medium text-gray-700">
                  Plant
                </Label>
                <Select
                  value={formData.plantId}
                  onValueChange={(value) => setFormData({ ...formData, plantId: value })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select plant (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {plants.map((plant) => (
                      <SelectItem key={plant.id} value={plant.id}>
                        {plant.plantName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="managerId" className="text-sm font-medium text-gray-700">
                  Manager
                </Label>
                <Select
                  value={formData.managerId}
                  onValueChange={(value) => setFormData({ ...formData, managerId: value })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select manager (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.user?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="categoryId" className="text-sm font-medium text-gray-700">
                  Category
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                  type="button"
                  onClick={nextStep}
                  className="bg-orange-500 hover:bg-orange-600 text-white min-w-[140px]"
                >
                  {formData.technicianType === 'Third Party' ? 'Save & Continue' : 'Submit'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Vendor Details (only for Third Party) */}
        {currentStep === 'vendorDetails' && (
          formData.technicianType === 'Third Party' ? (
            <div className="space-y-6">
              <div className="border p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-medium">Vendor Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="venderName" className="text-sm font-medium text-gray-700">
                      Vendor Name
                    </Label>
                    <Input
                      id="venderName"
                      value={formData.venderName}
                      onChange={(e) => setFormData({ ...formData, venderName: e.target.value })}
                      placeholder="Enter vendor name"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="venderNumber" className="text-sm font-medium text-gray-700">
                      Vendor Number
                    </Label>
                    <Input
                      id="venderNumber"
                      value={formData.venderNumber}
                      onChange={(e) => setFormData({ ...formData, venderNumber: e.target.value })}
                      placeholder="Enter vendor number"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="venderEmail" className="text-sm font-medium text-gray-700">
                      Vendor Email
                    </Label>
                    <Input
                      id="venderEmail"
                      type="email"
                      value={formData.venderEmail}
                      onChange={(e) => setFormData({ ...formData, venderEmail: e.target.value })}
                      placeholder="Enter vendor email"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="venderAddress" className="text-sm font-medium text-gray-700">
                      Vendor Address
                    </Label>
                    <Input
                      id="venderAddress"
                      value={formData.venderAddress}
                      onChange={(e) => setFormData({ ...formData, venderAddress: e.target.value })}
                      placeholder="Enter vendor address"
                      className="h-10"
                    />
                  </div>
                </div>
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
          ) : (
            <div className="space-y-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Vendor details are only required for Third Party technicians.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('assignments')}
                >
                  Go Back to Assignments
                </Button>
              </div>
            </div>
          )
        )}
      </form>
    </div>
  );
};