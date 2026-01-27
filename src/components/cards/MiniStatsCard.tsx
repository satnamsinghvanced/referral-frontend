import { Card, CardBody } from "@heroui/react";
import clsx from "clsx";
import { JSX } from "react";

export interface StatCard {
  heading: string;
  icon?: JSX.Element | string;
  value: string | number;
  subheading?: string | JSX.Element;
  onClick?: () => void;
}

interface MiniStatsCardProps {
  cardData: StatCard;
}

const MiniStatsCard = ({ cardData }: MiniStatsCardProps) => {
  return (
    // @ts-ignore
    <Card
      shadow="none"
      isPressable={!!cardData?.onClick}
      onPress={cardData?.onClick}
      className={clsx(
        "w-full p-0 text-xs font-extralight text-foreground/80",
        "border border-foreground/10 transition-all",
        "bg-white dark:bg-background",
        cardData?.onClick &&
          "cursor-pointer hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-lg dark:hover:shadow-primary/10 hover:-translate-y-0.5",
      )}
    >
      <CardBody>
        <div className="flex gap-1 items-center justify-between">
          <div className="font-medium text-foreground">{cardData.heading}</div>
          {cardData.icon && <div className="text-lg">{cardData.icon}</div>}
        </div>
        <div className="text-base md:text-lg mt-3 md:mt-5 mb-0.5 font-bold text-foreground">
          {cardData.value !== undefined && cardData.value !== null
            ? cardData.value
            : "0"}
        </div>
        {cardData.subheading && <div>{cardData.subheading}</div>}
      </CardBody>
    </Card>
  );
};

export default MiniStatsCard;
