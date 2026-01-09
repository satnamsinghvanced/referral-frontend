import { FormikProps } from "formik";

interface CommunitySectionProps {
  formik: FormikProps<any>;
  renderField: (field: any) => any;
}

export default function CommunitySection({
  formik,
  renderField,
}: CommunitySectionProps) {
  const communityFields = [
    {
      id: "communityReferrer.orgName",
      label: "Organization/Group Name",
      type: "text",
      placeholder: "Rotary Club, Chamber of Commerce, etc.",
      isRequired: true,
      isFullWidth: true,
    },
    {
      id: "communityReferrer.orgAddress",
      label: "Organization Address (Optional)",
      type: "text",
      placeholder: "123 Community Street",
      isFullWidth: true,
    },
    {
      id: "communityReferrer.orgUrl",
      label: "Organization Website",
      type: "url",
      placeholder: "https://www.organization.com",
      isFullWidth: true,
    },
  ];

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <h5 className="text-sm font-medium mb-3">Community Information</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2.5">
        {communityFields.map((f) => (
          <div key={f.id} className={f.isFullWidth ? "md:col-span-2" : ""}>
            {renderField(f)}
          </div>
        ))}
      </div>
    </div>
  );
}
