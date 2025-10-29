import { Card, CardBody } from "@heroui/react";
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
      className="w-full p-0 text-xs font-extralight text-foreground/80 border border-primary/15"
      shadow="none"
    >
      <CardBody
        onClick={cardData?.onClick}
        className={`${cardData?.onClick ? "cursor-pointer" : ""}`}
      >
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
