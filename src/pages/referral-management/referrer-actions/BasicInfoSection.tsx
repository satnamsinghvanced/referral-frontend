import { FormikProps } from "formik";

interface BasicInfoSectionProps {
  formik: FormikProps<any>;
  renderField: (field: any) => any;
}

export default function BasicInfoSection({
  formik,
  renderField,
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
      isRequired: true,
    },
  ];

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <h5 className="text-sm font-medium mb-3">Basic Information</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2.5">
        {basicFields.map(renderField)}
      </div>
    </div>
  );
}
