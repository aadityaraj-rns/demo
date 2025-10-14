import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Building2, Package } from "lucide-react";
import { assets, type Asset } from "@/data/mockFloorplanAssets";
import { SVGFloorplanViewer } from "@/components/floorplan/SVGFloorplanViewer";
import { AssetDetailPanel } from "@/components/floorplan/AssetDetailPanel";
import { FilterControls } from "@/components/floorplan/FilterControls";
import { AdminControlsPanel } from "@/components/floorplan/AdminControlsPanel";
import { AssetCreateModal } from "@/components/floorplan/AssetCreateModal";
import { AdminModeProvider, useAdminMode } from "@/contexts/AdminModeContext";
import { filterAssets } from "@/lib/floorplanUtils";
import { useToast } from "@/hooks/use-toast";

interface FilterState {
  type?: string;
  status?: string;
  searchTerm?: string;
}

// Inner component that uses admin mode context
const FloorplanViewerContent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isAdminMode,
    currentMode,
    isCreatingAsset,
    isDragMode,
    hasUnsavedChanges,
    updateAssetPosition,
    startAssetCreation,
    enableDragMode,
    setNavigationMode,
    cancelAssetCreation,
    createAsset,
    saveChanges,
    discardChanges,
    getAssetChanges
  } = useAdminMode();
  
  const [allAssets, setAllAssets] = useState<Asset[]>(assets);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createCoordinates, setCreateCoordinates] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Apply filters and admin mode changes when data changes
  useEffect(() => {
    // Apply pending changes to assets for display
    const assetsWithChanges = allAssets.map(asset => {
      const changes = getAssetChanges(asset.id);
      return changes ? { ...asset, x: changes.x, y: changes.y, isDirty: true } : asset;
    });
    
    const filtered = filterAssets(assetsWithChanges, filters);
    setFilteredAssets(filtered);
  }, [allAssets, filters, getAssetChanges]);

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmLeave) return;
    }
    navigate('/admin/floorplans');
  };

  // Admin mode handlers
  const handleAssetDrag = (asset: Asset, newCoords: { x: number; y: number }) => {
    updateAssetPosition(asset.id, newCoords);
  };

  const handleAssetDragEnd = (asset: Asset, newCoords: { x: number; y: number }) => {
    updateAssetPosition(asset.id, newCoords);
    toast({
      title: "Asset Position Updated",
      description: `${asset.id} moved to (${Math.round(newCoords.x)}, ${Math.round(newCoords.y)}). Click Save to persist changes.`,
    });
  };

  const handleFloorplanClick = (coords: { x: number; y: number }) => {
    setCreateCoordinates(coords);
    setCreateModalOpen(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await saveChanges();
      toast({
        title: "Changes Saved",
        description: "All asset positions have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm(
        'Are you sure you want to discard all pending changes?'
      );
      if (!confirmDiscard) return;
    }
    discardChanges();
    toast({
      title: "Changes Discarded",
      description: "All pending changes have been reverted.",
    });
  };

  const handleStartCreation = () => {
    startAssetCreation();
    toast({
      title: "Asset Creation Mode",
      description: "Click anywhere on the floorplan to place a new asset.",
    });
  };

  const handleEnableDragMode = () => {
    enableDragMode();
    toast({
      title: "Drag Mode Enabled",
      description: "You can now drag assets to reposition them.",
    });
  };

  const handleSetNavigationMode = () => {
    setNavigationMode();
    toast({
      title: "Navigation Mode",
      description: "You can now pan and zoom the floorplan.",
    });
  };

  const handleCancelCreation = () => {
    cancelAssetCreation();
    setCreateModalOpen(false);
  };

  const handleCreateAsset = (assetData: Partial<Asset>) => {
    // Generate unique ID if not provided
    const newAsset: Asset = {
      id: assetData.id || `NEW_${Date.now()}`,
      type: assetData.type || 'unknown',
      name: assetData.name || 'New Asset',
      x: assetData.x || 0,
      y: assetData.y || 0,
      status: assetData.status || 'green',
      meta: {
        ...assetData.meta,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      }
    };

    setAllAssets(prev => [...prev, newAsset]);
    setCreateModalOpen(false);
    createAsset(createCoordinates);
    
    toast({
      title: "Asset Created",
      description: `${newAsset.id} has been added to the floorplan.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading floorplan...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb */}
        <div className="px-6 py-3 border-b border-border bg-card">
          <p className="text-sm text-muted-foreground">
            Home / Floorplan Viewer / Manufacturing Facility
          </p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Manufacturing Facility
              </h1>
              <p className="text-sm text-muted-foreground">
                {filteredAssets.length} of {allAssets.length} assets shown
              </p>
            </div>
          </div>

          {/* Asset Count Summary */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{filteredAssets.length} Assets</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="px-6 py-4 border-b border-border bg-card">
          <FilterControls 
            onFilterChange={handleFilterChange}
            assetCount={{
              total: allAssets.length,
              filtered: filteredAssets.length
            }}
          />
        </div>

        {/* Floorplan Viewer */}
        <div className="flex-1 overflow-hidden">
          <SVGFloorplanViewer
            svgUrl="/floorplan2.svg"
            assets={filteredAssets}
            onAssetClick={handleAssetClick}
            selectedAsset={selectedAsset}
            isAdminMode={isAdminMode}
            currentMode={currentMode}
            isDragMode={isDragMode}
            isCreatingAsset={isCreatingAsset}
            onAssetDrag={handleAssetDrag}
            onAssetDragEnd={handleAssetDragEnd}
            onFloorplanClick={handleFloorplanClick}
            onModeChange={(mode) => {
              switch (mode) {
                case 'navigation':
                  handleSetNavigationMode();
                  break;
                case 'drag':
                  handleEnableDragMode();
                  break;
                case 'create':
                  handleStartCreation();
                  break;
              }
            }}
          />
        </div>
      </div>

      {/* Admin Controls Panel */}
      {isAdminMode && (
        <div className="p-4 border-l border-border bg-card">
          <AdminControlsPanel
            selectedAsset={selectedAsset ? {
              id: selectedAsset.id,
              x: selectedAsset.x,
              y: selectedAsset.y
            } : null}
            onSave={handleSaveChanges}
            onDiscard={handleDiscardChanges}
            onStartCreation={handleStartCreation}
            onCancelCreation={handleCancelCreation}
            isSaving={isSaving}
          />
        </div>
      )}

      {/* Asset Detail Panel */}
      {selectedAsset && !isAdminMode && (
        <AssetDetailPanel 
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}

      {/* Asset Creation Modal */}
      <AssetCreateModal
        isOpen={createModalOpen}
        coordinates={createCoordinates}
        onSave={handleCreateAsset}
        onCancel={() => setCreateModalOpen(false)}
      />
    </div>
  );
};

// Main component with provider
export default function FloorplanViewer() {
  return (
    <AdminModeProvider>
      <FloorplanViewerContent />
    </AdminModeProvider>
  );
}
