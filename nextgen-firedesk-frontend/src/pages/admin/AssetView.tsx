import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AssetView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAsset();
  }, [id]);
  const fetchAsset = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/asset/${id}`);
      if (response.success) setAsset(response.asset);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load asset details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading asset details...</p>
      </div>
    );
  }
  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground mb-4">Asset not found</p>
        <Button onClick={() => navigate("/admin/assets")}>
          Back to Assets
        </Button>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="px-8 pt-6 pb-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/assets")}
            className="px-2"
          >
            <ArrowLeft className="h-5 w-5 mr-1" /> Back to Assets
          </Button>
          <span className="text-2xl font-semibold">{asset.assetId}</span>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-auto">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Asset Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Asset ID
                  </p>
                  <p className="text-base mt-1">{asset.assetId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Plant
                  </p>
                  <p className="text-base mt-1">
                    {asset.plant?.plantName ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Building
                  </p>
                  <p className="text-base mt-1">{asset.building ?? "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Category
                  </p>
                  <p className="text-base mt-1">
                    {asset.category?.categoryName ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Product
                  </p>
                  <p className="text-base mt-1">
                    {asset.product?.productName ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Location
                  </p>
                  <p className="text-base mt-1">{asset.location ?? "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <p className="text-base mt-1">{asset.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Health Status
                  </p>
                  <p className="text-base mt-1">{asset.healthStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Technical Specifications
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Capacity
                  </p>
                  <p className="text-base mt-1">
                    {asset.capacity
                      ? `${asset.capacity} ${asset.capacityUnit || ""}`
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pressure Rating
                  </p>
                  <p className="text-base mt-1">
                    {asset.pressureRating
                      ? `${asset.pressureRating} ${asset.pressureUnit || ""}`
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Type
                  </p>
                  <p className="text-base mt-1">{asset.type ?? "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Sub Type
                  </p>
                  <p className="text-base mt-1">{asset.subType ?? "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Manufacturer Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Manufacturer Name
                  </p>
                  <p className="text-base mt-1">
                    {asset.manufacturerName ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Model
                  </p>
                  <p className="text-base mt-1">{asset.model ?? "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
