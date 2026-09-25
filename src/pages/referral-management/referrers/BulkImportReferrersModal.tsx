import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  addToast,
} from "@heroui/react";
import { useRef, useState, useEffect } from "react";
import { FiCheckCircle, FiDownload, FiFileText, FiUploadCloud } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import * as XLSX from "xlsx";
import { useImportReferrersCSV } from "../../../hooks/useReferral";

interface BulkImportReferrersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkImportReferrersModal = ({
  isOpen,
  onClose,
}: BulkImportReferrersModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: importCSV, isPending } = useImportReferrersCSV();

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    let fileToUpload = selectedFile;
    const fileName = selectedFile.name.toLowerCase();

    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      try {
        setIsConverting(true);
        const data = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          throw new Error("No sheets found in Excel file");
        }
        const worksheet = workbook.Sheets[firstSheetName];
        if (!worksheet) {
          throw new Error("Invalid worksheet in Excel file");
        }
        const csvText = XLSX.utils.sheet_to_csv(worksheet);
        const csvBlob = new Blob([csvText], { type: "text/csv" });
        const csvFileName = selectedFile.name.replace(/\.(xlsx|xls)$/i, ".csv");
        fileToUpload = new File([csvBlob], csvFileName, { type: "text/csv" });
      } catch (err) {
        console.error("Failed to convert Excel to CSV:", err);
        addToast({
          title: "Error",
          description:
            "Failed to read Excel file. Please try uploading a valid CSV or XLSX file.",
          color: "danger",
        });
        setIsConverting(false);
        return;
      } finally {
        setIsConverting(false);
      }
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);
    importCSV(formData, {
      onSuccess: () => {
        setSelectedFile(null);
        onClose();
      },
    });
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Referrer Name*",
      "Phone Number*",
      "Email Address",
      "Referrer Type",
      "Practice Name*",
      "Referrer Level*",
      "Type of Practice*",
      "Practice Address Line 1*",
      "City*",
      "State*",
      "Zip Code*",
      "Website",
      "Additional Notes",
    ];

    const sampleRow1 = [
      "Dr. Robert Smith",
      "555-234-5678",
      "dr.smith@smiledental.com",
      "Doctor",
      "Smile Dental Care",
      "A-Level",
      "General Dentistry",
      "123 Main St",
      "Los Angeles",
      "CA",
      "90001",
      "https://smiledental.com",
      "Top referring practice",
    ];

    const sampleRow2 = [
      "Emily Davis",
      "555-987-6543",
      "emily.davis@example.com",
      "Patient",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Community advocate",
    ];

    const escapeCsvCell = (val: string) => {
      if (val.includes(",") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const csvContent = [
      headers.map(escapeCsvCell).join(","),
      sampleRow1.map(escapeCsvCell).join(","),
      sampleRow2.map(escapeCsvCell).join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "referrer_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const fieldsReference = [
    { name: "Referrer Name", badge: "required", type: "all" },
    { name: "Phone Number", badge: "required", type: "all" },
    { name: "Practice Name", badge: "required for doctor only", type: "doctor" },
    { name: "Referrer Level", badge: "required for doctor only", type: "doctor" },
    { name: "Type of Practice", badge: "required for doctor only", type: "doctor" },
    { name: "Practice Address", badge: "required for doctor only", type: "doctor" },
    { name: "City, State, Zip", badge: "required for doctor only", type: "doctor" },
    { name: "Email Address", badge: "optional", type: "optional" },
    { name: "Referrer Type", badge: "optional", type: "optional" },
    { name: "Website URL", badge: "optional", type: "optional" },
    { name: "Additional Notes", badge: "optional", type: "optional" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: "max-w-[620px] max-sm:!m-3 !m-0",
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-4">
              <div className="flex items-center gap-2">
                <FiFileText className="text-primary text-xl" />
                <h4 className="text-base font-medium dark:text-white">
                  Bulk Import Referrers
                </h4>
              </div>
              <p className="text-xs text-gray-500 font-normal dark:text-foreground/60">
                Import multiple referrers at once from a CSV spreadsheet.
                Download our template to get started.
              </p>
            </ModalHeader>
            <ModalBody className="py-0 px-4 gap-3">
              <div className="border border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2.5 text-gray-900 dark:text-white">
                  <FiFileText className="size-4" />
                  <h4 className="font-medium text-sm dark:text-white">
                    How to import referrers:
                  </h4>
                </div>
                <ol className="text-xs text-gray-600 dark:text-foreground/60 space-y-1.5 list-decimal list-inside pl-1">
                  <li>Download the CSV template below</li>
                  <li>Fill in your referrer details following the example format</li>
                  <li>Save the file and upload it here</li>
                  <li>Review and submit to add referrers to your directory</li>
                </ol>
              </div>

              <div className="border border-foreground/10 rounded-xl p-4 md:flex md:items-center md:justify-between max-md:space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="size-10 min-w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-500 flex items-center justify-center">
                    <FiDownload className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Download Template
                    </p>
                    <p className="text-xs text-gray-500 dark:text-foreground/40 md:max-w-[150px]">
                      Get our pre-formatted CSV template with example data
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={handleDownloadTemplate}
                  startContent={<FiDownload className="size-3.5" />}
                  className="border-small"
                >
                  Download CSV
                </Button>
              </div>

              <div className="border border-foreground/10 rounded-xl p-4 space-y-3">
                <div className="space-y-1">
                  <h4 className="font-medium text-sm dark:text-white">
                    Upload Your File
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-foreground/40">
                    Accepted formats: CSV, XLS, XLSX
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv, .xls, .xlsx"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setSelectedFile(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer group ${
                    selectedFile
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-foreground/10 bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  {selectedFile ? (
                    <>
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
                        <FiFileText className="size-6" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700/90 transition-colors cursor-pointer"
                        >
                          <IoClose className="size-3" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[250px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-foreground/40">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <FiUploadCloud className="size-8 text-gray-400 group-hover:text-primary transition-colors" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-foreground/40">
                          CSV, XLS, or XLSX file
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="border border-foreground/10 rounded-xl p-4">
                <h4 className="font-medium text-sm dark:text-white mb-3">
                  Fields Reference
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-5">
                  {fieldsReference.map((field, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-gray-700 dark:text-foreground/70"
                    >
                      <FiCheckCircle
                        className={`shrink-0 size-3.5 ${
                          field.type === "all"
                            ? "text-green-500"
                            : field.type === "doctor"
                            ? "text-amber-500"
                            : "text-blue-400"
                        }`}
                      />
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-normal text-gray-800 dark:text-foreground/90">
                          {field.name}
                        </span>
                        <span
                          className={`text-[10px] font-medium ${
                            field.type === "all"
                              ? "text-green-600 dark:text-green-400"
                              : field.type === "doctor"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-gray-400 dark:text-foreground/40"
                          }`}
                        >
                          ({field.badge})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="px-4">
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
                variant="solid"
                color="primary"
                onPress={handleImport}
                isLoading={isPending || isConverting}
                isDisabled={!selectedFile || isPending || isConverting}
              >
                Import Referrers
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BulkImportReferrersModal;
