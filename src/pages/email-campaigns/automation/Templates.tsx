import { Button, Chip } from "@heroui/react";
import { BiHeart } from "react-icons/bi";
import { FaEdit, FaRegStar } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { LuHandshake } from "react-icons/lu";
import { MdOutlineWavingHand } from "react-icons/md";

const TEMPLATES_DATA = [
  {
    title: "Welcome Series",
    description: "Onboard new referral partners with a 3-email sequence",
    emails: 3,
    tag: "referral-outreach",
    icon: MdOutlineWavingHand,
    iconBgClass:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
  },
  {
    title: "Partner Nurture",
    description: "Build relationships with existing partners",
    emails: 5,
    tag: "referral-outreach",
    icon: LuHandshake,
    iconBgClass:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  },
  {
    title: "Patient Follow-up",
    description: "Follow up with patients after treatment",
    emails: 4,
    tag: "patient-follow-up",
    icon: BiHeart,
    iconBgClass:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  {
    title: "Review Request",
    description: "Automated review request sequence",
    emails: 2,
    tag: "patient-follow-up",
    icon: FaRegStar,
    iconBgClass:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
  },
];

const Templates = () => {
  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex flex-col gap-4 bg-background border border-foreground/10 rounded-xl p-4">
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
                className="bg-content1 border border-foreground/10 rounded-xl p-4"
                key={index}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    {/* <div className={clsx("p-2 rounded-lg", iconBgClass)}>
                      <Icon className="w-5 h-5" />
                    </div> */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">{title}</h4>
                      <p className="text-xs text-gray-600 dark:text-foreground/60">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-foreground/10">
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500 dark:text-foreground/50">
                      {emails} emails
                    </p>
                    {/* <Chip
                      size="sm"
                      radius="sm"
                      className="h-5 text-[11px] text-[#0c4a6e] bg-[#e0f2fe] dark:bg-sky-500/10 dark:text-sky-400 border-none"
                    >
                      {tag}
                    </Chip> */}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      radius="sm"
                      variant="ghost"
                      onPress={() => {}}
                      className="border-small"
                      startContent={<FiEdit size={14} />}
                    >
                      Customize
                    </Button>
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Templates;
