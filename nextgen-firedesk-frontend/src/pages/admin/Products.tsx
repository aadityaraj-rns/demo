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
import { Pencil, Plus, Trash2, ArrowLeft, MessageSquare, Image as ImageIcon } from 'lucide-react';

interface ProductVariant {
  type: string;
  subType?: string[];
  description: string;
  image: string;
}

interface Product {
  id: string;
  productName: string;
  categoryId: string;
  testFrequency: string;
  status: 'Active' | 'Deactive';
  variants: ProductVariant[];
  category?: {
    id: string;
    categoryName: string;
  };
}

interface Category {
  id: string;
  categoryName: string;
}

type ViewType = 'list' | 'create' | 'edit';
type WizardStep = 'productInfo' | 'variants';

const testFrequencyOptions = [
  'One Year',
  'Two Years',
  'Three Years',
  'Five Years',
  'Ten Years'
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [currentStep, setCurrentStep] = useState<WizardStep>('productInfo');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    categoryId: '',
    testFrequency: 'One Year',
    status: 'Active' as 'Active' | 'Deactive',
  });
  const [variants, setVariants] = useState<ProductVariant[]>([{
    type: '',
    subType: [],
    description: '',
    image: ''
  }]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.get('/product'),
        api.get('/category/active')
      ]);

      if (productsResponse && productsResponse.products) {
        setProducts(productsResponse.products);
      }

      if (categoriesResponse && categoriesResponse.activeCategories) {
        setCategories(categoriesResponse.activeCategories);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { type: '', subType: [], description: '', image: '' }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate variants
      if (variants.length === 0) {
        toast({
          title: 'Error',
          description: 'At least one variant is required',
          variant: 'destructive',
        });
        return;
      }

      for (const variant of variants) {
        if (!variant.type || !variant.description) {
          toast({
            title: 'Error',
            description: 'Variant type and description are required',
            variant: 'destructive',
          });
          return;
        }
      }

      if (editingProduct) {
        // For update, include status
        const productData = {
          id: editingProduct.id,
          categoryId: formData.categoryId,
          productName: formData.productName,
          testFrequency: formData.testFrequency,
          status: formData.status,
          productVariants: variants,
        };
        
        await api.put('/product', productData);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        // For create, don't include status (it defaults to Active)
        const productData = {
          categoryId: formData.categoryId,
          productName: formData.productName,
          testFrequency: formData.testFrequency,
          productVariants: variants,
        };
        
        await api.post('/product', productData);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }

      resetForm();
      setCurrentView('list');
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      categoryId: product.categoryId,
      testFrequency: product.testFrequency,
      status: product.status,
    });
    setVariants(product.variants || [{
      type: '',
      subType: [],
      description: '',
      image: ''
    }]);
    setCurrentView('edit');
    setCurrentStep('productInfo');
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await api.delete(`/product/${productToDelete.id}`);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      categoryId: '',
      testFrequency: 'One Year',
      status: 'Active',
    });
    setVariants([{ type: '', subType: [], description: '', image: '' }]);
    setEditingProduct(null);
    setCurrentStep('productInfo');
  };

  const openCreateView = () => {
    resetForm();
    setCurrentView('create');
  };

  const backToList = () => {
    setCurrentView('list');
  };

  const nextStep = () => {
    if (currentStep === 'productInfo') {
      setCurrentStep('variants');
    }
  };

  const prevStep = () => {
    if (currentStep === 'variants') {
      setCurrentStep('productInfo');
    }
  };

  if (loading && currentView === 'list') {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  // List View
  if (currentView === 'list') {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">
              Manage products - {products.length} product(s) loaded
            </p>
          </div>
          <Button onClick={openCreateView}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Test Frequency</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No products found. Create your first product.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell>{product.category?.categoryName || 'N/A'}</TableCell>
                    <TableCell>{product.testFrequency}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.variants?.slice(0, 3).map((v, i) => (
                          <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">
                            {v.type}
                          </span>
                        ))}
                        {product.variants?.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{product.variants.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setProductToDelete(product);
                            setDeleteDialogOpen(true);
                          }}
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

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the product "{productToDelete?.productName}".
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setProductToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
          Back to Products
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
            currentStep === 'productInfo' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('productInfo')}
        >
          Product Information
        </button>
        <button 
          className={`text-sm font-medium pb-2 ${
            currentStep === 'variants' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('variants')}
        >
          Product Variants
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Step 1: Product Information */}
        {currentStep === 'productInfo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="categoryId" className="text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  required
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

              <div className="space-y-3">
                <Label htmlFor="productName" className="text-sm font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="Enter product name"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="testFrequency" className="text-sm font-medium text-gray-700">
                  Test Frequency <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.testFrequency}
                  onValueChange={(value) => setFormData({ ...formData, testFrequency: value })}
                  required
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {testFrequencyOptions.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentView === 'edit' && (
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'Active' | 'Deactive') => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Deactive">Deactive</SelectItem>
                    </SelectContent>
                  </Select>
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

        {/* Step 2: Product Variants */}
        {currentStep === 'variants' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Product Variants <span className="text-red-500">*</span></h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>

            {variants.map((variant, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Variant {index + 1}</h4>
                  {variants.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVariant(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label>Type <span className="text-red-500">*</span></Label>
                    <Input
                      value={variant.type}
                      onChange={(e) => handleVariantChange(index, 'type', e.target.value)}
                      placeholder="e.g., CO2, Water, etc."
                      className="h-10"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Sub Type (comma-separated)</Label>
                    <Input
                      value={variant.subType?.join(', ') || ''}
                      onChange={(e) => handleVariantChange(index, 'subType', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      placeholder="e.g., Portable, Trolley"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label>Description <span className="text-red-500">*</span></Label>
                    <Textarea
                      value={variant.description}
                      onChange={(e) => handleVariantChange(index, 'description', e.target.value)}
                      placeholder="Enter variant description"
                      required
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label>Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={variant.image}
                        onChange={(e) => handleVariantChange(index, 'image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        type="url"
                        className="h-10"
                      />
                      <Button type="button" variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

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
}