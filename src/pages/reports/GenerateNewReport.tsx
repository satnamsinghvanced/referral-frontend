import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  DatePicker,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  LuActivity,
  LuChartColumn,
  LuDownload,
  LuFileText,
  LuMessageSquare,
  LuPhone,
  LuStar,
  LuTrendingUp,
  LuUsers,
} from "react-icons/lu";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  CATEGORIES,
  FORMATS,
  TIME_RANGES,
  FREQUENCIES,
} from "../../consts/reports";
import { useGenerateReport } from "../../hooks/useReports";
import {
  ReportCategory,
  ReportFormat,
  ReportTimeRange,
  ReportFrequency,
} from "../../types/reports";
import { formatCalendarDate } from "../../utils/formatCalendarDate";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  referralAnalytics: <LuUsers className="h-4 w-4 text-blue-600" />,
  marketingBudget: <LuTrendingUp className="h-4 w-4 text-green-600" />,
  socialMediaAnalytics: <LuMessageSquare className="h-4 w-4 text-purple-600" />,
  reviewAnalytics: <LuStar className="h-4 w-4 text-orange-600" />,
  communicationAnalytics: <LuPhone className="h-4 w-4 text-red-600" />,
};

const FORMAT_ICONS: Record<string, React.ReactNode> = {
  pdf: <LuFileText className="h-4 w-4" />,
  excel: <LuChartColumn className="h-4 w-4" />,
  csv: <LuFileText className="h-4 w-4" />,
};

interface ReportFormState {
  name: string;
  category: ReportCategory;
  timeRange: ReportTimeRange;
  startDate?: string;
  endDate?: string;
  format: ReportFormat;
  schedule: boolean;
  frequency: ReportFrequency;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  practice: any | null;
}

const GenerateNewReportModal = ({
  isOpen,
  onClose,
  practice,
}: ReportModalProps) => {
  const localTimeZone = getLocalTimeZone();
  const [formData, setFormData] = useState<ReportFormState>({
    name: "",
    category: "referralAnalytics",
    timeRange: "30days",
    format: "pdf",
    schedule: false,
    frequency: "monthly",
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        category: "referralAnalytics",
        timeRange: "30days",
        format: "pdf",
        schedule: false,
        frequency: "monthly",
      });
    }
  }, [isOpen]);

  const { mutate: generateReport, isPending } = useGenerateReport();

  const isFormValid =
    formData.name &&
    formData.category &&
    formData.timeRange &&
    formData.format &&
    (formData.timeRange !== "custom" ||
      (formData.startDate && formData.endDate));

  const handleChange = (
    name: keyof ReportFormState,
    value: string | boolean | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = async () => {
    if (!isFormValid) return;

    generateReport(formData, {
      onSuccess: () => {
        onClose();
        setFormData({
          name: "",
          category: "referralAnalytics",
          timeRange: "30days",
          format: "pdf",
          schedule: false,
          frequency: "monthly",
        });
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 p-4">
          <h2 className="text-base font-medium">
            Generate New Marketing Report
          </h2>
          <p className="text-gray-500 dark:text-foreground/60 font-normal text-xs">
            Create a custom report with specific metrics, time ranges, and
            export formats
          </p>
        </ModalHeader>

        <ModalBody className="gap-5 py-0 px-4 overflow-visible">
          <div>
            <Input
              size="sm"
              radius="sm"
              label="Report Name"
              labelPlacement="outside"
              placeholder="e.g., Q1 2024 Marketing ROI Analysis"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              isRequired
              className="mt-2"
            />
          </div>

          <div>
            <Select
              size="sm"
              radius="sm"
              label="Report Category"
              labelPlacement="outside"
              selectedKeys={[formData.category]}
              disabledKeys={[formData.category]}
              onSelectionChange={(keys) =>
                handleChange("category", keys.currentKey as string)
              }
              isRequired
              renderValue={(items) => {
                const item = items[0];
                if (!item) return null;
                return (
                  <div className="flex items-center gap-2">
                    {CATEGORY_ICONS[item.key as string]}
                    {item.rendered}
                  </div>
                );
              }}
            >
              {CATEGORIES.map((cat) => (
                <SelectItem
                  key={cat.key}
                  startContent={CATEGORY_ICONS[cat.key]}
                >
                  {cat.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="space-y-5">
            <Select
              size="sm"
              radius="sm"
              label="Time Range"
              labelPlacement="outside"
              selectedKeys={[formData.timeRange]}
              disabledKeys={[formData.timeRange]}
              isRequired
              onSelectionChange={(keys) =>
                handleChange("timeRange", keys.currentKey as string)
              }
            >
              {TIME_RANGES.map((range) => (
                <SelectItem key={range.key}>{range.label}</SelectItem>
              ))}
            </Select>

            {formData.timeRange === "custom" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <DatePicker
                    label="Start Date"
                    size="sm"
                    radius="sm"
                    labelPlacement="outside"
                    maxValue={
                      formData.endDate
                        ? parseDate(formData.endDate)
                        : today(localTimeZone)
                    }
                    value={
                      formData.startDate ? parseDate(formData.startDate) : null
                    }
                    onChange={(date) =>
                      handleChange(
                        "startDate",
                        date ? formatCalendarDate(date) : undefined,
                      )
                    }
                    isRequired
                  />
                </div>
                <div className="flex-1">
                  <DatePicker
                    label="End Date"
                    size="sm"
                    radius="sm"
                    labelPlacement="outside"
                    minValue={
                      formData.startDate ? parseDate(formData.startDate) : null
                    }
                    maxValue={today(localTimeZone)}
                    value={
                      formData.endDate ? parseDate(formData.endDate) : null
                    }
                    onChange={(date) =>
                      handleChange(
                        "endDate",
                        date ? formatCalendarDate(date) : undefined,
                      )
                    }
                    isRequired
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <Select
              size="sm"
              radius="sm"
              label="Export Format"
              labelPlacement="outside"
              selectedKeys={[formData.format]}
              disabledKeys={[formData.format]}
              onSelectionChange={(keys) =>
                handleChange("format", keys.currentKey as string)
              }
              isRequired
              renderValue={(items) => {
                const item = items[0];
                if (!item) return null;
                return (
                  <div className="flex items-center gap-2">
                    {FORMAT_ICONS[item.key as string]}
                    {item.rendered}
                  </div>
                );
              }}
            >
              {FORMATS.map((format) => (
                <SelectItem
                  key={format.key}
                  startContent={FORMAT_ICONS[format.key]}
                >
                  {format.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="space-y-4">
            <Checkbox
              size="sm"
              radius="sm"
              isSelected={formData.schedule}
              onChange={(e) => handleChange("schedule", e.target.checked)}
            >
              <span className="text-sm">Schedule Recurring Report</span>
            </Checkbox>

            {formData.schedule && (
              <div className="flex mt-4">
                <Select
                  size="sm"
                  radius="sm"
                  label="Frequency"
                  labelPlacement="outside"
                  selectedKeys={[formData.frequency]}
                  disabledKeys={[formData.frequency]}
                  onSelectionChange={(keys) =>
                    handleChange("frequency", keys.currentKey as string)
                  }
                  isRequired
                >
                  {FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.key}>{freq.label}</SelectItem>
                  ))}
                </Select>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2 p-4">
          <Button
            size="sm"
            radius="sm"
            variant="ghost"
            color="default"
            onPress={onClose}
            className="border-small"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            radius="sm"
            color="primary"
            isDisabled={!isFormValid}
            isLoading={isPending}
            onPress={handleGenerateReport}
            startContent={!isPending && <LuDownload className="size-3.5" />}
          >
            Generate Report
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GenerateNewReportModal;
