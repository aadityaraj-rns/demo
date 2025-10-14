import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function PlantCreate() {
  const navigate = useNavigate();
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

  // Fetch master data on component mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [statesRes, industriesRes, managersRes, categoriesRes] = await Promise.all([
          api.get('/state'),
          api.get('/industry'),
          api.get('/manager'),
          api.get('/category'),
        ]);

        setMasterData({
          states: (statesRes as any)?.allState || [],
          cities: [], // Will be loaded based on selected state
          industries: (industriesRes as any)?.allIndustry || [],
          managers: (managersRes as any)?.allManager || [],
          categories: (categoriesRes as any)?.allCategory || [],
        });
      } catch (error) {
        console.error('Failed to fetch master data:', error);
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
  }, [toast]);

  // Fetch cities when state is selected
  const loadCitiesForState = async (stateId: string) => {
    try {
      const response = await api.get(`/city?stateId=${stateId}`);
      const cities = (response as any)?.allCity || [];
      setMasterData((prev: any) => ({ ...prev, cities }));
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // Remove fields that don't exist in Plant model or are UI-only
      const { 
        orgName, 
        createdDate, 
        orgId,
        city,
        state,
        industry,
        manager,
        ...validPlantData 
      } = formData;
      
      // Clean up null/undefined values
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
      
      console.log('Saving draft with data:', plantData); // Debug log
      
      const response = await api.post('/plant', plantData);
      
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
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last step - save as active
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsSaving(true);
    try {
      // Remove fields that don't exist in Plant model or are UI-only
      const { 
        orgName, 
        createdDate, 
        orgId,
        city,
        state,
        industry,
        manager,
        ...validPlantData 
      } = formData;
      
      // Clean up null/undefined values
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
      
      console.log('Final submit with data:', plantData); // Debug log
      
      const response = await api.post('/plant', plantData);
      
      toast({
        title: "Success",
        description: "Plant created successfully!",
      });
      
      navigate('/admin/plants');
    } catch (error: any) {
      console.error('Failed to create plant:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create plant",
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
              <p className="text-muted-foreground">Loading form data...</p>
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

                  <TabsContent value="monitoring-log" className="mt-0">
                    <MonitoringLogStep />
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
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
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
                  {isSaving ? "Saving..." : activeTab === "scheduler-setup" ? "Submit" : "Save & Continue"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
