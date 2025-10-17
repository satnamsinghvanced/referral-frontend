import { Card, CardBody } from "@heroui/react";
import { JSX } from "react";

interface MiniStatsCardProps {
  cardData: {
    heading: string;
    icon: JSX.Element;
    value: string | number;
    subheading: string;
    onClick?: any;
  };
}
const MiniStatsCard = ({ cardData }: MiniStatsCardProps) => {
  return (
    <Card
      className="w-full p-0 text-xs font-extralight text-foreground/80 border border-primary/15 "
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
        <div className="text-lg mt-4 mb-1.5 font-bold">
          {cardData.value || cardData.value === 0 ? cardData.value : "N/A"}
        </div>
        <div>{cardData.subheading}</div>
      </CardBody>
    </Card>
  );
};

export default MiniStatsCard;
