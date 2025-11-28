import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import {
  LuTrendingUp,
  LuDownload,
  LuUsers,
  LuFileText,
  LuMessageSquare,
  LuStar,
  LuPhone,
  LuDollarSign,
  LuActivity,
} from "react-icons/lu";
import { MdOutlineBarChart } from "react-icons/md";

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
  {
    key: "financial",
    label: "Financial Reports",
    icon: <LuDollarSign className="h-4 w-4 text-green-600" />,
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
    icon: <MdOutlineBarChart className="h-4 w-4" />,
  },
  {
    key: "csv",
    label: "CSV File",
    icon: <LuFileText className="h-4 w-4" />,
  },
  {
    key: "interactive-dashboard",
    label: "Interactive Dashboard",
    icon: <LuActivity className="h-4 w-4" />,
  },
];

const TIME_RANGES = [
  { key: "7days", label: "Last 7 Days" },
  { key: "30days", label: "Last 30 Days" },
  { key: "90days", label: "Last 90 Days" },
  { key: "quarter", label: "Last Quarter" },
  { key: "lastYear", label: "Last Year" },
  // { key: "YearToDate", label: "Year to Date" },
  // { key: "custom", label: "Custom Range" },
];

interface ReportFormState {
  reportName: string;
  category: string;
  reportType: string;
  timeRange: string;
  exportFormat: string;
  includeCharts: boolean;
  includeRawData: boolean;
  scheduleRecurring: boolean;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  practice:any | null;
}

const GenerateNewReportModal = ({ isOpen, onClose , practice }: ReportModalProps) => {
  const [formData, setFormData] = useState<ReportFormState>({
    reportName: "",
    category: REPORT_CATEGORIES[0]?.key as string,
    reportType: "",
    timeRange: TIME_RANGES[0]?.key as any,
    exportFormat: EXPORT_FORMATS[0]?.key as any,
    includeCharts: true,
    includeRawData: false,
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
    console.log("Report generation initiated:", reportPayload);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="lg">
      <ModalContent className="p-6">
        <ModalHeader className="flex flex-col gap-2 !px-0">
          <h2 className="text-[16px] font-semibold">
            Generate New Marketing Report
          </h2>
          <p className="text-[#64748b] font-normal text-[12px]">
            Create a custom report with specific metrics, time ranges, and
            export formats
          </p>
        </ModalHeader>

        <div className="space-y-6 py-4">
          <div>
            <label className="block text-[12px] font-medium mb-1">
              Report Name *
            </label>
            <Input
              placeholder="e.g., Q1 2024 Marketing ROI Analysis"
              value={formData.reportName}
              onChange={(e) => handleChange("reportName", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-1">
              Report Category *
            </label>
            <Select
              selectedKeys={[formData.category]}
              disabledKeys={[formData.category]}
              onSelectionChange={(keys) =>
                handleChange("category", keys.currentKey as string)
              }
              renderValue={(items) => {
                const item = items[0];
                if (!item) return null;
                const cat = REPORT_CATEGORIES.find((c) => c.key === item.key);
                return (
                  <div className="flex items-center gap-2">{item.rendered}</div>
                );
              }}
            >
              {REPORT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.key} textValue={cat.label}>
                  <div className="flex items-center gap-2">
                    {cat.icon}
                    {cat.label}
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-1">
              Report Type *
            </label>
            <Select
              placeholder="Select report type"
              selectedKeys={formData.reportType ? [formData.reportType] : []}
              disabledKeys={formData.reportType ? [formData.reportType] : []}
              onSelectionChange={(keys) =>
                handleChange("reportType", keys.currentKey as string)
              }
            >
              <SelectItem key="social-engagement">
                Social Engagement{" "}
              </SelectItem>
              <SelectItem key="social-reach">Social Reach</SelectItem>
              <SelectItem key="social-conversion">
                Social Conversions
              </SelectItem>
              <SelectItem key="influencer-performance">
                Influencer Performance
              </SelectItem>
              <SelectItem key="content-performance">
                Content Performance
              </SelectItem>
            </Select>
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-1">
              Time Range *
            </label>
            <Select
              selectedKeys={[formData.timeRange]}
              disabledKeys={[formData.timeRange]}
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
            <label className="block text-[12px] font-medium mb-1">
              Export Format *
            </label>
            <Select
              selectedKeys={[formData.exportFormat]}
              disabledKeys={[formData.exportFormat]}
              onSelectionChange={(keys) =>
                handleChange("exportFormat", keys.currentKey as string)
              }
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

          <div className="space-y-3 pt-2">
            <label className="block text-[12px] font-medium">
              Report Options
            </label>

            <div className="flex flex-col">
              <Checkbox
                isSelected={formData.includeCharts}
                onChange={(e) =>
                  handleChange("includeCharts", e.target.checked)
                }
              >
                <span className="text-[12px] font-medium">
                  Include Charts and Visualizations
                </span>
              </Checkbox>

              <Checkbox
                isSelected={formData.includeRawData}
                onChange={(e) =>
                  handleChange("includeRawData", e.target.checked)
                }
              >
                <span className="text-[12px] font-medium">
                  Include Raw Data Tables
                </span>
              </Checkbox>

              <Checkbox
                isSelected={formData.scheduleRecurring}
                onChange={(e) =>
                  handleChange("scheduleRecurring", e.target.checked)
                }
              >
                <span className="text-[12px] font-medium">
                  Schedule Recurring Report
                </span>
              </Checkbox>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            className="border-1 border-[#0ea5e91a] text-[12px] rounded-[6px] px-[14px] py-[7px] h-[31px] hover:bg-[#fed7aa] hover:text-[#ea580c]"
            variant="light"
            onPress={onClose}
          >
            Cancel
          </Button>

          <Button
            color="primary"
            isDisabled={!isFormValid}
            onPress={handleGenerateReport}
          >
            <LuDownload className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default GenerateNewReportModal;
