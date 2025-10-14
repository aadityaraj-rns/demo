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

interface State {
  id: string;
  stateName: string;
  status: 'Active' | 'Deactive';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

type ViewType = 'list' | 'create' | 'edit';

export default function States() {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stateToDelete, setStateToDelete] = useState<State | null>(null);
  const [editingState, setEditingState] = useState<State | null>(null);
  const [formData, setFormData] = useState({ 
    stateName: '', 
    status: 'Active' as 'Active' | 'Deactive' 
  });

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading states...');
      
      const response = await api.get('/state');
      console.log('📡 API Response:', response);
      
      if (response && response.allState) {
        console.log('✅ States loaded:', response.allState);
        setStates(response.allState);
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        setStates([]);
      }
      
    } catch (error: any) {
      console.error('❌ Error loading states:', error);
      
      const errorMessage = error.message || error.response?.data?.message || 'Failed to load states';
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
      setStates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🔄 Submitting form:', formData);
      
      if (editingState) {
        await api.put('/state', { 
          id: editingState.id, 
          stateName: formData.stateName, 
          status: formData.status 
        });
        toast({ title: 'Success', description: 'State updated successfully' });
      } else {
        await api.post('/state', { stateName: formData.stateName });
        toast({ title: 'Success', description: 'State created successfully' });
      }
      
      setFormData({ stateName: '', status: 'Active' });
      setEditingState(null);
      setCurrentView('list');
      loadStates();
      
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
    if (!stateToDelete) return;
    
    try {
      console.log('🗑️ Deleting state:', stateToDelete.id);
      
      await api.delete(`/state/${stateToDelete.id}`);
      toast({ 
        title: 'Success', 
        description: 'State deleted successfully' 
      });
      
      setDeleteDialogOpen(false);
      setStateToDelete(null);
      loadStates(); // Refresh the list
      
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

  const openEditView = (state: State) => {
    setEditingState(state);
    setFormData({ 
      stateName: state.stateName, 
      status: state.status 
    });
    setCurrentView('edit');
  };

  const openDeleteDialog = (state: State) => {
    setStateToDelete(state);
    setDeleteDialogOpen(true);
  };

  const openCreateView = () => {
    setEditingState(null);
    setFormData({ stateName: '', status: 'Active' });
    setCurrentView('create');
  };

  const backToList = () => {
    setCurrentView('list');
  };

  if (loading && currentView === 'list') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading states...</span>
      </div>
    );
  }

  // List View
  if (currentView === 'list') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">States</h1>
            <p className="text-muted-foreground">
              Manage states - {states.length} state(s) loaded
            </p>
          </div>
          <Button onClick={openCreateView}>
            <Plus className="mr-2 h-4 w-4" />
            Add State
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the state{" "}
                <strong>{stateToDelete?.stateName}</strong>.
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
                <TableHead>State Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[130px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {states.length > 0 ? (
                states.map((state) => (
                  <TableRow key={state.id}>
                    <TableCell className="font-medium">{state.stateName}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          state.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {state.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(state.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditView(state)}
                          title="Edit state"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDeleteDialog(state)}
                          title="Delete state"
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
                    No states found. Create your first state above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Create/Edit View with the same UI as Industries
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
          Back to States
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
            State Information
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
          <div className="space-y-3">
            <Label
              htmlFor="stateName"
              className="text-sm font-medium text-gray-700"
            >
              State Name
            </Label>
            <Input
              id="stateName"
              value={formData.stateName}
              onChange={(e) =>
                setFormData({ ...formData, stateName: e.target.value })
              }
              placeholder="Enter state name"
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