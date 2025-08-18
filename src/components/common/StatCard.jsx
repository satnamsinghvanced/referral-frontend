import { Card, CardBody } from "@heroui/react";

const StatCard = ({ cardHeading, cardStat, cardNewData, cardIcon, onCardPress }) => {
    return (
        <Card
            isPressable
            shadow="none"
            onPress={onCardPress}
            className="border-gray-300 border-1.5 min-w-[250px] w-full"
        >
            <CardBody className="overflow-visible p-4 flex justify-between items-center w-full">
                <div className="flex w-full">
                    <div className="w-full">
                        <div className="text-base font-medium">{cardHeading}</div>
                        <div className="text-xl font-semibold">{cardStat}</div>
                        <div className="text-xs text-green-600">+{cardNewData} new</div>
                    </div>
                    <div className="w-full flex items-center justify-end">
                        {cardIcon}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default StatCard;
