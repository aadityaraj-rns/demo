import React, { useState, useCallback, useRef } from "react";
import type { Asset } from "@/data/mockFloorplanAssets";
import { assetTypeConfig, statusConfig } from "@/data/mockFloorplanAssets";
import { getStatusColor, getAssetTypeIcon } from "@/lib/floorplanUtils";

interface AssetMarkerProps {
  asset: Asset;
  isSelected?: boolean;
  isDraggable?: boolean;
  onClick?: () => void;
  onDrag?: (asset: Asset, newCoords: {x: number, y: number}) => void;
  onDragEnd?: (asset: Asset, newCoords: {x: number, y: number}) => void;
  scale?: number;
}

export const AssetMarker: React.FC<AssetMarkerProps> = ({
  asset,
  isSelected = false,
  isDraggable = false,
  onClick,
  onDrag,
  onDragEnd,
  scale = 1
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [currentPosition, setCurrentPosition] = useState({ x: asset.x, y: asset.y });
  const dragRef = useRef<{ startX: number; startY: number; assetStartX: number; assetStartY: number } | null>(null);
  
  // Validate asset coordinates
  if (!asset || typeof asset.x !== 'number' || typeof asset.y !== 'number' || 
      isNaN(asset.x) || isNaN(asset.y)) {
    return null;
  }
  
  // Get asset type configuration
  const typeConfig = assetTypeConfig[asset.type as keyof typeof assetTypeConfig] || {
    color: "#6b7280",
    icon: "📦",
    label: asset.type || "Unknown"
  };

  // Get status color (repository style: green/yellow/red)
  const statusColor = statusConfig[asset.status]?.color || "#6b7280";
  
  // Calculate sizes based on scale
  const markerSize = Math.max(8, 16 * scale);
  const pulseSize = markerSize + 4;
  const hoverSize = markerSize + 8;

  // Simplified drag handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;

    // Get the SVG element that contains the markers
    const svgElement = (e.target as Element)?.closest('svg') || document.querySelector('svg[viewBox]');
    if (!svgElement) return;

    // Create SVG point for coordinate transformation
    const pt = (svgElement as SVGSVGElement).createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    // Get screen to SVG transformation matrix
    const matrix = (svgElement as SVGSVGElement).getScreenCTM();
    if (!matrix) return;

    // Transform screen coordinates to SVG coordinates
    const svgPoint = pt.matrixTransform(matrix.inverse());
    
    setCurrentPosition({ x: svgPoint.x, y: svgPoint.y });
    onDrag?.(asset, { x: svgPoint.x, y: svgPoint.y });
  }, [isDragging, asset, onDrag]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      onDragEnd?.(asset, currentPosition);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      dragRef.current = null;
    }
  }, [isDragging, asset, currentPosition, onDragEnd, handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isDraggable) return;
    
    e.preventDefault();
    e.stopPropagation();

    // Get initial SVG coordinates
    const svgElement = (e.target as Element)?.closest('svg') || document.querySelector('svg[viewBox]');
    if (!svgElement) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      assetStartX: currentPosition.x,
      assetStartY: currentPosition.y
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isDraggable, currentPosition, handleMouseMove, handleMouseUp]);

  // Update position when asset changes
  React.useEffect(() => {
    if (!isDragging) {
      setCurrentPosition({ x: asset.x, y: asset.y });
    }
  }, [asset.x, asset.y, isDragging]);
  
  // Determine marker appearance based on health status
  const getMarkerStyle = () => {
    const baseStyle = {
      transition: isDragging ? 'none' : 'all 0.2s ease-in-out',
      cursor: isDraggable ? (isDragging ? 'grabbing' : 'grab') : 'pointer'
    };

    if (isDragging) {
      return {
        ...baseStyle,
        filter: 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.8))',
        transform: `scale(${1.3})`,
        zIndex: 1000
      };
    }

    if (isSelected) {
      return {
        ...baseStyle,
        filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))',
        transform: `scale(${1.2})`
      };
    }

    if (isHovered && isDraggable) {
      return {
        ...baseStyle,
        transform: `scale(${1.15})`,
        cursor: 'grab'
      };
    }

    if (isHovered) {
      return {
        ...baseStyle,
        transform: `scale(${1.1})`
      };
    }

    return baseStyle;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return; // Don't trigger click during drag
    e.stopPropagation();
    onClick?.();
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsHovered(false);
    }
  };

  return (
    <g transform={`translate(${currentPosition.x}, ${currentPosition.y})`}>
      {/* Pulse animation for critical assets */}
      {asset.status === 'red' && (
        <circle
          cx="0"
          cy="0"
          r={pulseSize / 2}
          fill="none"
          stroke={statusColor}
          strokeWidth="2"
          opacity="0.6"
          className="animate-ping"
        />
      )}

      {/* Selection ring */}
      {isSelected && (
        <circle
          cx="0"
          cy="0"
          r={markerSize / 2 + 4}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
      )}

      {/* Hover ring */}
      {isHovered && !isSelected && (
        <circle
          cx="0"
          cy="0"
          r={markerSize / 2 + 2}
          fill="none"
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth="1"
        />
      )}

      {/* Main marker */}
          <g
            style={{
              ...getMarkerStyle(), 
              pointerEvents: 'auto',
              cursor: isDraggable ? (isDragging ? 'grabbing' : 'grab') : 'pointer'
            }}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
        {/* Background circle */}
        <circle
          cx="0"
          cy="0"
          r={markerSize / 2}
          fill="#ffffff"
          stroke={statusColor}
          strokeWidth="2"
          filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
        />

        {/* Asset type icon */}
        <circle
          cx="0"
          cy="0"
          r={markerSize / 2 - 2}
          fill={typeConfig.color}
          opacity="0.1"
        />
        
        {/* Icon/Symbol */}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={Math.max(6, markerSize * 0.6)}
          fill={typeConfig.color}
          fontWeight="bold"
        >
          {getAssetTypeIcon(asset.type || "")}
        </text>

        {/* Status indicator */}
        <circle
          cx={markerSize / 3}
          cy={-markerSize / 3}
          r={Math.max(2, markerSize / 6)}
          fill={statusColor}
          stroke="#ffffff"
          strokeWidth="1"
        />
      </g>

      {/* Asset ID label (shown on hover or selection) */}
      {(isHovered || isSelected) && (
        <g transform={`translate(0, ${markerSize / 2 + 8})`}>
          <rect
            x={-asset.id.length * 3}
            y="-6"
            width={asset.id.length * 6}
            height="12"
            rx="2"
            fill="rgba(0, 0, 0, 0.8)"
          />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8"
            fill="#ffffff"
            fontWeight="500"
          >
            {asset.id}
          </text>
        </g>
      )}

      {/* Attention indicator for maintenance needed */}
      {asset.status === 'yellow' && (
        <g>
          <circle
            cx={markerSize / 2 + 2}
            cy={-markerSize / 2 - 2}
            r="3"
            fill="#f59e0b"
            className="animate-pulse"
          />
          <text
            x={markerSize / 2 + 2}
            y={-markerSize / 2 - 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="6"
            fill="#ffffff"
            fontWeight="bold"
          >
            !
          </text>
        </g>
      )}

      {/* Tooltip on hover */}
      {isHovered && (
        <g transform={`translate(${markerSize / 2 + 5}, ${-markerSize / 2})`}>
          <rect
            x="0"
            y="-20"
            width="120"
            height="40"
            rx="4"
            fill="rgba(0, 0, 0, 0.9)"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
            filter="drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))"
          />
          
          {/* Asset info */}
          <text x="8" y="-12" fontSize="9" fill="#ffffff" fontWeight="bold">
            {asset.id}
          </text>
          <text x="8" y="-2" fontSize="8" fill="#d1d5db">
            {typeConfig.label}
          </text>
          <text x="8" y="8" fontSize="8" fill="#d1d5db">
            {asset.name}
          </text>
          
          {/* Status indicator */}
          <circle cx="105" cy="-8" r="3" fill={statusColor} />
          <text x="105" y="4" fontSize="6" fill="#d1d5db" textAnchor="middle">
            {asset.status === 'green' ? 'OK' : 
             asset.status === 'yellow' ? 'ATTN' : 'FAIL'}
          </text>
        </g>
      )}

      {/* Coordinate tooltip during drag */}
      {isDragging && (
        <g transform={`translate(0, ${-markerSize / 2 - 20})`}>
          <rect
            x="-40"
            y="-15"
            width="80"
            height="30"
            rx="4"
            fill="rgba(59, 130, 246, 0.95)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
            filter="drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))"
          />
          <text x="0" y="-5" fontSize="8" fill="#ffffff" textAnchor="middle" fontWeight="bold">
            x: {Math.round(currentPosition.x)}
          </text>
          <text x="0" y="5" fontSize="8" fill="#ffffff" textAnchor="middle" fontWeight="bold">
            y: {Math.round(currentPosition.y)}
          </text>
        </g>
      )}

    </g>
  );
};
