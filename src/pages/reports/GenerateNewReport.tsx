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
import { LuFileText, LuDownload, LuUsers } from "react-icons/lu";

const REPORT_CATEGORIES = [
  {
    key: "referral",
    label: "Referral Analytics",
    icon: <LuUsers className="h-4 w-4 text-blue-600" />,
  },
  { key: "roi", label: "Marketing ROI" },
  { key: "campaign", label: "Campaign Performance" },
];

const EXPORT_FORMATS = [
  {
    key: "pdf",
    label: "PDF Document",
    icon: <LuFileText className="h-4 w-4" />,
  },
  { key: "csv", label: "CSV File" },
  { key: "xlsx", label: "Excel Spreadsheet" },
];

const TIME_RANGES = [
  { key: "30days", label: "Last 30 Days" },
  { key: "90days", label: "Last 90 Days" },
  { key: "q1_2024", label: "Q1 2024" },
  { key: "custom", label: "Custom Range" },
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
}

const GenerateNewReportModal = ({ isOpen, onClose  }: ReportModalProps) => {
  const [formData, setFormData] = useState<ReportFormState>({
    reportName: "",
    category: REPORT_CATEGORIES[0].key,
    reportType: "",
    timeRange: TIME_RANGES[0].key,
    exportFormat: EXPORT_FORMATS[0].key,
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
              onSelectionChange={(keys) =>
                handleChange("category", keys.currentKey as string)
              }
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
              onSelectionChange={(keys) =>
                handleChange("reportType", keys.currentKey as string)
              }
            >
              <SelectItem key="summary">Summary Report</SelectItem>
              <SelectItem key="detailed">Detailed Drilldown</SelectItem>
              <SelectItem key="trend">Historical Trend</SelectItem>
            </Select>
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-1">
              Time Range *
            </label>
            <Select
              selectedKeys={[formData.timeRange]}
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
              onSelectionChange={(keys) =>
                handleChange("exportFormat", keys.currentKey as string)
              }
              renderValue={(items) => {
                const item = items[0];
                if (!item) return null;
                const fmt = EXPORT_FORMATS.find((f) => f.key === item.key);

                return (
                  <div className="flex items-center gap-2">
                    {fmt?.icon}
                    {item.rendered}
                  </div>
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
