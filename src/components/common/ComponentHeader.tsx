import React from "react";
// import { Button } from "@heroui/react";
import { ButtonConfig } from "../../types/types";
import { Button } from "@heroui/react";

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
    <div className="md:px-7 px-4 py-3 md:py-6 bg-background flex justify-between items-center border-b-1 border-foreground/10">
      <div className="space-y-1">
        <h3 className="text-lg">{heading}</h3>
        {subHeading && (
          <p className="text-sm text-foreground/90">{subHeading}</p>
        )}
      </div>

      {buttons && buttons.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {buttons.map((btn, index) => (
            <Button
              key={index}
              size="sm"
              onPress={btn.onClick}
              startContent={btn.icon ?? null}
              variant={btn.variant ?? "solid"}
              color={btn.color ?? "primary"}
              {...btn}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentHeader;
