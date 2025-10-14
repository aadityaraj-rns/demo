// Utility functions for floorplan coordinate transformations and operations

export interface Point {
  x: number;
  y: number;
}

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Convert SVG coordinates to screen coordinates (using Point object)
 * @param point - SVG coordinate point
 * @param svg - SVG element reference
 * @returns Screen coordinate point
 */
export const pointToScreen = (point: Point, svg: SVGSVGElement): Point => {
  const svgPoint = svg.createSVGPoint();
  svgPoint.x = point.x;
  svgPoint.y = point.y;
  
  const screenPoint = svgPoint.matrixTransform(svg.getScreenCTM() || svg.createSVGMatrix());
  
  return {
    x: screenPoint.x,
    y: screenPoint.y
  };
};

/**
 * Convert screen coordinates to SVG coordinates (using Point object)
 * @param point - Screen coordinate point
 * @param svg - SVG element reference  
 * @returns SVG coordinate point
 */
export const pointToSvg = (point: Point, svg: SVGSVGElement): Point => {
  const svgPoint = svg.createSVGPoint();
  svgPoint.x = point.x;
  svgPoint.y = point.y;
  
  const matrix = svg.getScreenCTM();
  if (!matrix) return point;
  
  const transformedPoint = svgPoint.matrixTransform(matrix.inverse());
  
  return {
    x: transformedPoint.x,
    y: transformedPoint.y
  };
};

/**
 * Get the viewBox of an SVG element
 * @param svg - SVG element reference
 * @returns ViewBox object
 */
export const getSvgViewBox = (svg: SVGSVGElement): ViewBox => {
  // Check if SVG and viewBox exist
  if (!svg) {
    return { x: 0, y: 0, width: 1000, height: 600 };
  }
  
  if (!svg.viewBox || !svg.viewBox.baseVal) {
    // Fallback: try to get dimensions from width/height attributes or use defaults
    const width = svg?.width?.baseVal?.value || 1000;
    const height = svg?.height?.baseVal?.value || 600;
    
    return {
      x: 0,
      y: 0,
      width,
      height
    };
  }
  
  const viewBox = svg.viewBox.baseVal;
  
  return {
    x: viewBox.x || 0,
    y: viewBox.y || 0,
    width: viewBox.width || 1000,
    height: viewBox.height || 600
  };
};

/**
 * Check if a point is within the SVG bounds
 * @param point - Point to check
 * @param svg - SVG element reference
 * @returns True if point is within bounds
 */
export const isPointInSvg = (point: Point, svg: SVGSVGElement): boolean => {
  const viewBox = getSvgViewBox(svg);
  
  return (
    point.x >= viewBox.x &&
    point.x <= viewBox.x + viewBox.width &&
    point.y >= viewBox.y &&
    point.y <= viewBox.y + viewBox.height
  );
};

/**
 * Calculate distance between two points
 * @param point1 - First point
 * @param point2 - Second point
 * @returns Distance in pixels
 */
export const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Normalize coordinates to 0-1 range based on SVG viewBox
 * @param point - Point to normalize
 * @param svg - SVG element reference
 * @returns Normalized point
 */
export const normalizeCoordinates = (point: Point, svg: SVGSVGElement): Point => {
  const viewBox = getSvgViewBox(svg);
  
  return {
    x: (point.x - viewBox.x) / viewBox.width,
    y: (point.y - viewBox.y) / viewBox.height
  };
};

/**
 * Denormalize coordinates from 0-1 range to SVG coordinates
 * @param normalizedPoint - Normalized point
 * @param svg - SVG element reference
 * @returns SVG coordinate point
 */
export const denormalizeCoordinates = (normalizedPoint: Point, svg: SVGSVGElement): Point => {
  const viewBox = getSvgViewBox(svg);
  
  return {
    x: viewBox.x + (normalizedPoint.x * viewBox.width),
    y: viewBox.y + (normalizedPoint.y * viewBox.height)
  };
};

/**
 * Generate a unique ID for assets
 * @param prefix - Prefix for the ID
 * @returns Unique ID string
 */
export const generateAssetId = (prefix: string = 'asset'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Filter assets by various criteria (Repository style)
 * @param assets - Array of assets to filter
 * @param filters - Filter criteria
 * @returns Filtered assets array
 */
export const filterAssets = (
  assets: any[],
  filters: {
    type?: string;
    status?: string;
    searchTerm?: string;
  }
) => {
  return assets.filter(asset => {
    // Type filter
    if (filters.type && asset.type !== filters.type) {
      return false;
    }
    
    // Status filter (repository style: green/yellow/red)
    if (filters.status && asset.status !== filters.status) {
      return false;
    }
    
    // Search term filter (searches in asset ID, name, and description)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesId = asset.id?.toLowerCase().includes(searchLower);
      const matchesName = asset.name?.toLowerCase().includes(searchLower);
      const matchesDescription = asset.meta?.description?.toLowerCase().includes(searchLower);
      
      if (!matchesId && !matchesName && !matchesDescription) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Format date for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Get status color based on repository status system
 * @param status - Status string (green/yellow/red)
 * @returns Color hex code
 */
export const getStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    'green': '#10b981',
    'yellow': '#f59e0b', 
    'red': '#ef4444'
  };
  
  return statusColors[status] || '#6b7280';
};

/**
 * Get asset type icon
 * @param assetType - Asset type string
 * @returns Icon emoji or symbol
 */
export const getAssetTypeIcon = (assetType: string): string => {
  const typeIcons: { [key: string]: string } = {
    'smoke_detector': '🔍',
    'fire_extinguisher': '🧯',
    'sprinkler': '💧',
    'fire_alarm': '🚨',
    'fire_hydrant': '🚰'
  };
  
  return typeIcons[assetType] || '📦';
};

/**
 * Calculate optimal zoom level for asset visibility
 * @param containerWidth - Container width in pixels
 * @param containerHeight - Container height in pixels
 * @param svgWidth - SVG viewBox width
 * @param svgHeight - SVG viewBox height
 * @returns Optimal scale factor
 */
export const calculateOptimalZoom = (
  containerWidth: number,
  containerHeight: number,
  svgWidth: number,
  svgHeight: number
): number => {
  // Safety checks to prevent division by zero or invalid values
  if (!containerWidth || !containerHeight || !svgWidth || !svgHeight ||
      containerWidth <= 0 || containerHeight <= 0 || svgWidth <= 0 || svgHeight <= 0) {
    return 1; // Default scale
  }
  
  const scaleX = containerWidth / svgWidth;
  const scaleY = containerHeight / svgHeight;
  
  // Use the smaller scale to ensure the entire SVG fits
  const optimalScale = Math.min(scaleX, scaleY) * 0.9; // 0.9 for padding
  
  // Ensure the scale is within reasonable bounds
  return Math.max(0.1, Math.min(optimalScale, 10));
};

/**
 * Convert screen coordinates to SVG coordinates
 * @param clientX - Screen X coordinate (from mouse event)
 * @param clientY - Screen Y coordinate (from mouse event)  
 * @param svgElement - SVG element reference
 * @returns SVG coordinate point
 */
export const screenToSvg = (clientX: number, clientY: number, svgElement: SVGSVGElement): Point => {
  const pt = svgElement.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  
  const matrix = svgElement.getScreenCTM();
  if (!matrix) {
    console.warn('Could not get screen CTM from SVG element');
    return { x: clientX, y: clientY };
  }
  
  const svgPoint = pt.matrixTransform(matrix.inverse());
  return {
    x: svgPoint.x,
    y: svgPoint.y
  };
};

/**
 * Convert SVG coordinates to screen coordinates  
 * @param svgX - SVG X coordinate
 * @param svgY - SVG Y coordinate
 * @param svgElement - SVG element reference
 * @returns Screen coordinate point
 */
export const svgToScreen = (svgX: number, svgY: number, svgElement: SVGSVGElement): Point => {
  const pt = svgElement.createSVGPoint();
  pt.x = svgX;
  pt.y = svgY;
  
  const matrix = svgElement.getScreenCTM();
  if (!matrix) {
    console.warn('Could not get screen CTM from SVG element');
    return { x: svgX, y: svgY };
  }
  
  const screenPoint = pt.matrixTransform(matrix);
  return {
    x: screenPoint.x,
    y: screenPoint.y
  };
};

/**
 * Check if coordinates are within SVG bounds
 * @param point - Point to check
 * @param svgElement - SVG element reference
 * @returns True if point is within bounds
 */
export const isWithinSvgBounds = (point: Point, svgElement: SVGSVGElement): boolean => {
  const viewBox = getSvgViewBox(svgElement);
  
  return (
    point.x >= viewBox.x &&
    point.x <= viewBox.x + viewBox.width &&
    point.y >= viewBox.y &&
    point.y <= viewBox.y + viewBox.height
  );
};

/**
 * Clamp coordinates to SVG bounds
 * @param point - Point to clamp
 * @param svgElement - SVG element reference
 * @returns Clamped point within SVG bounds
 */
export const clampToSvgBounds = (point: Point, svgElement: SVGSVGElement): Point => {
  const viewBox = getSvgViewBox(svgElement);
  
  return {
    x: Math.max(viewBox.x, Math.min(point.x, viewBox.x + viewBox.width)),
    y: Math.max(viewBox.y, Math.min(point.y, viewBox.y + viewBox.height))
  };
};
