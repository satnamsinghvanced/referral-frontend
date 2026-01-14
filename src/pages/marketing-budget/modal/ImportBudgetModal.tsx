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
import { useImportBudgetItemsCSV } from "../../../hooks/useBudget";

interface ImportBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportBudgetModal = ({ isOpen, onClose }: ImportBudgetModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: importCSV, isPending } = useImportBudgetItemsCSV();

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
    // Generate CSV template with required fields
    const headers = [
      "Category*",
      "Subcategory*",
      "Budget Amount*",
      "Period*",
      "Priority*",
      "Status*",
      "Start Date*",
      "End Date*",
      "Description",
    ];
    const dummyRow = [
      "Digital Marketing",
      "Google Ads",
      "5000",
      "monthly",
      "high",
      "active",
      "2026-01-01",
      "2026-01-31",
      "Q1 Google Ads campaign budget",
    ];

    const csvContent = [headers.join(","), dummyRow.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "budget_import_template.csv";
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
                <h4 className="text-base font-medium">
                  Bulk Import Budget Items
                </h4>
              </div>
              <p className="text-xs text-gray-500 font-normal">
                Import multiple budget items at once from a CSV spreadsheet.
                Download our template to get started.
              </p>
            </ModalHeader>

            <ModalBody className="py-0 px-4 gap-3">
              {/* Instructions Section */}
              <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2.5 text-gray-900">
                  <FiFileText className="size-4" />
                  <h4 className="font-medium text-sm">
                    How to import budget items:
                  </h4>
                </div>
                <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside pl-1">
                  <li>Download the CSV template below</li>
                  <li>Fill in your budget data following the example format</li>
                  <li>Save the file and upload it here</li>
                  <li>Review the imported items and confirm</li>
                </ol>
              </div>

              {/* Download Template Section */}
              <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                    <FiDownload className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Download Template
                    </p>
                    <p className="text-xs text-gray-500 max-w-[150px]">
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
              <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">Upload Your File</h4>
                  <p className="text-xs text-gray-500">
                    Accepted format: CSV only
                  </p>
                </div>

                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer group ${
                    selectedFile
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"
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
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <FiUploadCloud className="size-8 text-gray-400 group-hover:text-primary transition-colors" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">CSV file only</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Requirements Note */}
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-medium text-sm mb-3">
                  Required Fields Reference
                </h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                  {[
                    "Category (required)",
                    "Subcategory (required)",
                    "Budget Amount (required)",
                    "Period (required)",
                    "Priority (required)",
                    "Status (required)",
                    "Start Date (required)",
                    "End Date (required)",
                  ].map((req, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-gray-600"
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
                Import Budget Items
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ImportBudgetModal;
