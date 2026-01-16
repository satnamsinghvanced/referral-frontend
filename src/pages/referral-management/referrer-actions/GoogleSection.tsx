import { FormikProps } from "formik";

interface GoogleSectionProps {
  formik: FormikProps<any>;
  renderField: (field: any) => any;
}

export default function GoogleSection({
  formik,
  renderField,
}: GoogleSectionProps) {
  const googleFields = [
    {
      id: "googleReferrer.glSource",
      label: "Source",
      type: "select",
      options: [
        { _id: "Google", title: "Google" },
        { _id: "Bing", title: "Bing" },
        { _id: "Yahoo", title: "Yahoo" },
        { _id: "Website", title: "Website" },
        { _id: "Google Ads", title: "Google Ads" },
        { _id: "Other Online", title: "Other Online" },
      ],
      placeholder: "Select online source",
      isRequired: true,
      isFullWidth: true,
    },
    {
      id: "googleReferrer.glPlatform",
      label: "Platform/Channel (Optional)",
      type: "text",
      placeholder: "e.g., Organic Search, Display Ads, Search Campaign",
      isFullWidth: true,
    },
    {
      id: "googleReferrer.glUrl",
      label: "Campaign URL / Landing Page",
      type: "url",
      placeholder: "https://example.com/campaign",
      isFullWidth: true,
    },
  ];

  return (
    <div className="border border-foreground/10 rounded-xl p-4">
      <h5 className="text-sm font-medium mb-3 dark:text-white">
        Google/Online Information
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2.5">
        {googleFields.map((f) => (
          <div key={f.id} className={f.isFullWidth ? "md:col-span-2" : ""}>
            {renderField(f)}
          </div>
        ))}
      </div>
    </div>
  );
}
