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

interface Category {
  id: string;
  categoryName: string;
  formId: string;
  status: 'Active' | 'Deactive';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  form: {
    id: string;
    serviceName: string;
  };
}

interface Form {
  id: string;
  serviceName: string;
}

type ViewType = 'list' | 'create' | 'edit';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ 
    categoryName: '', 
    formId: '',
    status: 'Active' as 'Active' | 'Deactive' 
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading categories and forms...');
      
      const [categoriesResponse, formsResponse] = await Promise.all([
        api.get('/category'),
        api.get('/form')
      ]);

      console.log('📡 Categories response:', categoriesResponse);
      console.log('📡 Forms response:', formsResponse);

      if (categoriesResponse && categoriesResponse.allCategory) {
        setCategories(categoriesResponse.allCategory);
      } else {
        setCategories([]);
      }

      if (formsResponse && formsResponse.allForm) {
        setForms(formsResponse.allForm);
      } else {
        setForms([]);
      }
      
    } catch (error: any) {
      console.error('❌ Error loading data:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Failed to load data';
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
      setCategories([]);
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🔄 Submitting category form:', formData);
      
      if (editingCategory) {
        await api.put('/category', { 
          id: editingCategory.id, 
          categoryName: formData.categoryName, 
          formId: formData.formId,
          status: formData.status 
        });
        toast({ title: 'Success', description: 'Category updated successfully' });
      } else {
        await api.post('/category', { 
          categoryName: formData.categoryName, 
          formId: formData.formId 
        });
        toast({ title: 'Success', description: 'Category created successfully' });
      }
      
      setFormData({ categoryName: '', formId: '', status: 'Active' });
      setEditingCategory(null);
      setCurrentView('list');
      loadData();
      
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
    if (!categoryToDelete) return;
    
    try {
      console.log('🗑️ Deleting category:', categoryToDelete.id);
      
      await api.delete(`/category/${categoryToDelete.id}`);
      toast({ 
        title: 'Success', 
        description: 'Category deleted successfully' 
      });
      
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
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

  const openEditView = (category: Category) => {
    setEditingCategory(category);
    setFormData({ 
      categoryName: category.categoryName, 
      formId: category.formId,
      status: category.status 
    });
    setCurrentView('edit');
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const openCreateView = () => {
    setEditingCategory(null);
    setFormData({ categoryName: '', formId: '', status: 'Active' });
    setCurrentView('create');
  };

  const backToList = () => {
    setCurrentView('list');
  };

  if (loading && currentView === 'list') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading categories...</span>
      </div>
    );
  }

  // List View
  if (currentView === 'list') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground">
              Manage categories - {categories.length} category(s) loaded
            </p>
          </div>
          <Button onClick={openCreateView}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the category{" "}
                <strong>{categoryToDelete?.categoryName}</strong>.
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
                <TableHead>SL No</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead>Form Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[130px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{category.categoryName}</TableCell>
                    <TableCell>{category.form.serviceName}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          category.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {category.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditView(category)}
                          title="Edit category"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDeleteDialog(category)}
                          title="Delete category"
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
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No categories found. Create your first category above.
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
          Back to Categories
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
            Category Information
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
          <div className="space-y-3">
            <Label
              htmlFor="categoryName"
              className="text-sm font-medium text-gray-700"
            >
              Category Name
            </Label>
            <Input
              id="categoryName"
              value={formData.categoryName}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
              placeholder="Enter category name"
              className="h-10"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="formId" className="text-sm font-medium text-gray-700">
              Service Form
            </Label>
            <Select
              value={formData.formId}
              onValueChange={(value) => setFormData({ ...formData, formId: value })}
              required
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select service form" />
              </SelectTrigger>
              <SelectContent>
                {forms.map((form) => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.serviceName}
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