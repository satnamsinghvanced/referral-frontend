import { Card, CardBody } from '@heroui/react'

interface MiniStatsCardProps {
    cardData: {
        heading: string;
        icon: JSX.Element;
        value: string | number;
        subheading: string;
    };
}
const MiniStatsCard = ({ cardData }:MiniStatsCardProps) => {
    return (
        <Card className='w-full p-0 text-xs font-extralight text-text/80 border border-sky-400/15 dark:border-sky-400/20 ' shadow='none' >
            <CardBody>
                <div className='mb-2 flex gap-1 items-center justify-between'>
                    <div className='font-semibold'>{cardData.heading}</div>
                    <div>{cardData.icon}</div>
                </div>
                <div className='text-lg text-text mt-4 mb-1.5 font-bold'>{cardData.value}</div>
                <div>{cardData.subheading}</div>
            </CardBody>
        </Card >
    )
}

export default MiniStatsCard