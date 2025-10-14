import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MessageSquare } from "lucide-react";

interface ChecklistItem {
  id: string;
  description: string;
  response: boolean;
  notes: string;
}

type WizardStep = 'serviceInfo' | 'pumpStatus' | 'inspection' | 'maintenance' | 'testing' | 'review';

export const ServiceFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState<WizardStep>('serviceInfo');

  const [inspectionWeekly, setInspectionWeekly] = useState<ChecklistItem[]>([
    { id: "A1-1", description: "Intake air louvers in pump room appear operational.", response: false, notes: "" },
    { id: "A1-2", description: "Pump suction, discharge, and bypass valves are open.", response: false, notes: "" },
    { id: "A1-3", description: "No piping or hoses leak.", response: false, notes: "" },
    { id: "A1-4", description: "Fire pump leaking one drop of water per second at seals.", response: false, notes: "" },
    { id: "A1-5", description: "Suction line pressure is normal.", response: false, notes: "" },
    { id: "A1-6", description: "System line pressure is normal.", response: false, notes: "" },
    { id: "A1-7", description: "Wet pit suction screens are unobstructed and in place.", response: false, notes: "" },
    { id: "A1-8", description: "Water flow test valves are in the closed position.", response: false, notes: "" },
  ]);

  const [inspectionMonthly, setInspectionMonthly] = useState<ChecklistItem[]>([
    { id: "A2-1", description: "Remove battery corrosion; clean and dry battery case.", response: false, notes: "" },
    { id: "A2-2", description: "Check battery charger and charger rate.", response: false, notes: "" },
    { id: "A2-3", description: "Exercise isolating switch and circuit breaker.", response: false, notes: "" },
    { id: "A2-4", description: "Inspect, clean, and test circuit breakers.", response: false, notes: "" },
    { id: "A2-5", description: "Equalize charge in battery system.", response: false, notes: "" },
  ]);

  const [inspectionQuarterly, setInspectionQuarterly] = useState<ChecklistItem[]>([
    { id: "A3-1", description: "Check crankcase breather on diesel pump for proper operation.", response: false, notes: "" },
    { id: "A3-2", description: "Clean water strainer in cooling system for diesel fire pump.", response: false, notes: "" },
    { id: "A3-3", description: "Check exhaust system insulation for integrity.", response: false, notes: "" },
    { id: "A3-4", description: "Check exhaust system clearance to combustibles to prevent fire hazard.", response: false, notes: "" },
    { id: "A3-5", description: "Check battery terminals to ensure they are clean and tight.", response: false, notes: "" },
  ]);

  const [inspectionYearly, setInspectionYearly] = useState<ChecklistItem[]>([
    { id: "A4-1", description: "Suction line control valves are sealed open.", response: false, notes: "" },
    { id: "A4-2", description: "Discharge line control valves are sealed open.", response: false, notes: "" },
    { id: "A4-3", description: "Bypass line control valves are sealed open.", response: false, notes: "" },
    { id: "A4-4", description: "All control valves are accessible.", response: false, notes: "" },
    { id: "A4-5", description: "Suction reservoir is full.", response: false, notes: "" },
  ]);

  const [maintenanceQuarterly, setMaintenanceQuarterly] = useState<ChecklistItem[]>([
    { id: "B1-1", description: "Clean strainer.", response: false, notes: "" },
    { id: "B1-2", description: "Clean filter.", response: false, notes: "" },
    { id: "B1-3", description: "Clean dirt leg.", response: false, notes: "" },
    { id: "B1-4", description: "Clean crankcase breather.", response: false, notes: "" },
    { id: "B1-5", description: "Clean water strainer of cooling system.", response: false, notes: "" },
    { id: "B1-6", description: "Clean and tighten battery terminals.", response: false, notes: "" },
    { id: "B1-7", description: "Examine wire insulation for breaks, cracks, or chafing.", response: false, notes: "" },
  ]);

  const [maintenanceSemiAnnual, setMaintenanceSemiAnnual] = useState<ChecklistItem[]>([
    { id: "B2-1", description: "Test antifreeze level.", response: false, notes: "" },
    { id: "B2-2", description: "Inspect flexible exhaust section of diesel exhaust piping.", response: false, notes: "" },
    { id: "B2-3", description: "Clean boxes, panels, and cabinets.", response: false, notes: "" },
    { id: "B2-4", description: "Test all safeties and alarms for proper operation.", response: false, notes: "" },
  ]);

  const [maintenanceYearly, setMaintenanceYearly] = useState<ChecklistItem[]>([
    { id: "B3-1", description: "Lubricate pump bearings.", response: false, notes: "" },
    { id: "B3-2", description: "Lubricate coupling.", response: false, notes: "" },
    { id: "B3-3", description: "Lubricate right-angle gear drive.", response: false, notes: "" },
    { id: "B3-4", description: "Grease motor bearings.", response: false, notes: "" },
    { id: "B3-5", description: "Replace flexible hoses and connector.", response: false, notes: "" },
    { id: "B3-6", description: "Replace oil at 50 hours or annually.", response: false, notes: "" },
    { id: "B3-7", description: "Replace oil filter at 50 hours or annually.", response: false, notes: "" },
    { id: "B3-8", description: "Calibrate pressure switch settings.", response: false, notes: "" },
    { id: "B3-9", description: "Check accuracy of pressure sensors.", response: false, notes: "" },
    { id: "B3-10", description: "Clean pump room louvers.", response: false, notes: "" },
    { id: "B3-11", description: "Remove water and foreign material from diesel fuel tank.", response: false, notes: "" },
    { id: "B3-12", description: "Rod out the heat exchanger or cooling system.", response: false, notes: "" },
    { id: "B3-13", description: "Fire pump controller in service.", response: false, notes: "" },
    { id: "B3-14", description: "Jockey pump controller in service.", response: false, notes: "" },
  ]);

  const [testingWeekly, setTestingWeekly] = useState<ChecklistItem[]>([
    { id: "C1-1", description: "Operate electric fire pumps for 10 minutes monthly.", response: false, notes: "" },
    { id: "C1-2", description: "Operate diesel fire pump for 30 minutes weekly.", response: false, notes: "" },
    { id: "C1-3", description: "Check packing gland tightness (slight leak at no flow).", response: false, notes: "" },
  ]);

  const [testingMonthly, setTestingMonthly] = useState<ChecklistItem[]>([
    { id: "C2-1", description: "Exercise isolating switch and circuit breaker.", response: false, notes: "" },
    { id: "C2-2", description: "Test antifreeze to determine protection level.", response: false, notes: "" },
    { id: "C2-3", description: "Test batteries for specific gravity or state of charge.", response: false, notes: "" },
    { id: "C2-4", description: "Test circuit breakers and fuses for proper operation.", response: false, notes: "" },
  ]);

  const [testingYearly, setTestingYearly] = useState<ChecklistItem[]>([
    { id: "C3-1", description: "Operate manual starting means.", response: false, notes: "" },
    { id: "C3-2", description: "Operate safety devices and alarms.", response: false, notes: "" },
  ]);

  const updateChecklist = (
    section: ChecklistItem[],
    setSection: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    id: string,
    field: "response" | "notes",
    value: boolean | string
  ) => {
    setSection(
      section.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const renderChecklistTable = (
    title: string,
    checklist: ChecklistItem[],
    setChecklist: React.Dispatch<React.SetStateAction<ChecklistItem[]>>
  ) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SL No</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Done</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checklist.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={item.response}
                    onCheckedChange={(checked: boolean) =>
                      updateChecklist(
                        checklist,
                        setChecklist,
                        item.id,
                        "response",
                        checked
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={item.notes}
                    onChange={(e) =>
                      updateChecklist(
                        checklist,
                        setChecklist,
                        item.id,
                        "notes",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const nextStep = () => {
    const steps: WizardStep[] = ['serviceInfo', 'pumpStatus', 'inspection', 'maintenance', 'testing', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: WizardStep[] = ['serviceInfo', 'pumpStatus', 'inspection', 'maintenance', 'testing', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Submitting service report...');
  };

  return (
    <div className="p-8">
      {/* Header with Back button and History & Comments */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="text-sm hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MessageSquare className="h-4 w-4 mr-2" />
          History & Comments
        </Button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-6"></div>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-8">Pump Room Service Form - Service #{id}</h1>

      {/* Step Navigation */}
      <div className="flex items-center border-b border-gray-200 mb-6">
        <button 
          className={`text-sm font-medium pb-2 mr-8 ${
            currentStep === 'serviceInfo' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('serviceInfo')}
        >
          Service Information
        </button>
        <button 
          className={`text-sm font-medium pb-2 mr-8 ${
            currentStep === 'pumpStatus' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('pumpStatus')}
        >
          Pump Status
        </button>
        <button 
          className={`text-sm font-medium pb-2 mr-8 ${
            currentStep === 'inspection' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('inspection')}
        >
          Inspection
        </button>
        <button 
          className={`text-sm font-medium pb-2 mr-8 ${
            currentStep === 'maintenance' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('maintenance')}
        >
          Maintenance
        </button>
        <button 
          className={`text-sm font-medium pb-2 mr-8 ${
            currentStep === 'testing' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('testing')}
        >
          Testing
        </button>
        <button 
          className={`text-sm font-medium pb-2 ${
            currentStep === 'review' 
              ? 'text-orange-600 border-b-2 border-orange-500' 
              : 'text-gray-500'
          }`}
          onClick={() => setCurrentStep('review')}
        >
          Review & Submit
        </button>
      </div>

      {/* Form Content */}
      <div className="space-y-8">
        {/* Step 1: Service Information */}
        {currentStep === 'serviceInfo' && (
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input placeholder="Service Person Name" />
              <Input type="date" placeholder="Date of Service" />
              <Input placeholder="Company Name" />
              <Input placeholder="Report Number" />
              <Input placeholder="Asset ID" />
              <Input placeholder="Asset Location" />
              <Input placeholder="Asset Description" />
              <Input type="date" placeholder="Date of Previous Inspection" />
              <Input placeholder="Service Frequency" />
              <Input placeholder="Service Type (AMC)" />
              <Input type="date" placeholder="Date of Last Test" />
              <Input type="date" placeholder="Next Test Due On" />
            </CardContent>
          </Card>
        )}

        {/* Step 2: Pump Status */}
        {currentStep === 'pumpStatus' && (
          <Card>
            <CardHeader>
              <CardTitle>Pump Status & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input placeholder="Pump Type" />
              <div className="flex items-center space-x-2">
                <Label>Pump Status:</Label>
                <Checkbox id="status-auto" />
                <Label htmlFor="status-auto">AUTO</Label>
                <Checkbox id="status-manual" />
                <Label htmlFor="status-manual">MANUAL</Label>
                <Checkbox id="status-off" />
                <Label htmlFor="status-off">OFF</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Label>Pump Sequential:</Label>
                <Checkbox id="seq-start" />
                <Label htmlFor="seq-start">START</Label>
                <Checkbox id="seq-cutoff" />
                <Label htmlFor="seq-cutoff">CUTOFF</Label>
              </div>
              <Input placeholder="Suction Pressure Gauge Reading (Kgs)" />
              <div className="flex items-center space-x-2">
                <Label>Pressure Switch Condition:</Label>
                <Checkbox id="switch-open" />
                <Label htmlFor="switch-open">OPEN</Label>
                <Checkbox id="switch-close" />
                <Label htmlFor="switch-close">CLOSE</Label>
              </div>
              <Input placeholder="Discharge Pressure Gauge Reading (Kgs)" />
              <div className="flex items-center space-x-2">
                <Label>Diesel Level:</Label>
                <Checkbox id="diesel-full" />
                <Label htmlFor="diesel-full">FULL</Label>
                <Checkbox id="diesel-half" />
                <Label htmlFor="diesel-half">HALF</Label>
                <Checkbox id="diesel-refuel" />
                <Label htmlFor="diesel-refuel">NEED RE-FUEL</Label>
              </div>
              <Input placeholder="Battery Status Reading (Volts)" />
              <Input placeholder="Installation Date" />
              <div className="flex items-center space-x-2">
                <Label>Water Storage Level:</Label>
                <Checkbox id="water-full" />
                <Label htmlFor="water-full">FULL</Label>
                <Checkbox id="water-half" />
                <Label htmlFor="water-half">HALF</Label>
                <Checkbox id="water-refuel" />
                <Label htmlFor="water-refuel">NEED RE-FUEL</Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Inspection */}
        {currentStep === 'inspection' && (
          <div className="space-y-6">
            {renderChecklistTable("A.1. Standard Inspection Checklist - Weekly", inspectionWeekly, setInspectionWeekly)}
            {renderChecklistTable("A.2. Standard Inspection Checklist - Monthly", inspectionMonthly, setInspectionMonthly)}
            {renderChecklistTable("A.3. Standard Inspection Checklist - Quarterly", inspectionQuarterly, setInspectionQuarterly)}
            {renderChecklistTable("A.4. Standard Inspection Checklist - Yearly", inspectionYearly, setInspectionYearly)}
          </div>
        )}

        {/* Step 4: Maintenance */}
        {currentStep === 'maintenance' && (
          <div className="space-y-6">
            {renderChecklistTable("B.1. Maintenance - Quarterly", maintenanceQuarterly, setMaintenanceQuarterly)}
            {renderChecklistTable("B.2. Maintenance - Semi-Annual (diesel pumps only)", maintenanceSemiAnnual, setMaintenanceSemiAnnual)}
            {renderChecklistTable("B.3. Maintenance - Yearly", maintenanceYearly, setMaintenanceYearly)}
          </div>
        )}

        {/* Step 5: Testing */}
        {currentStep === 'testing' && (
          <div className="space-y-6">
            {renderChecklistTable("C.1. Testing - Weekly", testingWeekly, setTestingWeekly)}
            {renderChecklistTable("C.2. Testing - Monthly", testingMonthly, setTestingMonthly)}
            {renderChecklistTable("C.3. Testing - Yearly", testingYearly, setTestingYearly)}
          </div>
        )}

        {/* Step 6: Review & Submit */}
        {currentStep === 'review' && (
          <Card>
            <CardHeader>
              <CardTitle>Remarks & Approvals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Engineer's Remarks" />
              <Textarea placeholder="Manager's Remarks" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Manager Name" />
                <Input type="date" placeholder="Approval Date" />
              </div>
              <Input placeholder="Signature of Technician" />
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 pt-8 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 'serviceInfo'}
            className="min-w-[120px]"
          >
            Previous
          </Button>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="min-w-[120px]"
            >
              Save as Draft
            </Button>
            {currentStep === 'review' ? (
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-orange-500 hover:bg-orange-600 text-white min-w-[140px]"
              >
                Submit Service Report
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-orange-500 hover:bg-orange-600 text-white min-w-[140px]"
              >
                Save & Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};