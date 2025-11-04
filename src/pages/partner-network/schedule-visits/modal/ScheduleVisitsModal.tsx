import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  // Assuming addToast is available or handled by a context/hook
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState, useCallback, useMemo } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import { PlanDetailsTab } from "./PlanDetailsTab";
import { ReviewSaveTab } from "./ReviewSaveTab";
import { SelectReferrersTab } from "./SelectReferrersTab";
import { Partner, RouteOptimizationResults } from "../../../../types/partner";
import { RoutePlanningTab } from "./RoutePlanning";

// --- State and Data Structures ---

// The desired final payload structure (modified to match state keys)
interface SchedulePlanPayload {
  isDraft: string;
  practices: string[]; // array of referrer IDs
  route: {
    routeDate: string;
    startTime: string;
    durationPerVisit: string;
    routeDetails: RouteOptimizationResults["bestRoute"] | {};
  };
  planDetails: {
    planName: string;
    defaultPriority: string;
    defaultVisitPurpose: string | { title: string; duration: string }; // Simplified for custom/predefined
    description: string;
  };
}

interface FilterState {
  search: string;
  category: string;
}

interface PlanDetailsOption {
  title: string;
  duration: string;
}

interface CategoryOption {
  _id: string;
  shortTitle: string;
}

// Initial state for all form data
const initialPlanState = {
  // Select Referrers State (handled separately by selectedReferrersState)

  // Route Planning State
  routeDate: "",
  startTime: "",
  durationPerVisit: "", // Used in RoutePlanningTab

  // Plan Details State
  planName: "",
  defaultPriority: "",
  defaultVisitPurpose: "", // Title of the purpose
  customVisitPurpose: "", // Only used if defaultVisitPurpose is 'Custom Purpose'
  description: "",
};

const purposeOptions: PlanDetailsOption[] = [
  { title: "Relationship Building", duration: "45 min duration" },
  // ... (rest of purpose options)
  { title: "Custom Purpose", duration: "Custom" },
];

const durationOptions: string[] = [
  "30 minutes",
  "45 minutes",
  "1 hour",
  "1.5 hours",
  "2 hours",
];

const categoryOptions: CategoryOption[] = [
  { _id: "General", shortTitle: "General Dentistry" },
  // ... (rest of category options)
];

// Mock API function
const createSchedulePlan = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Submitting Payload:", data);
      resolve({ success: true, payload: data });
    }, 1000);
  });
};

function useCreateSchedulePlan() {
  return useMutation({
    mutationFn: createSchedulePlan,
    onSuccess: (data) => {
      // Add success toast/handle closure here
    },
    onError: (error) => {
      // Add error toast here
    },
  });
}

// --- Component ---

export function ScheduleVisitsModal({
  isOpen,
  onClose,
  practices,
}: {
  isOpen: boolean;
  onClose: () => void;
  practices: Partner[];
}) {
  const [activeStep, setActiveStep] = useState<string>("select_referrers");
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
  });
  const [routeOptimizationResults, setRouteOptimizationResults] =
    useState<RouteOptimizationResults | null>(null);
  const [selectedReferrersState, setSelectedReferrersState] = useState<
    string[]
  >([]);

  // Central State Management
  const [planState, setPlanState] = useState(initialPlanState);
  const [validationErrors, setValidationErrors] = useState<any>({});

  const createPlanMutation = useCreateSchedulePlan();

  const handleStateChange = useCallback(
    (key: keyof typeof initialPlanState, value: any) => {
      setPlanState((prev) => ({ ...prev, [key]: value }));
      // Clear validation error for the field being updated
      setValidationErrors((prev: any) => ({ ...prev, [key]: null }));
    },
    []
  );

  const handleReferrerToggle = (id: string) => {
    setSelectedReferrersState((prev) => {
      const newState = prev.includes(id)
        ? prev.filter((refId) => refId !== id)
        : [...prev, id];
      // Clear validation error for selectedReferrers if one is selected
      if (newState.length > 0) {
        setValidationErrors((prev: any) => ({
          ...prev,
          selectedReferrers: null,
        }));
      }
      return newState;
    });
    setRouteOptimizationResults(null); // Reset route data if referrers change
  };

  const handleSelectAll = () => {
    const allIds = practices
      .filter(
        (r) =>
          r.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          (filters.category === "" || r.level === filters.category)
      )
      .map((r) => r._id);
    setSelectedReferrersState(allIds);
    setRouteOptimizationResults(null);
  };

  const handleClearAll = () => {
    setSelectedReferrersState([]);
    setRouteOptimizationResults(null);
  };

  const selectedReferrerObjects = useMemo(
    () => practices.filter((r) => selectedReferrersState.includes(r._id)),
    [practices, selectedReferrersState]
  );

  // --- Validation Logic (Manual) ---

  const validateStep = useCallback(
    (step: string): boolean => {
      let errors: any = {};
      let fieldsToValidate: (
        | keyof typeof initialPlanState
        | "selectedReferrers"
      )[] = [];

      if (step === "select_referrers") {
        if (selectedReferrersState.length === 0) {
          errors.selectedReferrers =
            "Select at least one referrer to continue.";
        }
      } else if (step === "route_planning") {
        fieldsToValidate = ["routeDate", "startTime", "durationPerVisit"];
      } else if (step === "plan_details") {
        fieldsToValidate = [
          "planName",
          "defaultVisitPurpose",
          "defaultPriority",
          // Note: durationPerVisit is also required for the plan
          "durationPerVisit",
        ];
        if (planState.defaultVisitPurpose === "Custom Purpose") {
          fieldsToValidate.push("customVisitPurpose");
        }
      }

      // Run field-level validation for route/plan details
      for (const field of fieldsToValidate) {
        const value = planState[field as keyof typeof initialPlanState];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors[field] = `${field} is required.`;
        }
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [planState, selectedReferrersState]
  );

  // --- Step Handlers ---

  const handleNext = async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    const currentTabIndex = tabs.findIndex((t) => t.key === activeStep);
    if (currentTabIndex < tabs.length - 1) {
      setActiveStep(tabs[currentTabIndex + 1]?.key as string);
    }
  };

  const handleBack = () => {
    const currentTabIndex = tabs.findIndex((t) => t.key === activeStep);
    if (currentTabIndex > 0) {
      setActiveStep(tabs[currentTabIndex - 1]?.key as string);
    }
  };

  // --- Submission ---

  const handleSubmit = () => {
    if (!validateStep("plan_details")) {
      return;
    }

    const finalVisitPurpose =
      planState.defaultVisitPurpose === "Custom Purpose"
        ? {
            title: planState.customVisitPurpose,
            duration: planState.durationPerVisit,
          }
        : purposeOptions.find(
            (p) => p.title === planState.defaultVisitPurpose
          ) || planState.defaultVisitPurpose;

    const payload: SchedulePlanPayload = {
      isDraft: "draft",
      practices: selectedReferrersState,
      route: {
        routeDate: planState.routeDate,
        startTime: planState.startTime,
        durationPerVisit: planState.durationPerVisit,
        routeDetails: routeOptimizationResults?.bestRoute || {},
      },
      planDetails: {
        planName: planState.planName,
        defaultPriority: planState.defaultPriority,
        defaultVisitPurpose: finalVisitPurpose,
        description: planState.description,
      },
    };

    createPlanMutation.mutate(payload, {
      onSuccess: () => {
        // Handle post-submit success (e.g., reset form, close modal)
        // addToast({ title: "Success", description: "Plan submitted!", variant: "success" });
        // onClose();
      },
      // Note: onError is handled in useCreateSchedulePlan
    });
  };

  const isSubmitting = createPlanMutation.isPending;
  const isSuccess = createPlanMutation.isSuccess;

  const tabs = [
    { key: "select_referrers", label: "Select Referrers" },
    { key: "route_planning", label: "Route Planning" },
    { key: "plan_details", label: "Plan Details" },
    { key: "review_save", label: "Review & Save" },
  ];
  const currentTabIndex = tabs.findIndex((t) => t.key === activeStep);

  console.log(routeOptimizationResults, "RESULTS");

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="4xl"
      classNames={{
        closeButton: "cursor-pointer",
      }}
      className="!my-4 !mx-2"
    >
      <ModalContent>
        <ModalHeader className="p-5 pb-4 flex-col">
          <h2 className="leading-none font-medium text-base">
            Schedule Referrer Visits
          </h2>
          <p className="text-xs text-gray-600 mt-1.5 font-normal">
            Create and manage visit schedules with optimized routes for maximum
            efficiency.
          </p>
          {isSuccess && (
            <Chip
              color="success"
              variant="flat"
              startContent={<FiCheckCircle />}
              className="mt-3 text-xs"
            >
              Plan submitted successfully!
            </Chip>
          )}
          {createPlanMutation.isError && (
            <Chip
              color="danger"
              variant="flat"
              startContent={<IoClose />}
              className="mt-3 text-xs"
            >
              Submission failed:{" "}
              {createPlanMutation.error?.message || "Check console"}
            </Chip>
          )}
        </ModalHeader>

        <ModalBody className="px-5 py-0 gap-0">
          <Tabs
            aria-label="Schedule Steps"
            selectedKey={activeStep}
            onSelectionChange={(key) => setActiveStep(key as string)}
            items={tabs}
            classNames={{
              tabList: "flex w-full rounded-full bg-primary/10",
              tab: "flex-1 px-4 py-1 text-sm font-medium transition-all",
              cursor: "rounded-full",
              panel: "p-0",
            }}
            className="w-full"
          >
            {(item) => <Tab key={item.key} title={item.label} />}
          </Tabs>

          <div className="pt-4 pb-4 relative overflow-hidden">
            <div
              className="transition-opacity duration-300"
              style={{
                display: activeStep === "select_referrers" ? "block" : "none",
              }}
            >
              <SelectReferrersTab
                filters={filters}
                setFilters={setFilters}
                selectedReferrersState={selectedReferrersState}
                handleReferrerToggle={handleReferrerToggle}
                handleSelectAll={handleSelectAll}
                handleClearAll={handleClearAll}
                practices={practices}
                categoryOptions={categoryOptions}
                // Display validation error if present
                error={validationErrors.selectedReferrers}
              />
            </div>

            <div
              className="transition-opacity duration-300"
              style={{
                display: activeStep === "route_planning" ? "block" : "none",
              }}
            >
              <RoutePlanningTab
                // Pass state and handler instead of formik
                planState={planState}
                onStateChange={handleStateChange}
                errors={validationErrors}
                selectedReferrerObjects={selectedReferrerObjects}
                durationOptions={durationOptions}
                // Placeholder removed, route generation is self-contained in tab
                onGenerateRoute={() => {}}
                routeOptimizationResults={routeOptimizationResults}
                setRouteOptimizationResults={setRouteOptimizationResults}
              />
            </div>

            <div
              className="transition-opacity duration-300"
              style={{
                display: activeStep === "plan_details" ? "block" : "none",
              }}
            >
              <PlanDetailsTab
                planState={planState}
                onStateChange={handleStateChange}
                errors={validationErrors}
                data={routeOptimizationResults?.bestRoute}
                selectedReferrerObjects={selectedReferrerObjects}
                purposeOptions={purposeOptions}
                durationOptions={durationOptions}
              />
            </div>

            <div
              className="transition-opacity duration-300"
              style={{
                display: activeStep === "review_save" ? "block" : "none",
              }}
            >
              {/* <ReviewSaveTab
                // Pass final data object
                planState={planState}
                selectedReferrerObjects={selectedReferrerObjects}
                routeOptimizationResults={routeOptimizationResults}
                // data={mockInitialData}
              /> */}
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-between px-5 py-3.5 border-t border-gray-200">
          {currentTabIndex > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onPress={handleBack}
              isDisabled={currentTabIndex === 0 || isSubmitting || isSuccess}
              className="border-small"
            >
              Back to {tabs[currentTabIndex - 1]?.label || ""}
            </Button>
          ) : (
            <p></p>
          )}

          <div className="flex space-x-3">
            {currentTabIndex < tabs.length - 1 ? (
              <Button
                color="primary"
                size="sm"
                onPress={handleNext}
                isDisabled={isSubmitting || isSuccess}
              >
                {tabs[currentTabIndex + 1]?.label}
              </Button>
            ) : (
              <Button
                color="primary"
                size="sm"
                onPress={handleSubmit} // Call local handleSubmit
                isLoading={isSubmitting}
                isDisabled={isSubmitting || isSuccess}
              >
                {isSuccess ? "Plan Saved" : "Save Plan"}
              </Button>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
