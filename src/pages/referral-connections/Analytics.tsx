import { Card } from '@heroui/react';
import MiniStatsCard from '../../components/cards/MiniStatsCard';

interface StatCardData {
    cardHeading: string;
    cardStat: string | number;
    cardNewData?: string | number;
    cardIcon?: React.ReactNode;
    bgColor?: string;
    textColor?: string;
}

interface ReferralConnectionsAnalyticsProps {
    StatCardData: StatCardData[];
}

const ReferralConnectionsAnalytics = ({ StatCardData }: ReferralConnectionsAnalyticsProps) => {
    return (
        <Card className="border-none shadow-none">
            <h6 className='py-1'>Practice Analytics</h6>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-between">
                {StatCardData.map((data: StatCardData, index: number) => (
                    <MiniStatsCard key={index} cardData={data} />
                ))}
            </div>
        </Card>
    );
};

export default ReferralConnectionsAnalytics;
