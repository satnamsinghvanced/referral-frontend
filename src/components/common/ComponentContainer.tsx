import React from "react";
import ComponentHeader from "./ComponentHeader";
import { ButtonConfig } from "../../types/types";

interface ComponentContainerProps {
  headingData: {
    heading: string;
    subHeading?: string | undefined;
    buttons?: ButtonConfig[] | undefined;
  };
  children: React.ReactNode;
}

const ComponentContainer: React.FC<ComponentContainerProps> = ({
  headingData,
  children,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-background text-foreground">
        <ComponentHeader
          heading={headingData.heading}
          subHeading={headingData.subHeading}
          buttons={headingData.buttons}
        />
      </div>
      <div className="flex flex-col gap-4 md:gap-5 md:p-6 p-4 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default ComponentContainer;
