import React from 'react';
import { FiEye } from 'react-icons/fi';
import { Button } from '@heroui/react';

interface ReferralCardProps {
  referral: {
    id: string;
    fullName: string;
    referringByName: string;
    practice?: string;
    totalReferrals: number;
    referralsThisMonth: number;
  };
  buttons?: Array<{
    label: string;
    onClick: (id: string) => void;
    props?: React.ComponentProps<typeof Button>;
    className?: string;
    icon?: React.ReactNode;
  }>;
}

const RefererCard: React.FC<ReferralCardProps> = ({ referrer, buttons }) => {
  return (
    <div className="flex justify-between border border-foreground/10 rounded-lg p-4 bg-background">
      <div className="font-medium text-sm w-full h-full">
        {referrer.name}
        <div className="flex gap-2 items-center text-xs font-light text-foreground/80">
          {referrer.practice}
        </div>
        <div className="flex gap-2 mt-1 text-foreground/80">
          <div className="flex gap-1 items-center text-xs font-light">
            {referrer.total} total
          </div>
          <div className="flex gap-1 items-center text-xs font-light">
            {referrer.referralsThisMonth} this month
          </div>
        </div>
      </div>

      <div className="flex text-center justify-end h-full w-full gap-4 text-sm">
        {buttons?.map((btn, index) => (
          <Button
            size="sm"
            key={index}
            onPress={() => btn.onClick(referrer.id)}
            {...btn.props}
            className={btn.className ?? "border text-foreground border-foreground/30 bg-transparent"}
            startContent={btn.icon ?? null}
          >
            {btn.label}
          </Button>
        ))}

        <Button
          isIconOnly={true}
          size="sm"
          className="flex justify-center items-center bg-transparent hover:bg-secondary-200"
        >
          <FiEye />
        </Button>
      </div>
    </div>
  );
};

export default RefererCard;
