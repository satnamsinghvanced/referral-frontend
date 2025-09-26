import { Button, Card, CardBody } from "@heroui/react";

interface Plan {
    id: string;
    name: string;
    price: number;
    description: string[];
}

interface PlanCardProps {
    plan: Plan;
    onBuyNowClick: (id: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onBuyNowClick }) => {
    return (
        <Card
            shadow="none"
            className="min-w-[280px] w-full rounded-lg border-1 border-foreground/10 hover:border-primary/40 transition-all duration-300"
        >
            <CardBody className="overflow-visible p-6 flex flex-col justify-between items-center w-full">
                <div className="flex w-full flex-col items-center">
                    <div className="text-lg font-semibold text-foreground/80 mb-2">
                        {plan.name}
                    </div>

                    <div className="text-3xl font-bold text-primary-600 mb-4">
                        ${plan.price}
                        <span className="text-sm font-normal text-foreground/70">/month</span>
                    </div>

                    <div className="w-full mb-6">
                        {plan.description.map((item, index) => (
                            <div
                                key={index}
                                className="text-center text-sm text-foreground/70   py-2 border-b border-foreground/10  last:border-b-0"
                            >
                                {item}
                            </div>
                        ))}
                    </div>

                    <Button
                        color="primary"
                        className="w-full mt-2 font-semibold bottom-0"
                        onClick={() => onBuyNowClick(plan.id)}
                    >
                        Get Started
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default PlanCard;
