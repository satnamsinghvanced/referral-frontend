import { FormikProps } from "formik";
import { Select, SelectItem } from "@heroui/react";
import { Location } from "../../../types/common";

interface BasicInfoSectionProps {
  formik: FormikProps<any>;
  renderField: (field: any) => any;
  isEdit: boolean;
  locations?: Location[];
}
export default function BasicInfoSection({
  formik,
  renderField,
  isEdit,
  locations = [],
}: BasicInfoSectionProps) {
  const basicFields = [
    {
      id: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter full name",
      isRequired: true,
    },
    {
      id: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "e.g., (123) 456-7890",
      isRequired: true,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "e.g., johndoe@gmail.com",
      isFullWidth: true,
      isRequired: false,
      isDisabled: isEdit && !!formik.initialValues?.email?.trim(),
    },
  ];
  return (
    <div className="border border-foreground/10 rounded-xl p-4 space-y-4">
      <h5 className="text-sm font-medium dark:text-white">
        Basic Information
      </h5>
      {locations && locations.length > 0 && (
        <div className="flex">
          <Select
            label="Practice Location"
            labelPlacement="outside"
            placeholder="Select practice location"
            isRequired
            size="sm"
            radius="sm"
            variant="flat"
            disableAnimation
            popoverProps={{ disableAnimation: true, shouldCloseOnScroll: false }}
            selectedKeys={
              formik.values.locationId ? [formik.values.locationId] : []
            }
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0] as string;
              formik.setFieldValue("locationId", val);
            }}
            onBlur={() => formik.setFieldTouched("locationId", true)}
            isInvalid={
              !!(formik.errors.locationId && formik.touched.locationId)
            }
            errorMessage={formik.errors.locationId as string}
          >
            {locations.map((loc) => (
              <SelectItem key={loc._id} textValue={loc.name}>
                {loc.name} {loc.isPrimary ? "(Primary)" : ""}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2.5">
        {basicFields.map(renderField)}
      </div>
    </div>
  );
}
