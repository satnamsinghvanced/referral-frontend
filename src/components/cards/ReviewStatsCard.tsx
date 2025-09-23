import { Card, CardBody } from "@heroui/react";

interface ReviewStatsCardProps {
    cardHeading: React.ReactNode;
    cardStat: string | number;
    subheading: React.ReactNode;
    cardIcon: React.ReactNode;
}

const ReviewStatsCard = ({ cardHeading, cardStat, subheading, cardIcon }: ReviewStatsCardProps) => {
    return (
        <Card className='w-full p-0 text-xs font-extralight text-text/80 border border-text/20 ' shadow='none' >
            <CardBody>
                <div className="flex justify-between items-center">
                    <div>
                        <div className='mb-2 flex gap-1 items-center justify-start'>
                            {cardHeading}
                        </div>
                        <div className='text-xl font-semibold text-text'>{cardStat}</div>
                        <div>{subheading}</div>
                    </div>
                    <div className="h-7 w-7">{cardIcon}</div>
                </div>
            </CardBody>
        </Card >
    );
};

export default ReviewStatsCard;
