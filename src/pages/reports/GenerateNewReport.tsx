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
} from "@heroui/react";
import { useState } from "react";
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
import { TIME_RANGES } from "../../consts/reports";

const REPORT_CATEGORIES = [
  {
    key: "referral",
    label: "Referral Analytics",
    icon: <LuUsers className="h-4 w-4 text-blue-600" />,
  },
  {
    key: "marketing",
    label: "Marketing Performance",
    icon: <LuTrendingUp className="h-4 w-4 text-green-600" />,
  },
  {
    key: "analytics",
    label: "Social Media Analytics",
    icon: <LuMessageSquare className="h-4 w-4 text-purple-600" />,
  },
  {
    key: "review",
    label: "Review  Analytics",
    icon: <LuStar className="h-4 w-4 text-orange-600" />,
  },
  {
    key: "communication",
    label: "Communication  Analytics",
    icon: <LuPhone className="h-4 w-4 text-red-600" />,
  },
];

const EXPORT_FORMATS = [
  {
    key: "pdf",
    label: "PDF Document",
    icon: <LuFileText className="h-4 w-4" />,
  },
  {
    key: "xlsx",
    label: "Excel Spreadsheet",
    icon: <LuChartColumn className="h-4 w-4" />,
  },
  {
    key: "csv",
    label: "CSV File",
    icon: <LuFileText className="h-4 w-4" />,
  },
  // {
  //   key: "interactive-dashboard",
  //   label: "Interactive Dashboard",
  //   icon: <LuActivity className="h-4 w-4" />,
  // },
];

interface ReportFormState {
  reportName: string;
  category: string;
  reportType: string;
  timeRange: string;
  exportFormat: string;
  scheduleRecurring: boolean;
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
  const [formData, setFormData] = useState<ReportFormState>({
    reportName: "",
    category: REPORT_CATEGORIES[0]?.key as string,
    reportType: "",
    timeRange: TIME_RANGES[0]?.key as any,
    exportFormat: EXPORT_FORMATS[0]?.key as any,
    scheduleRecurring: false,
  });

  const isFormValid =
    formData.reportName &&
    formData.category &&
    formData.reportType &&
    formData.timeRange &&
    formData.exportFormat;

  const handleChange = (
    name: keyof ReportFormState,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = async () => {
    if (!isFormValid) return;
    const reportPayload = { ...formData };
    onClose();
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
        <ModalHeader className="flex flex-col gap-1 p-5">
          <h2 className="text-base font-medium">
            Generate New Marketing Report
          </h2>
          <p className="text-gray-500 dark:text-foreground/40 font-normal text-xs">
            Create a custom report with specific metrics, time ranges, and
            export formats
          </p>
        </ModalHeader>

        <ModalBody className="gap-5 py-0 px-5">
          <div>
            <Input
              size="sm"
              radius="sm"
              label="Report Name"
              labelPlacement="outside-top"
              placeholder="e.g., Q1 2024 Marketing ROI Analysis"
              value={formData.reportName}
              onChange={(e) => handleChange("reportName", e.target.value)}
              isRequired
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
                const cat = REPORT_CATEGORIES.find((c) => c.key === item.key);
                return (
                  <div className="flex items-center gap-2">
                    {cat?.icon}
                    {item.rendered}
                  </div>
                );
              }}
            >
              {REPORT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.key} startContent={cat.icon}>
                  {cat.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div>
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
          </div>

          <div>
            <Select
              size="sm"
              radius="sm"
              label="Export Format"
              labelPlacement="outside"
              selectedKeys={[formData.exportFormat]}
              disabledKeys={[formData.exportFormat]}
              onSelectionChange={(keys) =>
                handleChange("exportFormat", keys.currentKey as string)
              }
              isRequired
              renderValue={(items) => {
                const item = items[0];
                if (!item) return null;
                const fmt = EXPORT_FORMATS.find((f) => f.key === item.key);

                return (
                  <div className="flex items-center gap-2">{item.rendered}</div>
                );
              }}
            >
              {EXPORT_FORMATS.map((format) => (
                <SelectItem key={format.key} textValue={format.label}>
                  <div className="flex items-center gap-2">
                    {format.icon}
                    {format.label}
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            {/* <label className="block text-xs">Report Options</label> */}
            <div className="flex flex-col gap-1">
              <Checkbox
                size="sm"
                radius="sm"
                isSelected={formData.scheduleRecurring}
                onChange={(e) =>
                  handleChange("scheduleRecurring", e.target.checked)
                }
              >
                <span className="text-sm">Schedule Recurring Report</span>
              </Checkbox>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2 p-5">
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
            onPress={handleGenerateReport}
            startContent={<LuDownload className="size-3.5" />}
          >
            Generate Report
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GenerateNewReportModal;
