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
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
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
    "Description must be at most 200 characters.",
  ),
  startDate: Yup.string().required("Start Date is required."),
  endDate: Yup.string().required("End Date is required."),
});

// ... (imports remain)
import { useState } from "react";

// ... (schema remains)

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
  syncedProviders = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  editedData: BudgetItem | null;
  setCurrentFilters: any;
  syncedProviders?: string[];
}) {
  const isEdit = !!editedData;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingValues, setPendingValues] = useState<BudgetFormValues | null>(
    null,
  );
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const { data: categories } = useBudgetCategories();
  const createMutation = useCreateBudgetItem();
  const updateMutation = useUpdateBudgetItem(editedData?._id || "");
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // @ts-ignore
  const initialValues: BudgetFormValues = useMemo(() => {
    if (editedData) {
      const categoryId =
        typeof editedData.category === "string"
          ? editedData.category
          : editedData.category?._id || "";
      const subCategoryId =
        typeof editedData.subCategory === "string"
          ? editedData.subCategory
          : editedData.subCategory?._id || "";

      return {
        category: categoryId,
        subCategory: subCategoryId,
        budgetAmount: editedData.amount, // Updated from budget to amount
        actualSpent: Number(editedData.spent) || "",
        roi: Number(editedData.roi) || "",
        period: editedData.period || "monthly",
        priority: editedData.priority || "medium",
        status: editedData.status || "active",
        description: editedData.description || "",
        startDate: editedData.startDate
          ? editedData.startDate.split("T")[0]
          : "",
        endDate: editedData.endDate ? editedData.endDate.split("T")[0] : "",
      };
    }
    return {
      category: "",
      subCategory: "",
      budgetAmount: "",
      actualSpent: "",
      roi: "",
      period: "monthly",
      priority: "medium",
      status: "active",
      description: "",
      startDate: "",
      endDate: "",
    };
  }, [editedData]);

  const proceedWithSubmission = (values: BudgetFormValues) => {
    const payload = {
      amount: Number(values.budgetAmount), // Updated key
      spent: Number(values.actualSpent),
      roi: Number(values.roi),
      period: values.period,
      priority: values.priority,
      status: values.status,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      category: values.category, // Updated key
      subCategory: values.subCategory, // Updated key
    };

    if (isEdit) {
      updateMutation.mutate({ id: editedData._id, data: payload as any });
    } else {
      createMutation.mutate(payload as any);
    }

    setCurrentFilters((prev: any) => ({
      ...prev,
      period: values.period,
    }));
    setShowConfirmation(false);
    setPendingValues(null);
  };

  const formik = useFormik<BudgetFormValues>({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      // Logic to check for synced conflicts only for NEW items
      if (!isEdit && categories) {
        // Find the selected subcategory title
        let selectedSubCategoryTitle = "";
        for (const cat of categories) {
          const found = cat.subCategory.find(
            (sub) => sub._id === values.subCategory,
          );
          if (found) {
            selectedSubCategoryTitle = found.subCategory;
            break;
          }
        }

        const lowerTitle = selectedSubCategoryTitle.toLowerCase();
        let conflictProvider = "";

        if (
          lowerTitle.includes("google ads") &&
          syncedProviders.includes("google")
        ) {
          conflictProvider = "Google Ads";
        } else if (
          (lowerTitle.includes("meta") ||
            lowerTitle.includes("facebook") ||
            lowerTitle.includes("instagram")) &&
          syncedProviders.includes("meta")
        ) {
          conflictProvider = "Meta Ads";
        } else if (
          lowerTitle.includes("tiktok") &&
          syncedProviders.includes("tiktok")
        ) {
          conflictProvider = "TikTok Ads";
        }

        if (conflictProvider) {
          setConfirmationMessage(
            `${conflictProvider} is already synced. Do you want to add another item of ${conflictProvider}?`,
          );
          setPendingValues(values);
          setShowConfirmation(true);
          return;
        }
      }

      proceedWithSubmission(values);
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
          <ModalHeader className="p-4 pb-0 flex-col">
            <h2 className="leading-none font-medium text-base text-foreground">
              {modalTitle}
            </h2>
            <p className="text-xs text-gray-600 dark:text-foreground/60 mt-2 font-normal">
              {isEdit
                ? `Update the details for ${
                    typeof editedData.category === "string"
                      ? "this"
                      : editedData.category?.category
                  } budget item.`
                : "Create a new budget item to track your marketing spend across different categories and periods."}
            </p>
          </ModalHeader>

          <ModalBody className="px-4 py-4 grid grid-cols-2 gap-4">
            {/* ... form fields ... */}
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
                disabledKeys={
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
                  <SelectItem key={cat._id}>{cat.category}</SelectItem>
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
                disabledKeys={
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
                    (category: any) => category._id === formik.values.category,
                  )?.subCategory || []
                ).map((cat: any) => (
                  <SelectItem key={cat._id}>{cat.subCategory}</SelectItem>
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
                startContent={
                  <span className="text-gray-500 dark:text-foreground/40">
                    $
                  </span>
                }
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
                  startContent={
                    <span className="text-gray-500 dark:text-foreground/40">
                      $
                    </span>
                  }
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
                isRequired
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
                isRequired
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
                isRequired
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
                minValue={today(getLocalTimeZone())}
                value={
                  formik.values.startDate
                    ? parseDate(formik.values.startDate)
                    : null
                }
                onChange={(date) => {
                  formik.setFieldValue(
                    "startDate",
                    date ? date.toString() : "",
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
                    date ? date.toString() : null,
                  );
                }}
                isRequired
                onBlur={() => formik.setFieldTouched("endDate", true)}
                isInvalid={!!formik.touched.endDate && !!formik.errors.endDate}
                errorMessage={formik.touched.endDate && formik.errors.endDate}
              />
            </div>
          </ModalBody>

          <ModalFooter className="flex flex-col justify-end gap-2 px-4 pb-4 pt-0">
            {isEdit && (
              <div className="col-span-2 rounded-md bg-gray-100 dark:bg-default-100 px-4 py-3 border border-transparent dark:border-default-200/50">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-600 dark:text-foreground/60">
                    Remaining Budget:
                  </span>
                  <span className="font-medium text-foreground">
                    $
                    {formik.values.budgetAmount && formik.values.actualSpent
                      ? (
                          (formik.values.budgetAmount as number) -
                          (formik.values.actualSpent as number)
                        ).toLocaleString()
                      : 0}
                  </span>
                </div>

                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-600 dark:text-foreground/60">
                    Budget Utilization:
                  </span>
                  <span className="font-medium text-foreground">
                    {utilization.toFixed(1)}%
                  </span>
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

            <div className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onPress={onClose}
                className="border border-gray-300 dark:border-default-200 text-gray-700 dark:text-foreground/70 hover:bg-gray-50 dark:hover:bg-default-100"
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
                isDisabled={isLoading || !formik.isValid}
              >
                {buttonLabel}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>

      <Modal
        isOpen={showConfirmation}
        onOpenChange={(open) => {
          if (!open) {
            setShowConfirmation(false);
            setPendingValues(null);
          }
        }}
        size="sm"
        classNames={{
          base: `max-sm:m-1 m-0`,
          closeButton: "cursor-pointer",
          // content: "!top-10 translate-y-0",
        }}
      >
        <ModalContent className="p-0">
          <ModalHeader className="p-4 pb-3 leading-none font-medium text-base text-foreground">
            Confirmation
          </ModalHeader>
          <ModalBody className="px-4 py-0">
            <p className="text-sm text-foreground/80">{confirmationMessage}</p>
          </ModalBody>
          <ModalFooter className="p-4">
            <Button
              size="sm"
              radius="sm"
              variant="ghost"
              color="default"
              onPress={() => {
                setShowConfirmation(false);
                setPendingValues(null);
              }}
              className="border-small border-gray-300 dark:border-default-200 text-gray-700 dark:text-foreground/70 hover:bg-gray-50 dark:hover:bg-default-100"
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              size="sm"
              radius="sm"
              isDisabled={isLoading}
              isLoading={isLoading}
              onPress={() => {
                if (pendingValues) {
                  proceedWithSubmission(pendingValues);
                }
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Modal>
  );
}
