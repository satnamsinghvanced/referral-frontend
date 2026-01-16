import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useRef, useState } from "react";
import {
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiUploadCloud,
} from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useImportReferralsCSV } from "../../../hooks/useReferral";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkImportModal = ({ isOpen, onClose }: BulkImportModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: importCSV, isPending } = useImportReferralsCSV();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    importCSV(formData, {
      onSuccess: () => {
        setSelectedFile(null);
        onClose();
      },
    });
  };

  const handleDownloadTemplate = () => {
    // Generate a simple CSV blob
    const headers = [
      "Patient Name*",
      "Patient Age*",
      "Phone Number*",
      "Email Address*",
      "Treatment/Reason*",
      "Referral Source",
    ];
    const dummyRow = [
      "John Doe",
      "30",
      "555-0123-485",
      "john@example.com",
      "Invisalign",
      "Direct Referral",
    ];

    const csvContent = [headers.join(","), dummyRow.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "referral_import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
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
                  Bulk Import Referrals
                </h4>
              </div>
              <p className="text-xs text-gray-500 font-normal dark:text-foreground/60">
                Import multiple referrals at once from a CSV spreadsheet.
                Download our template to get started.
              </p>
            </ModalHeader>

            <ModalBody className="py-0 px-4 gap-3">
              {/* Instructions Section */}
              <div className="border border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2.5 text-gray-900 dark:text-white">
                  <FiFileText className="size-4" />
                  <h4 className="font-medium text-sm dark:text-white">
                    How to import referrals:
                  </h4>
                </div>
                <ol className="text-xs text-gray-600 dark:text-foreground/60 space-y-1.5 list-decimal list-inside pl-1">
                  <li>Download the CSV template below</li>
                  <li>
                    Fill in your referral data following the example format
                  </li>
                  <li>Save the file and upload it here</li>
                  <li>Review the matched referrers and confirm import</li>
                </ol>
              </div>

              {/* Download Template Section */}
              <div className="border border-foreground/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-500 flex items-center justify-center">
                    <FiDownload className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Download Template
                    </p>
                    <p className="text-xs text-gray-500 dark:text-foreground/40 max-w-[150px]">
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

              {/* Upload Section */}
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

              {/* Requirements Note */}
              <div className="border border-foreground/10 rounded-xl p-4">
                <h4 className="font-medium text-sm dark:text-white mb-3">
                  Required Fields Reference
                </h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                  {[
                    "Patient Name (required)",
                    "Patient Email (required)",
                    "Patient Age (required)",
                    "Referral Source (required)",
                    "Treatment/Reason (required)",
                  ].map((req, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-foreground/60"
                    >
                      <FiCheckCircle className="text-green-500 shrink-0 size-3.5" />
                      <span>{req}</span>
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
                isLoading={isPending}
                isDisabled={!selectedFile || isPending}
              >
                Import Referrals
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BulkImportModal;
