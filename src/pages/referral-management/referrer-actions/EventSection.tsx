import { FormikProps } from "formik";

interface EventSectionProps {
  formik: FormikProps<any>;
  renderField: (field: any) => any;
}

export default function EventSection({
  formik,
  renderField,
}: EventSectionProps) {
  const eventFields = [
    {
      id: "eventReferrer.evName",
      label: "Event Name",
      type: "text",
      placeholder: "Community Health Fair, School Event, etc.",
      isRequired: true,
      isFullWidth: true,
    },
    {
      id: "eventReferrer.evLocation",
      label: "Event Location",
      type: "text",
      placeholder: "123 Event Center Drive",
      isFullWidth: true,
    },
    {
      id: "eventReferrer.evType",
      label: "Event Type",
      type: "select",
      options: [
        { _id: "Health Fair", title: "Health Fair" },
        { _id: "Community Event", title: "Community Event" },
        { _id: "School Event", title: "School Event" },
        { _id: "Sports Event", title: "Sports Event" },
        { _id: "Trade Show", title: "Trade Show" },
        { _id: "Charity Event", title: "Charity Event" },
        { _id: "Other", title: "Other" },
      ],
      placeholder: "Select event type",
      isRequired: true,
      isFullWidth: true,
    },
    {
      id: "eventReferrer.evUrl",
      label: "Campaign URL / Landing Page",
      type: "url",
      placeholder: "https://example.com/campaign",
      isFullWidth: true,
    },
  ];

  return (
    <div className="border border-foreground/10 rounded-xl p-4">
      <h5 className="text-sm font-medium mb-3 dark:text-white">
        Event Information
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2.5">
        {eventFields.map((f) => (
          <div key={f.id} className={f.isFullWidth ? "md:col-span-2" : ""}>
            {renderField(f)}
          </div>
        ))}
      </div>
    </div>
  );
}
