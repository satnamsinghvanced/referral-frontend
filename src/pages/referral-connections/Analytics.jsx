import { Card } from '@heroui/react'
import MiniStatsCard from '../../components/cards/MiniStatsCard'

const ReferralConnectionsAnalytics = ({ StatCardData }) => {
    return (
        <Card className="border-none  shadow-none">
            <h6 className='py-1'>Practice Analytics</h6>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-between">
                {StatCardData.map((data, index) => (
                    <MiniStatsCard key={index} cardData={data} />
                ))}
            </div>
        </Card>
    )
}

export default ReferralConnectionsAnalytics