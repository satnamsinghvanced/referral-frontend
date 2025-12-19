import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import {
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiUploadCloud,
} from "react-icons/fi";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkImportModal = ({ isOpen, onClose }: BulkImportModalProps) => {
  const handleDownloadTemplate = () => {
    // Generate a simple CSV blob
    const headers = [
      "Patient Name*",
      "Patient Age*",
      "Phone Number*",
      "Email Address",
      "Referrer Name*",
      "Practice Name",
      "Treatment/Reason*",
      "Date Received*",
      "Referral Source",
    ];
    const dummyRow = [
      "John Doe",
      "30",
      "555-0123",
      "john@example.com",
      "Dr. Smith",
      "Smith Dental",
      "Invisalign",
      "2023-12-01",
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
            <ModalHeader className="flex flex-col gap-1 px-5">
              <div className="flex items-center gap-2">
                <FiFileText className="text-primary text-xl" />
                <h4 className="text-base font-medium">Bulk Import Referrals</h4>
              </div>
              <p className="text-xs text-gray-500 font-normal">
                Import multiple referrals at once from a CSV spreadsheet.
                Download our template to get started.
              </p>
            </ModalHeader>

            <ModalBody className="py-0 px-5 gap-3">
              {/* Instructions Section */}
              <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2.5 text-gray-900">
                  <FiFileText className="size-4" />
                  <h4 className="font-medium text-sm">
                    How to import referrals:
                  </h4>
                </div>
                <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside pl-1">
                  <li>Download the CSV template below</li>
                  <li>
                    Fill in your referral data following the example format
                  </li>
                  <li>Save the file and upload it here</li>
                  <li>Review the matched referrers and confirm import</li>
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
                    Accepted formats: CSV, XLS, XLSX
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 bg-gray-50/50 hover:bg-gray-50 transition-all cursor-pointer group">
                  <FiUploadCloud className="size-8 text-gray-400 group-hover:text-primary transition-colors" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      CSV, XLS, or XLSX file
                    </p>
                  </div>
                </div>
              </div>

              {/* Requirements Note */}
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-medium text-sm mb-3">
                  Required Fields Reference
                </h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {[
                    "Patient Name (required)",
                    "Patient Age (required)",
                    "Referral Source (required)",
                    "Practice Name (required)",
                    "Treatment/Reason (required)",
                    "Date Received (required)",
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

            <ModalFooter className="px-5">
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
                onPress={onClose}
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
