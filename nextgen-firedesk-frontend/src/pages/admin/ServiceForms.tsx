import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Pencil, Plus, Trash2, Eye, ArrowLeft, MessageSquare } from 'lucide-react';

interface Form {
  id: string;
  serviceName: string;
  status: 'Active' | 'Deactive';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

type ViewType = 'list' | 'create' | 'edit';

export default function ServiceForms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<Form | null>(null);
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState({ 
    serviceName: '', 
    status: 'Active' as 'Active' | 'Deactive' 
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading service forms...');
      
      const response = await api.get('/form');
      console.log('📡 API Response:', response);
      
      if (response && response.allForm) {
        console.log('✅ Service forms loaded:', response.allForm);
        setForms(response.allForm);
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        setForms([]);
      }
      
    } catch (error: any) {
      console.error('❌ Error loading service forms:', error);
      
      const errorMessage = error.message || error.response?.data?.message || 'Failed to load service forms';
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🔄 Submitting form:', formData);
      
      if (editingForm) {
        await api.put('/form', { 
          id: editingForm.id, 
          serviceName: formData.serviceName, 
          status: formData.status 
        });
        toast({ title: 'Success', description: 'Service form updated successfully' });
      } else {
        await api.post('/form', { serviceName: formData.serviceName });
        toast({ title: 'Success', description: 'Service form created successfully' });
      }
      
      setFormData({ serviceName: '', status: 'Active' });
      setEditingForm(null);
      setCurrentView('list');
      loadForms();
      
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Operation failed';
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    }
  };

  const handleDelete = async () => {
    if (!formToDelete) return;
    
    try {
      console.log('🗑️ Deleting service form:', formToDelete.id);
      
      await api.delete(`/form/${formToDelete.id}`);
      toast({ 
        title: 'Success', 
        description: 'Service form deleted successfully' 
      });
      
      setDeleteDialogOpen(false);
      setFormToDelete(null);
      loadForms();
      
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

  const openEditView = (form: Form) => {
    setEditingForm(form);
    setFormData({ 
      serviceName: form.serviceName, 
      status: form.status 
    });
    setCurrentView('edit');
  };

  const openDeleteDialog = (form: Form) => {
    setFormToDelete(form);
    setDeleteDialogOpen(true);
  };

  const openCreateView = () => {
    setEditingForm(null);
    setFormData({ serviceName: '', status: 'Active' });
    setCurrentView('create');
  };

  const handleViewForm = (form: Form) => {
    navigate(`/admin/service-forms/${form.id}`);
  };

  const backToList = () => {
    setCurrentView('list');
  };

  if (loading && currentView === 'list') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading service forms...</span>
      </div>
    );
  }

  // List View
  if (currentView === 'list') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Service Forms</h1>
            <p className="text-muted-foreground">
              Manage service forms - {forms.length} form(s) loaded
            </p>
          </div>
          <Button onClick={openCreateView}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service Form
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the service form{" "}
                <strong>{formToDelete?.serviceName}</strong> and all its associated categories.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.length > 0 ? (
                forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.serviceName}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          form.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {form.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(form.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewForm(form)}
                          title="View service form"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditView(form)}
                          title="Edit service form"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDeleteDialog(form)}
                          title="Delete service form"
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
                    No service forms found. Create your first service form above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Create/Edit View with the same UI as other components
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
          Back to Service Forms
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
            Service Form Information
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
          <div className="space-y-3">
            <Label
              htmlFor="serviceName"
              className="text-sm font-medium text-gray-700"
            >
              Service Name
            </Label>
            <Input
              id="serviceName"
              value={formData.serviceName}
              onChange={(e) =>
                setFormData({ ...formData, serviceName: e.target.value })
              }
              placeholder="Enter service name"
              className="h-10"
              required
            />
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
        </form>
      </div>
    </div>
  );
}