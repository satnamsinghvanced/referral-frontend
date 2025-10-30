import {
  Button,
  Calendar,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
} from "@heroui/react";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiList } from "react-icons/fi";
import { GoLocation } from "react-icons/go";
import { IoClose, IoSearch } from "react-icons/io5";
import { RiPencilRulerLine } from "react-icons/ri";
import * as Yup from "yup";
import { categoryOptions } from "../../utils/filters"; // Assuming this utility exists
import { LuFilter } from "react-icons/lu";
import { FaRegMap } from "react-icons/fa";
import LevelChip from "../../components/chips/LevelChip";

// --- Mock Data ---
const mockReferrerList = [
  {
    id: "tfd",
    name: "Tulsa Family Dental",
    address: "1234 S Yale Ave, Tulsa, OK 74136",
    score: "A-Level",
    scoreValue: 95,
    referrals: 45,
    category: "General",
    phone: "(918) 555-0100",
  },
  {
    id: "jdc",
    name: "Jenks Dental Care",
    address: "789 W Main St, Jenks, OK 74037",
    score: "B-Level",
    scoreValue: 78,
    referrals: 28,
    category: "Orthodontics",
    phone: "(918) 555-0200",
  },
  {
    id: "bsc",
    name: "Bixby Smile Center",
    address: "456 N Cabaniss Ave, Bixby, OK 74008",
    score: "C-Level",
    scoreValue: 55,
    referrals: 12,
    category: "General",
    phone: "(918) 555-0300",
  },
  {
    id: "sfc",
    name: "South First Clinic",
    address: "100 S First St, Tulsa, OK 74103",
    score: "B-Level",
    scoreValue: 72,
    referrals: 35,
    category: "Pediatric",
    phone: "(918) 555-0400",
  },
];

const mockOptimizedRouteData = [
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

const mockInitialData = {
  planName: "First Plan",
  description: "This is the first trip of my plan.",
  month: "October 2025",
  defaultVisitPurpose: "Relationship Building",
  defaultPriority: "Medium Priority",
  durationPerVisit: "1 hour",
  enableAutoRoute: true,
  selectedReferrers: mockReferrerList.slice(0, 3).map((r) => r.id),
  estimatedTotalTime: "4 hours",
  estimatedDistance: "20 miles",
  mileageCost: "$11",
  visitSchedule: {
    "2025-10-22": { visits: 2, optimized: true },
    "2025-10-23": { visits: 2, optimized: true },
  },
  optimizedRoute: mockOptimizedRouteData,
};

// --- Validation Schema ---
const validationSchema = Yup.object().shape({
  planName: Yup.string().required("Plan Name is required"),
  description: Yup.string(),
  month: Yup.string().required("Month is required"),
  defaultVisitPurpose: Yup.string().required("Purpose is required"),
  defaultPriority: Yup.string().required("Priority is required"),
  durationPerVisit: Yup.string().required("Duration is required"),
  enableAutoRoute: Yup.boolean(),
  selectedReferrers: Yup.array().min(
    1,
    "Select at least one referrer to continue."
  ),
});

// --- Tab Content Renderer ---
const renderTabContent = (
  key: string,
  formik: any,
  data: any,
  setActiveStep: (step: string) => void,
  filters: any,
  setFilters: any,
  selectedReferrersState: string[],
  handleReferrerToggle: (id: string) => void,
  handleSelectAll: () => void,
  handleClearAll: () => void,
  showRoutePreview: boolean,
  setShowRoutePreview: (show: boolean) => void
) => {
  const filteredReferrers = mockReferrerList.filter(
    (r) =>
      r.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.category === "" || r.category === filters.category)
  );

  const selectedReferrerObjects = mockReferrerList.filter((r) =>
    selectedReferrersState.includes(r.id)
  );

  const routePreviewData = mockOptimizedRouteData;

  let estTotalTime = "0 hours";
  let estDistance = "0 miles";
  let mileageCost = "$0";

  const totalDriveTimeMinutes = routePreviewData.reduce(
    (sum, stop) => sum + stop.driveMin,
    0
  );
  const totalVisitTimeMinutes = selectedReferrerObjects.length * 60;
  const totalMinutes = Math.round(
    totalDriveTimeMinutes + totalVisitTimeMinutes
  );

  estTotalTime = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

  const totalMiles = routePreviewData.reduce(
    (sum, stop) => sum + stop.miles,
    0
  );
  estDistance = `${totalMiles.toFixed(1)}mi`;

  mileageCost = `$${Math.ceil(totalMiles * 0.56)}`;

  data.estimatedTotalTime = estTotalTime;
  data.estimatedDistance = estDistance;
  data.mileageCost = mileageCost;

  switch (key) {
    // --- 1. Select Referrers Tab ---
    case "select_referrers":
      return (
        <div className="space-y-3 h-full">
          {/* Search and Category Filters */}
          <div className="flex justify-between items-center text-sm gap-2.5 px-1">
            <Input
              placeholder="Search referrers..."
              size="sm"
              fullWidth
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              classNames={{
                inputWrapper: "border-none shadow-none bg-gray-100",
              }}
              startContent={<IoSearch className="text-gray-400 text-base" />}
            />
            <Select
              key="Categories"
              size="sm"
              radius="sm"
              aria-label="Categories"
              selectedKeys={[filters.category]}
              onSelectionChange={(keys: any) => {
                const category = Array.from(keys).join("") as string;
                setFilters({ ...filters, category });
              }}
              className="w-[220px]"
              classNames={{ value: "text-xs" }}
              startContent={<LuFilter className="text-gray-400 text-base" />}
            >
              <>
                <SelectItem key="" classNames={{ title: "text-xs" }}>
                  All Categories
                </SelectItem>
                {categoryOptions.map((opt: any) => (
                  <SelectItem key={opt._id} classNames={{ title: "text-xs" }}>
                    {opt.shortTitle}
                  </SelectItem>
                ))}
              </>
            </Select>
          </div>

          {/* Select/Clear All and Count */}
          <div className="flex justify-between items-center text-xs px-1">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="border-small"
                onPress={handleSelectAll}
              >
                Select All ({filteredReferrers.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="border-small"
                onPress={handleClearAll}
              >
                Clear All
              </Button>
            </div>
            <p className="">
              <span>{selectedReferrersState.length}</span> of{" "}
              {mockReferrerList.length} referrers selected
            </p>
          </div>

          {/* Selected Referrers Preview and Stats */}
          {selectedReferrersState.length > 0 && (
            <Card className="shadow-none border border-primary/15 bg-blue-50/50">
              <CardHeader className="flex items-center justify-between pb-0">
                <p className="font-medium text-sm">
                  Selected Referrers ({selectedReferrersState.length})
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="min-w-fit border-small"
                  onPress={() => setShowRoutePreview(!showRoutePreview)}
                  isDisabled={selectedReferrerObjects.length < 2}
                  startContent={<FaRegMap />}
                >
                  {showRoutePreview
                    ? "Hide Route Preview"
                    : "Show Route Preview"}
                </Button>
              </CardHeader>
              <CardBody className="py-3 px-4 space-y-3">
                {selectedReferrerObjects.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedReferrerObjects.map((r: any, index: number) => (
                      <div
                        key={r.id}
                        className="bg-background border border-primary/15 rounded-md p-2 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="min-h-[18px] min-w-[18px] size-[18px] rounded-full bg-primary text-white inline-flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          <div className="text-xs">
                            <p>{r.name}</p>
                            <p className="text-gray-600">{r.address}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          radius="sm"
                          isIconOnly
                          className="size-5 min-w-auto border-none"
                          onPress={() => handleReferrerToggle(r.id)}
                        >
                          <IoClose />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stats Bar */}
                <div className="flex justify-around items-center bg-background border border-primary/15 rounded-md p-3">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-primary">
                      {selectedReferrerObjects.length}
                    </p>
                    <p className="text-xs text-gray-600">Referrers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-primary">
                      {estTotalTime}
                    </p>
                    <p className="text-xs text-gray-600">Est. Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-primary">
                      {estDistance}
                    </p>
                    <p className="text-xs text-gray-600">Est. Miles</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-primary">
                      {mileageCost}
                    </p>
                    <p className="text-xs text-gray-600">Mileage Cost</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Route Preview Modal-like Card */}
          {showRoutePreview && selectedReferrerObjects.length >= 2 && (
            <Card className="shadow-none border border-primary/15 mt-4">
              <CardBody className="p-4 space-y-3">
                <p className="font-medium text-sm">Optimized Route Preview</p>
                <div className="">
                  {routePreviewData.map((stop, index) => (
                    <div key={stop.id} className="flex items-start space-x-3">
                      <div className="flex flex-col items-center">
                        <div className="size-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                        {index < routePreviewData.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-300"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{stop.name}</p>
                        <p className="text-xs text-gray-500">{stop.address}</p>
                        <div className="flex space-x-3 text-[11px] text-gray-600 mt-1">
                          <span>Arrive: {stop.arrive}</span>
                          <span>Depart: {stop.depart}</span>
                          {stop.miles > 0 && (
                            <>
                              <span>• {stop.driveMin.toFixed(1)}min drive</span>
                              <span>• {stop.miles.toFixed(1)}mi</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Referrer List */}
          <div className="space-y-3 max-h-80 overflow-y-auto p-1 pr-2">
            {filteredReferrers.map((r: any) => (
              <Card
                key={r.id}
                className={`border border-primary/15 shadow-none ${
                  selectedReferrersState.includes(r.id)
                    ? "outline-2 outline-primary"
                    : "outline-none"
                }`}
              >
                <CardBody className="p-3 flex justify-between items-center flex-row">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      isSelected={selectedReferrersState.includes(r.id)}
                      onValueChange={() => handleReferrerToggle(r.id)}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.address}</p>
                      <p className="text-xs text-gray-500">{r.phone}</p>
                    </div>
                  </div>
                  <LevelChip level={r.score.toLowerCase()} />
                </CardBody>
              </Card>
            ))}
            {filteredReferrers.length === 0 && (
              <p className="text-center text-gray-500 pt-5">
                No referrers match the current filters.
              </p>
            )}
          </div>
        </div>
      );

    // --- 2. Plan Details Tab ---
    case "plan_details":
      return (
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <Input
                name="planName"
                label="Plan Name *"
                placeholder="First Plan"
                size="sm"
                radius="sm"
                value={formik.values.planName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.planName && !!formik.errors.planName}
                errorMessage={formik.touched.planName && formik.errors.planName}
              />

              <Select
                name="defaultVisitPurpose"
                label="Default Visit Purpose"
                placeholder="Select purpose"
                size="sm"
                radius="sm"
                selectedKeys={[formik.values.defaultVisitPurpose]}
                onSelectionChange={(keys: any) =>
                  formik.setFieldValue(
                    "defaultVisitPurpose",
                    Array.from(keys).join("")
                  )
                }
                startContent={<GoLocation className="size-4 text-primary" />}
                classNames={{ trigger: "h-10" }}
              >
                <SelectItem key="Relationship Building">
                  Relationship Building
                </SelectItem>
                <SelectItem key="Marketing Drop">Marketing Drop</SelectItem>
              </Select>

              <Select
                name="defaultPriority"
                label="Default Priority"
                placeholder="Select priority"
                size="sm"
                radius="sm"
                selectedKeys={[formik.values.defaultPriority]}
                onSelectionChange={(keys: any) =>
                  formik.setFieldValue(
                    "defaultPriority",
                    Array.from(keys).join("")
                  )
                }
                startContent={
                  <RiPencilRulerLine className="size-4 text-primary" />
                }
                classNames={{ trigger: "h-10" }}
              >
                <SelectItem key="High Priority">High Priority</SelectItem>
                <SelectItem key="Medium Priority">Medium Priority</SelectItem>
                <SelectItem key="Low Priority">Low Priority</SelectItem>
              </Select>

              <Select
                name="durationPerVisit"
                label="Duration per Visit"
                placeholder="Select duration"
                size="sm"
                radius="sm"
                selectedKeys={[formik.values.durationPerVisit]}
                onSelectionChange={(keys: any) =>
                  formik.setFieldValue(
                    "durationPerVisit",
                    Array.from(keys).join("")
                  )
                }
                classNames={{ trigger: "h-10" }}
              >
                <SelectItem key="30 minutes">30 minutes</SelectItem>
                <SelectItem key="1 hour">1 hour</SelectItem>
              </Select>

              <Checkbox
                name="enableAutoRoute"
                isSelected={formik.values.enableAutoRoute}
                onValueChange={(checked: boolean) =>
                  formik.setFieldValue("enableAutoRoute", checked)
                }
                size="sm"
              >
                Enable automatic route optimization
              </Checkbox>
            </div>

            <div className="space-y-4">
              <Textarea
                name="description"
                label="Description"
                placeholder="This is the first trip of my plan."
                size="sm"
                radius="sm"
                minRows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <Card className="shadow-none border border-primary/15 bg-blue-50/20">
                <CardBody className="p-4 space-y-2">
                  <h5 className="font-semibold text-sm mb-1">Plan Summary</h5>
                  <div className="text-xs space-y-1">
                    <p className="flex justify-between">
                      <span>Selected Referrers:</span>{" "}
                      <strong>{selectedReferrerObjects.length}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Estimated Total Time:</span>{" "}
                      <strong>{data.estimatedTotalTime}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Estimated Distance:</span>{" "}
                      <strong>{data.estimatedDistance}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Mileage Cost (IRS Rate):</span>{" "}
                      <strong>{data.mileageCost}</strong>
                    </p>
                    <p className="pt-2 text-gray-500">
                      * Estimates based on 60min per visit and route
                      optimization
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </form>
      );

    // --- 3. Schedule Visits Tab (Calendar View) ---
    case "schedule_visits":
      const today = 29;

      const renderDay = (day: number) => {
        const dateKey = `2025-10-${day.toString().padStart(2, "0")}`;
        const schedule = data.visitSchedule[dateKey];
        const isWeekday =
          day >= 1 && day <= 31 && day % 7 !== 0 && day % 7 !== 1;
        const isSelected = day === today;

        return (
          <div
            key={day}
            className={`p-1 border border-gray-200 h-20 text-xs text-right transition-colors ${
              schedule
                ? "bg-blue-50/50 border-blue-400"
                : isSelected
                ? "border-2 border-blue-500"
                : isWeekday
                ? "hover:bg-gray-50 cursor-pointer"
                : "bg-gray-100/50 text-gray-400"
            }`}
          >
            <span className="font-semibold block">{day > 0 ? day : ""}</span>
            {schedule && (
              <div className="mt-1 space-y-1">
                <Chip
                  size="sm"
                  radius="sm"
                  className="bg-yellow-100 text-yellow-800 text-[10px] px-1 h-4"
                >
                  {schedule.visits} visits
                </Chip>
              </div>
            )}
          </div>
        );
      };

      return (
        <div className="space-y-4">
          <Card className="shadow-none border border-primary/15">
            <CardBody className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-semibold text-sm">First Plan</h5>
                <FiList className="size-4 text-gray-500" />
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Schedule visits for {formik.values.month} 2025
              </p>

              <Calendar
                calendarWidth={`100%`}
                className="w-full shadow-none p-0 pt-2 bg-background"
                aria-label="Date (Presets)"
                weekdayStyle="short"
                // topContent={
                //     <ButtonGroup
                //         fullWidth
                //         className="rounded-sm pb-2 pt-3 bg-background [&>button]:text-default-500 [&>button]:border-default-200/60"
                //         radius="full"
                //         size="sm"
                //         variant="bordered"
                //     >
                //         <Button onPress={() => setValue(now)}>Today</Button>
                //         <Button onPress={() => setValue(nextWeek)}>Next week</Button>
                //         <Button onPress={() => setValue(nextMonth)}>Next month</Button>
                //     </ButtonGroup>
                // }
                classNames={{
                  content: "w-full bg-transparent",
                  gridBody: "w-full",
                  base: "w-full",
                  gridBodyRow: "w-full",
                  cell: "w-full m-1",
                  grid: "w-full p-10 bg-background",
                  gridHeader: "w-full bg-background shadow-none",
                  gridHeaderRow: "pb-0",
                  header: "w-full", // september 2025
                  headerWrapper: "bg-background p-0 !text-foreground pb-2",
                  gridHeaderCell: "w-full",
                  cellButton:
                    "w-full h-[80px] border rounded-md border-foreground/10 flex justify-start items-start pt-2 pl-2",
                  prevButton:
                    "py-0.5 px-1 w-10 border-1 border-foreground/20 rounded-sm hover:bg-foreground/10",
                  nextButton:
                    "py-0.5 px-1 w-10 border-1 border-foreground/20 rounded-sm hover:bg-foreground/10",
                }}
                // focusedValue={value}
                nextButtonProps={{
                  variant: "bordered",
                }}
                prevButtonProps={{
                  variant: "bordered",
                }}

                // value={value!}
                // onChange={setValue}
                // onFocusChange={setValue}

                // bottomContent={
                //     <RadioGroup
                //         aria-label="Date precision"
                //         classNames={{
                //             base: "w-full pb-2",
                //             wrapper: "-my-2.5 py-2.5 px-3 gap-1 flex-nowrap w-full ",
                //         }}
                //         defaultValue="exact_dates"
                //         orientation="horizontal"
                //         className='w-full bg-background'
                //     >
                //         <CustomRadio value="exact_dates">Exact dates</CustomRadio>
                //         <CustomRadio value="1_day">1 day</CustomRadio>
                //         <CustomRadio value="2_days">2 days</CustomRadio>
                //         <CustomRadio value="3_days">3 days</CustomRadio>
                //         <CustomRadio value="7_days">7 days</CustomRadio>
                //         <CustomRadio value="14_days">14 days</CustomRadio>
                //     </RadioGroup>
                // }
              />

              <p className="text-center text-xs text-gray-500 mt-4">
                Click on weekdays to schedule visits. Weekend scheduling is
                disabled.
              </p>
            </CardBody>
          </Card>
        </div>
      );

    // --- 4. Review & Save Tab ---
    case "review_save":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <Card className="shadow-none border border-primary/15 bg-blue-100/50">
              <CardBody className="py-3">
                <p className="text-xl font-bold text-blue-800">
                  {selectedReferrerObjects.length}
                </p>
                <p className="text-xs text-blue-700">Referrers</p>
              </CardBody>
            </Card>
            <Card className="shadow-none border border-primary/15 bg-green-100/50">
              <CardBody className="py-3">
                <p className="text-xl font-bold text-green-800">2</p>
                <p className="text-xs text-green-700">Visit Days</p>
              </CardBody>
            </Card>
            <Card className="shadow-none border border-primary/15 bg-orange-100/50">
              <CardBody className="py-3">
                <p className="text-xl font-bold text-orange-800">
                  {data.estimatedTotalTime}
                </p>
                <p className="text-xs text-orange-700">Total Time</p>
              </CardBody>
            </Card>
            <Card className="shadow-none border border-primary/15 bg-purple-100/50">
              <CardBody className="py-3">
                <p className="text-xl font-bold text-purple-800">
                  {data.estimatedDistance}
                </p>
                <p className="text-xs text-purple-700">Distance</p>
              </CardBody>
            </Card>
          </div>

          <h5 className="font-semibold text-sm pt-2">Visit Schedule</h5>
          {Object.keys(data.visitSchedule).map((dateKey) => (
            <Card
              key={dateKey}
              className="shadow-none border border-primary/15"
            >
              <CardBody className="p-3 space-y-1">
                <div className="flex items-center space-x-2">
                  <h6 className="font-semibold text-sm">
                    {new Date(dateKey).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </h6>
                  <Chip
                    size="sm"
                    radius="sm"
                    variant="flat"
                    color="warning"
                    className="text-[10px] h-4"
                  >
                    medium
                  </Chip>
                  <Chip
                    size="sm"
                    radius="sm"
                    variant="flat"
                    color="success"
                    className="text-[10px] h-4"
                  >
                    Optimized
                  </Chip>
                </div>
                <p className="text-xs text-gray-600">
                  {data.defaultVisitPurpose}
                </p>
                <p className="text-xs text-gray-500">
                  2 offices &bull; 143.4387614264083min total &bull; 6.9mi
                  distance
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      );

    default:
      return (
        <div className="p-4 text-center text-gray-500">
          Tab Content Not Found
        </div>
      );
  }
};

// --- Main Modal Component ---

export function ScheduleVisitsModal({ isOpen, onClose }: any) {
  const [activeStep, setActiveStep] = useState("select_referrers");

  const [filters, setFilters] = useState({
    search: "",
    category: "",
  });
  const [showRoutePreview, setShowRoutePreview] = useState(false);

  const [selectedReferrersState, setSelectedReferrersState] = useState<
    string[]
  >(mockInitialData.selectedReferrers);

  const handleReferrerToggle = (id: string) => {
    setSelectedReferrersState((prev) =>
      prev.includes(id) ? prev.filter((refId) => refId !== id) : [...prev, id]
    );
    setShowRoutePreview(false);
  };

  const handleSelectAll = () => {
    const allIds = mockReferrerList.map((r) => r.id);
    setSelectedReferrersState(allIds);
    setShowRoutePreview(false);
  };

  const handleClearAll = () => {
    setSelectedReferrersState([]);
    setShowRoutePreview(false);
  };

  const formik = useFormik({
    initialValues: mockInitialData,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const finalValues = {
        ...values,
        selectedReferrers: selectedReferrersState,
      };
      console.log("Final Submission:", finalValues);
      alert("Plan Submitted: " + JSON.stringify(finalValues.planName));
      onClose();
    },
  });

  const tabs = [
    { key: "select_referrers", label: "Select Referrers" },
    { key: "plan_details", label: "Plan Details" },
    { key: "schedule_visits", label: "Schedule Visits" },
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

    if (activeStep === "plan_details") {
      const errors = await formik.validateForm();
      if (
        errors.planName ||
        errors.defaultVisitPurpose ||
        errors.durationPerVisit
      ) {
        formik.setTouched({
          planName: true,
          defaultVisitPurpose: true,
          durationPerVisit: true,
        });
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
            Create and manage monthly visit schedules with optimized routes for
            maximum efficiency.
          </p>
        </ModalHeader>

        <ModalBody className="px-5 py-0 max-h-[80vh] overflow-auto gap-0">
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
            className="w-full sticky top-0 z-20 bg-white pb-2.5"
          >
            {(item) => (
              <Tab key={item.key} title={item.label}>
                <div className="min-h-[450px] pt-2 pb-4">
                  {renderTabContent(
                    item.key,
                    formik,
                    mockInitialData,
                    setActiveStep,
                    filters,
                    setFilters,
                    selectedReferrersState,
                    handleReferrerToggle,
                    handleSelectAll,
                    handleClearAll,
                    showRoutePreview,
                    setShowRoutePreview
                  )}
                </div>
              </Tab>
            )}
          </Tabs>
        </ModalBody>

        <ModalFooter className="flex justify-between px-5 py-3.5 border-t border-gray-200">
          <Button
            variant="light"
            size="sm"
            onPress={handleBack}
            isDisabled={currentTabIndex === 0}
          >
            Back to{" "}
            {currentTabIndex === 0
              ? "Planning"
              : tabs[currentTabIndex - 1]?.label || ""}
          </Button>

          <div className="flex space-x-3">
            {currentTabIndex < tabs.length - 1 ? (
              <Button
                color="primary"
                size="sm"
                onPress={handleNext}
                isDisabled={formik.isSubmitting}
              >
                {tabs[currentTabIndex + 1]?.label}
              </Button>
            ) : (
              <Button
                color="primary"
                size="sm"
                onPress={() => formik.handleSubmit()}
                isLoading={formik.isSubmitting}
              >
                Save Plan
              </Button>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
