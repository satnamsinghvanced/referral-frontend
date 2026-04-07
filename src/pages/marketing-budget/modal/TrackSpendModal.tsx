import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Tooltip,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { useFormik } from "formik";
import { FiCalendar, FiDollarSign, FiPlus, FiTrash2 } from "react-icons/fi";
import * as Yup from "yup";
import { useAddSpendRecord, useBudgetItem, useDeleteSpendRecord } from "../../../hooks/useBudget";

interface TrackSpendModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetId: string;
}

export default function TrackSpendModal({
  isOpen,
  onClose,
  budgetId,
}: TrackSpendModalProps) {
  const { data: budgetData, isLoading: isBudgetLoading } = useBudgetItem(budgetId);
  const addSpendMutation = useAddSpendRecord(budgetId);
  const deleteSpendMutation = useDeleteSpendRecord(budgetId);

  const budgetStartDate = budgetData?.startDate ? budgetData.startDate.split("T")[0] : "";
  const budgetEndDate = budgetData?.endDate ? budgetData.endDate.split("T")[0] : "";

  const validationSchema = Yup.object().shape({
    startDate: Yup.string()
      .required("Start Date is required.")
      .test("within-budget", "Start date must be within budget period", (value) => {
        if (!value || !budgetStartDate) return true;
        return value >= budgetStartDate && (!budgetEndDate || value <= budgetEndDate);
      }),
    endDate: Yup.string()
      .required("End Date is required.")
      .test("within-budget", "End date must be within budget period", (value) => {
        if (!value || !budgetEndDate) return true;
        return value <= budgetEndDate && (!budgetStartDate || value >= budgetStartDate);
      })
      .test("after-start", "End date must be after start date", function (value) {
        const { startDate } = this.parent;
        if (!value || !startDate) return true;
        return value >= startDate;
      }),
    spent: Yup.number().min(0, "Spent must be non-negative.").required("Spent is required."),
    revenue: Yup.number().min(0, "Revenue must be non-negative.").required("Revenue is required."),
    notes: Yup.string().max(200, "Notes must be at most 200 characters."),
  });

  const formik = useFormik({
    initialValues: {
      startDate: budgetStartDate,
      endDate: budgetEndDate || "",
      spent: 0,
      revenue: 0,
      notes: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      addSpendMutation.mutate(
        {
          budgetId,
          ...values,
          startDate: values.startDate || budgetStartDate || "",
          spent: Number(values.spent),
          revenue: Number(values.revenue),
        },
        {
          onSuccess: () => {
            resetForm();
          },
        }
      );
    },
  });


  if (isBudgetLoading) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: `max-sm:!m-3 !m-0 max-h-[90vh]`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 p-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FiDollarSign className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold">Track Marketing Spend & Revenue</h2>
          </div>
          <p className="text-sm font-normal text-muted-foreground mt-1">
            Record actual spend with dates and revenue generated to automatically calculate ROI for{" "}
            <span className="font-medium text-foreground">
              {typeof budgetData?.subCategory === "string"
                ? budgetData.subCategory
                : budgetData?.subCategory?.subCategory}
            </span>
          </p>
        </ModalHeader>

        <ModalBody className="p-6 pt-2 gap-6">
          {/* Spend History */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Spend History</h3>
            <div className="max-h-[200px] overflow-y-auto flex flex-col gap-3 pr-2 scrollbar-none">
              {budgetData?.spendHistory && budgetData.spendHistory.length > 0 ? (
                budgetData.spendHistory.map((record) => (
                  <div
                    key={record._id}
                    className="p-3 border border-divider rounded-xl items-center flex justify-between bg-content1 shadow-sm"
                  >

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center gap-2 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-3.5 h-3.5" />
                          {new Date(record.startDate).toLocaleDateString()} -{" "}
                          {new Date(record.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex justify-end shrink-0 ml-auto">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => deleteSpendMutation.mutate(record._id)}
                            isLoading={
                              deleteSpendMutation.isPending &&
                              deleteSpendMutation.variables === record._id
                            }
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-0 mt-1 w-full overflow-hidden">
                        <div className="text-[10px] flex items-center gap-1 w-[120px] shrink-0 min-w-0">
                          <span className="shrink-0 text-muted-foreground">Spent:</span>
                          <Tooltip content={`$${record.spent.toLocaleString()}`}>
                            <span className="text-red-500 font-medium truncate shrink min-w-0">
                              ${record.spent.toLocaleString()}
                            </span>
                          </Tooltip>
                        </div>

                        <div className="text-[10px] flex items-center gap-1 w-[120px] shrink-0 border-l border-divider pl-2 min-w-0">
                          <span className="shrink-0 text-muted-foreground">Revenue:</span>
                          <Tooltip content={`$${record.revenue.toLocaleString()}`}>
                            <span className="text-green-600 font-medium truncate shrink min-w-0">
                              ${record.revenue.toLocaleString()}
                            </span>
                          </Tooltip>
                        </div>

                        <div className="text-[10px] flex items-center gap-1 w-[100px] shrink-0 border-l border-divider pl-2 min-w-0">
                          <span className="shrink-0 text-muted-foreground">ROI:</span>
                          <span
                            className={`font-medium truncate ${record.roi < 0 ? "text-red-500" : "text-green-600"
                              }`}
                          >
                            {record.roi}%
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-divider rounded-xl">
                  No spend records yet.
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-0 p-3 bg-primary/5 rounded-xl border border-primary/10 items-center">
            <div className="flex flex-col items-center px-1 min-w-0">
              <span className="text-[9px] text-muted-foreground uppercase font-semibold text-center truncate w-full">
                Total Spent
              </span>
              <Tooltip
                content={`$${(budgetData?.stats?.totalSpent || 0).toLocaleString()}`}
              >
                <span className="text-base font-medium text-red-500 truncate w-full text-center">
                  ${(budgetData?.stats?.totalSpent || 0).toLocaleString()}
                </span>
              </Tooltip>
            </div>
            <div className="flex flex-col items-center border-x border-primary/10 px-1 min-w-0">
              <span className="text-[9px] text-muted-foreground uppercase font-semibold text-center truncate w-full">
                Total Revenue
              </span>
              <Tooltip
                content={`$${(budgetData?.stats?.totalRevenue || 0).toLocaleString()}`}
              >
                <span className="text-base font-bold text-green-600 truncate w-full text-center">
                  ${(budgetData?.stats?.totalRevenue || 0).toLocaleString()}
                </span>
              </Tooltip>
            </div>
            <div className="flex flex-col items-center px-1 min-w-0">
              <span className="text-[9px] text-muted-foreground uppercase font-semibold text-center truncate w-full">
                Overall ROI
              </span>
              <span
                className={`text-base font-medium truncate w-full text-center ${(budgetData?.stats?.overallROI || 0) < 0
                  ? "text-red-500"
                  : "text-green-600"
                  }`}
              >
                {budgetData?.stats?.overallROI || 0}%
              </span>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 pt-2">
            <h3 className="text-sm font-semibold">Add New Spend Record</h3>

            <div className="grid grid-cols-2 gap-4">
              <DatePicker
                size="sm"
                radius="md"
                label="Spend Start Date"
                labelPlacement="outside"
                value={formik.values.startDate ? parseDate(formik.values.startDate) : null}
                onChange={(date) => formik.setFieldValue("startDate", date ? date.toString() : "")}
                isInvalid={!!formik.errors.startDate && !!formik.touched.startDate}
                errorMessage={formik.errors.startDate}
              />
              <DatePicker
                size="sm"
                radius="md"
                label="Spend End Date"
                labelPlacement="outside"
                value={formik.values.endDate ? parseDate(formik.values.endDate) : null}
                onChange={(date) => formik.setFieldValue("endDate", date ? date.toString() : "")}
                isInvalid={!!formik.errors.endDate && !!formik.touched.endDate}
                errorMessage={formik.errors.endDate}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                size="sm"
                radius="md"
                label="Amount Spent"
                labelPlacement="outside"
                type="number"
                placeholder="0"
                startContent={<span className="text-muted-foreground text-xs">$</span>}
                value={formik.values.spent.toString()}
                onChange={formik.handleChange}
                name="spent"
                isInvalid={!!formik.errors.spent && !!formik.touched.spent}
                errorMessage={formik.errors.spent}
              />
              <Input
                size="sm"
                radius="md"
                label="Revenue Generated"
                labelPlacement="outside"
                type="number"
                placeholder="0"
                startContent={<span className="text-muted-foreground text-xs">$</span>}
                description="Enter the revenue you made from this marketing effort"
                value={formik.values.revenue.toString()}
                onChange={formik.handleChange}
                name="revenue"
                isInvalid={!!formik.errors.revenue && !!formik.touched.revenue}
                errorMessage={formik.errors.revenue}
                classNames={{
                  description: "text-[10px] leading-tight mt-1"
                }}
              />
            </div>

            <Textarea
              size="sm"
              radius="md"
              label="Notes (Optional)"
              labelPlacement="outside"
              placeholder="Add any notes about this spend period..."
              value={formik.values.notes}
              onChange={formik.handleChange}
              name="notes"
              isInvalid={!!formik.errors.notes && !!formik.touched.notes}
              errorMessage={formik.errors.notes}
            />

          </form>
        </ModalBody>

        <ModalFooter className="p-6 pt-2">
          <Button
            className="flex-1 font-semibold"
            color="primary"
            onPress={() => formik.handleSubmit()}
            isLoading={addSpendMutation.isPending}
            startContent={!addSpendMutation.isPending && <FiPlus className="w-4 h-4" />}
          >
            Add Spend Record
          </Button>
          <Button
            variant="bordered"
            className="px-8 font-semibold"
            onPress={() => {
              formik.resetForm();
              onClose();
            }}
          >
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
