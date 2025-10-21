import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";

interface PremisesStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const floorUsageOptions = [
  { value: "production", label: "Production" },
  { value: "storage", label: "Storage" },
  { value: "office", label: "Office" },
  { value: "laboratory", label: "Laboratory" },
  { value: "warehouse", label: "Warehouse" },
];

const wingOptions = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
];

export function PremisesStep({ formData, setFormData }: PremisesStepProps) {
  const [building, setBuilding] = useState({
    buildingName: "",
    numFloors: "",
    buildingHeight: "",
    floors: [] as any[],
  });

  const [floor, setFloor] = useState({
    floorName: "",
    floorUsage: "",
    floorArea: "",
    wing: "",
  });

  const [entrance, setEntrance] = useState({
    entranceName: "",
    entranceWidth: "",
  });

  const isBuildingValid =
    building.buildingName.trim() !== "" &&
    building.numFloors !== "" &&
    building.buildingHeight !== "";

  const isFloorValid =
    floor.floorName.trim() !== "" &&
    floor.floorUsage !== "" &&
    floor.floorArea !== "" &&
    floor.wing !== "";

  const isEntranceValid =
    entrance.entranceName.trim() !== "" && entrance.entranceWidth !== "";

  const handleAddFloor = () => {
    setBuilding((prev) => ({
      ...prev,
      floors: [...prev.floors, { ...floor, id: Date.now().toString() }],
    }));
    setFloor({
      floorName: "",
      floorUsage: "",
      floorArea: "",
      wing: "",
    });
  };

  const handleAddBuilding = () => {
    setFormData((prev: any) => ({
      ...prev,
      buildings: [...(prev.buildings || []), { ...building, id: Date.now().toString() }],
    }));
    setBuilding({
      buildingName: "",
      numFloors: "",
      buildingHeight: "",
      floors: [],
    });
  };

  const handleAddEntrance = () => {
    setFormData((prev: any) => ({
      ...prev,
      entrances: [...(prev.entrances || []), { ...entrance, id: Date.now().toString() }],
    }));
    setEntrance({
      entranceName: "",
      entranceWidth: "",
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const removeBuilding = (buildingId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      buildings: prev.buildings?.filter((b: any) => b.id !== buildingId) || [],
    }));
  };

  const removeEntrance = (entranceId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      entrances: prev.entrances?.filter((e: any) => e.id !== entranceId) || [],
    }));
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: Building Count */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Building Count</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="mainBuildings">Main Buildings</Label>
            <Input
              id="mainBuildings"
              placeholder="e.g., 2"
              type="number"
              value={formData.mainBuildings ?? ""}
              onChange={(e) => handleChange("mainBuildings", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subBuildings">Sub Buildings</Label>
            <Input
              id="subBuildings"
              placeholder="e.g., 1"
              type="number"
              value={formData.subBuildings ?? ""}
              onChange={(e) => handleChange("subBuildings", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Building Details */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Building Details</h3>
          <Button
            variant="default"
            size="sm"
            onClick={handleAddBuilding}
            disabled={!isBuildingValid || building.floors.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Building
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Building Name</Label>
            <Input
              placeholder="e.g., Factory Block A"
              value={building.buildingName}
              onChange={(e) =>
                setBuilding({ ...building, buildingName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Number of Floors</Label>
            <Input
              placeholder="e.g., 4"
              type="number"
              value={building.numFloors}
              onChange={(e) =>
                setBuilding({ ...building, numFloors: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Building Height (Mtrs)</Label>
            <Input
              placeholder="e.g., 15"
              type="number"
              value={building.buildingHeight}
              onChange={(e) =>
                setBuilding({ ...building, buildingHeight: e.target.value })
              }
            />
          </div>
        </div>

        {/* Floor Details */}
        <div className="border rounded p-4 mt-4">
          <h4 className="font-semibold mb-3">Add Floor Details</h4>
          <div className="grid grid-cols-4 gap-4 mb-3">
            <div className="space-y-2">
              <Label>Floor Name</Label>
              <Input
                placeholder="e.g., Ground Floor"
                value={floor.floorName}
                onChange={(e) =>
                  setFloor({ ...floor, floorName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Floor Usage</Label>
              <Select
                value={floor.floorUsage}
                onValueChange={(val) => setFloor({ ...floor, floorUsage: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Usage" />
                </SelectTrigger>
                <SelectContent>
                  {floorUsageOptions.map((fu) => (
                    <SelectItem key={fu.value} value={fu.value}>
                      {fu.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Floor Area (Sq.Mtrs)</Label>
              <Input
                placeholder="e.g., 500"
                type="number"
                value={floor.floorArea}
                onChange={(e) =>
                  setFloor({ ...floor, floorArea: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Wing</Label>
              <Select
                value={floor.wing}
                onValueChange={(val) => setFloor({ ...floor, wing: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Wing" />
                </SelectTrigger>
                <SelectContent>
                  {wingOptions.map((wing) => (
                    <SelectItem key={wing.value} value={wing.value}>
                      {wing.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleAddFloor}
            disabled={!isFloorValid}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Floor
          </Button>

          {/* Current Building Floors */}
          {building.floors.length > 0 && (
            <div className="mt-4">
              <h5 className="font-medium mb-2">Current Building Floors:</h5>
              <div className="space-y-2">
                {building.floors.map((fl, idx) => (
                  <div
                    key={fl.id}
                    className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                  >
                    <span>
                      {fl.floorName} - {fl.floorUsage} - {fl.floorArea} Sq.Mtrs - Wing {fl.wing}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Added Buildings */}
        {formData.buildings && formData.buildings.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-3">Added Buildings</h4>
            <div className="space-y-3">
              {formData.buildings.map((bldg: any) => (
                <div key={bldg.id} className="border rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">
                      {bldg.buildingName} ({bldg.buildingHeight}m, {bldg.numFloors} Floors)
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeBuilding(bldg.id)}
                    >
                      Remove
                    </Button>
                  </div>
                  {bldg.floors && bldg.floors.length > 0 && (
                    <div className="pl-4 space-y-1 text-sm text-muted-foreground">
                      {bldg.floors.map((fl: any, i: number) => (
                        <div key={i}>
                          • Floor: {fl.floorName} | Usage: {fl.floorUsage} | Area: {fl.floorArea} Sq.Mtrs | Wing: {fl.wing}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: Total Area */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Total Area</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="totalPlantArea">Total Plant Area (Sq.Mtrs)</Label>
            <div className="flex gap-2">
              <Input
                id="totalPlantArea"
                placeholder="e.g., 15000"
                type="number"
                className="flex-1"
                value={formData.totalPlantArea ?? ""}
                onChange={(e) => handleChange("totalPlantArea", e.target.value)}
              />
              <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                Sq.Mtrs
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalBuildUpArea">Total Build-Up Area (Sq.Mtrs)</Label>
            <div className="flex gap-2">
              <Input
                id="totalBuildUpArea"
                placeholder="e.g., 10000"
                type="number"
                className="flex-1"
                value={formData.totalBuildUpArea ?? ""}
                onChange={(e) =>
                  handleChange("totalBuildUpArea", e.target.value)
                }
              />
              <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                Sq.Mtrs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Entrance Details */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Entrance Details</h3>
          <Button
            variant="default"
            size="sm"
            onClick={handleAddEntrance}
            disabled={!isEntranceValid}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entrance
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Entrance Name</Label>
            <Input
              placeholder="e.g., East Gate"
              value={entrance.entranceName}
              onChange={(e) =>
                setEntrance({ ...entrance, entranceName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Width (Mtrs)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 6"
                type="number"
                className="flex-1"
                value={entrance.entranceWidth}
                onChange={(e) =>
                  setEntrance({ ...entrance, entranceWidth: e.target.value })
                }
              />
              <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                Mtrs
              </div>
            </div>
          </div>
        </div>

        {/* Added Entrances */}
        {formData.entrances && formData.entrances.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-3">Added Entrances</h4>
            <div className="space-y-2">
              {formData.entrances.map((ent: any) => (
                <div key={ent.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span>{ent.entranceName} - {ent.entranceWidth} meters</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEntrance(ent.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: Diesel Generator */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Diesel Generator</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dgAvailable">Diesel Generator Available</Label>
            <Select
              value={formData.dgAvailable || ""}
              onValueChange={(value) => handleChange("dgAvailable", value)}
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
            <Label htmlFor="dgQuantity">Quantity</Label>
            <Input
              id="dgQuantity"
              placeholder="e.g., 2"
              type="number"
              value={formData.dgQuantity || ""}
              onChange={(e) => handleChange("dgQuantity", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 6: Staircase Details */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Staircase Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="staircaseAvailable">Is Staircase Available</Label>
              <Select
                value={formData.staircaseAvailable || ""}
                onValueChange={(value) =>
                  handleChange("staircaseAvailable", value)
                }
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
              <Label htmlFor="staircaseQuantity">Quantity</Label>
              <Input
                id="staircaseQuantity"
                placeholder="e.g., 2"
                type="number"
                value={formData.staircaseQuantity || ""}
                onChange={(e) =>
                  handleChange("staircaseQuantity", e.target.value)
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="staircaseType">Type</Label>
              <Select
                value={formData.staircaseType || ""}
                onValueChange={(value) => handleChange("staircaseType", value)}
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
              <Label htmlFor="staircaseWidth">Width (Mtrs)</Label>
              <div className="flex gap-2">
                <Input
                  id="staircaseWidth"
                  placeholder="e.g., 1.5"
                  type="number"
                  className="flex-1"
                  step="0.1"
                  value={formData.staircaseWidth || ""}
                  onChange={(e) =>
                    handleChange("staircaseWidth", e.target.value)
                  }
                />
                <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                  Mtrs
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staircaseFireRating">Fire Rating (Mins)</Label>
              <Select
                value={formData.staircaseFireRating || ""}
                onValueChange={(value) =>
                  handleChange("staircaseFireRating", value)
                }
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
              <Label htmlFor="staircasePressurization">Pressurization System</Label>
              <Select
                value={formData.staircasePressurization || ""}
                onValueChange={(value) =>
                  handleChange("staircasePressurization", value)
                }
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
              <Label htmlFor="staircaseEmergencyLighting">Emergency Lighting</Label>
              <Select
                value={formData.staircaseEmergencyLighting || ""}
                onValueChange={(value) =>
                  handleChange("staircaseEmergencyLighting", value)
                }
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
            <Label htmlFor="staircaseLocation">Location</Label>
            <Input
              id="staircaseLocation"
              placeholder="e.g., North Wing, Near Main Entrance"
              value={formData.staircaseLocation || ""}
              onChange={(e) =>
                handleChange("staircaseLocation", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* SECTION 7: Lift Details */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Lift Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="liftAvailable">Lift Available</Label>
            <Select
              value={formData.liftAvailable || ""}
              onValueChange={(value) => handleChange("liftAvailable", value)}
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
            <Label htmlFor="liftQuantity">Quantity</Label>
            <Input
              id="liftQuantity"
              placeholder="e.g., 2"
              type="number"
              value={formData.liftQuantity || ""}
              onChange={(e) => handleChange("liftQuantity", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremisesStep;