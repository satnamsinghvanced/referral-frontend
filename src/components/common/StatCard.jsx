import { Card, CardBody } from "@heroui/react";

const StatCard = ({ cardHeading, cardStat, cardNewData, cardIcon,bgColor, textColor, onCardPress }) => {
    return (
        <Card
            isPressable
            shadow="none"
            onPress={onCardPress}
             className={`min-w-[200px] w-full rounded-lg border border-gray-200 ${bgColor}` }

        >
            <CardBody className="overflow-visible p-4 flex justify-between items-center w-full" >
                <div className="flex w-full">
                    <div className="w-full text-center text-gray-800 ">
                         <div className={`text-base  ${textColor}  `}>{cardStat}</div>
                        <div className="text-xs ">{cardHeading}</div>
                       
                        {/* <div className="text-xs text-green-600">+{cardNewData} new</div> */}
                    </div>
                    {/* <div className="w-full flex items-center justify-end">
                        {cardIcon}
                    </div> */}
                </div>
            </CardBody>
        </Card>
    );
};

export default StatCard;
