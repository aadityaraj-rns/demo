import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

interface ComplianceStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function ComplianceStep({ formData, setFormData }: ComplianceStepProps) {
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Fire NOC */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Fire NOC</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fireNocNumber">Fire NOC Number *</Label>
            <Input 
              id="fireNocNumber" 
              placeholder="e.g., NOC-DEL-2024-09"
              value={formData.fireNocNumber ?? ''}
              onChange={(e) => handleChange('fireNocNumber', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nocValidityDate">NOC Validity Date *</Label>
            <Input 
              id="nocValidityDate" 
              type="date" 
              placeholder="dd/mm/yyyy"
              value={formData.nocValidityDate ?? ''}
              onChange={(e) => handleChange('nocValidityDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Fire NOC Insurance */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Fire Insurance</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="insurancePolicyNumber">Insurance Policy Number *</Label>
            <Input 
              id="insurancePolicyNumber" 
              placeholder="e.g., INS-XYZ-2024-0089"
              value={formData.insurancePolicyNumber ?? ''}
              onChange={(e) => handleChange('insurancePolicyNumber', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insurerName">Insurer Name *</Label>
            <Input 
              id="insurerName" 
              placeholder="e.g., ICICI Lombard"
              value={formData.insurerName ?? ''}
              onChange={(e) => handleChange('insurerName', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Fire Equipment Count */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Compliance Equipment Count</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="complianceNumExtinguishers">Number of Fire Extinguishers *</Label>
            <Input 
              id="complianceNumExtinguishers" 
              placeholder="e.g., 15" 
              type="number"
              value={formData.complianceNumExtinguishers ?? ''}
              onChange={(e) => handleChange('complianceNumExtinguishers', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complianceNumHydrants">Number of Hydrant Points *</Label>
            <Input 
              id="complianceNumHydrants" 
              placeholder="e.g., 2" 
              type="number"
              value={formData.complianceNumHydrants ?? ''}
              onChange={(e) => handleChange('complianceNumHydrants', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complianceNumSprinklers">Number of Sprinklers *</Label>
            <Input 
              id="complianceNumSprinklers" 
              placeholder="e.g., 15" 
              type="number"
              value={formData.complianceNumSprinklers ?? ''}
              onChange={(e) => handleChange('complianceNumSprinklers', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complianceNumSafeAreas">Number of Safe Assembly Areas *</Label>
            <Input 
              id="complianceNumSafeAreas" 
              placeholder="e.g., 2" 
              type="number"
              value={formData.complianceNumSafeAreas ?? ''}
              onChange={(e) => handleChange('complianceNumSafeAreas', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Upload Document */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            <span className="text-primary font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, PNG, JPG (max. 10mb)
          </p>
        </div>
      </div>
    </div>
  );
}
