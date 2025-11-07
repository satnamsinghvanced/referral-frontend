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
import { useCallback, useMemo, useState } from "react";

import { PURPOSE_OPTIONS } from "../../../../consts/practice";
import { useCreateSchedulePlan } from "../../../../hooks/usePartner";
import {
  Partner,
  RouteOptimizationResults,
  SaveSchedulePlanPayload,
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

const initialPlanState = {
  routeDate: "",
  startTime: "",
  durationPerVisit: "30 minutes",
  planName: "",
  defaultPriority: "",
  defaultVisitPurpose: "",
  customVisitPurpose: "",
  description: "",
  enableAutoRoute: true,
  visitDays: "",
};

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

  const [planState, setPlanState] = useState(initialPlanState);
  const [validationErrors, setValidationErrors] = useState<any>({});

  const { user } = useTypedSelector((state) => state.auth);
  const userId = user?.userId;

  const createPlanMutation = useCreateSchedulePlan();

  const handleStateChange = useCallback(
    (key: keyof typeof initialPlanState, value: any) => {
      setPlanState((prev) => ({ ...prev, [key]: value }));
      setValidationErrors((prev: any) => ({ ...prev, [key]: null }));
    },
    []
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

  const validateStep = useCallback(
    (step: string): boolean => {
      let errors: any = {};
      let fieldsToValidate: (
        | keyof typeof initialPlanState
        | "selectedReferrers"
      )[] = [];

      if (step === "select_referrers") {
        // if (selectedReferrersState.length === 0) {
        //   errors.selectedReferrers =
        //     "Select at least one referrer to continue.";
        // }
      } else if (step === "route_planning") {
        fieldsToValidate = ["routeDate", "startTime", "durationPerVisit"];
        if (!routeOptimizationResults?.bestRoute) {
          errors.routeOptimizationResults =
            "A route must be successfully generated before proceeding.";
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
        if (!routeOptimizationResults?.bestRoute) {
          errors.routeOptimizationResults =
            "Route data is missing. Please return to Route Planning.";
        }
      }

      for (const field of fieldsToValidate) {
        const value = planState[field as keyof typeof initialPlanState];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors[field] = `${
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
              : field
          } is required.`;
        }
      }

      return Object.keys(errors).length === 0;
    },
    [planState, selectedReferrersState, routeOptimizationResults]
  );

  const handleNext = async () => {
    const isValid = validateStep(activeStep);

    if (!isValid) {
      let errors: any = {};
      let fieldsToValidate: (
        | keyof typeof initialPlanState
        | "selectedReferrers"
      )[] = [];

      if (activeStep === "select_referrers") {
        // if (selectedReferrersState.length === 0)
        //   errors.selectedReferrers =
        //     "Select at least one referrer to continue.";
      } else if (activeStep === "route_planning") {
        fieldsToValidate = ["routeDate", "startTime", "durationPerVisit"];
        if (!routeOptimizationResults?.bestRoute)
          errors.routeOptimizationResults =
            "A route must be successfully generated before proceeding.";
      } else if (activeStep === "plan_details") {
        fieldsToValidate = [
          "planName",
          "defaultVisitPurpose",
          "defaultPriority",
        ];
        if (planState.defaultVisitPurpose === "Custom Purpose")
          fieldsToValidate.push("customVisitPurpose");
      }

      for (const field of fieldsToValidate) {
        const value = planState[field as keyof typeof initialPlanState];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors[field] = `${
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
              : field
          } is required.`;
        }
      }

      setValidationErrors(errors);
      return;
    }

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
    if (!validateStep("plan_details") || !validateStep("review_save")) {
      addToast({
        title: "Validation Failed",
        description: "Please check all required fields and route data.",
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
            (p) => p.title === planState.defaultVisitPurpose
          ) || {
            title: planState.defaultVisitPurpose,
            duration: planState.durationPerVisit,
          };

    const bestRoute = routeOptimizationResults?.bestRoute;
    if (!bestRoute) {
      addToast({
        title: "Error",
        description:
          "Cannot save: Route data is missing. Please regenerate the route.",
        color: "danger",
      });
      return;
    }

    const payload: SaveSchedulePlanPayload = {
      isDraft: action === "draft" ? true : false,
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
        visitDays: bestRoute.visitDays,
      },
      planDetails: {
        name: planState.planName,
        priority: planState.defaultPriority,
        visitPurpose: finalVisitPurpose,
        description: planState.description,
      },
    };

    createPlanMutation.mutate(
      { id: userId || "", data: payload },
      {
        onSuccess: () => {
          setPlanState(initialPlanState);
          setActiveStep("select_referrers");
          setFilters({
            search: "",
            category: "",
          });
          setRouteOptimizationResults(null);
          setSelectedReferrersState([]);
          setValidationErrors({});

          addToast({
            title: "Success",
            description: "Plan Scheduled!",
            color: "success",
          });
          onClose();
        },
        onError: (error) => {
          addToast({
            title: "Submission Failed",
            description: error.message || "An unknown error occurred.",
            color: "danger",
          });
        },
      }
    );
  };

  const isSubmitting = createPlanMutation.isPending;
  const currentTabIndex = tabs.findIndex((t) => t.key === activeStep);

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
        </ModalHeader>

        <ModalBody className="px-5 py-0 gap-0">
          <Tabs
            aria-label="Schedule Steps"
            selectedKey={activeStep}
            onSelectionChange={(key) => {
              setActiveStep(key as string);
            }}
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
              />
            </div>

            <div
              className="transition-opacity duration-300"
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
                data={routeOptimizationResults?.bestRoute}
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

        <ModalFooter className="flex justify-between px-5 py-3.5 border-t border-gray-200">
          {currentTabIndex > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onPress={handleBack}
              isDisabled={currentTabIndex === 0 || isSubmitting}
              className="border-small"
              startContent={<IoChevronBack className="text-sm" />}
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
                isDisabled={isSubmitting}
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
                  className="border-small"
                  startContent={<FiSave className="text-sm" />}
                >
                  {createPlanMutation.isSuccess ? "Saved" : "Save as Draft"}
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  onPress={() => handleSubmit("submit")}
                  isDisabled={
                    isSubmitting || Object.keys(validationErrors).length > 0
                  }
                  isLoading={isSubmitting}
                >
                  {createPlanMutation.isSuccess
                    ? "Visit Scheduled"
                    : "Save & Schedule Visit"}
                </Button>
              </>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
