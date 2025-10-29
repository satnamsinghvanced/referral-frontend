import { Card, CardBody } from "@heroui/react";

interface ReviewStatsCardProps {
  cardHeading: React.ReactNode;
  cardStat: string | number;
  subheading: React.ReactNode;
  cardIcon: React.ReactNode;
}

const ReviewStatsCard = ({
  cardHeading,
  cardStat,
  subheading,
  cardIcon,
}: ReviewStatsCardProps) => {
  return (
    <Card
      className="w-full p-0 text-xs font-extralight text-foreground/80 border border-primary/20"
      shadow="none"
    >
      <CardBody>
        <div className="flex justify-between items-center">
          <div className="w-full">
            <div className="flex justify-between w-full">
              <div className="mb-4 flex gap-1 items-center justify-start">
                {cardHeading}
              </div>
              <div className="h-5 w-5">{cardIcon}</div>
            </div>
            <div className="text-xl font-semibold text-foreground">
              {cardStat}
            </div>
            <div className="mt-0.5">{subheading}</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ReviewStatsCard;
