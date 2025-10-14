import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssetInfoStepProps {
  formData: any;
  setFormData: (data: any) => void;
  plants: any[];
  categories: any[];
  products: any[];
}

export function AssetInfoStep({ formData, setFormData, plants, categories, products }: AssetInfoStepProps) {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle category change - clear product when category changes
  const handleCategoryChange = (categoryId: string) => {
    setFormData({ 
      ...formData, 
      productCategoryId: categoryId,
      productId: "" // Clear product selection when category changes
    });
  };

  // Filter products by selected category
  const filteredProducts = formData.productCategoryId 
    ? products.filter(prod => {
        // Ensure both IDs are strings and compare
        const prodCatId = String(prod.categoryId || '');
        const selectedCatId = String(formData.productCategoryId || '');
        return prodCatId === selectedCatId;
      })
    : [];

  // Debug logging
  console.log('AssetInfoStep - Category selected:', formData.productCategoryId);
  console.log('AssetInfoStep - All products:', products);
  console.log('AssetInfoStep - Filtered products:', filteredProducts);
  console.log('AssetInfoStep - Category match check:', products.map(p => ({
    name: p.productName,
    categoryId: p.categoryId,
    categoryIdType: typeof p.categoryId,
    selectedCategoryId: formData.productCategoryId,
    selectedCategoryIdType: typeof formData.productCategoryId,
    matches: String(p.categoryId) === String(formData.productCategoryId)
  })));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Organization Name</Label>
          <Input value="Aryan2" disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label>Organization ID</Label>
          <Input value="7BC1A650" disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label>Created Date</Label>
          <Input
            type="date"
            value={new Date().toISOString().split('T')[0]}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>Asset ID</Label>
          <Input value="Auto-generated" disabled className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plantId">Plant *</Label>
          <Select
            value={formData.plantId || ""}
            onValueChange={(value) => handleChange("plantId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Plant" />
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

        <div className="space-y-2">
          <Label htmlFor="building">Building *</Label>
          <Input
            id="building"
            placeholder="e.g., Main Building"
            value={formData.building || ""}
            onChange={(e) => handleChange("building", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productCategoryId">Product Category *</Label>
          <Select
            value={formData.productCategoryId || ""}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category">
                {formData.productCategoryId 
                  ? categories.find(cat => cat.id === formData.productCategoryId)?.categoryName || "Select Category"
                  : "Select Category"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-data" disabled>No categories available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="productId">Product *</Label>
          <Select
            value={formData.productId || ""}
            onValueChange={(value) => handleChange("productId", value)}
            disabled={!formData.productCategoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder={!formData.productCategoryId ? "Select category first" : "Select Product"}>
                {formData.productId 
                  ? filteredProducts.find(prod => prod.id === formData.productId)?.productName || "Select Product"
                  : !formData.productCategoryId ? "Select category first" : "Select Product"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <SelectItem key={prod.id} value={prod.id}>
                    {prod.productName}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-data" disabled>
                  {!formData.productCategoryId ? "Select a category first" : "No products available for this category"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            placeholder="e.g., Horizontal Split Case"
            value={formData.type || ""}
            onChange={(e) => handleChange("type", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subType">Sub Type</Label>
          <Input
            id="subType"
            placeholder="e.g., Electric"
            value={formData.subType || ""}
            onChange={(e) => handleChange("subType", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="e.g., Pump Room-1"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status || "Warranty"}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Warranty">Warranty</SelectItem>
              <SelectItem value="AMC">AMC</SelectItem>
              <SelectItem value="In-House">In-House</SelectItem>
              <SelectItem value="Deactive">Deactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tag">Tag</Label>
          <Input
            id="tag"
            placeholder="e.g., Critical"
            value={formData.tag || ""}
            onChange={(e) => handleChange("tag", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manufacturingDate">Manufacturing Date *</Label>
          <Input
            id="manufacturingDate"
            type="date"
            value={formData.manufacturingDate || ""}
            onChange={(e) => handleChange("manufacturingDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="installDate">Install Date *</Label>
          <Input
            id="installDate"
            type="date"
            value={formData.installDate || ""}
            onChange={(e) => handleChange("installDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="healthStatus">Health Status *</Label>
          <Select
            value={formData.healthStatus || "Healthy"}
            onValueChange={(value) => handleChange("healthStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Health Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Healthy">Healthy</SelectItem>
              <SelectItem value="AttentionRequired">Attention Required</SelectItem>
              <SelectItem value="NotWorking">Not Working</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
