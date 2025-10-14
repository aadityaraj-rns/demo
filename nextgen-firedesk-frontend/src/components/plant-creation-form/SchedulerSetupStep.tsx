import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SchedulerSetupStepProps {
  formData: any;
  setFormData: (data: any) => void;
  categories?: any[];
}

export function SchedulerSetupStep({ formData, setFormData, categories = [] }: SchedulerSetupStepProps) {
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Category */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.schedulerCategory || ''}
            onValueChange={(value) => handleChange('schedulerCategory', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input 
            id="startDate" 
            type="date" 
            placeholder="dd/mm/yyyy"
            value={formData.schedulerStartDate || ''}
            onChange={(e) => handleChange('schedulerStartDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input 
            id="endDate" 
            type="date" 
            placeholder="dd/mm/yyyy"
            value={formData.schedulerEndDate || ''}
            onChange={(e) => handleChange('schedulerEndDate', e.target.value)}
          />
        </div>
      </div>

      {/* Frequencies */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="inspectionFrequency">Inspection Frequency *</Label>
          <Select
            value={formData.inspectionFrequency || ''}
            onValueChange={(value) => handleChange('inspectionFrequency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="half-yearly">Half-Yearly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="testingFrequency">Testing Frequency *</Label>
          <Select
            value={formData.testingFrequency || ''}
            onValueChange={(value) => handleChange('testingFrequency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="half-yearly">Half-Yearly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="maintenanceFrequency">Maintenance Frequency *</Label>
          <Select
            value={formData.maintenanceFrequency || ''}
            onValueChange={(value) => handleChange('maintenanceFrequency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="half-yearly">Half-Yearly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
