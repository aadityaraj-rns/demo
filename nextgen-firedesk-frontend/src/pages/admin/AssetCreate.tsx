import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetInfoStep } from "@/components/asset-creation-form/AssetInfoStep";
import { TechnicalSpecsStep } from "@/components/asset-creation-form/TechnicalSpecsStep";
import { ManufacturerStep } from "@/components/asset-creation-form/ManufacturerStep";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ASSET_TABS = [
  { value: "info", label: "Asset Info" },
  { value: "technical", label: "Technical Specs" },
  { value: "manufacturer", label: "Manufacturer" },
];

export default function AssetCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(ASSET_TABS[0].value);
  const [formData, setFormData] = useState({
    status: "Warranty",
    healthStatus: "Healthy",
  });
  const [masterData, setMasterData] = useState({
    plants: [],
    categories: [],
    products: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [plantsRes, categoriesRes, productsRes] = await Promise.all([
          api.get("/organisation/plant"),
          api.get("/category"),
          api.get("/product"),
        ]);
        setMasterData({
          plants: plantsRes?.plants || [],
          categories: categoriesRes?.allCategory || [],
          products: productsRes?.products || [],
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to load form data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchMasterData();
  }, []);

  const handleSubmit = async () => {
    if (
      !formData.plantId ||
      !formData.building ||
      !formData.productCategoryId ||
      !formData.productId ||
      !formData.location
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      await api.post("/asset", formData);
      toast({ title: "Success", description: "Asset created successfully!" });
      navigate("/admin/assets");
    } catch {
      toast({
        title: "Error",
        description: "Failed to create asset",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex-1 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/assets")}
            className="px-2"
          >
            <ArrowLeft className="h-5 w-5 mr-1" /> Back to Assets
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="flex border-b mb-6 bg-transparent w-full px-0"
            style={{ justifyContent: "flex-start" }} // force left alignment
          >
            {ASSET_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-sm py-3 px-5 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 rounded-none"
                style={{ marginLeft: 0 }} // override any left margin from libraries
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="info">
            <AssetInfoStep
              formData={formData}
              setFormData={setFormData}
              plants={masterData.plants}
              categories={masterData.categories}
              products={masterData.products}
            />
          </TabsContent>
          <TabsContent value="technical">
            <TechnicalSpecsStep formData={formData} setFormData={setFormData} />
          </TabsContent>
          <TabsContent value="manufacturer">
            <ManufacturerStep formData={formData} setFormData={setFormData} />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/assets")}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isSaving ? "Creating..." : "Create Asset"}
          </Button>
        </div>
      </div>
    </div>
  );
}
