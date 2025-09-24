import { Button } from "@heroui/react";

interface ComponentHeaderProps {
  heading: string;
  subHeading?: string;
  buttons?: Array<{
    label: string;
    onClick: () => void;
    props?: React.ComponentProps<typeof Button>;
    classNames?: string;
    icon?: React.ReactNode;
  }>;
}

const ComponentHeader = ({
  heading,
  subHeading,
  buttons,
}: ComponentHeaderProps) => {
  return (
    <div className="md:px-7 px-4 py-3 md:py-6 bg-background flex justify-between items-center border-b-1 border-text/10 dark:border-text/30 dark:bg-text">
      <div className="space-y-1">
        <h3 className="text-lg">{heading}</h3>
        <p className="text-sm dark:text-background/90">{subHeading}</p>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {buttons?.map((btn, index) => (
          <Button
            size="sm"
            key={index}
            onPress={btn.onClick}
            {...btn.props}
            className={`${btn.classNames ? btn.classNames : "border border-text/30 dark:border-background/30"
              }`}
            startContent={btn?.icon ? btn.icon : <></>}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ComponentHeader;
