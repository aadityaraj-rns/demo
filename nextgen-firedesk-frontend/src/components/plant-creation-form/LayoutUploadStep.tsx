import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LayoutUploadStepProps {
  formData: any;
  setFormData: (data: any) => void;
  masterData?: any;
}

export function LayoutUploadStep({
  formData,
  setFormData,
  masterData,
}: LayoutUploadStepProps) {
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Select plant, then building, then floor, then wing
  const selectedPlant = masterData?.plants?.find(
    (p: any) => p.id === formData.plantId
  );
  const selectedBuilding = selectedPlant?.buildings?.find(
    (b: any) => b.id === formData.buildingId
  );
  const selectedFloor = selectedBuilding?.floors?.find(
    (f: any) => f.id === formData.floorId
  );

  return (
    <div className="space-y-6">
      {/* Layout Name */}
      <div className="space-y-2">
        <Label htmlFor="layoutName">Layout Name</Label>
        <Input
          id="layoutName"
          placeholder="e.g., Floor Plan - Ground Level"
          value={formData.layoutName || ""}
          onChange={(e) => handleChange("layoutName", e.target.value)}
        />
      </div>

      {/* Location Selector (Plant > Building > Floor > Wing) */}
      <div className="space-y-2">
        <Label htmlFor="locationSelector">Location Selector</Label>
        <div className="grid grid-cols-4 gap-4">
          {/* Plant Dropdown */}
          <Select
            value={formData.plantId || ""}
            onValueChange={(value) => {
              handleChange("plantId", value);
              handleChange("buildingId", "");
              handleChange("floorId", "");
              handleChange("wingId", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Plant" />
            </SelectTrigger>
            <SelectContent>
              {(masterData?.plants || []).map((p: any) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Building Dropdown */}
          <Select
            value={formData.buildingId || ""}
            disabled={!formData.plantId}
            onValueChange={(value) => {
              handleChange("buildingId", value);
              handleChange("floorId", "");
              handleChange("wingId", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Building" />
            </SelectTrigger>
            <SelectContent>
              {(selectedPlant?.buildings || []).map((b: any) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Floor Dropdown */}
          <Select
            value={formData.floorId || ""}
            disabled={!formData.buildingId}
            onValueChange={(value) => {
              handleChange("floorId", value);
              handleChange("wingId", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Floor" />
            </SelectTrigger>
            <SelectContent>
              {(selectedBuilding?.floors || []).map((f: any) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Wing Dropdown */}
          <Select
            value={formData.wingId || ""}
            disabled={!formData.floorId}
            onValueChange={(value) => handleChange("wingId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Wing" />
            </SelectTrigger>
            <SelectContent>
              {(selectedFloor?.wings || []).map((w: any) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upload Layout */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Upload Layout</h3>
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            <span className="text-primary font-medium">Click to upload</span> or
            drag and drop
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
                handleChange("layoutFiles", files);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LayoutUploadStep;