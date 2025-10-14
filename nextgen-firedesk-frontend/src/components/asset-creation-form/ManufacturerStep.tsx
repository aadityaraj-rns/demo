import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ManufacturerStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function ManufacturerStep({ formData, setFormData }: ManufacturerStepProps) {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="manufacturerName">Manufacturer Name</Label>
          <Input
            id="manufacturerName"
            placeholder="e.g., ABC Industries"
            value={formData.manufacturerName || ""}
            onChange={(e) => handleChange("manufacturerName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            placeholder="e.g., XYZ-1000"
            value={formData.model || ""}
            onChange={(e) => handleChange("model", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slNo">SL No / Part No</Label>
          <Input
            id="slNo"
            placeholder="e.g., SN12345"
            value={formData.slNo || ""}
            onChange={(e) => handleChange("slNo", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="space-y-2">
          <Label htmlFor="document1">Document 1</Label>
          <Input
            id="document1"
            type="file"
            accept=".svg,.png,.pdf"
            onChange={(e) => {
              // Handle file upload
            }}
          />
          <p className="text-xs text-gray-500">svg, png, pdf (max. 10mb)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="document2">Document 2</Label>
          <Input
            id="document2"
            type="file"
            accept=".svg,.png,.pdf"
            onChange={(e) => {
              // Handle file upload
            }}
          />
          <p className="text-xs text-gray-500">svg, png, pdf (max. 10mb)</p>
        </div>
      </div>
    </div>
  );
}
