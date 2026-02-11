import React from "react";
import AddStepBar from "./AddStepBar";
import StepNode from "./StepNode";

interface FlowCanvasProps {
  steps: any[];
  onAddStep: (type: string, path: string) => void;
  onEditStep: (stepId: string) => void;
  onDeleteStep: (stepId: string) => void;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  steps,
  onAddStep,
  onEditStep,
  onDeleteStep,
}) => {
  /**
   * Renders a sequence of steps at the same indentation level.
   * Icon center is at 34px.
   * Container indentation is 64px (ml-16).
   * Vertical trunk at left-[-30px] relative to container (64 - 30 = 34).
   */
  const renderSiblingList = (stepList: any[], pathPrefix: string = "") => {
    return (
      <div className="flex flex-col relative mt-8">
        {stepList.map((step, index) => {
          const currentPath = pathPrefix ? `${pathPrefix}${index}` : `${index}`;
          const isLast = index === stepList.length - 1;

          return (
            <div
              key={step.id}
              className="relative flex flex-col mb-8 last:mb-0"
            >
              {/* --- VERTICAL GROUP TRUNK --- */}
              {/* This line comes from the parent level and stops at the last sibling's connector pin. */}
              <div
                className="absolute left-[-30px] w-0.5 bg-foreground/10"
                style={{
                  top: "-40px",
                  bottom: isLast ? "calc(100% - 24px)" : "-40px",
                }}
              />

              {/* --- HORIZONTAL CONNECTOR PIN --- */}
              <div className="absolute left-[-30px] top-[24px] w-[30px] h-0.5 bg-foreground/10" />

              <div className="flex flex-col">
                <StepNode
                  step={step}
                  onEdit={onEditStep}
                  onDelete={onDeleteStep}
                />

                {/* --- CHILDREN (INDENTED) --- */}
                <div className="ml-[64px] mt-4 relative">
                  {/* Vertical trunk segment down to children group */}
                  <div
                    className="absolute left-[-30px] top-[-16px] w-0.5 bg-foreground/10"
                    style={{
                      height:
                        (step.children?.length ?? 0) > 0
                          ? "calc(100% - 82px)"
                          : "48px",
                    }}
                  />

                  {step.type !== "condition" && (
                    <div className="relative z-10">
                      <AddStepBar
                        onAdd={(type) =>
                          onAddStep(type, `${currentPath}.children.last`)
                        }
                      />
                    </div>
                  )}

                  {step.children && step.children.length > 0 && (
                    <div className="mt-2 text-wrap">
                      {renderSiblingList(
                        step.children,
                        `${currentPath}.children.`,
                      )}
                    </div>
                  )}
                </div>

                {/* --- CONDITION BRANCHES --- */}
                {step.type === "condition" && step.branches && (
                  <div className="mt-8 ml-[64px] space-y-12 relative flex flex-col">
                    {/* Main Trunk Line specifically for branches */}
                    <div className="absolute left-[-30px] top-[-48px] bottom-0 w-0.5 bg-foreground/10" />

                    {/* Yes Branch */}
                    <div className="relative pl-6">
                      {/* Horizontal connector from trunk */}
                      <div className="absolute left-[-30px] top-[14px] w-8 h-0.5 bg-foreground/10" />

                      {/* Yes Label floating on the line */}
                      <div className="absolute left-[-22px] top-[4px] z-20">
                        <div className="bg-[#f0fdf4] dark:bg-green-900 text-green-600 dark:text-green-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border border-green-200 dark:border-green-800 shadow-sm">
                          Yes
                        </div>
                      </div>

                      <div className="mb-4">
                        <AddStepBar
                          onAdd={(type) =>
                            onAddStep(type, `${currentPath}.branches.yes.last`)
                          }
                        />
                      </div>
                      {renderSiblingList(
                        step.branches.yes,
                        `${currentPath}.branches.yes.`,
                      )}
                    </div>

                    {/* No Branch */}
                    <div className="relative pl-6">
                      {/* Horizontal connector from trunk */}
                      <div className="absolute left-[-30px] top-[14px] w-8 h-0.5 bg-foreground/10" />

                      {/* No Label floating on the line */}
                      <div className="absolute left-[-20px] top-[4px] z-20">
                        <div className="bg-[#fff1f2] dark:bg-red-900 text-red-600 dark:text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border border-red-200 dark:border-red-800 shadow-sm">
                          No
                        </div>
                      </div>

                      <div className="mb-4">
                        <AddStepBar
                          onAdd={(type) =>
                            onAddStep(type, `${currentPath}.branches.no.last`)
                          }
                        />
                      </div>
                      {renderSiblingList(
                        step.branches.no,
                        `${currentPath}.branches.no.`,
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const rootTrigger = steps[0];

  return (
    <div className="min-h-[400px] flex justify-start bg-background overflow-auto">
      <div className="w-full flex flex-col">
        {/* ROOT: Trigger Stage */}
        {rootTrigger && (
          <div className="relative flex flex-col">
            <StepNode
              step={rootTrigger}
              onEdit={onEditStep}
              onDelete={onDeleteStep}
            />

            {/* Initial Vertical Trunk from Trigger down to children group */}
            <div className="absolute left-[34px] top-[76px] h-[40px] w-0.5 bg-foreground/10" />

            <div className="ml-[64px] mt-4">
              <div className="mb-2">
                <AddStepBar
                  onAdd={(type) => onAddStep(type, "0.children.last")}
                />
              </div>
              {rootTrigger.children &&
                renderSiblingList(rootTrigger.children, "0.children.")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowCanvas;
