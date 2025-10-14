import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, Shield, ArrowLeft, MessageSquare } from 'lucide-react';
import { api } from '@/lib/api'; // Use your existing api
import { toast } from '@/hooks/use-toast';

interface Permissions {
  manageUsers: boolean;
  manageRoles: boolean;
  managePlants: boolean;
  manageManagers: boolean;
  manageTechnicians: boolean;
  viewDashboard: boolean;
  viewPlants: boolean;
  assignTechnicians: boolean;
  viewReports: boolean;
  viewAssignedJobs: boolean;
  updateTaskStatus: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permissions;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

type ViewType = 'list' | 'create' | 'edit';
type WizardStep = 'basicInfo' | 'permissions';

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [currentStep, setCurrentStep] = useState<WizardStep>('basicInfo');
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    permissions: Permissions;
  }>({
    name: '',
    description: '',
    permissions: {
      manageUsers: false,
      manageRoles: false,
      managePlants: false,
      manageManagers: false,
      manageTechnicians: false,
      viewDashboard: false,
      viewPlants: false,
      assignTechnicians: false,
      viewReports: false,
      viewAssignedJobs: false,
      updateTaskStatus: false,
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/role');
      setRoles(response.roles);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await api.put('/role', { ...formData, id: editingRole.id });
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
      } else {
        await api.post('/role', formData);
        toast({
          title: "Success",
          description: "Role created successfully",
        });
      }
      resetForm();
      setCurrentView('list');
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save role",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setCurrentView('edit');
    setCurrentStep('basicInfo');
  };

  const handleDelete = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await api.delete(`/role/${roleId}`);
        toast({
          title: "Success",
          description: "Role deleted successfully",
        });
        loadData();
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete role",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: {
        manageUsers: false,
        manageRoles: false,
        managePlants: false,
        manageManagers: false,
        manageTechnicians: false,
        viewDashboard: false,
        viewPlants: false,
        assignTechnicians: false,
        viewReports: false,
        viewAssignedJobs: false,
        updateTaskStatus: false,
      }
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
      setCurrentStep('permissions');
    }
  };

  const prevStep = () => {
    if (currentStep === 'permissions') {
      setCurrentStep('basicInfo');
    }
  };

  const permissionLabels = {
    manageUsers: 'Manage Users',
    manageRoles: 'Manage Roles',
    managePlants: 'Manage Plants',
    manageManagers: 'Manage Managers',
    manageTechnicians: 'Manage Technicians',
    viewDashboard: 'View Dashboard',
    viewPlants: 'View Plants',
    assignTechnicians: 'Assign Technicians',
    viewReports: 'View Reports',
    viewAssignedJobs: 'View Assigned Jobs',
    updateTaskStatus: 'Update Task Status',
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
            <h1 className="text-3xl font-bold">Roles</h1>
            <p className="text-muted-foreground">
              Manage roles - {roles.length} role(s) loaded
            </p>
          </div>
          <Button onClick={openCreateView}>
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No roles found. Create your first role.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          role.isDefault
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {role.isDefault ? 'Default' : 'Custom'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {Object.entries(role.permissions)
                          .filter(([_, allowed]) => allowed)
                          .slice(0, 3)
                          .map(([permission]) => (
                            <span key={permission} className="text-xs bg-secondary px-2 py-1 rounded">
                              {permissionLabels[permission as keyof typeof permissionLabels]}
                            </span>
                          ))}
                        {Object.values(role.permissions).filter(Boolean).length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{Object.values(role.permissions).filter(Boolean).length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(role)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {!role.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(role.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
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
          Back to Roles
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
          className={`text-sm font-medium pb-2 ${
            currentStep === 'permissions' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('permissions')}
        >
          Permissions
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Step 1: Basic Information */}
        {currentStep === 'basicInfo' && (
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Role Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter role name"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role's purpose and scope"
                  rows={3}
                />
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

        {/* Step 2: Permissions */}
        {currentStep === 'permissions' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-gray-50">
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors">
                    <Switch
                      id={key}
                      checked={formData.permissions[key as keyof Permissions]}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          permissions: {
                            ...prev.permissions,
                            [key]: checked
                          }
                        }))
                      }
                      className="data-[state=checked]:bg-orange-500"
                    />
                    <Label htmlFor={key} className="text-sm font-medium text-gray-700">
                      {label}
                    </Label>
                  </div>
                ))}
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
        )}
      </form>
    </div>
  );
};