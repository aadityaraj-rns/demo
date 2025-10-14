import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface LayoutUploadStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function LayoutUploadStep({ formData, setFormData }: LayoutUploadStepProps) {
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Layout Name */}
      <div className="space-y-2">
        <Label htmlFor="layoutName">Layout Name *</Label>
        <Input 
          id="layoutName" 
          placeholder="e.g., Floor Plan - Ground Level"
          value={formData.layoutName || ''}
          onChange={(e) => handleChange('layoutName', e.target.value)}
        />
      </div>

      {/* Upload Layout */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Upload Layout</h3>
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            <span className="text-primary font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            PDF, PNG, JPG, DWG, DXF (max. 10mb)
          </p>
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleChange('layoutFiles', files);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
