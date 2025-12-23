import { FormikProps } from "formik";

interface AdditionalNotesSectionProps {
  formik: FormikProps<any>;
  renderField: (field: any) => any;
}

export default function AdditionalNotesSection({
  formik,
  renderField,
}: AdditionalNotesSectionProps) {
  const notesField = [
    {
      id: "additionalNotes",
      label: "Notes (optional)",
      type: "textarea",
      placeholder: "Any additional information about this referrer...",
      minRows: 2,
    },
  ];

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <h5 className="text-sm font-medium mb-3">Additional Information</h5>
      <div className="grid grid-cols-1 gap-4">
        {notesField.map(renderField)}
      </div>
    </div>
  );
}
