import { Button, Chip } from "@heroui/react";
import clsx from "clsx";
import { BiHeart } from "react-icons/bi";
import { FaRegStar } from "react-icons/fa";
import { LuHandshake } from "react-icons/lu";
import { MdOutlineWavingHand } from "react-icons/md";

const TEMPLATES_DATA = [
  {
    title: "Welcome Series",
    description: "Onboard new referral partners with a 3-email sequence",
    emails: 3,
    tag: "referral-outreach",
    icon: MdOutlineWavingHand,
    iconBgClass: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Partner Nurture",
    description: "Build relationships with existing partners",
    emails: 5,
    tag: "referral-outreach",
    icon: LuHandshake,
    iconBgClass: "bg-orange-100 text-orange-600",
  },
  {
    title: "Patient Follow-up",
    description: "Follow up with patients after treatment",
    emails: 4,
    tag: "patient-follow-up",
    icon: BiHeart,
    iconBgClass: "bg-blue-100 text-blue-600",
  },
  {
    title: "Review Request",
    description: "Automated review request sequence",
    emails: 2,
    tag: "patient-follow-up",
    icon: FaRegStar,
    iconBgClass: "bg-yellow-100 text-yellow-600",
  },
];

const Templates = () => {
  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-4 border border-foreground/10 rounded-xl p-4">
        <h4 className="font-medium text-sm">Automation Templates</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {TEMPLATES_DATA.map((template, index) => {
            const {
              title,
              description,
              emails,
              tag,
              icon: Icon,
              iconBgClass,
            } = template;

            return (
              <div
                className="border border-foreground/10 rounded-xl p-4"
                key={index}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={clsx("p-2 rounded-lg", iconBgClass)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">{title}</h4>
                      <p className="text-xs text-gray-600">{description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-foreground/10">
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500">{emails} emails</p>
                    <Chip
                      size="sm"
                      radius="sm"
                      className="h-5 text-[11px] text-[#0c4a6e] bg-[#e0f2fe]"
                    >
                      {tag}
                    </Chip>
                  </div>

                  <Button
                    size="sm"
                    radius="sm"
                    variant="solid"
                    color="primary"
                    onPress={() => console.log(`Using template: ${title}`)}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Templates;
