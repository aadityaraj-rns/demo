import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FireSafetyStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

const vendorOptions = [
  { value: "firetech", label: "FireTech Services" },
  { value: "safepro", label: "SafePro Solutions" },
  { value: "aegis", label: "Aegis Maintenance" },
];

export function FireSafetyStep({ formData, setFormData }: FireSafetyStepProps) {
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Tank Capacities */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Tank Capacities</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="primeOverTankCapacity">Prime Over Tank Capacity</Label>
            <div className="flex gap-2">
              <Input
                id="primeOverTankCapacity"
                placeholder="e.g., 15000"
                type="number"
                className="flex-1"
                value={formData.primeOverTankCapacity || ""}
                onChange={(e) =>
                  handleChange("primeOverTankCapacity", e.target.value)
                }
              />
              <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                Liters
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="terraceTankCapacity">Terrace Tank Capacity</Label>
            <div className="flex gap-2">
              <Input
                id="terraceTankCapacity"
                placeholder="e.g., 10000"
                type="number"
                className="flex-1"
                value={formData.terraceTankCapacity || ""}
                onChange={(e) =>
                  handleChange("terraceTankCapacity", e.target.value)
                }
              />
              <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                Liters
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diesel1TankCapacity">Diesel 1 Tank Capacity</Label>
            <div className="flex gap-2">
              <Input
                id="diesel1TankCapacity"
                placeholder="e.g., 8000"
                type="number"
                className="flex-1"
                value={formData.diesel1TankCapacity || ""}
                onChange={(e) =>
                  handleChange("diesel1TankCapacity", e.target.value)
                }
              />
              <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                Liters
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diesel2TankCapacity">Diesel 2 Tank Capacity</Label>
            <div className="flex gap-2">
              <Input
                id="diesel2TankCapacity"
                placeholder="e.g., 6000"
                type="number"
                className="flex-1"
                value={formData.diesel2TankCapacity || ""}
                onChange={(e) =>
                  handleChange("diesel2TankCapacity", e.target.value)
                }
              />
              <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                Liters
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pressure & Commissioning */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Pressure & Commissioning</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="headerPressureBar">Header Pressure (in Bar)</Label>
            <div className="flex gap-2">
              <Input
                id="headerPressureBar"
                placeholder="e.g., 7"
                type="number"
                className="flex-1"
                value={formData.headerPressureBar || ""}
                onChange={(e) =>
                  handleChange("headerPressureBar", e.target.value)
                }
              />
              <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                Bar
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="systemCommissionDate">System Commission Date</Label>
            <Input
              id="systemCommissionDate"
              type="date"
              placeholder="dd/mm/yyyy"
              value={formData.systemCommissionDate || ""}
              onChange={(e) =>
                handleChange("systemCommissionDate", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* AMC / Maintenance */}
      <div>
        <h3 className="text-lg font-semibold mb-4">AMC / Maintenance</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="amcVendor">AMC / Maintenance Vendor</Label>
            <Select
              value={formData.amcVendor || ""}
              onValueChange={(value) => handleChange("amcVendor", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendorOptions.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amcStartDate">AMC Start Date</Label>
            <Input
              id="amcStartDate"
              type="date"
              placeholder="dd/mm/yyyy"
              value={formData.amcStartDate || ""}
              onChange={(e) => handleChange("amcStartDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amcEndDate">AMC End Date</Label>
            <Input
              id="amcEndDate"
              type="date"
              placeholder="dd/mm/yyyy"
              value={formData.amcEndDate || ""}
              onChange={(e) => handleChange("amcEndDate", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Fire Equipment Count */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Fire Equipment Count</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="numFireExtinguishers">Number of Fire Extinguishers</Label>
            <Input
              id="numFireExtinguishers"
              placeholder="e.g., 10"
              type="number"
              value={formData.numFireExtinguishers || ""}
              onChange={(e) =>
                handleChange("numFireExtinguishers", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numHydrantPoints">Number of Hydrant Points</Label>
            <Input
              id="numHydrantPoints"
              placeholder="e.g., 2"
              type="number"
              value={formData.numHydrantPoints || ""}
              onChange={(e) => handleChange("numHydrantPoints", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numSprinklers">Number of Sprinklers</Label>
            <Input
              id="numSprinklers"
              placeholder="e.g., 15"
              type="number"
              value={formData.numSprinklers || ""}
              onChange={(e) => handleChange("numSprinklers", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numSafeAssemblyAreas">Number of Safe Assembly Areas</Label>
            <Input
              id="numSafeAssemblyAreas"
              placeholder="e.g., 2"
              type="number"
              value={formData.numSafeAssemblyAreas || ""}
              onChange={(e) =>
                handleChange("numSafeAssemblyAreas", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Fire Pumps */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Fire Pumps</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dieselEngine">Diesel Engine</Label>
            <Input
              id="dieselEngine"
              placeholder="e.g., Kirloskar DE-75"
              value={formData.dieselEngine || ""}
              onChange={(e) => handleChange("dieselEngine", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="electricalPump">Electrical Pump</Label>
            <Input
              id="electricalPump"
              placeholder="e.g., ABB 3-Phase"
              value={formData.electricalPump || ""}
              onChange={(e) => handleChange("electricalPump", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jockeyPump">Jockey Pump</Label>
            <Input
              id="jockeyPump"
              placeholder="e.g., Grundfos JP-5"
              value={formData.jockeyPump || ""}
              onChange={(e) => handleChange("jockeyPump", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}