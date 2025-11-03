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
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import * as Yup from "yup";

import { PlanDetailsTab } from "./PlanDetailsTab";
import { ReviewSaveTab } from "./ReviewSaveTab";
import { SelectReferrersTab } from "./SelectReferrersTab";
import { Partner, RouteOptimizationResults } from "../../../../types/partner";
import { RoutePlanningTab } from "./RoutePlanning";

interface OptimizedRouteStop {
  id: string;
  name: string;
  address: string;
  arrive: string;
  depart: string;
  driveMin: number;
  miles: number;
}

interface MockInitialData {
  planName: string;
  description: string;
  month: string;
  visitDuration: string;
  defaultVisitPurpose: string;
  customVisitPurpose: string;
  defaultPriority: string;
  durationPerVisit: string;
  enableAutoRoute: boolean;
  selectedReferrers: string[];
  estimatedTotalTime: string;
  estimatedDistance: string;
  mileageCost: string;
  visitSchedule: {
    [date: string]: { visits: number; optimized: boolean };
  };
  optimizedRoute: OptimizedRouteStop[];
  routeDate: string;
  startTime: string;
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

const purposeOptions: PlanDetailsOption[] = [
  { title: "Relationship Building", duration: "45 min duration" },
  { title: "Lunch Meeting", duration: "90 min duration" },
  { title: "Case Consultation", duration: "60 min duration" },
  { title: "Education Seminar", duration: "120 min duration" },
  { title: "New Technology Demo", duration: "75 min duration" },
  { title: "Marketing Materials Delivery", duration: "30 min duration" },
  { title: "Feedback Session", duration: "60 min duration" },
  { title: "Staff Training", duration: "90 min duration" },
  { title: "Milestone Celebration", duration: "60 min duration" },
  { title: "Problem Solving", duration: "75 min duration" },
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
  { _id: "Orthodontics", shortTitle: "Orthodontics" },
  { _id: "Pediatric", shortTitle: "Pediatric Dentistry" },
];

const mockOptimizedRouteData: OptimizedRouteStop[] = [
  {
    id: "tfd",
    name: "Tulsa Family Dental",
    address: "1234 S Yale Ave, Tulsa, OK 74136",
    arrive: "9:00 AM",
    depart: "10:00 AM",
    driveMin: 0,
    miles: 0,
  },
  {
    id: "jdc",
    name: "Jenks Dental Care",
    address: "789 W Main St, Jenks, OK 74037",
    arrive: "10:20 AM",
    depart: "11:20 AM",
    driveMin: 20.7,
    miles: 3.6,
  },
  {
    id: "bsc",
    name: "Bixby Smile Center",
    address: "456 N Cabaniss Ave, Bixby, OK 74008",
    arrive: "11:41 AM",
    depart: "12:41 PM",
    driveMin: 20.9,
    miles: 4.8,
  },
];

const mockInitialData: MockInitialData = {
  planName: "October Visits",
  description: "Weekly referrer meetings",
  month: "October 2025",
  visitDuration: "45 minutes",
  defaultVisitPurpose: "Relationship Building",
  customVisitPurpose: "",
  defaultPriority: "Medium Priority",
  durationPerVisit: "1 hour",
  enableAutoRoute: true,
  selectedReferrers: ["tfd", "jdc", "bsc"],
  estimatedTotalTime: "4h 0m",
  estimatedDistance: "20.0mi",
  mileageCost: "$11",
  visitSchedule: {
    "2025-10-22": { visits: 2, optimized: true },
    "2025-10-23": { visits: 2, optimized: true },
  },
  optimizedRoute: mockOptimizedRouteData,
  routeDate: "",
  startTime: "09:00",
};

const validationSchema = Yup.object().shape({
  planName: Yup.string().required("Plan Name is required"),
  description: Yup.string(),
  month: Yup.string().required("Month is required"),
  defaultVisitPurpose: Yup.string().required("Visit Purpose is required"),
  customVisitPurpose: Yup.string().when("defaultVisitPurpose", {
    is: "Custom Purpose",
    then: (schema) => schema.required("Custom Purpose cannot be empty"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  defaultPriority: Yup.string().required("Default Priority is required"),
  durationPerVisit: Yup.string().required("Visit Duration is required"),
  enableAutoRoute: Yup.boolean(),
  selectedReferrers: Yup.array().min(
    1,
    "Select at least one referrer to continue."
  ),
  routeDate: Yup.string().required("Route Date is required"),
  startTime: Yup.string().required("Start Time is required"),
});

const createSchedulePlan = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, payload: data });
    }, 1000);
  });
};

function useCreateSchedulePlan() {
  return useMutation({
    mutationFn: createSchedulePlan,
    onSuccess: (data) => {},
    onError: (error) => {},
  });
}

export function ScheduleVisitsModal({
  isOpen,
  onClose,
  practices,
}: {
  isOpen: boolean;
  onClose: () => void;
  practices: Partner[];
}) {
  const [routeOptimizationResults, setRouteOptimizationResults] =
    useState<RouteOptimizationResults | null>(null);
  const [activeStep, setActiveStep] = useState<string>("select_referrers");
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
  });
  const [showRoutePreview, setShowRoutePreview] = useState<boolean>(false);

  const [selectedReferrersState, setSelectedReferrersState] = useState<
    string[]
  >([]);

  const createPlanMutation = useCreateSchedulePlan();

  const handleReferrerToggle = (id: string) => {
    setSelectedReferrersState((prev) =>
      prev.includes(id) ? prev.filter((refId) => refId !== id) : [...prev, id]
    );
    setShowRoutePreview(false);
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
    setShowRoutePreview(false);
  };

  const handleClearAll = () => {
    setSelectedReferrersState([]);
    setShowRoutePreview(false);
  };

  const selectedReferrerObjects = practices.filter((r) =>
    selectedReferrersState.includes(r._id)
  );

  const formik = useFormik({
    initialValues: mockInitialData,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const selectedPracticeIds = practices
        .filter((r) => selectedReferrersState.includes(r._id))
        .map((r) => r._id);

      const finalVisitPurposeTitle =
        values.defaultVisitPurpose === "Custom Purpose"
          ? values.customVisitPurpose
          : values.defaultVisitPurpose;

      const payload = {
        practices: selectedPracticeIds,
        planDetails: {
          planName: values.planName,
          defaultPriority: values.defaultPriority,
          durationPerVisit: values.durationPerVisit,
          defaultVisitPurpose: finalVisitPurposeTitle,
          description: values.description,
        },
        route: routeOptimizationResults?.bestRoute,
      };

      createPlanMutation.mutate(payload, {
        onSuccess: () => {},
      });
    },
  });

  const tabs = [
    { key: "select_referrers", label: "Select Referrers" },
    { key: "route_planning", label: "Route Planning" },
    { key: "plan_details", label: "Plan Details" },
    { key: "review_save", label: "Review & Save" },
  ];

  const currentTabIndex = tabs.findIndex((t) => t.key === activeStep);

  const handleNext = async () => {
    if (activeStep === "select_referrers") {
      if (selectedReferrersState.length === 0) {
        alert("Please select at least one referrer to continue.");
        return;
      }
      formik.setFieldValue("selectedReferrers", selectedReferrersState);
    }

    if (activeStep === "route_planning") {
      const errors = await formik.validateForm();
      const fieldsToValidate = ["routeDate", "startTime", "visitDuration"];

      let hasError = false;
      for (const field of fieldsToValidate) {
        if (errors[field as keyof typeof errors]) {
          formik.setTouched({ ...formik.touched, [field]: true });
          hasError = true;
        }
      }

      if (
        !formik.values.estimatedTotalTime ||
        formik.values.estimatedTotalTime === mockInitialData.estimatedTotalTime
      ) {
        alert("Please generate the route before proceeding.");
        hasError = true;
      }

      if (hasError) {
        return;
      }
    }

    if (activeStep === "plan_details") {
      const errors = await formik.validateForm();
      const fieldsToValidate = [
        "planName",
        "defaultVisitPurpose",
        "defaultPriority",
        "durationPerVisit",
      ];

      if (formik.values.defaultVisitPurpose === "Custom Purpose") {
        fieldsToValidate.push("customVisitPurpose");
      }

      let hasError = false;
      for (const field of fieldsToValidate) {
        if (errors[field as keyof typeof errors]) {
          formik.setTouched({ ...formik.touched, [field]: true });
          hasError = true;
        }
      }

      if (hasError) {
        return;
      }
    }

    if (currentTabIndex < tabs.length - 1) {
      setActiveStep(tabs[currentTabIndex + 1]?.key as string);
    }
  };

  const handleBack = () => {
    if (currentTabIndex > 0) {
      setActiveStep(tabs[currentTabIndex - 1]?.key as string);
    }
  };

  const handleGenerateRoute = () => {
    // This function is kept as a placeholder but the actual logic
    // for route generation and formik update should be inside RoutePlanningTab.
  };

  const isSubmitting = createPlanMutation.isPending || formik.isSubmitting;
  const isSuccess = createPlanMutation.isSuccess;

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
                showRoutePreview={showRoutePreview}
                setShowRoutePreview={setShowRoutePreview}
                practices={practices}
                categoryOptions={categoryOptions}
                mockOptimizedRouteData={mockOptimizedRouteData}
                data={mockInitialData}
              />
            </div>

            <div
              className="transition-opacity duration-300"
              style={{
                display: activeStep === "route_planning" ? "block" : "none",
              }}
            >
              <RoutePlanningTab
                formik={formik}
                selectedReferrerObjects={selectedReferrerObjects}
                durationOptions={durationOptions}
                onGenerateRoute={handleGenerateRoute}
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
                formik={formik}
                data={mockInitialData}
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
              <ReviewSaveTab
                formik={formik}
                data={mockInitialData}
                selectedReferrerObjects={selectedReferrerObjects}
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
                onPress={() => formik.handleSubmit()}
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
