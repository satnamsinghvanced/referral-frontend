import { useNavigate } from "react-router";
import PlanCard from "../../components/cards/PlanCard";

const plans = [
    {
        id: 1,
        name: 'Single Location Practice',
        price: 79,
        description: [
            'Referral Retriever platform access',
            'Track patient and professional referrals',
            'Monitor contact shares via NFC/QR',
            'Track employee-led review taps (which team members are generating reviews)',
            'Email support'
        ],
    },
    {
        id: 2,
        name: 'Premium',
        price: 179,
        description: [
            'Multiple location tracking in one dashboard',
            'Location-specific referral performance',
            'Team performance metrics across offices',
            'Custom branded referral links',
            'Priority support'
        ],
    },
    {
        id: 3,
        name: 'Enterprise',
        price: 'Custom Pricing',
        description: [
            'White-label branding',
            'Dedicated success manager',
            'API access and custom integrations',
            'Advanced analytics and reporting',
            'Training and rollout support'
        ],
    }
];


const PlansPage = () => {
    const navigate = useNavigate();
    const handleBuyNow = (planId: any) => {
        console.log(`Plan with ID ${planId} was clicked!`);
        navigate(`/success?planId=${planId}`);
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center ">
            <div className="grid grid-cols-3 gap-8 m-auto max-w-7xl">
                {plans.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} onBuyNowClick={handleBuyNow} />
                ))}
            </div>
        </div>
    );
};

export default PlansPage;
