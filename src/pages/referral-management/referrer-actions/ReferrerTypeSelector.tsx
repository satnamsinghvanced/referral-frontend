import { Select, SelectItem } from "@heroui/react";
import { FormikProps } from "formik";

interface ReferrerTypeSelectorProps {
  formik: FormikProps<any>;
  isPracticeEdit: boolean;
  editedData: any;
}

export default function ReferrerTypeSelector({
  formik,
  isPracticeEdit,
  editedData,
}: ReferrerTypeSelectorProps) {
  if (isPracticeEdit) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <Select
        size="sm"
        label="Referrer Type"
        labelPlacement="outside"
        isRequired
        placeholder="Select type"
        selectedKeys={[formik.values.type]}
        disabledKeys={[formik.values.type]}
        onSelectionChange={(keys) =>
          formik.setFieldValue("type", Array.from(keys)[0] as string)
        }
        classNames={{ label: "text-sm font-medium" }}
        isDisabled={!!editedData?.type}
      >
        <SelectItem key="doctor">Doctor Referrer</SelectItem>
        <SelectItem key="patient">Patient Referrer</SelectItem>
        <SelectItem key="communityreferrer">Community Referrer</SelectItem>
        <SelectItem key="googlereferrer">Google Referrer</SelectItem>
        <SelectItem key="socialmediareferrer">Social Media Referrer</SelectItem>
        <SelectItem key="eventreferrer">Event Referrer</SelectItem>
      </Select>
    </div>
  );
}
