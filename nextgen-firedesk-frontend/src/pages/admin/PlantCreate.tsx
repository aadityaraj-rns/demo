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
import { MessageSquare, ArrowLeft, MoreVertical } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import React from "react";

type MenuOption = {
  label: string;
  action: () => void;
};

type ThreeDotMenuProps = {
  options: MenuOption[];
};

const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({ options }) => {
  const [open, setOpen] = React.useState(false);

  const toggleMenu = () => setOpen(!open);
  const onClickOption = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleMenu}
        className="p-2 rounded hover:bg-gray-200"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="More options"
      >
        <MoreVertical size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white border rounded shadow-lg z-10">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => onClickOption(option.action)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Menu options mapping for all wizards
const menuOptionsMap: Record<string, MenuOption[]> = {
  "plant-info": [
    {
      label: "Edit Plant Details",
      action: () => console.log("Edit Plant Details"),
    },
    { label: "View History", action: () => console.log("View History") },
    { label: "Duplicate Plant", action: () => console.log("Duplicate Plant") },
    { label: "Archive Plant", action: () => console.log("Archive Plant") },
    { label: "Delete Plant", action: () => console.log("Delete Plant") },
    { label: "Refresh", action: () => console.log("Refresh Plant Info") },
    { label: "Export Info", action: () => console.log("Export Plant Info") },
    { label: "Print", action: () => console.log("Print Plant Info") },
  ],
  premises: [
    { label: "Edit Premises", action: () => console.log("Edit Premises") },
    {
      label: "Add New Premises",
      action: () => console.log("Add New Premises"),
    },
    { label: "Remove Premises", action: () => console.log("Remove Premises") },
    {
      label: "View Premises Map",
      action: () => console.log("View Premises Map"),
    },
    {
      label: "Export Premises Data",
      action: () => console.log("Export Premises Data"),
    },
    { label: "Refresh", action: () => console.log("Refresh Premises") },
    { label: "Assign Manager", action: () => console.log("Assign Manager") },
    { label: "Print", action: () => console.log("Print Premises") },
  ],
  "fire-safety": [
    {
      label: "Edit Fire Safety Plan",
      action: () => console.log("Edit Fire Safety Plan"),
    },
    {
      label: "Download Fire Safety Report",
      action: () => console.log("Download Fire Safety Report"),
    },
    {
      label: "Upload Safety Documents",
      action: () => console.log("Upload Safety Documents"),
    },
    {
      label: "Refresh Data",
      action: () => console.log("Refresh Fire Safety Data"),
    },
    {
      label: "Run Safety Audit",
      action: () => console.log("Run Safety Audit"),
    },
    { label: "View Incidents", action: () => console.log("View Incidents") },
    {
      label: "Export Report",
      action: () => console.log("Export Fire Safety Report"),
    },
    { label: "Notify Team", action: () => console.log("Notify Team") },
  ],
  compliance: [
    {
      label: "View Compliance Checklist",
      action: () => console.log("View Compliance Checklist"),
    },
    {
      label: "Upload Compliance Documents",
      action: () => console.log("Upload Compliance Documents"),
    },
    {
      label: "Generate Report",
      action: () => console.log("Generate Compliance Report"),
    },
    {
      label: "Download Certificates",
      action: () => console.log("Download Certificates"),
    },
    {
      label: "Refresh Data",
      action: () => console.log("Refresh Compliance Data"),
    },
    { label: "Assign Auditor", action: () => console.log("Assign Auditor") },
    { label: "Send Reminder", action: () => console.log("Send Reminder") },
    {
      label: "Archive Compliance",
      action: () => console.log("Archive Compliance"),
    },
  ],
  monitoring: [
    {
      label: "Start Monitoring",
      action: () => console.log("Start Monitoring"),
    },
    {
      label: "Pause Monitoring",
      action: () => console.log("Pause Monitoring"),
    },
    { label: "View Logs", action: () => console.log("View Logs") },
    {
      label: "Export Data",
      action: () => console.log("Export Monitoring Data"),
    },
    {
      label: "Reset Monitoring",
      action: () => console.log("Reset Monitoring"),
    },
    {
      label: "Configure Alerts",
      action: () => console.log("Configure Alerts"),
    },
    {
      label: "Refresh Status",
      action: () => console.log("Refresh Monitoring Status"),
    },
    { label: "Stop Monitoring", action: () => console.log("Stop Monitoring") },
  ],
  "layout-upload": [
    {
      label: "Upload Layout File",
      action: () => console.log("Upload Layout File"),
    },
    {
      label: "View Current Layout",
      action: () => console.log("View Current Layout"),
    },
    { label: "Delete Layout", action: () => console.log("Delete Layout") },
    { label: "Download Layout", action: () => console.log("Download Layout") },
    { label: "Refresh Layout", action: () => console.log("Refresh Layout") },
    { label: "Validate Layout", action: () => console.log("Validate Layout") },
    { label: "Export Layout", action: () => console.log("Export Layout") },
    { label: "Replace Layout", action: () => console.log("Replace Layout") },
  ],
  "scheduler-setup": [
    { label: "Edit Schedule", action: () => console.log("Edit Schedule") },
    {
      label: "Run Scheduler Now",
      action: () => console.log("Run Scheduler Now"),
    },
    { label: "Export Schedule", action: () => console.log("Export Schedule") },
    { label: "Import Schedule", action: () => console.log("Import Schedule") },
    { label: "Pause Scheduler", action: () => console.log("Pause Scheduler") },
    {
      label: "Resume Scheduler",
      action: () => console.log("Resume Scheduler"),
    },
    { label: "Delete Schedule", action: () => console.log("Delete Schedule") },
    {
      label: "View Scheduler Logs",
      action: () => console.log("View Scheduler Logs"),
    },
  ],
};

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

  // Fetch master data on mount and other hooks/functions ...

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [statesRes, industriesRes, managersRes, categoriesRes] =
          await Promise.all([
            api.get("/state"),
            api.get("/industry"),
            api.get("/manager"),
            api.get("/category"),
          ]);

        setMasterData({
          states: (statesRes as any)?.allState || [],
          cities: [], // Loaded on state selection
          industries: (industriesRes as any)?.allIndustry || [],
          managers: (managersRes as any)?.allManager || [],
          categories: (categoriesRes as any)?.allCategory || [],
        });
      } catch (error) {
        console.error("Failed to fetch master data:", error);
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

  const loadCitiesForState = async (stateId: string) => {
    try {
      const response = await api.get(`/city/stateId/${stateId}`);
      const cities = (response as any)?.cities || (response as any)?.allCity || [];
      setMasterData((prev: any) => ({ ...prev, cities }));
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const payload: any = { ...formData, status: 'Draft' };
      // normalize empty strings to null for numeric/date-like fields already handled in backend
      const res = await api.post('/plant', payload);
      toast({ title: 'Success', description: 'Plant saved as draft successfully!' });
      navigate('/admin/plants');
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to save draft', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    // advance wizard until final submission
    const currentIndex = steps.findIndex((s) => s.id === activeTab);
    const nextStep = steps.find((s, idx) => idx > currentIndex && !s.hidden);
    if (nextStep) {
      setActiveTab(nextStep.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // final submit
    setIsSaving(true);
    try {
      const payload: any = { ...formData, status: 'Active' };
      const res = await api.post('/plant', payload);
      toast({ title: 'Success', description: 'Plant created successfully!' });
      navigate('/admin/plants');
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to create plant', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/plants")}
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
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="flex justify-between items-center">
                  <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    {steps
                      .filter((s) => !s.hidden)
                      .map((step) => (
                        <TabsTrigger
                          key={step.id}
                          value={step.id}
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 py-3"
                        >
                          {step.label}
                        </TabsTrigger>
                      ))}
                  </TabsList>

                  {/* Three dot menu */}
                  <div className="ml-auto">
                    <ThreeDotMenu options={menuOptionsMap[activeTab] || []} />
                  </div>
                </div>

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
                  <FireSafetyStep
                    formData={formData}
                    setFormData={setFormData}
                  />
                </TabsContent>

                <TabsContent value="compliance" className="mt-0">
                  <ComplianceStep
                    formData={formData}
                    setFormData={setFormData}
                  />
                </TabsContent>

                <TabsContent value="monitoring" className="mt-0">
                  <MonitoringStep
                    formData={formData}
                    setFormData={setFormData}
                  />
                </TabsContent>

                <TabsContent value="layout-upload" className="mt-0">
                  <LayoutUploadStep
                    formData={formData}
                    setFormData={setFormData}
                  />
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
              </Tabs>

              {/* Action buttons */}
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
                  {isSaving
                    ? "Saving..."
                    : activeTab === "scheduler-setup"
                    ? "Submit"
                    : "Save & Continue"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
