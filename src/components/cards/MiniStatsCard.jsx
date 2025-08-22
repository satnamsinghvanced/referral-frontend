import { Card, CardBody, CardHeader } from '@heroui/react'

const MiniStatsCard = ({ cardData }) => {
    return (
        <Card isPressable={true} className='min-w-[210px] p-0 text-xs font-extralight text-text/80 border border-text/20 ' shadow='none' >
            <CardBody>
                <div className='mb-2 flex gap-1 items-center justify-start'>
                    <span>{cardData.icon}</span>
                    <span >{cardData.heading}</span>
                </div>
                <div className='text-lg font-medium text-text'>{cardData.value}</div>
                <div>{cardData.subheading}</div>
            </CardBody>
        </Card >
    )
}

export default MiniStatsCard