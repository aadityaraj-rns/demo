// Repository-style asset tracking data structure
// Based on https://github.com/Weasley18/layouttrial

export interface Asset {
  id: string;
  type: string;
  name: string;
  x: number;           // SVG/CAD coordinates
  y: number;           // SVG/CAD coordinates  
  x_norm?: number;     // Normalized coordinates (optional)
  y_norm?: number;     // Normalized coordinates (optional)
  status: "green" | "yellow" | "red";  // Repository status system
  // Admin mode fields
  originalX?: number;  // Store original coordinates for change tracking
  originalY?: number;
  isDirty?: boolean;   // Track unsaved changes
  createdBy?: string;  // Track who created/modified
  createdAt?: string;  // Creation timestamp
  modifiedAt?: string; // Last modification timestamp
  meta: {
    lastCheck?: string;
    battery?: number;
    temperature?: number;
    description?: string;
    [key: string]: unknown;  // Additional metadata
  };
}

// Repository-style mock assets for single building
// Based on https://github.com/Weasley18/layouttrial implementation
export const assets: Asset[] = [
  {
    id: "SD_001",
    type: "smoke_detector",
    name: "Main Lobby Detector",
    x: 245.5,
    y: 180.3,
    x_norm: 0.245,
    y_norm: 0.300,
    status: "green",
    meta: {
      lastCheck: "2025-10-08T08:00:00Z",
      battery: 95,
      temperature: 22.5,
      description: "Above main entrance"
    }
  },
  {
    id: "FE_002",
    type: "fire_extinguisher", 
    name: "Production Line A Extinguisher",
    x: 450.8,
    y: 320.1,
    x_norm: 0.451,
    y_norm: 0.533,
    status: "yellow",
    meta: {
      lastCheck: "2025-10-05T14:30:00Z",
      description: "Pressure check needed"
    }
  },
  {
    id: "SP_003",
    type: "sprinkler",
    name: "Assembly Area Sprinkler", 
    x: 680.2,
    y: 150.7,
    x_norm: 0.680,
    y_norm: 0.251,
    status: "green",
    meta: {
      lastCheck: "2025-10-09T10:15:00Z",
      description: "Working properly"
    }
  },
  {
    id: "AL_004", 
    type: "fire_alarm",
    name: "Emergency Exit Alarm",
    x: 150.0,
    y: 400.5,
    x_norm: 0.150,
    y_norm: 0.668,
    status: "red",
    meta: {
      lastCheck: "2025-10-07T16:45:00Z",
      description: "Requires immediate attention"
    }
  },
  {
    id: "HY_005",
    type: "fire_hydrant",
    name: "Loading Bay Hydrant",
    x: 800.3,
    y: 280.9,
    x_norm: 0.800,
    y_norm: 0.468,
    status: "green",
    meta: {
      lastCheck: "2025-10-06T11:20:00Z",
      description: "Pressure tested"
    }
  },
  {
    id: "SD_006",
    type: "smoke_detector",
    name: "Storage Area A Detector",
    x: 600.0,
    y: 200.0,
    x_norm: 0.600,
    y_norm: 0.333,
    status: "green",
    meta: {
      lastCheck: "2025-10-08T09:30:00Z",
      battery: 88,
      temperature: 18.2,
      description: "Storage area coverage"
    }
  },
  {
    id: "FE_007",
    type: "fire_extinguisher",
    name: "Chemical Storage Extinguisher",
    x: 300.5,
    y: 350.8,
    x_norm: 0.301,
    y_norm: 0.585,
    status: "yellow",
    meta: {
      lastCheck: "2025-10-04T13:45:00Z",
      description: "Service due next month"
    }
  },
  {
    id: "AL_008",
    type: "fire_alarm",
    name: "Control Panel Area Alarm",
    x: 500.2,
    y: 120.4,
    x_norm: 0.500,
    y_norm: 0.201,
    status: "green",
    meta: {
      lastCheck: "2025-10-09T08:15:00Z",
      description: "Recently serviced"
    }
  }
];

// Asset type configurations for display
export const assetTypeConfig = {
  smoke_detector: {
    color: "#3b82f6", // blue
    icon: "🔍",
    label: "Smoke Detector"
  },
  fire_extinguisher: {
    color: "#ef4444", // red
    icon: "🧯", 
    label: "Fire Extinguisher"
  },
  sprinkler: {
    color: "#06b6d4", // cyan
    icon: "💧",
    label: "Sprinkler"
  },
  fire_alarm: {
    color: "#f59e0b", // amber
    icon: "🚨",
    label: "Fire Alarm"
  },
  fire_hydrant: {
    color: "#10b981", // emerald 
    icon: "🚰",
    label: "Fire Hydrant"
  }
};

// Status configurations (repository style: green/yellow/red)
export const statusConfig = {
  green: {
    color: "#10b981", // emerald
    label: "Healthy",
    priority: 1
  },
  yellow: { 
    color: "#f59e0b", // amber
    label: "Attention Required",
    priority: 2
  },
  red: {
    color: "#ef4444", // red
    label: "Critical", 
    priority: 3
  }
};