import { Card, CardBody } from "@heroui/react";
import { FiZap, FiPhone, FiGitCommit, FiMic, FiArrowRight, FiUserCheck, FiUsers, FiPhoneCall } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const PIPELINE_STEPS = [
  {
    step: "Step 1",
    title: "Patient Calls Your Phone Service Number",
    description: "Your practice shares its Phone Service number. Patients call it just like any office line.",
    icon: <FiPhone className="w-4 h-4" />,
    borderColor: "border-sky-200 dark:border-sky-900/40",
    hoverBorderColor: "hover:border-sky-300",
    bgColor: "bg-sky-50/20 dark:bg-sky-950/10",
    iconBgColor: "bg-sky-100 dark:bg-sky-900/40 text-primary",
    textColor: "text-primary",
  },
  {
    step: "Step 2",
    title: "IVR Routes the Call",
    description: "\u201cPress 1 for new patients, Press 2 for existing.\u201d Phone Service forwards to the right office line.",
    icon: <FiGitCommit className="w-4 h-4" />,
    borderColor: "border-purple-200 dark:border-purple-900/40",
    hoverBorderColor: "hover:border-purple-300",
    bgColor: "bg-purple-50/20 dark:bg-purple-950/10",
    iconBgColor: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    step: "Step 3",
    title: "Call Is Recorded & Transcribed",
    description: "The full conversation is recorded. AI transcribes it in real time, extracting key details.",
    icon: <FiMic className="w-4 h-4" />,
    borderColor: "border-pink-200 dark:border-pink-900/40",
    hoverBorderColor: "hover:border-pink-300",
    bgColor: "bg-pink-50/20 dark:bg-pink-950/10",
    iconBgColor: "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400",
    textColor: "text-pink-600 dark:text-pink-400",
  },
  {
    step: "Step 4",
    title: "Lead Form Auto-Filled",
    description: "Name, insurance, reason for call, and requested date are pulled from the transcript and saved as a lead.",
    icon: <HiOutlineSparkles className="w-4 h-4" />,
    borderColor: "border-amber-200 dark:border-amber-900/40",
    hoverBorderColor: "hover:border-amber-300",
    bgColor: "bg-amber-50/20 dark:bg-amber-950/10",
    iconBgColor: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
    textColor: "text-amber-600 dark:text-amber-400",
  },
];

export default function TwilioPipelineOverview() {
  return (
    <Card className="shadow-none border border-foreground/10 rounded-2xl bg-background p-5">
      <CardBody className="p-0 flex flex-col gap-5">
        <div>
          <div className="flex items-center gap-2">
            <FiZap className="w-4 h-4 text-primary" />
            <h3 className="text-base font-bold text-foreground">
              How Your Phone Service Integration Works
            </h3>
          </div>
          <p className="text-xs text-foreground-500 mt-0.5">
            Every inbound call flows through this pipeline automatically
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {PIPELINE_STEPS.map((item, idx) => {
            const isLast = idx === PIPELINE_STEPS.length - 1;
            return (
              <div
                key={item.step}
                className={`border ${item.borderColor} ${item.bgColor} rounded-xl p-4 flex flex-col justify-between relative group ${item.hoverBorderColor} transition-all`}
              >
                <div>
                  <div className={`w-8 h-8 rounded-xl ${item.iconBgColor} flex items-center justify-center mb-3`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${item.textColor} block mb-1`}>
                    {item.step}
                  </span>
                  <h4 className="text-sm font-bold text-foreground mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-foreground-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {!isLast && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 bg-background border border-foreground/10 rounded-full p-1 text-foreground-400 shadow-xs">
                    <FiArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="pt-2 border-t border-foreground/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-foreground-500">
          <span className="font-bold tracking-wider uppercase text-[10px] text-foreground-400">
            Routing Options:
          </span>
          <div className="flex items-center gap-1.5">
            <FiUserCheck className="w-3.5 h-3.5 text-primary" />
            <span>New patients — forward to your new-patient line</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiUsers className="w-3.5 h-3.5 text-purple-500" />
            <span>Existing patients — forward to your existing-patient line</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiPhoneCall className="w-3.5 h-3.5 text-emerald-500" />
            <span>Or use a single number for both</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}