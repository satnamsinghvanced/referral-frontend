import { Card, CardBody } from "@heroui/react";
import clsx from "clsx";
import { JSX } from "react";

export interface StatCard {
  heading: string;
  icon: JSX.Element | string;
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
      onPress={() => cardData?.onClick}
      className={clsx(
        "w-full p-0 text-xs font-extralight text-foreground/80",
        "border border-transparent transition-all",
        cardData?.onClick &&
          "cursor-pointer hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      <CardBody>
        <div className="mb-2 flex gap-1 items-center justify-between">
          <div className="font-semibold">{cardData.heading}</div>
          <div
            className={`${typeof cardData.icon === "string" ? `text-lg` : ""}`}
          >
            {cardData.icon}
          </div>
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
