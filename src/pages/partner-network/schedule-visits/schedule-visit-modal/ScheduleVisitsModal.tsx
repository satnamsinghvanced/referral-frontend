import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { PURPOSE_OPTIONS } from "../../../../consts/practice";
import {
  useCreateSchedulePlan,
  useUpdateSchedulePlan,
} from "../../../../hooks/usePartner";
import {
  Partner,
  RouteOptimizationResults,
  SaveSchedulePlanPayload,
  SchedulePlan,
  SchedulePlanPutRequest, // Import the necessary type for update
} from "../../../../types/partner";
import { PlanDetailsTab } from "./PlanDetailsTab";
import { ReviewSaveTab } from "./ReviewSaveTab";
import { RoutePlanningTab } from "./RoutePlanning";
import { SelectReferrersTab } from "./SelectReferrersTab";
import { FiSave } from "react-icons/fi";
import { IoChevronBack } from "react-icons/io5";
import { useTypedSelector } from "../../../../hooks/useTypedSelector";

interface FilterState {
  search: string;
  category: string;
}

const tabs = [
  { key: "select_referrers", label: "Select Referrers", index: 0 },
  { key: "route_planning", label: "Route Planning", index: 1 },
  { key: "plan_details", label: "Plan Details", index: 2 },
  { key: "review_save", label: "Review & Save", index: 3 },
];

export function ScheduleVisitsModal({
  isOpen,
  onClose,
  practices,
  editedData,
}: {
  isOpen: boolean;
  onClose: () => void;
  practices: Partner[];
  editedData?: SchedulePlan; // Made optional if used for creation
}) {
  const initialPlanState = {
    routeDate: new Date().toISOString(),
    startTime: "21:00",
    durationPerVisit: "30 minutes",
    planName: "",
    defaultPriority: "",
    defaultVisitPurpose: "",
    customVisitPurpose: "",
    description: "",
    enableAutoRoute: true,
    visitDays: "",
  };

  const isEditing = !!editedData?._id; // Check if we are editing an existing plan

  const [activeStep, setActiveStep] = useState<string>("select_referrers");
  const [clearedSteps, setClearedSteps] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
  });
  const [routeOptimizationResults, setRouteOptimizationResults] =
    useState<RouteOptimizationResults | null>(null);
  const [selectedReferrersState, setSelectedReferrersState] = useState<
    string[]
  >([]);

  const [planState, setPlanState] = useState(initialPlanState);
  const [validationErrors, setValidationErrors] = useState<any>({});

  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;

  useEffect(() => {
    setActiveStep("select_referrers");
    if (editedData) {
      // Ensure we extract IDs if practices are objects
      const practiceIds =
        editedData?.practices?.map((p: any) =>
          typeof p === "object" ? p._id : p,
        ) || [];
      setSelectedReferrersState(practiceIds);

      setPlanState({
        routeDate: editedData?.route.date || "",
        startTime: editedData?.route.startTime || "21:00",
        durationPerVisit: editedData?.route.durationPerVisit || "30 minutes",
        planName: editedData?.planDetails.name || "",
        defaultPriority: editedData?.planDetails.priority || "",
        defaultVisitPurpose: PURPOSE_OPTIONS.some(
          (p) => p.title === editedData.planDetails.visitPurpose.title,
        )
          ? editedData?.planDetails.visitPurpose.title
          : PURPOSE_OPTIONS[PURPOSE_OPTIONS.length - 1]?.title || "",
        customVisitPurpose:
          (editedData?.planDetails.visitPurpose.title &&
            !PURPOSE_OPTIONS.some(
              (p) => p.title === editedData.planDetails.visitPurpose.title,
            ) &&
            editedData.planDetails.visitPurpose.title) ||
          "",
        description: editedData?.planDetails.description || "",
        enableAutoRoute: true,
        visitDays: editedData?.route.visitDays || "",
      });
    } else {
      // Reset state if not editing
      setSelectedReferrersState([]);
      setPlanState(initialPlanState);
      setRouteOptimizationResults(null);
    }
  }, [editedData]);

  const createPlanMutation = useCreateSchedulePlan();
  const updatePlanMutation = useUpdateSchedulePlan(); // Utilize the imported hook

  const handleStateChange = useCallback(
    (key: string, value: string | boolean) => {
      setPlanState((prev) => ({ ...prev, [key]: value }));
      setValidationErrors((prev: any) => ({ ...prev, [key]: null }));
    },
    [],
  );

  const handleReferrerToggle = (id: string) => {
    setSelectedReferrersState((prev) => {
      const newState = prev.includes(id)
        ? prev.filter((refId) => refId !== id)
        : [...prev, id];
      if (newState.length > 0) {
        setValidationErrors((prev: any) => ({
          ...prev,
          selectedReferrers: null,
        }));
      }
      return newState;
    });
    setRouteOptimizationResults(null);
  };

  const handleSelectAll = () => {
    const allIds = practices
      .filter(
        (r) =>
          r.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          (filters.category === "" || r.level === filters.category),
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
    () => practices.filter((r) => selectedReferrersState?.includes(r._id)),
    [practices, selectedReferrersState],
  );

  const validateStep = useCallback(
    (step: string): boolean => {
      let errors: any = {};
      let fieldsToValidate: (
        | keyof typeof initialPlanState
        | "selectedReferrers"
      )[] = [];

      if (step === "select_referrers") {
        if (selectedReferrersState?.length < 1) {
          const errorMsg = "Please select at least one referrer to continue.";
          errors.selectedReferrers = errorMsg;
          addToast({
            title: "Error",
            description: errorMsg,
            color: "danger",
          });
        }
      } else if (step === "route_planning") {
        fieldsToValidate = ["routeDate", "startTime", "durationPerVisit"];
        if (!routeOptimizationResults?.optimized) {
          const errorMsg =
            "A route must be successfully generated before proceeding.";
          errors.routeOptimizationResults = errorMsg;
          addToast({
            title: "Route Error",
            description: errorMsg,
            color: "danger",
          });
        }
      } else if (step === "plan_details") {
        fieldsToValidate = [
          "planName",
          "defaultVisitPurpose",
          "defaultPriority",
        ];
        if (planState.defaultVisitPurpose === "Custom Purpose") {
          fieldsToValidate.push("customVisitPurpose");
        }
      } else if (step === "review_save") {
        if (!routeOptimizationResults?.optimized) {
          const errorMsg =
            "Route data is missing. Please return to Route Planning.";
          errors.routeOptimizationResults = errorMsg;
          addToast({
            title: "Error",
            description: errorMsg,
            color: "danger",
          });
        }
      }

      for (const field of fieldsToValidate) {
        const value = planState[field as keyof typeof initialPlanState];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          const fieldLabel =
            field === "routeDate"
              ? "Route date"
              : field === "startTime"
                ? "Start time"
                : field === "planName"
                  ? "Plan name"
                  : field === "defaultVisitPurpose"
                    ? "Visit purpose"
                    : field === "defaultPriority"
                      ? "Priority"
                      : field;

          const errorMsg = `${fieldLabel} is required.`;
          errors[field] = errorMsg;
        }
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [planState, selectedReferrersState, routeOptimizationResults],
  );

  const handleNext = async () => {
    const isValid = validateStep(activeStep);

    if (!isValid) {
      return;
    }

    setClearedSteps((prev) => new Set(prev).add(activeStep));
    setValidationErrors({});

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

  const handleSubmit = (action: string) => {
    if (!validateStep("select_referrers") || !validateStep("route_planning")) {
      return;
    }
    if (!validateStep("plan_details")) {
      addToast({
        title: "Error",
        description: "Please fill all required fields.",
        color: "danger",
      });
      return;
    }

    const finalVisitPurpose =
      planState.defaultVisitPurpose === "Custom Purpose"
        ? {
            title: planState.customVisitPurpose,
            duration: planState.durationPerVisit,
          }
        : PURPOSE_OPTIONS.find(
            (p) => p.title === planState.defaultVisitPurpose,
          ) || {
            title: planState.defaultVisitPurpose,
            duration: planState.durationPerVisit,
          };

    const bestRoute = routeOptimizationResults?.optimized;
    if (!bestRoute) {
      return;
    }

    // Prepare the common payload structure
    const basePayload: SaveSchedulePlanPayload = {
      practices: selectedReferrersState,
      route: {
        date: planState.routeDate,
        startTime: planState.startTime,
        durationPerVisit: planState.durationPerVisit,
        routeDetails: bestRoute.routeDetails as any,
        totalStops: bestRoute.totalStops,
        estimatedTotalTime: bestRoute.estimatedTotalTime,
        estimatedDistance: bestRoute.estimatedDistance,
        mileageCost: bestRoute.mileageCost,
        visitDays: bestRoute.visitDays, // Use visitDays from planState (or ensure bestRoute has it)
      },
      planDetails: {
        name: planState.planName,
        priority: planState.defaultPriority,
        visitPurpose: finalVisitPurpose,
        description: planState.description,
      },
    };

    const onSuccess = () => {
      setPlanState(initialPlanState);
      setActiveStep("select_referrers");
      setFilters({
        search: "",
        category: "",
      });
      setRouteOptimizationResults(null);
      setSelectedReferrersState([]);
      setValidationErrors({});
      onClose();
    };

    const onError = (error: any) => {
      addToast({
        title: "Submission Failed",
        description: error.message || "An unknown error occurred.",
        color: "danger",
      });
    };

    if (isEditing && editedData?._id) {
      // 🚀 UPDATE Logic
      const updatePayload: SchedulePlanPutRequest = {
        id: editedData._id,
        data: basePayload,
      };

      updatePlanMutation.mutate(updatePayload, { onSuccess, onError });
    } else {
      createPlanMutation.mutate(
        { id: userId || "", data: basePayload },
        { onSuccess, onError },
      );
    }
  };

  const isSubmitting =
    createPlanMutation.isPending || updatePlanMutation.isPending;
  const currentTabIndex = tabs.findIndex((t) => t.key === activeStep);
  const mutationSuccess = isEditing
    ? updatePlanMutation.isSuccess
    : createPlanMutation.isSuccess;
  const submitButtonText = isEditing ? "Update Plan" : "Save & Schedule Visit";
  const draftButtonText = isEditing ? "Save Draft" : "Save as Draft";

  function clearModalStates() {
    setActiveStep("select_referrers");
    setClearedSteps(new Set());
    setPlanState(initialPlanState);
    setRouteOptimizationResults(null);
    setSelectedReferrersState([]);
    setValidationErrors({});
  }

  function closeModal() {
    setActiveStep("select_referrers");
    if (!isEditing && !editedData?._id) {
      clearModalStates();
    }
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={closeModal}
      size="4xl"
      placement="center"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      scrollBehavior="inside"
    >
      <ModalContent className="max-h-[90vh] overflow-hidden p-0 w-full relative">
        <ModalHeader className="p-4 pb-3 flex-col">
          <h2 className="leading-none font-medium text-base">
            {isEditing
              ? "Edit Referrer Visit Schedule"
              : "Schedule Referrer Visit"}
          </h2>
          <p className="text-xs text-gray-600 dark:text-foreground/60 mt-1.5 font-normal">
            Create and manage visit schedules with optimized routes for maximum
            efficiency.
          </p>
        </ModalHeader>

        <ModalBody className="px-4 py-0 gap-3">
          <div className="">
            <Tabs
              aria-label="Schedule Steps"
              selectedKey={activeStep}
              onSelectionChange={(key) => {
                setActiveStep(key as string);
              }}
              items={tabs}
              variant="light"
              radius="full"
              classNames={{
                base: "bg-primary/15 dark:bg-background rounded-full p-1 w-full",
                tabList: "flex w-full rounded-full p-0 gap-0",
                tab: "flex-1 h-9 text-sm font-medium transition-all",
                cursor: "rounded-full bg-white dark:bg-primary",
                tabContent:
                  "dark:group-data-[selected=true]:text-primary-foreground text-default-500 dark:text-foreground/60 transition-colors",
              }}
              className="w-full"
            >
              {(item) => {
                // const itemIndex = tabs.findIndex((t) => t.key === item.key);
                // const isAhead = itemIndex < currentTabIndex;
                // const isNotCleared = !clearedSteps.has(item.key);
                // const isDisabled = isAhead && isNotCleared;
                return (
                  <Tab
                    key={item.key}
                    title={item.label}
                    // isDisabled={isDisabled}
                  />
                );
              }}
            </Tabs>
          </div>
          <div className="relative overflow-auto pb-4">
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
              />
            </div>

            <div
              className="transition-opacity duration-300 flex-1"
              style={{
                display: activeStep === "route_planning" ? "block" : "none",
              }}
            >
              <RoutePlanningTab
                planState={planState}
                onStateChange={handleStateChange}
                errors={validationErrors}
                selectedReferrerObjects={selectedReferrerObjects}
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
                data={
                  planState.enableAutoRoute
                    ? routeOptimizationResults?.optimized
                    : routeOptimizationResults?.original
                }
                selectedReferrerObjects={selectedReferrerObjects}
              />
            </div>

            <div
              className="transition-opacity duration-300"
              style={{
                display: activeStep === "review_save" ? "block" : "none",
              }}
            >
              <ReviewSaveTab
                planState={planState}
                selectedReferrerObjects={selectedReferrerObjects}
                routeOptimizationResults={routeOptimizationResults}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-between gap-3 px-4 py-3.5 border-t border-foreground/10 max-sm:flex-col max-sm:gap-2.5">
          {currentTabIndex > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onPress={handleBack}
              isDisabled={currentTabIndex === 0 || isSubmitting}
              className="border-small dark:text-foreground/80"
              startContent={<IoChevronBack className="text-sm max-sm:hidden" />}
            >
              Back to {tabs[currentTabIndex - 1]?.label || ""}
            </Button>
          ) : (
            ""
          )}

          <div className="flex space-x-3 max-sm:space-x-2">
            {currentTabIndex < tabs.length - 1 ? (
              <Button
                color="primary"
                size="sm"
                onPress={handleNext}
                isDisabled={isSubmitting}
                className="max-sm:w-full"
              >
                Next: {tabs[currentTabIndex + 1]?.label}
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => handleSubmit("draft")}
                  isDisabled={
                    isSubmitting || Object.keys(validationErrors).length > 0
                  }
                  className="border-small dark:text-foreground/80 max-sm:w-full"
                  startContent={<FiSave className="text-sm max-sm:hidden" />}
                >
                  {draftButtonText}
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  onPress={() => handleSubmit("submit")}
                  isDisabled={
                    isSubmitting || Object.keys(validationErrors).length > 0
                  }
                  isLoading={isSubmitting}
                  className="max-sm:w-full"
                >
                  {submitButtonText}
                </Button>
              </>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
