import { Button } from "@heroui/react";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router";
import { STEPS } from "../consts/tour";
import { CgClose } from "react-icons/cg";

interface TourContextType {
  startTour: () => void;
  closeTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  isOpen: boolean;
}
const TourContext = createContext<TourContextType | undefined>(undefined);
export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const location = useLocation();
  const requestRef = useRef<number | null>(null);
  const currentStep = STEPS[currentStepIndex];
  const updateRect = () => {
    if (currentStep) {
      const el = document.querySelector(currentStep.selector);
      if (el) {
        setTargetElement(el);
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetElement(null);
        setTargetRect(null);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateRect();
      window.addEventListener("resize", updateRect);
      window.addEventListener("scroll", updateRect, true);
      const interval = setInterval(updateRect, 500);

      return () => {
        window.removeEventListener("resize", updateRect);
        window.removeEventListener("scroll", updateRect, true);
        clearInterval(interval);
      };
    }
  }, [isOpen, currentStepIndex, location.pathname]);

  useEffect(() => {
    if (isOpen && targetElement) {
      const handleAdvance = () => {
        nextStep();
      };


      targetElement.addEventListener("click", handleAdvance);

      return () => {
        targetElement.removeEventListener("click", handleAdvance);
      };
    }
  }, [isOpen, targetElement]);
  const startTour = () => {
    setCurrentStepIndex(0);
    setIsOpen(true);
  };

  const closeTour = () => {
    setIsOpen(false);
    setCurrentStepIndex(0);
  };

  const nextStep = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentStepIndex < STEPS.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        setIsTransitioning(false);
      } else {
        closeTour();
        setIsTransitioning(false);
      }
    }, 1000);
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <TourContext.Provider
      value={{
        startTour,
        closeTour,
        nextStep,
        prevStep,
        currentStep: currentStepIndex,
        isOpen,
      }}
    >
      {children}
      {isOpen && !isTransitioning && targetRect && targetElement && (
        <TourOverlay
          rect={targetRect}
          step={currentStep}
          totalSteps={STEPS.length}
          currentStepIndex={currentStepIndex}
          onNext={nextStep}
          onPrev={prevStep}
          onClose={closeTour}
        />
      )}
    </TourContext.Provider>
  );
};

const TourOverlay = ({
  rect,
  step,
  totalSteps,
  currentStepIndex,
  onNext,
  onPrev,
  onClose,
}: any) => {

  const tooltipStyle: React.CSSProperties = {
    position: "absolute",
    top: rect.top + window.scrollY,
    left: rect.right + 20 + window.scrollX,
    zIndex: 9999,
  };

  if (rect.right + 350 > window.innerWidth) {
    tooltipStyle.left = rect.left - 370 + window.scrollX;
  }
  if (rect.top + 200 > window.innerHeight + window.scrollY) {
    tooltipStyle.top = rect.bottom - 200 + window.scrollY;
  }

  const maskPath = `
    M 0 0
    L ${window.innerWidth} 0
    L ${window.innerWidth} ${window.innerHeight}
    L 0 ${window.innerHeight}
    L 0 0
    M ${rect.left} ${rect.top}
    l 0 ${rect.height}
    l ${rect.width} 0
    l 0 -${rect.height}
    l -${rect.width} 0
    z
  `;

  return (
    <div className="fixed inset-0 z-[5000] pointer-events-none">
      <svg
        width="100%"
        height="100%"
        className="fixed inset-0 pointer-events-none"
      >
        <path
          d={maskPath}
          fill="rgba(0, 0, 0, 0.6)"
          fillRule="evenodd"
          className="pointer-events-auto"
        />
        <rect
          x={rect.left}
          y={rect.top}
          width={rect.width}
          height={rect.height}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2"
          className="transition-all duration-300 ease-in-out pointer-events-none"
        />
      </svg>

      {!step.requiredClick && (
        <div
          className="fixed z-[5005] pointer-events-auto cursor-default"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      )}

      {/* Tooltip */}
      <div
        style={tooltipStyle}
        className="pointer-events-auto transition-all duration-300"
      >
        <div className="bg-white p-3 rounded-xl shadow-xl w-[350px] border border-foreground/10 flex flex-col gap-2 animate-fade-in relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <CgClose />
          </button>

          <div>
            <h4 className="font-medium text-sm">{step.title}</h4>
            <p className="text-xs text-gray-600 mt-1.5">{step.content}</p>
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-600 font-medium">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
            <div className="flex items-center gap-2">
              {currentStepIndex > 0 && (
                <Button
                  size="sm"
                  variant="flat"
                  onPress={onPrev}
                  className="h-8 min-w-0 px-3"
                >
                  Back
                </Button>
              )}

              {step.requiredClick ? (
                <span className="text-xs text-blue-600 font-medium animate-pulse ml-auto">
                  Click text to proceed
                </span>
              ) : (
                <Button
                  size="sm"
                  color="primary"
                  onPress={onNext}
                  className="h-8 min-w-0 px-3"
                >
                  {currentStepIndex === totalSteps - 1 ? "Finish" : "Next"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
