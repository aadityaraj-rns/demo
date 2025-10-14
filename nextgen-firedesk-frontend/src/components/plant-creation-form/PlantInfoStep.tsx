import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

interface PlantInfoStepProps {
  formData: any;
  setFormData: (data: any) => void;
  masterData?: any;
  onStateChange?: (stateId: string) => void;
}

export function PlantInfoStep({ formData, setFormData, masterData, onStateChange }: PlantInfoStepProps) {
  const { user } = useAuth();

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    
    // If state changed, load cities
    if (field === 'stateId' && onStateChange) {
      onStateChange(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="orgName">Organization Name</Label>
          <Input 
            id="orgName" 
            placeholder="Fire Desk PVT Ltd" 
            value={user?.name || ''}
            disabled
            className="bg-muted"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="orgId">Organization ID</Label>
          <Input 
            id="orgId" 
            placeholder="Auto-generated"
            value={user?.id?.substring(0, 8).toUpperCase() || ''}
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="createdDate">Created Date</Label>
          <Input 
            id="createdDate" 
            type="date" 
            value={new Date().toISOString().split('T')[0]}
            disabled
            className="bg-muted"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plantId">Plant ID</Label>
          <Input 
            id="plantId" 
            placeholder="Auto-generated"
            value="Auto-generated"
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="plantName">Plant Name *</Label>
          <Input 
            id="plantName" 
            placeholder="e.g., Factory A" 
            required
            value={formData.plantName || ''}
            onChange={(e) => handleChange('plantName', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plantManager">Plant Manager</Label>
          <Select
            value={formData.managerId || ''}
            onValueChange={(value) => handleChange('managerId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Manager" />
            </SelectTrigger>
            <SelectContent>
              {masterData?.managers?.map((manager: any) => (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.user?.name || manager.name || manager.managerId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="address1">Address Line 1 *</Label>
          <Input 
            id="address1" 
            placeholder="e.g., 112 Industrial Road" 
            required
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address2">Address Line 2</Label>
          <Input 
            id="address2" 
            placeholder="e.g., Near Metro Station"
            value={formData.address2 || ''}
            onChange={(e) => handleChange('address2', e.target.value)}
          />
        </div>
      </div>

      {/* Row 5 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Select
            value={formData.stateId || ''}
            onValueChange={(value) => handleChange('stateId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {masterData?.states?.map((state: any) => (
                <SelectItem key={state.id} value={state.id}>
                  {state.stateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Select
            value={formData.cityId || ''}
            onValueChange={(value) => handleChange('cityId', value)}
            disabled={!formData.stateId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {masterData?.cities?.map((city: any) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.cityName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code *</Label>
          <Input 
            id="zipCode" 
            placeholder="e.g., 400001" 
            required
            value={formData.zipCode || ''}
            onChange={(e) => handleChange('zipCode', e.target.value)}
          />
        </div>
      </div>

      {/* Row 6 */}
      <div className="space-y-2">
        <Label htmlFor="gstNo">GST No</Label>
        <Input 
          id="gstNo" 
          placeholder="e.g., 27AAPFK1234L1ZV"
          value={formData.gstNo || ''}
          onChange={(e) => handleChange('gstNo', e.target.value)}
        />
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select
          value={formData.industryId || ''}
          onValueChange={(value) => handleChange('industryId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Industry" />
          </SelectTrigger>
          <SelectContent>
            {masterData?.industries?.map((industry: any) => (
              <SelectItem key={industry.id} value={industry.id}>
                {industry.industryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
