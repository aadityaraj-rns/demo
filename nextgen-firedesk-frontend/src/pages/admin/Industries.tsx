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
import { Pencil, Plus, Trash2, AlertTriangle, ArrowLeft, MessageSquare } from 'lucide-react';

interface Industry {
  id: string;
  industryName: string;
  status: 'Active' | 'Deactive';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

type ViewType = 'list' | 'create' | 'edit';

export default function Industries() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [industryToDelete, setIndustryToDelete] = useState<Industry | null>(null);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [formData, setFormData] = useState({
    industryName: '',
    status: 'Active' as 'Active' | 'Deactive',
  });

  useEffect(() => {
    loadIndustries();
  }, []);

  const loadIndustries = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading industries...');
      
      const response = await api.get('/industry');
      console.log('📡 API Response:', response);
      
      if (response && response.allIndustry) {
        console.log('✅ Industries loaded:', response.allIndustry);
        setIndustries(response.allIndustry);
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        setIndustries([]);
      }
      
    } catch (error: any) {
      console.error('❌ Error loading industries:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Failed to load industries';
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
      setIndustries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🔄 Submitting industry form:', formData);
      
      if (editingIndustry) {
        await api.put('/industry', { 
          id: editingIndustry.id, 
          industryName: formData.industryName, 
          status: formData.status 
        });
        toast({ 
          title: 'Success', 
          description: 'Industry updated successfully' 
        });
      } else {
        await api.post('/industry', { 
          industryName: formData.industryName 
        });
        toast({ 
          title: 'Success', 
          description: 'Industry created successfully' 
        });
      }
      
      setFormData({ industryName: '', status: 'Active' });
      setEditingIndustry(null);
      setCurrentView('list');
      loadIndustries();
      
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
    if (!industryToDelete) return;
    
    try {
      console.log('🗑️ Deleting industry:', industryToDelete.id);
      
      await api.delete(`/industry/${industryToDelete.id}`);
      
      toast({ 
        title: 'Success', 
        description: 'Industry deleted successfully' 
      });
      
      setDeleteDialogOpen(false);
      setIndustryToDelete(null);
      loadIndustries();
      
    } catch (error: any) {
      console.error('❌ Delete error:', error);
      
      // Enhanced error handling for constraint violations
      let errorMessage = error.message || error.response?.data?.message || 'Delete operation failed';
      
      // Check if it's a foreign key constraint error
      if (errorMessage.includes('plants') || errorMessage.includes('industryId') || errorMessage.includes('constraint')) {
        errorMessage = 'Cannot delete industry because it is being used by one or more plants. Please reassign or delete those plants first.';
      }
      
      toast({ 
        title: 'Cannot Delete Industry', 
        description: errorMessage, 
        variant: 'destructive',
        duration: 5000 // Show for longer so user can read
      });
    }
  };

  const openEditView = (industry: Industry) => {
    setEditingIndustry(industry);
    setFormData({ 
      industryName: industry.industryName, 
      status: industry.status 
    });
    setCurrentView('edit');
  };

  const openDeleteDialog = (industry: Industry) => {
    setIndustryToDelete(industry);
    setDeleteDialogOpen(true);
  };

  const openCreateView = () => {
    setEditingIndustry(null);
    setFormData({ industryName: '', status: 'Active' });
    setCurrentView('create');
  };

  const backToList = () => {
    setCurrentView('list');
  };

  if (loading && currentView === 'list') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading industries...</span>
      </div>
    );
  }

  // List View
  if (currentView === 'list') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Industries</h1>
            <p className="text-muted-foreground">
              Manage industries - {industries.length} industry(s) loaded
            </p>
          </div>
          <Button onClick={openCreateView}>
            <Plus className="mr-2 h-4 w-4" />
            Add Industry
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Delete Industry
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-2">
                  <p>
                    This action cannot be undone. This will permanently delete the industry{" "}
                    <strong>{industryToDelete?.industryName}</strong>.
                  </p>
                  <p className="text-yellow-600 font-medium">
                    ⚠️ Note: If this industry is being used by any plants, the deletion will fail. 
                    You'll need to reassign those plants to a different industry first.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Anyway
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Industry Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[130px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {industries.length > 0 ? (
                industries.map((industry) => (
                  <TableRow key={industry.id}>
                    <TableCell className="font-medium">{industry.industryName}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          industry.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {industry.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(industry.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditView(industry)}
                          title="Edit industry"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDeleteDialog(industry)}
                          title="Delete industry"
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
                    No industries found. Create your first industry above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Create/Edit View with Back button
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
          Back to Industries
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
            Industry Info
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
          <div className="space-y-3">
            <Label
              htmlFor="industryName"
              className="text-sm font-medium text-gray-700"
            >
              Industry Name
            </Label>
            <Input
              id="industryName"
              value={formData.industryName}
              onChange={(e) =>
                setFormData({ ...formData, industryName: e.target.value })
              }
              placeholder="Enter industry name"
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
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white min-w-[120px]"
            >
              Save and Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}