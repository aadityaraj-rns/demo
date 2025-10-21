import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlantInfoStep } from "@/components/plant-creation-form/PlantInfoStep";
import { PremisesStep } from "@/components/plant-creation-form/PremisesStep";
import { FireSafetyStep } from "@/components/plant-creation-form/FireSafetyStep";
import { ComplianceStep } from "@/components/plant-creation-form/ComplianceStep";
import { MonitoringStep } from "@/components/plant-creation-form/MonitoringStep";
import { LayoutUploadStep } from "@/components/plant-creation-form/LayoutUploadStep";
import { MonitoringLogStep } from "@/components/plant-creation-form/MonitoringLogStep";
import { SchedulerSetupStep } from "@/components/plant-creation-form/SchedulerSetupStep";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: "plant-info", label: "Plant Info", number: 1 },
  { id: "premises", label: "Premises", number: 2 },
  { id: "fire-safety", label: "Fire Safety", number: 3 },
  { id: "compliance", label: "Compliance", number: 4 },
  { id: "monitoring", label: "Monitoring", number: 5 },
  { id: "layout-upload", label: "Layout Upload", number: 6 },
  { id: "monitoring-log", label: "Monitoring", number: 7, hidden: true },
  { id: "scheduler-setup", label: "Scheduler Setup", number: 7 },
];

export default function PlantEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("plant-info");
  const [formData, setFormData] = useState<any>({});
  const [masterData, setMasterData] = useState<any>({
    states: [],
    cities: [],
    industries: [],
    managers: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch master data and plant data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch master data
        const [statesRes, industriesRes, managersRes, categoriesRes] = await Promise.all([
          api.get('/state/active'),
          api.get('/industry/active'),
          api.get('/manager/active'),
          api.get('/category/active'),
        ]);

        console.log('=== MASTER DATA LOADED ===');
        console.log('Managers Response:', managersRes);
        console.log('Managers Array:', (managersRes as any)?.allManager);

        setMasterData({
          states: (statesRes as any)?.allState || (statesRes as any)?.states || [],
          cities: [], // Will be loaded based on selected state
          industries: (industriesRes as any)?.allIndustry || (industriesRes as any)?.industries || [],
          managers: (managersRes as any)?.allManager || (managersRes as any)?.managers || [],
          categories: (categoriesRes as any)?.allCategory || (categoriesRes as any)?.categories || [],
        });

        console.log('Loaded managers:', (managersRes as any)?.allManager);

        // Fetch plant data
        const plantRes = await api.get(`/organisation/plant/${id}`);
        const plant = (plantRes as any)?.plant;
        
        console.log('Fetched plant data:', plant);
        
        if (plant) {
          // Clean the plant data - convert null to empty string for string fields
          // BUT preserve 0 for numeric fields and keep null for IDs
          const cleanedPlant: any = {};
          Object.keys(plant).forEach(key => {
            const value = plant[key];
            // Keep null for foreign key IDs (for dropdowns to work)
            if (value === null) {
              if (key.endsWith('Id') || key === 'managerId') {
                cleanedPlant[key] = null; // Keep as null for dropdowns
              } else {
                cleanedPlant[key] = ''; // Convert to empty string for text fields
              }
            } else if (value === 0) {
              cleanedPlant[key] = 0; // Preserve 0 for numeric fields
            } else {
              cleanedPlant[key] = value; // Keep all other values as-is
            }
          });
          
          console.log('Cleaned plant data:', cleanedPlant);
          console.log('Premises data:', {
            mainBuildings: cleanedPlant.mainBuildings,
            subBuildings: cleanedPlant.subBuildings,
            totalPlantArea: cleanedPlant.totalPlantArea,
            totalBuildUpArea: cleanedPlant.totalBuildUpArea
          });
          
          setFormData(cleanedPlant);
          
          // Load cities for the plant's state
          if (plant.stateId) {
            const citiesRes = await api.get(`/city/active/stateId/${plant.stateId}`);
            const cities = (citiesRes as any)?.allCity || (citiesRes as any)?.cities || [];
            setMasterData((prev: any) => ({ ...prev, cities }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({
          title: "Error",
          description: "Failed to load plant data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  // Fetch cities when state is selected
  const loadCitiesForState = async (stateId: string) => {
    try {
      const response = await api.get(`/city/active/stateId/${stateId}`);
      const cities = (response as any)?.allCity || (response as any)?.cities || [];
      setMasterData((prev: any) => ({ ...prev, cities }));
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const { 
        orgName, 
        createdDate, 
        orgId,
        city,
        state,
        industry,
        manager,
        plantId,
        orgUserId,
        createdAt,
        updatedAt,
        ...validPlantData 
      } = formData;
      
      // Clean up null/undefined values - convert to empty strings or remove
      // For ENUM and NUMERIC fields, empty strings must be converted to null
      const numericFields = [
        'headerPressure', 'mainWaterStorage', 'primeWaterTankStorage', 
        'dieselStorage', 'primeOverTankCapacity2', 'staircaseFireRating',
        'numberOfBasements', 'numberOfFloors', 'builtUpArea', 'plotArea'
      ];
      const enumFields = ['pressureUnit'];
      
      const cleanData: any = {};
      Object.keys(validPlantData).forEach(key => {
        const value = validPlantData[key];
        if (value !== null && value !== undefined) {
          // Convert empty strings to null for numeric and enum fields
          if (value === '' && (numericFields.includes(key) || enumFields.includes(key))) {
            cleanData[key] = null;
          } else if (value !== '') {
            // Only include non-empty values
            cleanData[key] = value;
          }
        }
      });
      
      const plantData = {
        ...cleanData,
        status: 'Draft'
      };
      
      console.log('Saving draft with cleaned data:', plantData);
      
      const response = await api.put(`/organisation/plant/${id}`, plantData);
      
      toast({
        title: "Success",
        description: "Plant saved as draft successfully!",
      });
      
      navigate('/admin/plants');
    } catch (error: any) {
      console.error('Failed to save draft:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save plant as draft",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndContinue = () => {
    const currentIndex = steps.findIndex(s => s.id === activeTab);
    const nextStep = steps.find((s, idx) => idx > currentIndex && !s.hidden);
    
    if (nextStep) {
      setActiveTab(nextStep.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsSaving(true);
    try {
      const { 
        orgName, 
        createdDate, 
        orgId,
        city,
        state,
        industry,
        manager,
        plantId,
        orgUserId,
        createdAt,
        updatedAt,
        ...validPlantData 
      } = formData;
      
      // Clean up null/undefined values - convert to empty strings or remove
      // For ENUM and NUMERIC fields, empty strings must be converted to null
      const numericFields = [
        'headerPressure', 'mainWaterStorage', 'primeWaterTankStorage', 
        'dieselStorage', 'primeOverTankCapacity2', 'staircaseFireRating',
        'numberOfBasements', 'numberOfFloors', 'builtUpArea', 'plotArea'
      ];
      const enumFields = ['pressureUnit'];
      
      const cleanData: any = {};
      Object.keys(validPlantData).forEach(key => {
        const value = validPlantData[key];
        if (value !== null && value !== undefined) {
          // Convert empty strings to null for numeric and enum fields
          if (value === '' && (numericFields.includes(key) || enumFields.includes(key))) {
            cleanData[key] = null;
          } else if (value !== '') {
            // Only include non-empty values
            cleanData[key] = value;
          }
        }
      });
      
      const plantData = {
        ...cleanData,
        status: 'Active'
      };
      
      console.log('Final submit with cleaned data:', plantData);
      
      console.log('Sending UPDATE request to:', `/organisation/plant/${id}`);
      console.log('With data:', plantData);
      
      const response = await api.put(`/organisation/plant/${id}`, plantData);
      
      console.log('Update response:', response);
      
      toast({
        title: "Success",
        description: "Plant updated successfully!",
      });
      
      navigate('/admin/plants');
    } catch (error: any) {
      console.error('Failed to update plant:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update plant",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin/plants')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Plants
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageSquare className="h-4 w-4 mr-2" />
              History & Comments
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading plant data...</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  {steps.filter(s => !s.hidden).map((step) => (
                    <TabsTrigger
                      key={step.id}
                      value={step.id}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 py-3"
                    >
                      {step.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="plant-info" className="mt-0">
                    <PlantInfoStep
                      formData={formData}
                      setFormData={setFormData}
                      masterData={masterData}
                      onStateChange={loadCitiesForState}
                    />
                  </TabsContent>

                  <TabsContent value="premises" className="mt-0">
                    <PremisesStep formData={formData} setFormData={setFormData} />
                  </TabsContent>

                  <TabsContent value="fire-safety" className="mt-0">
                    <FireSafetyStep formData={formData} setFormData={setFormData} />
                  </TabsContent>

                  <TabsContent value="compliance" className="mt-0">
                    <ComplianceStep formData={formData} setFormData={setFormData} />
                  </TabsContent>

                  <TabsContent value="monitoring" className="mt-0">
                    <MonitoringStep formData={formData} setFormData={setFormData} />
                  </TabsContent>

                  <TabsContent value="layout-upload" className="mt-0">
                    <LayoutUploadStep formData={formData} setFormData={setFormData} />
                  </TabsContent>

                  <TabsContent value="scheduler-setup" className="mt-0">
                    <SchedulerSetupStep 
                      formData={formData} 
                      setFormData={setFormData}
                      categories={masterData.categories}
                    />
                  </TabsContent>
                </div>
              </Tabs>

              {/* Action Buttons */}
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/plants')}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handleSaveAndContinue}
                    disabled={isSaving}
                  >
                    {activeTab === "scheduler-setup" ? "Update Plant" : "Save & Continue"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
