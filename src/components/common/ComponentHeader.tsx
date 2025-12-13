import React from "react";
// import { Button } from "@heroui/react";
import { Button } from "@heroui/react";
import { ButtonConfig } from "../../types/types";

interface ComponentHeaderProps {
  heading: string;
  subHeading?: string | undefined;
  buttons?: ButtonConfig[] | undefined;
}

const ComponentHeader: React.FC<ComponentHeaderProps> = ({
  heading,
  subHeading,
  buttons,
}) => {
  return (
    <div className="md:p-6 p-4 bg-background border-b-1 border-foreground/10">
      <div className="md:flex md:justify-between md:items-center max-md:space-y-3.5">
        <div className="space-y-1">
          <h3 className="text-base md:text-lg">{heading}</h3>
          {subHeading && (
            <p className="text-xs md:text-sm text-gray-600">{subHeading}</p>
          )}
        </div>

        {buttons && buttons.length > 0 && (
          <div className="space-x-2 md:space-x-3">
            {buttons.map((btn, index) => (
              <Button
                key={index}
                size="sm"
                onPress={btn.onClick}
                startContent={btn.icon ?? null}
                variant={btn.variant ?? "solid"}
                color={btn.color ?? "primary"}
                className={btn.className ?? ""}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentHeader;
