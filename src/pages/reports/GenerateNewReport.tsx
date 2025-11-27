import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
} from "@heroui/react";
import React, { useState } from "react";
import {
  LuMessageSquare,
  LuChartColumn,
  LuDownload,
} from "react-icons/lu";


const REPORT_CATEGORIES = [
  {
    value: "social",
    label: "Social Media Analytics",
    icon: <LuMessageSquare className="h-4 w-4 text-purple-600" />,
  },
  {
    value: "referral",
    label: "Referral Program",
    icon: <LuChartColumn className="h-4 w-4 text-green-600" />,
  },
  {
    value: "roi",
    label: "Marketing ROI",
    icon: <LuDownload className="h-4 w-4 text-sky-600" />,
  },
];

const TIME_RANGES = [
  { value: "30_days", label: "Last 30 Days" },
  { value: "90_days", label: "Last 90 Days" },
  { value: "q1_2024", label: "Q1 2024" },
];

const EXPORT_FORMATS = [
  {
    value: "excel",
    label: "Excel Spreadsheet",
    icon: <LuChartColumn className="h-4 w-4" />,
  },
  {
    value: "pdf",
    label: "PDF Document",
    icon: <LuDownload className="h-4 w-4" />,
  },
  {
    value: "csv",
    label: "CSV File",
    icon: <LuChartColumn className="h-4 w-4" />,
  },
];

// --- Component Interface ---

interface GenerateReportDialogProps {
  /** Controls the visibility of the dialog. */
  isOpen: boolean;
  /** Callback function when the dialog needs to be closed (by user or submission). */
  onOpenChange: (open: boolean) => void;
}

// --- Component ---

export function GenerateReportDialog({
  isOpen,
  onOpenChange,
}: GenerateReportDialogProps) {
  const [reportName, setReportName] = useState("");
  const [reportCategory, setReportCategory] = useState(
    REPORT_CATEGORIES[0].value
  );
  const [reportType, setReportType] = useState("");
  const [timeRange, setTimeRange] = useState(TIME_RANGES[0].value);
  const [exportFormat, setExportFormat] = useState(EXPORT_FORMATS[0].value);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(false);
  const [scheduleRecurring, setScheduleRecurring] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportName) {
      return;
    }

    console.log("Generating report with:", {
      reportName,
      reportCategory,
      reportType,
      timeRange,
      exportFormat,
      includeCharts,
      includeRawData,
      scheduleRecurring,
    });
    
    // Close the dialog after successful submission
    onOpenChange(false);
  };

  const selectedCategory = REPORT_CATEGORIES.find(
    (c) => c.value === reportCategory
  );
  const selectedFormat = EXPORT_FORMATS.find(
    (f) => f.value === exportFormat
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate New Marketing Report</DialogTitle>
          <DialogDescription>
            Create a custom report with specific metrics, time ranges, and export
            formats
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* 1. Report Name */}
          <div className="space-y-2">
            <Label htmlFor="reportName">Report Name *</Label>
            <Input
              id="reportName"
              placeholder="e.g., Q1 2024 Marketing ROI Analysis"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>

          {/* 2. Report Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Report Category *</Label>
            <Select
              value={reportCategory}
              onValueChange={setReportCategory}
              id="category"
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {selectedCategory?.icon}
                    {selectedCategory?.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {REPORT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      {cat.icon}
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. Report Type */}
          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type *</Label>
            <Select value={reportType} onValueChange={setReportType} id="reportType">
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="detailed_summary">Detailed Summary</SelectItem>
                <SelectItem value="raw_data">Raw Conversion Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. Time Range */}
          <div className="space-y-2">
            <Label htmlFor="timeRange">Time Range *</Label>
            <Select value={timeRange} onValueChange={setTimeRange} id="timeRange">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 5. Export Format */}
          <div className="space-y-2">
            <Label htmlFor="format">Export Format *</Label>
            <Select
              value={exportFormat}
              onValueChange={setExportFormat}
              id="format"
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {selectedFormat?.icon}
                    {selectedFormat?.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {EXPORT_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex items-center gap-2">
                      {format.icon}
                      {format.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 6. Report Options (Checkboxes) */}
          <div className="space-y-3">
            <Label>Report Options</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="includeCharts"
                  checked={includeCharts}
                  onCheckedChange={setIncludeCharts}
                />
                <Label htmlFor="includeCharts" className="cursor-pointer">
                  Include Charts and Visualizations
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="includeRawData"
                  checked={includeRawData}
                  onCheckedChange={setIncludeRawData}
                />
                <Label htmlFor="includeRawData" className="cursor-pointer">
                  Include Raw Data Tables
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="scheduleRecurring"
                  checked={scheduleRecurring}
                  onCheckedChange={setScheduleRecurring}
                />
                <Label htmlFor="scheduleRecurring" className="cursor-pointer">
                  Schedule Recurring Report
                </Label>
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            // We use the full handleSubmit function here to validate and close
            onClick={handleSubmit} 
            disabled={!reportName} // Disable if Report Name is empty
          >
            <LuDownload className="h-4 w-4 mr-2" aria-hidden="true" />
            Generate Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}