import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Assets() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/asset");
      setAssets(response.assets || []);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load assets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Warranty: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      AMC: "bg-green-500/10 text-green-700 border-green-500/20",
      "In-House": "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
      Deactive: "bg-red-500/10 text-red-700 border-red-500/20",
    };
    return (
      <Badge variant="outline" className={statusColors[status] || ""}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-1">
              Assets
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage assets in your system
            </p>
          </div>
          <Button onClick={() => navigate("/admin/assets/create")} size="lg">
            + Add Asset
          </Button>
        </div>
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/50">
                <TableHead className="font-semibold">Asset ID</TableHead>
                <TableHead className="font-semibold">Plant</TableHead>
                <TableHead className="font-semibold">Building</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <p className="text-muted-foreground">Loading assets...</p>
                  </TableCell>
                </TableRow>
              ) : assets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-96">
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <Package className="h-20 w-20 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-1">
                        No assets found
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create your first asset to get started
                      </p>
                      <Button onClick={() => navigate("/admin/assets/create")}>
                        + Create Asset
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">
                      {asset.assetId}
                    </TableCell>
                    <TableCell>{asset.plant?.plantName || "-"}</TableCell>
                    <TableCell>{asset.building || "-"}</TableCell>
                    <TableCell>{asset.category?.categoryName || "-"}</TableCell>
                    <TableCell>{asset.product?.productName || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {asset.location}
                    </TableCell>
                    <TableCell>{getStatusBadge(asset.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/assets/${asset.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/assets/${asset.id}/edit`)
                          }
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
