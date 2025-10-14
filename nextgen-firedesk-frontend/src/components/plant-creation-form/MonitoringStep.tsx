import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonitoringStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function MonitoringStep({ formData, setFormData }: MonitoringStepProps) {
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* FireDesk Edge Device ID */}
      <div className="space-y-2">
        <Label htmlFor="edgeDeviceId">FireDesk Edge Device ID *</Label>
        <Input 
          id="edgeDeviceId" 
          placeholder="e.g., EDGE-DEV-2024-001"
          value={formData.edgeDeviceId || ''}
          onChange={(e) => handleChange('edgeDeviceId', e.target.value)}
        />
      </div>

      {/* Location Info */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Location Info</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="monitoringBuilding">Building *</Label>
              <Input 
                id="monitoringBuilding" 
                placeholder="e.g., Building 1"
                value={formData.monitoringBuilding || ''}
                onChange={(e) => handleChange('monitoringBuilding', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specificLocation">Specific Location / Area *</Label>
              <Input 
                id="specificLocation" 
                placeholder="e.g., Main Pump Room"
                value={formData.specificLocation || ''}
                onChange={(e) => handleChange('specificLocation', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="installationDate">Installation Date *</Label>
            <Input 
              id="installationDate" 
              type="date" 
              placeholder="dd/mm/yyyy"
              value={formData.installationDate || ''}
              onChange={(e) => handleChange('installationDate', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
