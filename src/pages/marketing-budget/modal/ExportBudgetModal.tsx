import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXlsx } from "react-icons/bs";
import { useExportBudgetItems } from "../../../hooks/useBudget";

interface ExportBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportBudgetModal = ({ isOpen, onClose }: ExportBudgetModalProps) => {
  const { mutate: exportBudget, isPending } = useExportBudgetItems();

  const handleExport = (type: "csv" | "excel" | "pdf") => {
    exportBudget(type, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const exportOptions = [
    {
      key: "csv",
      title: "Export as CSV",
      description: "Compatible with Excel and Google Sheets",
      icon: <BsFiletypeCsv className="text-green-600 w-6 h-6" />,
      action: () => handleExport("csv"),
    },
    {
      key: "excel",
      title: "Export as Excel",
      description: "Optimized for Microsoft Excel",
      icon: <BsFiletypeXlsx className="text-blue-600 w-6 h-6" />,
      action: () => handleExport("excel"),
    },
    {
      key: "pdf",
      title: "Export as PDF",
      description: "Professional report format",
      icon: <BsFiletypePdf className="text-red-600 w-6 h-6" />,
      action: () => handleExport("pdf"),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      classNames={{
        base: "max-sm:m-1 m-0",
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="p-4">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-2 p-0 pb-4">
              <h2 className="leading-none font-medium text-base">
                Export Budget Data
              </h2>
              <p className="text-xs text-gray-600 font-normal">
                Download your marketing budget data in your preferred format.
              </p>
            </ModalHeader>
            <ModalBody className="p-0">
              <div className="flex flex-col gap-2">
                {exportOptions.map((option) => (
                  <div
                    key={option.key}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border border-default-200 p-3 transition-all hover:bg-default-50 hover:border-default-300 ${
                      isPending ? "opacity-50 pointer-events-none" : ""
                    }`}
                    onClick={() => {
                      if (!isPending) {
                        option.action();
                      }
                    }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-default-50 border border-default-100">
                      {option.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-default-900">
                        {option.title}
                      </span>
                      <span className="text-xs text-default-500">
                        {option.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ExportBudgetModal;
