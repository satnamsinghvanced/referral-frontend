import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useState } from "react";
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeXlsx } from "react-icons/bs";
import { useExportBudgetItems } from "../../../hooks/useBudget";

interface ExportBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    period: string;
    startDate?: string;
    endDate?: string;
  };
}

const ExportBudgetModal = ({
  isOpen,
  onClose,
  filters,
}: ExportBudgetModalProps) => {
  const { mutate: exportBudget, isPending } = useExportBudgetItems();
  const [activeExport, setActiveExport] = useState<string | null>(null);

  const handleExport = (type: "csv" | "excel" | "pdf") => {
    setActiveExport(type);
    exportBudget(
      {
        type,
        ...filters,
      },
      {
        onSuccess: () => {
          onClose();
          setActiveExport(null);
        },
        onError: () => {
          setActiveExport(null);
        },
      },
    );
  };

  const exportOptions = [
    {
      key: "csv",
      title: "Export as CSV",
      description: "Compatible with Excel and Google Sheets",
      icon: (
        <BsFiletypeCsv className="text-green-600 dark:text-green-500 w-6 h-6" />
      ),
      action: () => handleExport("csv"),
    },
    {
      key: "excel",
      title: "Export as Excel",
      description: "Optimized for Microsoft Excel",
      icon: (
        <BsFiletypeXlsx className="text-blue-600 dark:text-blue-500 w-6 h-6" />
      ),
      action: () => handleExport("excel"),
    },
    {
      key: "pdf",
      title: "Export as PDF",
      description: "Professional report format",
      icon: (
        <BsFiletypePdf className="text-red-600 dark:text-red-500 w-6 h-6" />
      ),
      action: () => handleExport("pdf"),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      placement="center"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="p-4">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-2 p-0 pb-4">
              <h2 className="leading-none font-medium text-base text-foreground">
                Export Budget Data
              </h2>
              <p className="text-xs text-gray-600 dark:text-foreground/60 font-normal">
                Download your marketing budget data in your preferred format.
              </p>
            </ModalHeader>
            <ModalBody className="p-0">
              <div className="flex flex-col gap-2">
                {exportOptions.map((option) => (
                  <button
                    key={option.key}
                    disabled={isPending}
                    className={`flex cursor-pointer items-center w-full text-left gap-3 rounded-lg border border-default-200 p-3 transition-all hover:bg-default-50 hover:border-default-300 ${
                      isPending ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    onClick={option.action}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-default-50 border border-default-100">
                      {option.icon}
                    </div>
                    <div className="flex flex-col flex-1 gap-0.5">
                      <span className="text-sm font-medium text-default-900">
                        {option.title}
                      </span>
                      <span className="text-xs text-default-500">
                        {option.description}
                      </span>
                    </div>
                    {isPending && activeExport === option.key && (
                      <div className="flex items-center gap-2 text-xs font-medium text-primary">
                        <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Exporting...</span>
                      </div>
                    )}
                  </button>
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
