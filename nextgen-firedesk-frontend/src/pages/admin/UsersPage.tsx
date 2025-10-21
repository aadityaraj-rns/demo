// UsersPage.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Users, UserCheck, Building2, Search, X, Wrench, Mail, Phone, ArrowLeft, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: any;
}

interface Plant {
  id: string;
  plantName: string;
  plantId: string;
  industry: {
    industryName: string;
  };
}

interface Category {
  id: string;
  categoryName: string;
  description: string;
}

interface Manager {
  id: string;
  managerId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: string;
  status: string;
  roleId: string;
  role: Role;
  createdAt: string;
}

type ViewType = 'list' | 'create' | 'edit';
type WizardStep = 'basicInfo' | 'roleSelection' | 'roleSpecific';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [currentStep, setCurrentStep] = useState<WizardStep>('basicInfo');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchPlant, setSearchPlant] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    roleId: '',
    plantId: '',
    managerId: '',
    categoryId: '',
    technicianType: 'In House' as 'In House' | 'Third Party',
    experience: '',
    specialization: '',
    venderName: '',
    venderNumber: '',
    venderEmail: '',
    venderAddress: '',
  });

  const selectedRole = roles.find(role => role.id === formData.roleId);
  const isManager = selectedRole?.name === 'Manager';
  const isTechnician = selectedRole?.name === 'Technician';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [usersResponse, rolesResponse] = await Promise.all([
        api.get('/admin/users'),
        api.get('/role')
      ]);
      console.log('Users response:', usersResponse); // Debug log
      console.log('Roles response:', rolesResponse); // Debug log
      setUsers(usersResponse.users || []);
      setRoles(rolesResponse.roles || []);
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

  const fetchPlants = async () => {
    try {
      const response = await api.get('/organisation/plant');
      console.log('Plants response:', response); // Debug log
      setPlants(response.plants || []);
    } catch (error: any) {
      console.error('Failed to fetch plants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch plants",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/category/active');
      console.log('Categories response:', response); // Debug log
      // FIX: Use allCategory instead of categories
      setCategories(response.allCategory || []);
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await api.get('/manager/active');
      console.log('Managers response:', response); // Debug log
      // FIX: Use allManager instead of managers
      setManagers(response.allManager || []);
    } catch (error: any) {
      console.error('Failed to fetch managers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch managers",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Form data:', formData);
      console.log('Selected role:', selectedRole);
      console.log('Is technician:', isTechnician);
      console.log('Role ID being sent:', formData.roleId);

      if (editingUser) {
        // Update user role only
        await api.put('/admin/users/role', {
          userId: editingUser.id,
          roleId: formData.roleId
        });
        toast({
          title: "Success",
          description: "User role updated successfully",
        });
      } else {
        if (isTechnician) {
          // Create technician using technician endpoint
          const technicianData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            plantId: formData.plantId,
            managerId: formData.managerId,
            categoryId: formData.categoryId,
            technicianType: formData.technicianType,
            experience: formData.experience,
            specialization: formData.specialization,
            venderName: formData.venderName,
            venderNumber: formData.venderNumber,
            venderEmail: formData.venderEmail,
            venderAddress: formData.venderAddress,
            roleId: formData.roleId, // CRITICAL FIX: Add roleId here
          };
          console.log('Creating technician with role:', formData.roleId);
          console.log('Technician data:', technicianData);
          await api.post('/technician', technicianData);
        } else if (isManager) {
          // Create manager using user endpoint with plantIds
          const userData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            roleId: formData.roleId,
            plantIds: [formData.plantId]
          };
          console.log('Creating manager:', userData);
          await api.post('/admin/users', userData);
        } else {
          // Create regular user
          const userData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            roleId: formData.roleId,
          };
          console.log('Creating user:', userData);
          await api.post('/admin/users', userData);
        }
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }
      resetForm();
      setCurrentView('list');
      loadData();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to save user",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: '',
      roleId: user.roleId || '',
      plantId: '',
      managerId: '',
      categoryId: '',
      technicianType: 'In House',
      experience: '',
      specialization: '',
      venderName: '',
      venderNumber: '',
      venderEmail: '',
      venderAddress: '',
    });
    setCurrentView('edit');
    setCurrentStep('basicInfo');
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      roleId: '',
      plantId: '',
      managerId: '',
      categoryId: '',
      technicianType: 'In House',
      experience: '',
      specialization: '',
      venderName: '',
      venderNumber: '',
      venderEmail: '',
      venderAddress: '',
    });
    setSearchPlant('');
    setCurrentStep('basicInfo');
  };

  const openCreateView = () => {
    resetForm();
    setCurrentView('create');
  };

  const backToList = () => {
    setCurrentView('list');
  };

  const nextStep = async () => {
    if (currentStep === 'basicInfo') {
      setCurrentStep('roleSelection');
    } else if (currentStep === 'roleSelection') {
      // Fetch data when manager or technician role is selected
      const selectedRole = roles.find(r => r.id === formData.roleId);
      if (selectedRole?.name === 'Manager') {
        await fetchPlants();
      } else if (selectedRole?.name === 'Technician') {
        await Promise.all([fetchPlants(), fetchCategories(), fetchManagers()]);
      }
      setCurrentStep('roleSpecific');
    }
  };

  const prevStep = () => {
    if (currentStep === 'roleSpecific') {
      setCurrentStep('roleSelection');
    } else if (currentStep === 'roleSelection') {
      setCurrentStep('basicInfo');
    }
  };

  const getRoleColor = (roleName: string) => {
    const colors = {
      Admin: 'bg-red-100 text-red-700 border-red-300',
      Manager: 'bg-blue-100 text-blue-700 border-blue-300',
      Technician: 'bg-green-100 text-green-700 border-green-300',
    };
    return colors[roleName as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-300';
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
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground">
              Manage users - {users.length} user(s) loaded
            </p>
          </div>
          <Button onClick={openCreateView}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found. Create your first user.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.userType}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p>{user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.phone || 'No phone'}</p>
                    </TableCell>
                    <TableCell>
                      {user.role ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.role.name === 'Admin'
                              ? 'bg-red-100 text-red-800'
                              : user.role.name === 'Manager'
                              ? 'bg-blue-100 text-blue-800'
                              : user.role.name === 'Technician'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.role.name}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          No Role
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.status || 'active'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit2 className="h-4 w-4" />
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
          Back to Users
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
            currentStep === 'roleSelection' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('roleSelection')}
        >
          Role Selection
        </button>
        <button 
          className={`text-sm font-medium pb-2 ${
            currentStep === 'roleSpecific' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('roleSpecific')}
        >
          Role Details
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Step 1: Basic Information */}
        {currentStep === 'basicInfo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
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
                  Phone <span className="text-red-500">*</span>
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

              {!editingUser && (
                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    className="h-10"
                    required
                    minLength={6}
                  />
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

        {/* Step 2: Role Selection */}
        {currentStep === 'roleSelection' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.roleId}
                onValueChange={(value) => setFormData({ ...formData, roleId: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  Save & Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Role Specific Fields */}
        {currentStep === 'roleSpecific' && (
          <div className="space-y-6">
            {editingUser ? (
              // Edit mode - only show role selection
              <div className="space-y-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    You are editing the user's role. Only the role can be changed for existing users.
                  </p>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Current Role</Label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="font-medium">{editingUser.role?.name || 'No Role'}</span>
                    </div>
                  </div>
                  <div className="space-y-3 mt-4">
                    <Label className="text-sm font-medium text-gray-700">New Role</Label>
                    <Select
                      value={formData.roleId}
                      onValueChange={(value) => setFormData({ ...formData, roleId: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : isManager ? (
              // Manager Specific Fields
              <div className="space-y-6 p-5 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-orange-800">Manager Assignment</h3>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-orange-700">Assign Plant <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.plantId}
                    onValueChange={(value) => setFormData({ ...formData, plantId: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select plant" />
                    </SelectTrigger>
                    <SelectContent>
                      {plants.map((plant) => (
                        <SelectItem key={plant.id} value={plant.id}>
                          {plant.plantName} - {plant.industry?.industryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : isTechnician ? (
              // Technician Specific Fields
              <div className="space-y-6 p-5 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Wrench className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-green-800">Technician Assignment</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-green-700">Plant <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.plantId}
                      onValueChange={(value) => setFormData({ ...formData, plantId: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select plant" />
                      </SelectTrigger>
                      <SelectContent>
                        {plants.map((plant) => (
                          <SelectItem key={plant.id} value={plant.id}>
                            {plant.plantName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-green-700">Manager <span className="text-red-500">*</span></Label>
                    <Select
                      value={formData.managerId}
                      onValueChange={(value) => setFormData({ ...formData, managerId: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.user?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-green-700">Category <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-green-700">Experience</Label>
                    <Input
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="e.g., 5 years"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-green-700">Specialization</Label>
                    <Input
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="e.g., Electrical Systems"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-green-700">Technician Type <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.technicianType}
                    onValueChange={(value: 'In House' | 'Third Party') => setFormData({ ...formData, technicianType: value })}
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

                {formData.technicianType === 'Third Party' && (
                  <div className="space-y-6 p-5 border border-green-200 rounded-lg bg-green-25">
                    <h4 className="font-medium text-green-800">Vendor Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-green-700">Vendor Name <span className="text-red-500">*</span></Label>
                        <Input
                          value={formData.venderName}
                          onChange={(e) => setFormData({ ...formData, venderName: e.target.value })}
                          placeholder="Vendor company name"
                          required
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-green-700">Vendor Number <span className="text-red-500">*</span></Label>
                        <Input
                          value={formData.venderNumber}
                          onChange={(e) => setFormData({ ...formData, venderNumber: e.target.value })}
                          placeholder="Vendor contact number"
                          required
                          className="h-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-green-700">Vendor Email <span className="text-red-500">*</span></Label>
                      <Input
                        type="email"
                        value={formData.venderEmail}
                        onChange={(e) => setFormData({ ...formData, venderEmail: e.target.value })}
                        placeholder="Vendor email address"
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-green-700">Vendor Address <span className="text-red-500">*</span></Label>
                      <Input
                        value={formData.venderAddress}
                        onChange={(e) => setFormData({ ...formData, venderAddress: e.target.value })}
                        placeholder="Vendor physical address"
                        required
                        className="h-10"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Regular User or Admin - No additional fields needed
              <div className="space-y-6">
                <div className="text-center py-12">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 inline-block mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedRole?.name || 'User'} Account
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {selectedRole?.name === 'Admin' 
                      ? 'Admin users have full system access. No additional configuration is needed.'
                      : 'Basic user account created successfully. No additional configuration is needed.'
                    }
                  </p>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Selected Role:</strong> {selectedRole?.name || 'None'}
                    </p>
                    {selectedRole?.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Description:</strong> {selectedRole.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

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