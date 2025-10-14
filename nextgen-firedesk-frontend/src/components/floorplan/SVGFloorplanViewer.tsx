import { useRef, useEffect, useState, useCallback } from "react";
import { AssetMarker } from "./AssetMarker";
import type { Asset } from "@/data/mockFloorplanAssets";
import { 
  screenToSvg, 
  getSvgViewBox, 
  calculateOptimalZoom,
  debounce 
} from "@/lib/floorplanUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Navigation, Move, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AdminMode = 'navigation' | 'drag' | 'create';

interface SVGFloorplanViewerProps {
  svgUrl: string;
  assets: Asset[];
  onAssetClick?: (asset: Asset) => void;
  selectedAsset?: Asset | null;
  enablePanZoom?: boolean;
  className?: string;
  // Admin mode props
  isAdminMode?: boolean;
  currentMode?: AdminMode;
  isDragMode?: boolean;
  isCreatingAsset?: boolean;
  onAssetDrag?: (asset: Asset, newCoords: {x: number, y: number}) => void;
  onAssetDragEnd?: (asset: Asset, newCoords: {x: number, y: number}) => void;
  onFloorplanClick?: (coords: {x: number, y: number}) => void;
  onModeChange?: (mode: AdminMode) => void;
}

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

export const SVGFloorplanViewer: React.FC<SVGFloorplanViewerProps> = ({
  svgUrl,
  assets,
  onAssetClick,
  selectedAsset,
  enablePanZoom = true,
  className = "",
  // Admin mode props
  isAdminMode = false,
  currentMode = 'navigation',
  isDragMode = false,
  isCreatingAsset = false,
  onAssetDrag,
  onAssetDragEnd,
  onFloorplanClick,
  onModeChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const floorplanRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placementPreview, setPlacementPreview] = useState<{ x: number; y: number } | null>(null);
  const { toast } = useToast();

  // Load SVG content
  useEffect(() => {
    const loadSvg = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(svgUrl);
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.status}`);
        }
        
        const text = await response.text();
        setSvgContent(text);
      } catch (err) {
        console.error('SVG loading error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load floorplan');
        toast({
          title: "Error",
          description: "Failed to load floorplan. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (svgUrl) {
      loadSvg();
    }
  }, [svgUrl, toast]);

  // Initialize view when SVG loads
  useEffect(() => {
    if (svgContent && containerRef.current && svgRef.current) {
      try {
        const container = containerRef.current;
        const svg = svgRef.current;
        
        // Wait a bit for SVG to be fully rendered and retry if container is not ready
        const initializeView = (attempts = 0) => {
          try {
            // Get dimensions
            const containerRect = container.getBoundingClientRect();
            
            // If container has no dimensions, retry up to 5 times
            if ((containerRect.width === 0 || containerRect.height === 0) && attempts < 5) {
              setTimeout(() => initializeView(attempts + 1), 200);
              return;
            }
            
            // If still no dimensions after retries, use default values
            const containerWidth = containerRect.width || 1000;
            const containerHeight = containerRect.height || 600;
            
            const viewBox = getSvgViewBox(svg);
            
            // Calculate initial scale to fit
            const optimalScale = calculateOptimalZoom(
              containerWidth,
              containerHeight,
              viewBox.width,
              viewBox.height
            );
            
            // Center the SVG
            const centerX = (containerWidth - viewBox.width * optimalScale) / 2;
            const centerY = (containerHeight - viewBox.height * optimalScale) / 2;
            
            setTransform({
              scale: optimalScale,
              translateX: centerX,
              translateY: centerY
            });
          } catch (error) {
            console.error('Error initializing SVG view:', error);
            // Set default transform
            setTransform({
              scale: 1,
              translateX: 0,
              translateY: 0
            });
          }
        };
        
        setTimeout(() => initializeView(), 100);
      } catch (error) {
        console.error('Error in SVG initialization:', error);
        setError('Failed to initialize floorplan view');
      }
    }
  }, [svgContent]);

  // Zoom functionality
  const handleZoom = useCallback((delta: number, centerPoint?: { x: number; y: number }) => {
    if (!enablePanZoom || !containerRef.current) return;

    setTransform(prev => {
      const newScale = Math.max(0.1, Math.min(5, prev.scale + delta));
      const scaleRatio = newScale / prev.scale;
      
      let newTranslateX = prev.translateX;
      let newTranslateY = prev.translateY;
      
      if (centerPoint) {
        // Zoom towards the center point
        newTranslateX = centerPoint.x - (centerPoint.x - prev.translateX) * scaleRatio;
        newTranslateY = centerPoint.y - (centerPoint.y - prev.translateY) * scaleRatio;
      }
      
      return {
        scale: newScale,
        translateX: newTranslateX,
        translateY: newTranslateY
      };
    });
  }, [enablePanZoom]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!enablePanZoom) return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const rect = containerRef.current?.getBoundingClientRect();
    
    if (rect) {
      const centerPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      handleZoom(delta, centerPoint);
    }
  }, [enablePanZoom, handleZoom]);

  // Handle floorplan click (admin mode) or pan start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left click
    
    // In admin mode with asset creation, handle click-to-place
    if (isAdminMode && isCreatingAsset) {
      e.preventDefault();
      e.stopPropagation();
      
      if (svgRef.current && containerRef.current) {
        // Get container bounds for proper coordinate calculation
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Calculate relative position within the container
        const relativeX = e.clientX - containerRect.left;
        const relativeY = e.clientY - containerRect.top;
        
        // Account for the transform (scale and translation)
        const svgX = (relativeX - transform.translateX) / transform.scale;
        const svgY = (relativeY - transform.translateY) / transform.scale;
        
        onFloorplanClick?.({ x: svgX, y: svgY });
      }
      return;
    }
    
    // Normal pan functionality
    if (!enablePanZoom) return;
    
    setIsPanning(true);
    setPanStart({ x: e.clientX - transform.translateX, y: e.clientY - transform.translateY });
    e.preventDefault();
  }, [enablePanZoom, transform, isAdminMode, isCreatingAsset, onFloorplanClick]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Handle placement preview in admin mode
    if (isAdminMode && isCreatingAsset && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate relative position within the container
      const relativeX = e.clientX - containerRect.left;
      const relativeY = e.clientY - containerRect.top;
      
      // Account for the transform (scale and translation)
      const svgX = (relativeX - transform.translateX) / transform.scale;
      const svgY = (relativeY - transform.translateY) / transform.scale;
      
      setPlacementPreview({ x: svgX, y: svgY });
    }
    
    // Handle panning
    if (!isPanning || !enablePanZoom) return;
    
    setTransform(prev => ({
      ...prev,
      translateX: e.clientX - panStart.x,
      translateY: e.clientY - panStart.y
    }));
  }, [isPanning, enablePanZoom, panStart, isAdminMode, isCreatingAsset, transform]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enablePanZoom) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [enablePanZoom, handleWheel, handleMouseMove, handleMouseUp]);

  // Reset view
  const resetView = useCallback(() => {
    if (!containerRef.current || !svgRef.current) return;
    
    const container = containerRef.current;
    const svg = svgRef.current;
    const containerRect = container.getBoundingClientRect();
    const viewBox = getSvgViewBox(svg);
    
    const optimalScale = calculateOptimalZoom(
      containerRect.width,
      containerRect.height,
      viewBox.width,
      viewBox.height
    );
    
    const centerX = (containerRect.width - viewBox.width * optimalScale) / 2;
    const centerY = (containerRect.height - viewBox.height * optimalScale) / 2;
    
    setTransform({
      scale: optimalScale,
      translateX: centerX,
      translateY: centerY
    });
  }, []);

  // Fit to window
  const fitToWindow = useCallback(() => {
    resetView();
  }, [resetView]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full bg-muted/30 ${className}`}>
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading floorplan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full bg-muted/30 ${className}`}>
        <div className="text-center space-y-4 p-8">
          <div className="text-red-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">Failed to Load Floorplan</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} size="sm">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full min-h-[400px] bg-muted/30 overflow-hidden ${className}`}>
      {/* Admin Mode Toggle Buttons */}
      {isAdminMode && (
        <div className="absolute top-4 left-4 z-20 flex gap-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
          <Button
            variant={currentMode === 'navigation' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange?.('navigation')}
            className="flex items-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            <span className="hidden sm:inline">Navigate</span>
          </Button>
          <Button
            variant={currentMode === 'create' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange?.('create')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      )}

      {/* Current Mode Indicator */}
      {isAdminMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <Badge variant="secondary" className="px-3 py-1 bg-background/90 backdrop-blur-sm">
            {(currentMode === 'navigation' || currentMode === 'drag') && (
              <span className="flex items-center gap-1">
                <Navigation className="h-3 w-3" />
                Navigation Mode
              </span>
            )}
            {currentMode === 'create' && (
              <span className="flex items-center gap-1">
                <Plus className="h-3 w-3" />
                Creation Mode
              </span>
            )}
          </Badge>
        </div>
      )}

      {/* Zoom Control Panel */}
      {enablePanZoom && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleZoom(0.2)}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleZoom(-0.2)}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={resetView}
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={fitToWindow}
            title="Fit to Window"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* SVG Container */}
      <div 
        ref={containerRef}
        className="w-full h-full min-h-[400px] cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <div
          data-floorplan-container
          style={{
            transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          {/* SVG Floorplan */}
          <div
            ref={floorplanRef}
            dangerouslySetInnerHTML={{ __html: svgContent }}
            className="pointer-events-none"
          />

          {/* Overlay SVG for Asset Markers and Interactions */}
          <svg
            ref={svgRef}
            className="absolute top-0 left-0"
            width="1000"
            height="600"
            viewBox="0 0 1000 600"
            style={{
              pointerEvents: 'none' // Allow clicks through to container, but enable for children
            }}
          >
            {assets.map((asset) => (
              <AssetMarker
                key={asset.id}
                asset={asset}
                isSelected={selectedAsset?.id === asset.id}
                isDraggable={isAdminMode && (isDragMode || currentMode === 'navigation')} // Enable drag in navigation mode too
                onClick={() => onAssetClick?.(asset)}
                onDrag={onAssetDrag}
                onDragEnd={onAssetDragEnd}
                scale={1 / transform.scale} // Counter the transform scale
              />
            ))}
            
            {/* Placement preview during asset creation */}
            {isAdminMode && isCreatingAsset && placementPreview && (
              <g transform={`translate(${placementPreview.x}, ${placementPreview.y})`}>
                <circle
                  cx="0"
                  cy="0"
                  r="8"
                  fill="rgba(59, 130, 246, 0.3)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
                <text
                  x="0"
                  y="1"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="8"
                  fill="#3b82f6"
                  fontWeight="bold"
                >
                  +
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Healthy: {assets.filter(a => a.status === 'green').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Warning: {assets.filter(a => a.status === 'yellow').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Critical: {assets.filter(a => a.status === 'red').length}</span>
          </div>
          <div className="text-muted-foreground border-l pl-4 ml-2">
            Zoom: {Math.round(transform.scale * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};
