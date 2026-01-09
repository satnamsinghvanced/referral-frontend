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

  // Helper to update rect on resize/scroll
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
      window.addEventListener("scroll", updateRect, true); // capture scroll
      const interval = setInterval(updateRect, 500); // Polling for robust detection

      return () => {
        window.removeEventListener("resize", updateRect);
        window.removeEventListener("scroll", updateRect, true);
        clearInterval(interval);
      };
    }
  }, [isOpen, currentStepIndex, location.pathname]); // Update on route change too

  // Handle click on target element to advance
  useEffect(() => {
    if (isOpen && targetElement) {
      const handleAdvance = () => {
        // Optional: slight delay to allow navigation to start?
        // But usually React state updates are fine.
        nextStep();
      };

      // Use capture to ensure we catch it before navigation might unmount things (though unmount happens later)
      // Actually bubble is fine usually.
      targetElement.addEventListener("click", handleAdvance);

      return () => {
        targetElement.removeEventListener("click", handleAdvance);
      };
    }
  }, [isOpen, targetElement]); // Add nextStep if not stable, but it's defined in component scope.
  // Ideally wrap nextStep in useCallback or omit from deps if safe.
  // I'll leave it as is, standard React behavior.

  const startTour = () => {
    setCurrentStepIndex(0);
    setIsOpen(true);
  };

  const closeTour = () => {
    setIsOpen(false);
    setCurrentStepIndex(0);
  };

  const nextStep = () => {
    // Add a delay so user can process the current step/action
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

// Internal components for Overlay and Tooltip
const TourOverlay = ({
  rect,
  step,
  totalSteps,
  currentStepIndex,
  onNext,
  onPrev,
  onClose,
}: any) => {
  // Calculate tooltip position
  // Default to right, but check viewport
  const tooltipStyle: React.CSSProperties = {
    position: "absolute",
    top: rect.top + window.scrollY,
    left: rect.right + 20 + window.scrollX, // 20px padding
    zIndex: 9999,
  };

  // If going off screen right, move to left
  if (rect.right + 350 > window.innerWidth) {
    tooltipStyle.left = rect.left - 370 + window.scrollX; // 350 width + 20 padding
  }
  // Adjust top if offscreen bottom (simple logic)
  if (rect.top + 200 > window.innerHeight + window.scrollY) {
    tooltipStyle.top = rect.bottom - 200 + window.scrollY;
  }

  // Mask paths
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
      {/* SVG Overlay */}
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
        {/* Highlight Border */}
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

      {/* Block interaction if click is NOT required */}
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
        <div className="bg-white p-3 rounded-xl shadow-xl w-[350px] border border-gray-100 flex flex-col gap-2 animate-fade-in relative">
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
              {/* Only show Back button if not first step (optional, but keep for nav) */}
              {/* The user wants 'click item to proceed', so 'Next' is hidden. Back is maybe optional. */}
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

              {/* Next Button or Click Instruction */}
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
