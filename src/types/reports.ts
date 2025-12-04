export interface ReportItem {
  id: number;
  title: string;
  description: string;
  status: "ready" | "processing";
  fileType: "PDF" | "Excel" | "CSV";
  fileSize: string;
  onClickDownload: () => void;
  onClickShare: () => void;
}
