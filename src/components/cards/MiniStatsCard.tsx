import { Card, CardBody } from "@heroui/react";
import clsx from "clsx";
import { JSX } from "react";

export interface StatCard {
  heading: string;
  icon: JSX.Element;
  value: string | number;
  subheading: string;
  onClick?: () => void;
}

interface MiniStatsCardProps {
  cardData: StatCard;
}

const MiniStatsCard = ({ cardData }: MiniStatsCardProps) => {
  return (
    <Card
      shadow="none"
      isPressable={!!cardData?.onClick}
      onPress={cardData?.onClick}
      className={clsx(
        "w-full p-0 text-xs font-extralight text-foreground/80",
        "border border-transparent transition-all",
        "hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5",
        cardData?.onClick && "cursor-pointer"
      )}
    >
      <CardBody>
        <div className="mb-2 flex gap-1 items-center justify-between">
          <div className="font-semibold">{cardData.heading}</div>
          <div>{cardData.icon}</div>
        </div>
        <div className="text-lg mt-4 mb-0.5 font-bold">
          {cardData.value !== undefined && cardData.value !== null
            ? cardData.value
            : "0"}
        </div>
        <div>{cardData.subheading}</div>
      </CardBody>
    </Card>
  );
};

export default MiniStatsCard;
