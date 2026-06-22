import { LuCheck } from "react-icons/lu";
import { FiSmartphone, FiCode, FiShield, FiMessageSquare } from "react-icons/fi";
import { LuPalette } from "react-icons/lu";

interface Step {
  name: string;
  desc: string;
}
interface SetupStepperProps {
  steps: Step[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  isPublished?: boolean;
}

export default function SetupStepper({ steps, activeStep, setActiveStep, isPublished }: SetupStepperProps) {
  const getStepIcon = (index: number, colorClass: string) => {
    switch (index) {
      case 0:
        return <LuPalette className={`w-4 h-4 ${colorClass}`} />;
      case 1:
        return <FiMessageSquare className={`w-4 h-4 ${colorClass}`} />;
      case 2:
        return <FiSmartphone className={`w-4 h-4 ${colorClass}`} />;
      case 3:
        return <FiShield className={`w-4 h-4 ${colorClass}`} />;
      case 4:
      default:
        return <FiCode className={`w-4 h-4 ${colorClass}`} />;
    }
  };
  return (
    <div className="">
      <div className="-mx-6 w-[calc(100%+3rem)] border-b border-foreground/10 px-6 pb-4 mb-6">
        <p className="text-sm font-semibold tracking-wider mb-1 font-sans">
          Setup Wizard
        </p>
        <p className="text-xs text-default-500 font-sans">
          Follow these steps to configure your chat widget
        </p>
      </div>
      <div className="relative flex justify-between items-start w-full mt-10 mb-8 p-0 isolate">
        <div className="absolute top-[28px] left-[28px] right-[28px] h-[3px] bg-default-200 dark:bg-default-100/50 -z-10">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-in-out"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;
          return (
            <div
              key={idx}
              className={`flex flex-col relative z-10 group w-14 ${idx <= activeStep || isPublished ? "cursor-pointer" : "cursor-default"} ${idx == 0 ? "items-start" : "items-center"} ${idx == steps.length - 1 ? "items-end" : "items-center"}`}
              onClick={() => {
                if (idx <= activeStep || isPublished) {
                  setActiveStep(idx);
                }
              }}
            >
              <div className="w-14 h-14 rounded-full bg-white dark:bg-content1 flex items-center justify-center flex-shrink-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-200 bg-background
                  ${isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isActive
                      ? "bg-primary border-primary text-white shadow-sm shadow-primary/20 dark:shadow-none"
                      : "border-default-300 dark:border-default-200 text-default-400"
                  }`}
                >
                  {isCompleted ? (
                    <LuCheck className="w-4.5 h-4.5 font-bold" />
                  ) : (
                    getStepIcon(idx, isActive ? "text-white" : "text-default-400")
                  )}
                </div>
              </div>
              <span className={`${idx == 0 ? "text-start" : "text-center"} ${idx == steps.length - 1 ? "text-end" : "text-center"}  text-[10px] md:text-xs font-semibold mt-2.5 truncate font-sans
                ${isActive ? "text-primary font-bold" : isCompleted ? "text-emerald-500" : "text-default-500"}`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
