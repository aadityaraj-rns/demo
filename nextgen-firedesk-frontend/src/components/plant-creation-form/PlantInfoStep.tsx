import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

interface PlantInfoStepProps {
  formData: any;
  setFormData: (cb: any) => void;
  masterData?: any;
  onStateChange?: (stateId: string) => void;
}

export function PlantInfoStep({
  formData,
  setFormData,
  masterData,
  onStateChange,
}: PlantInfoStepProps) {
  const { user } = useAuth();

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));

    if (field === "stateId" && onStateChange) {
      onStateChange(value);
    }
  };

  const handleManagerToggle = (managerId: string) => {
    setFormData((prev: any) => {
      const currentManagers = prev.managerIds || [];
      if (currentManagers.includes(managerId)) {
        return {
          ...prev,
          managerIds: currentManagers.filter((id: string) => id !== managerId)
        };
      } else {
        return {
          ...prev,
          managerIds: [...currentManagers, managerId]
        };
      }
    });
  };

  const isManagerSelected = (managerId: string) => {
    return formData.managerIds?.includes(managerId) || false;
  };

  return (
    <div className="space-y-6">
      {/* Organization and Plant Internal Details */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="orgName">Organization Name</Label>
          <Input
            id="orgName"
            placeholder="Fire Desk PVT Ltd"
            value={user?.name || ""}
            disabled
            className="bg-muted"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="orgId">Organization ID</Label>
          <Input
            id="orgId"
            placeholder="Auto-generated"
            value={user?.id?.substring(0, 8).toUpperCase() || ""}
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="createdDate">Created Date</Label>
          <Input
            id="createdDate"
            type="date"
            value={new Date().toISOString().split("T")[0]}
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

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="plantName">Plant Name *</Label>
          <Input
            id="plantName"
            placeholder="e.g., Factory A"
            required
            value={formData.plantName || ""}
            onChange={(e) => handleChange("plantName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plantManager">Plant Manager(s)</Label>
          <Select
            value=""
            onValueChange={(value) => {
              if (value && !formData.managerIds?.includes(value)) {
                handleManagerToggle(value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Managers" />
            </SelectTrigger>
            <SelectContent>
              {masterData?.managers?.map((manager: any) => (
                <SelectItem 
                  key={manager.id} 
                  value={manager.id}
                  disabled={isManagerSelected(manager.id)}
                >
                  {manager.user?.name || manager.name || manager.managerId}
                  {isManagerSelected(manager.id) && " ✓"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Hidden field to ensure managerIds array exists in payload */}
          <input type="hidden" name="managerIds" value={(formData.managerIds || []).join(',')} />
          
          {/* Display selected managers */}
          {formData.managerIds?.length > 0 && (
            <div className="mt-2 space-y-1">
              <Label className="text-sm text-muted-foreground">Selected Managers:</Label>
              <div className="flex flex-wrap gap-1">
                {formData.managerIds.map((managerId: string) => {
                  const manager = masterData?.managers?.find((m: any) => m.id === managerId);
                  return manager ? (
                    <div
                      key={managerId}
                      className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-sm"
                    >
                      <span>{manager.user?.name || manager.name || manager.managerId}</span>
                      <button
                        type="button"
                        onClick={() => handleManagerToggle(managerId)}
                        className="text-primary hover:text-primary/70"
                      >
                        ×
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other form fields... */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="address1">Address Line 1</Label>
          <Input
            id="address1"
            placeholder="e.g., 112 Industrial Road"
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address2">Address Line 2</Label>
          <Input
            id="address2"
            placeholder="e.g., Near Metro Station"
            value={formData.address2 || ""}
            onChange={(e) => handleChange("address2", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select
            value={formData.stateId || ""}
            onValueChange={(value) => handleChange("stateId", value)}
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
          <Label htmlFor="city">City</Label>
          <Select
            value={formData.cityId || ""}
            onValueChange={(value) => handleChange("cityId", value)}
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
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            placeholder="e.g., 400001"
            value={formData.zipCode || ""}
            onChange={(e) => handleChange("zipCode", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gstNo">GST No</Label>
        <Input
          id="gstNo"
          placeholder="e.g., 27AAPFK1234L1ZV"
          value={formData.gstNo || ""}
          onChange={(e) => handleChange("gstNo", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select
          value={formData.industryId || ""}
          onValueChange={(value) => handleChange("industryId", value)}
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

export default PlantInfoStep;