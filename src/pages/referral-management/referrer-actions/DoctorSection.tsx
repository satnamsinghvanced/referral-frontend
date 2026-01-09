import { FormikProps } from "formik";
import { CATEGORY_OPTIONS } from "../../../consts/filters";

interface DoctorSectionProps {
  formik: FormikProps<any>;
  renderField: (field: any) => any;
  specialties: any[];
}

export default function DoctorSection({
  formik,
  renderField,
  specialties,
}: DoctorSectionProps) {
  const doctorFields = [
    {
      id: "practiceName",
      label: "Practice Name",
      type: "text",
      placeholder: "Enter practice name",
      isRequired: true,
    },
    {
      id: "partnershipLevel",
      label: "Referrer Level",
      type: "select",
      options: CATEGORY_OPTIONS,
      placeholder: "Select level",
      isRequired: true,
    },
    {
      id: "practiceType",
      label: "Type of Practice",
      type: "select",
      options: specialties,
      placeholder: "Select specialty",
      isFullWidth: true,
      isRequired: true,
    },
    {
      id: "practiceAddress",
      label: "Practice Address",
      type: "group",
      isFullWidth: true,
      isRequired: true,
      subFields: [
        {
          id: "addressLine1",
          placeholder: "123 Main Street, Suite 100",
          isRequired: true,
          type: "text",
        },
        {
          id: "addressLine2",
          placeholder: "Address Line 2 (Optional)",
          type: "text",
        },
        {
          id: "city",
          placeholder: "City",
          type: "text",
          isRequired: true,
        },
        {
          id: "state",
          placeholder: "State",
          type: "text",
          isRequired: true,
        },
        {
          id: "zip",
          placeholder: "Zip",
          type: "text",
          isRequired: true,
        },
      ],
    },
    {
      id: "website",
      label: "Website",
      type: "url",
      placeholder: "https://www.practice.com",
      isFullWidth: true,
    },
  ];

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <h5 className="text-sm font-medium mb-3">Practice Information</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2.5">
        {doctorFields.map((f) => (
          <div key={f.id} className={f.isFullWidth ? "md:col-span-2" : ""}>
            {renderField(f)}
          </div>
        ))}
      </div>
    </div>
  );
}
