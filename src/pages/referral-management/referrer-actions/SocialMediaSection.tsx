import { FormikProps } from "formik";

interface SocialMediaSectionProps {
  formik: FormikProps<any>;
  renderField: (field: any) => any;
}

export default function SocialMediaSection({
  formik,
  renderField,
}: SocialMediaSectionProps) {
  const socialFields = [
    {
      id: "socialMediaReferrer.smPlatform",
      label: "Platform/Channel",
      type: "select",
      options: [
        { _id: "Facebook", title: "Facebook" },
        { _id: "Instagram", title: "Instagram" },
        { _id: "Twitter", title: "Twitter/X" },
        { _id: "LinkedIn", title: "LinkedIn" },
        { _id: "TikTok", title: "TikTok" },
        { _id: "YouTube", title: "YouTube" },
        { _id: "Snapchat", title: "Snapchat" },
        { _id: "Pinterest", title: "Pinterest" },
        { _id: "Other", title: "Other" },
      ],
      placeholder: "Select platform",
      isRequired: true,
      isFullWidth: true,
    },
    {
      id: "socialMediaReferrer.smSource",
      label: "Source Name (Optional)",
      type: "text",
      placeholder: "Campaign Name, Ad Name, etc.",
      isFullWidth: true,
    },
  ];

  return (
    <div className="border border-foreground/10 rounded-xl p-4">
      <h5 className="text-sm font-medium mb-3 dark:text-white">
        Social Media Information
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2.5">
        {socialFields.map((f) => (
          <div key={f.id} className={f.isFullWidth ? "md:col-span-2" : ""}>
            {renderField(f)}
          </div>
        ))}
      </div>
    </div>
  );
}
