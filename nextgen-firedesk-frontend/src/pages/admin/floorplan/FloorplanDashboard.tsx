import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FloorplanDashboard() {
  const navigate = useNavigate();

  // Repository-style implementation: Direct redirect to single floorplan
  useEffect(() => {
    navigate('/admin/floorplans/manufacturing-facility');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-muted-foreground">Redirecting to floorplan viewer...</p>
      </div>
    </div>
  );
}
