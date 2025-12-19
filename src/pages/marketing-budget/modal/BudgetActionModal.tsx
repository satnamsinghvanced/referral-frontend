import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { useFormik } from "formik";
import { useEffect, useMemo } from "react";
import * as Yup from "yup";
import { BUDGET_DURATIONS, BUDGET_STATUSES } from "../../../consts/budget";
import { PRIORITY_LEVELS } from "../../../consts/practice";
import {
  useBudgetCategories,
  useCreateBudgetItem,
  useUpdateBudgetItem,
} from "../../../hooks/useBudget";
import { BudgetItem } from "../../../types/budget";

const validationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required."),
  subCategory: Yup.string().required("Subcategory is required."),
  budgetAmount: Yup.number()
    .min(0, "Budget Amount must be non-negative.")
    .required("Budget Amount is required."),
  period: Yup.string().required("Period is required."),
  priority: Yup.string().required("Priority is required."),
  status: Yup.string().required("Status is required."),
  description: Yup.string().max(
    200,
    "Description must be at most 200 characters."
  ),
  startDate: Yup.string().required("Start Date is required."),
  endDate: Yup.string().required("End Date is required."),
});

interface BudgetFormValues {
  category: string;
  subCategory: string;
  budgetAmount: number | "";
  actualSpent?: number | "";
  roi?: number | "";
  period: string;
  priority: string;
  status: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function BudgetActionModal({
  isOpen,
  onClose,
  editedData,
  setCurrentFilters,
}: {
  isOpen: boolean;
  onClose: () => void;
  editedData: BudgetItem | null;
  setCurrentFilters: any;
}) {
  const isEdit = !!editedData;

  const { data: categories } = useBudgetCategories();
  const createMutation = useCreateBudgetItem();
  const updateMutation = useUpdateBudgetItem(editedData?._id || "");
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // @ts-ignore
  const initialValues: BudgetFormValues = useMemo(() => {
    if (editedData) {
      return {
        category: editedData.marketingCategory?._id || "",
        subCategory: editedData.subCategory?._id || "",
        budgetAmount: editedData.budget,
        actualSpent: editedData.spent || "", // ⬅ added
        roi: editedData.roi || "", // ⬅ added
        period: editedData.period,
        priority: editedData.priority,
        status: editedData.status,
        description: editedData.description || "",
        startDate: editedData.startDate.split("T")[0],
        endDate: editedData.endDate.split("T")[0],
      };
    }
    return {
      category: "",
      subCategory: "",
      budgetAmount: "",
      actualSpent: "", // add empty for new item (hidden anyway)
      roi: "",
      period: "monthly",
      priority: "medium",
      status: "active",
      description: "",
      startDate: "",
      endDate: "",
    };
  }, [editedData]);

  const formik = useFormik<BudgetFormValues>({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        budget: Number(values.budgetAmount),
        spent: Number(values.actualSpent),
        roi: Number(values.roi),
        period: values.period,
        priority: values.priority,
        status: values.status,
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        marketingCategory: values.category,
        subCategory: values.subCategory,
      };

      if (isEdit) {
        updateMutation.mutate({ id: editedData._id, data: payload });
      } else {
        createMutation.mutate(payload);
      }

      setCurrentFilters((prev: any) => ({
        ...prev,
        period: values.period,
      }));
    },
  });

  useEffect(() => {
    if (createMutation.isSuccess || updateMutation.isSuccess) {
      formik.resetForm();
      onClose();
    }
  }, [createMutation.isSuccess, updateMutation.isSuccess]);

  const utilization =
    formik.values.actualSpent && formik.values.budgetAmount
      ? (formik.values.actualSpent / formik.values.budgetAmount) * 100
      : 0;

  const modalTitle = isEdit ? "Edit Budget Item" : "Add New Budget Item";
  const buttonLabel = isEdit ? "Save Changes" : "Add Budget Item";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      classNames={{
        base: `max-sm:m-1 m-0`,
        closeButton: "cursor-pointer",
        // content: "!top-10 translate-y-0",
      }}
    >
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader className="p-5 pb-0 flex-col">
            <h2 className="leading-none font-medium text-base">{modalTitle}</h2>
            <p className="text-xs text-gray-600 mt-2 font-normal">
              {isEdit
                ? `Update the details for ${editedData?.marketingCategory.title} budget item.`
                : "Create a new budget item to track your marketing spend across different categories and periods."}
            </p>
          </ModalHeader>

          <ModalBody className="px-5 py-5 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Select
                size="sm"
                radius="sm"
                label="Category"
                labelPlacement="outside"
                placeholder="Select category"
                isRequired
                selectedKeys={
                  formik.values.category ? [formik.values.category] : []
                }
                onSelectionChange={(keys) => {
                  formik.setFieldValue("category", Array.from(keys)[0] || "");
                  formik.setFieldValue("subCategory", ""); // Reset subcategory on category change
                }}
                onBlur={() => formik.handleBlur("category")}
                isInvalid={
                  !!formik.errors.category &&
                  (!!formik.touched.category as boolean)
                }
                errorMessage={formik.touched.category && formik.errors.category}
              >
                {(categories || [])?.map((cat: any) => (
                  <SelectItem key={cat._id}>{cat.title}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="col-span-2">
              <Select
                size="sm"
                radius="sm"
                label="Subcategory"
                labelPlacement="outside"
                placeholder="Select subcategory"
                isRequired
                selectedKeys={
                  formik.values.subCategory ? [formik.values.subCategory] : []
                }
                onSelectionChange={(keys) =>
                  formik.setFieldValue("subCategory", Array.from(keys)[0] || "")
                }
                onBlur={() => formik.handleBlur("subCategory")}
                isInvalid={
                  !!formik.touched.subCategory && !!formik.errors.subCategory
                }
                errorMessage={
                  formik.touched.subCategory && formik.errors.subCategory
                }
                isDisabled={!formik.values.category}
              >
                {(
                  (categories || [])?.find(
                    (category: any) => category._id === formik.values.category
                  )?.subCategories || []
                ).map((cat: any) => (
                  <SelectItem key={cat._id}>{cat.title}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Input
                size="sm"
                radius="sm"
                label="Budget Amount"
                labelPlacement="outside-top"
                name="budgetAmount"
                type="number"
                startContent={<span className="text-gray-500">$</span>}
                placeholder="0"
                isRequired
                value={formik.values.budgetAmount.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                    formik.setFieldValue("budgetAmount", value);
                  }
                }}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!formik.touched.budgetAmount && !!formik.errors.budgetAmount
                }
                errorMessage={
                  formik.touched.budgetAmount && formik.errors.budgetAmount
                }
              />
            </div>

            {isEdit && (
              <div className="col-span-2 sm:col-span-1">
                <Input
                  size="sm"
                  radius="sm"
                  label="Actual Spent"
                  labelPlacement="outside-top"
                  name="actualSpent"
                  type="number"
                  startContent={<span className="text-gray-500">$</span>}
                  placeholder="0"
                  max={formik.values.budgetAmount}
                  value={formik.values.actualSpent?.toString() ?? ""}
                  onChange={(e) =>
                    formik.setFieldValue("actualSpent", e.target.value)
                  }
                />
              </div>
            )}

            {isEdit && (
              <div className="col-span-2 sm:col-span-1">
                <Input
                  size="sm"
                  radius="sm"
                  label="ROI (%)"
                  labelPlacement="outside-top"
                  name="roi"
                  type="number"
                  placeholder="0"
                  value={formik.values.roi?.toString() ?? ""}
                  onChange={(e) => formik.setFieldValue("roi", e.target.value)}
                />
              </div>
            )}

            <div className="col-span-2 sm:col-span-1">
              <Select
                size="sm"
                radius="sm"
                label="Period"
                labelPlacement="outside"
                placeholder="Select period"
                selectedKeys={[formik.values.period]}
                disabledKeys={[formik.values.period]}
                onSelectionChange={(keys) =>
                  formik.setFieldValue("period", Array.from(keys)[0] || "")
                }
                onBlur={formik.handleBlur("period")}
                isInvalid={!!formik.touched.period && !!formik.errors.period}
                errorMessage={formik.touched.period && formik.errors.period}
              >
                {BUDGET_DURATIONS.map((duration) => (
                  <SelectItem key={duration.value}>{duration.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Select
                size="sm"
                radius="sm"
                label="Priority"
                labelPlacement="outside"
                placeholder="Select priority"
                selectedKeys={[formik.values.priority]}
                disabledKeys={[formik.values.priority]}
                onSelectionChange={(keys) =>
                  formik.setFieldValue("priority", Array.from(keys)[0] || "")
                }
                onBlur={formik.handleBlur("priority")}
                isInvalid={
                  !!formik.touched.priority && !!formik.errors.priority
                }
                errorMessage={formik.touched.priority && formik.errors.priority}
              >
                {PRIORITY_LEVELS.map((level) => (
                  <SelectItem key={level.value}>{level.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Select
                size="sm"
                radius="sm"
                label="Status"
                labelPlacement="outside"
                placeholder="Select status"
                selectedKeys={[formik.values.status]}
                disabledKeys={[formik.values.status]}
                onSelectionChange={(keys) =>
                  formik.setFieldValue("status", Array.from(keys)[0] || "")
                }
                onBlur={formik.handleBlur("status")}
                isInvalid={!!formik.touched.status && !!formik.errors.status}
                errorMessage={formik.touched.status && formik.errors.status}
              >
                {BUDGET_STATUSES.map((status) => (
                  <SelectItem key={status.value}>{status.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="col-span-2">
              <Textarea
                size="sm"
                radius="sm"
                label="Description"
                labelPlacement="outside-top"
                name="description"
                placeholder="Brief description of this budget item"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!formik.touched.description && !!formik.errors.description
                }
                errorMessage={
                  formik.touched.description && formik.errors.description
                }
                classNames={{ inputWrapper: "py-2" }}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <DatePicker
                size="sm"
                radius="sm"
                label="Start Date"
                labelPlacement="outside"
                isRequired
                value={
                  formik.values.startDate
                    ? parseDate(formik.values.startDate)
                    : null
                }
                onChange={(date) => {
                  formik.setFieldValue(
                    "startDate",
                    date ? date.toString() : ""
                  );
                }}
                onBlur={() => formik.setFieldTouched("startDate", true)}
                isInvalid={
                  !!formik.touched.startDate && !!formik.errors.startDate
                }
                errorMessage={
                  formik.touched.startDate && formik.errors.startDate
                }
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <DatePicker
                size="sm"
                radius="sm"
                label="End Date"
                labelPlacement="outside"
                value={
                  formik.values.endDate
                    ? parseDate(formik.values.endDate)
                    : null
                }
                minValue={
                  formik.values.startDate
                    ? parseDate(formik.values.startDate)
                    : null
                }
                onChange={(date) => {
                  formik.setFieldValue(
                    "endDate",
                    date ? date.toString() : null
                  );
                }}
                isRequired
                onBlur={() => formik.setFieldTouched("endDate", true)}
                isInvalid={!!formik.touched.endDate && !!formik.errors.endDate}
                errorMessage={formik.touched.endDate && formik.errors.endDate}
              />
            </div>
          </ModalBody>

          <ModalFooter className="flex flex-col justify-end gap-2 px-5 pb-5 pt-0">
            {isEdit && (
              <div className="col-span-2 rounded-md bg-gray-100 px-4 py-3">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-600">Remaining Budget:</span>
                  <span className="font-medium">
                    $
                    {formik.values.budgetAmount && formik.values.actualSpent
                      ? formik.values.budgetAmount - formik.values.actualSpent
                      : 0}
                  </span>
                </div>

                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-600">Budget Utilization:</span>
                  <span className="font-medium">{utilization.toFixed(1)}%</span>
                </div>

                {/* Progress Bar */}
                <Progress
                  aria-label="Budget utilization"
                  value={utilization}
                  color="primary"
                  className="h-2"
                  radius="full"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-2">
              <Button
                size="sm"
                variant="ghost"
                onPress={onClose}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="solid"
                color="primary"
                type="submit"
                isLoading={isLoading}
                isDisabled={isLoading || !formik.isValid || !formik.dirty}
              >
                {buttonLabel}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
