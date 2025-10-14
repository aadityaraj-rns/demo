import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PremisesStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function PremisesStep({ formData, setFormData }: PremisesStepProps) {
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Number of Buildings */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Number of Buildings</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="mainBuildings">Main</Label>
            <Input 
              id="mainBuildings" 
              placeholder="e.g., 2" 
              type="number"
              value={formData.mainBuildings ?? ''}
              onChange={(e) => handleChange('mainBuildings', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subBuildings">Sub</Label>
            <Input 
              id="subBuildings" 
              placeholder="e.g., 1" 
              type="number"
              value={formData.subBuildings ?? ''}
              onChange={(e) => handleChange('subBuildings', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Building Details */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Building Details</h3>
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Building
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="buildingName">Building Name *</Label>
              <Input id="buildingName" placeholder="e.g., Factory Block A" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numFloors">Number of Floors *</Label>
              <Input id="numFloors" placeholder="e.g., 4" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floorName">Floor Name *</Label>
              <Input id="floorName" placeholder="e.g., Ground Floor" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="floorUsage">Floor Usage *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="floorArea">Floor Area (Sq.Mtrs) *</Label>
              <Input id="floorArea" placeholder="e.g., 1200" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buildingHeight">Building Height (Mtrs) *</Label>
              <Input id="buildingHeight" placeholder="e.g., 15" type="number" />
            </div>
          </div>

          {/* Building table row */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-muted rounded-md text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Building</p>
              <p className="font-medium">Factory Block A</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Floors</p>
              <p className="font-medium">4</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Floor Name</p>
              <p className="font-medium">Ground Floor</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Usage</p>
              <p className="font-medium">Production</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Area</p>
              <p className="font-medium">1200 Sq.Mtrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Area */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Total Area</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="totalPlantArea">Total Plant Area (Sq.Mtrs) *</Label>
            <div className="flex gap-2">
              <Input 
                id="totalPlantArea" 
                placeholder="e.g., 15" 
                type="number" 
                className="flex-1"
                value={formData.totalPlantArea ?? ''}
                onChange={(e) => handleChange('totalPlantArea', e.target.value)}
              />
              <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                Sq.Mtrs
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalBuildUpArea">Total Build-Up Area (Sq.Mtrs) *</Label>
            <div className="flex gap-2">
              <Input 
                id="totalBuildUpArea" 
                placeholder="e.g., 15" 
                type="number" 
                className="flex-1"
                value={formData.totalBuildUpArea ?? ''}
                onChange={(e) => handleChange('totalBuildUpArea', e.target.value)}
              />
              <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                Sq.Mtrs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entrance Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Entrance Details (Repeatable block)</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="entranceName">Entrance Name *</Label>
            <Input id="entranceName" placeholder="e.g., East Gate" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="entranceWidth">Width (Mtrs) *</Label>
            <div className="flex gap-2">
              <Input id="entranceWidth" placeholder="e.g., 6" type="number" className="flex-1" />
              <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                Mtrs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diesel Generator */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Diesel Generator</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dgAvailable">Diesel Generator Available *</Label>
            <Select
              value={formData.dgAvailable || ''}
              onValueChange={(value) => handleChange('dgAvailable', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dgQuantity">Quantity *</Label>
            <Input 
              id="dgQuantity" 
              placeholder="e.g., 2" 
              type="number"
              value={formData.dgQuantity || ''}
              onChange={(e) => handleChange('dgQuantity', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Staircase Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Staircase Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="staircaseAvailable">Is Staircase Available *</Label>
              <Select
                value={formData.staircaseAvailable || ''}
                onValueChange={(value) => handleChange('staircaseAvailable', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staircaseQuantity">Quantity *</Label>
              <Input 
                id="staircaseQuantity" 
                placeholder="e.g., 2" 
                type="number"
                value={formData.staircaseQuantity || ''}
                onChange={(e) => handleChange('staircaseQuantity', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="staircaseType">Type *</Label>
              <Select
                value={formData.staircaseType || ''}
                onValueChange={(value) => handleChange('staircaseType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enclosed">Enclosed</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="spiral">Spiral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staircaseWidth">Width (Mtrs) *</Label>
              <div className="flex gap-2">
                <Input 
                  id="staircaseWidth" 
                  placeholder="e.g., 1.5" 
                  type="number" 
                  className="flex-1" 
                  step="0.1"
                  value={formData.staircaseWidth || ''}
                  onChange={(e) => handleChange('staircaseWidth', e.target.value)}
                />
                <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                  Mtrs
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staircaseFireRating">Fire Rating (Mins) *</Label>
              <Select
                value={formData.staircaseFireRating || ''}
                onValueChange={(value) => handleChange('staircaseFireRating', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60 Minutes</SelectItem>
                  <SelectItem value="90">90 Minutes</SelectItem>
                  <SelectItem value="120">120 Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="staircasePressurization">Pressurization System *</Label>
              <Select
                value={formData.staircasePressurization || ''}
                onValueChange={(value) => handleChange('staircasePressurization', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staircaseEmergencyLighting">Emergency Lighting *</Label>
              <Select
                value={formData.staircaseEmergencyLighting || ''}
                onValueChange={(value) => handleChange('staircaseEmergencyLighting', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="staircaseLocation">Location *</Label>
            <Input 
              id="staircaseLocation" 
              placeholder="e.g., North Wing, Near Main Entrance"
              value={formData.staircaseLocation || ''}
              onChange={(e) => handleChange('staircaseLocation', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Lift Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Lift Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="liftAvailable">Lift Available *</Label>
            <Select
              value={formData.liftAvailable || ''}
              onValueChange={(value) => handleChange('liftAvailable', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="liftQuantity">Quantity *</Label>
            <Input 
              id="liftQuantity" 
              placeholder="e.g., 2" 
              type="number"
              value={formData.liftQuantity || ''}
              onChange={(e) => handleChange('liftQuantity', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
