import React from "react";
import { Button } from "@heroui/react";

type ButtonProps = React.ComponentProps<typeof Button>;
type AllowedVariants = ButtonProps['variant'];

type ButtonConfig = {
  label: string;
  onClick: () => void;
  props?: Partial<ButtonProps> & { variant?: AllowedVariants };  // props exactly as Button accepts
  classNames?: string;
  icon?: React.ReactNode;
};

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
              {...btn.props}
              className={btn.classNames ?? "border border-foreground/30"}
              startContent={btn.icon ?? null}
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
