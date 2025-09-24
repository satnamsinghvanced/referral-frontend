import { FiEdit, FiEye } from 'react-icons/fi';
import { IoCallOutline } from 'react-icons/io5';
import UrgencyChip from '../../components/chips/UrgencyChip';
import { Button } from '@heroui/react';
import { FaQrcode } from 'react-icons/fa';

interface ReferralCardProps {
    referral: {
        id: string;
        fullName: string;
        referringByName: string;
        practice?: string;
        totalReferrals: number
        referralsThisMonth: number;
    };
    buttons?: Array<{
        label: string;
        onClick: () => void;
        props?: React.ComponentProps<typeof Button>;
        classNames?: string;
        icon?: React.ReactNode;
    }>;
}

const RefererCard = ({ referral, buttons }: ReferralCardProps) => {
    return (
        <div className="flex justify-between border border-text/10 dark:border-text/30 rounded-lg p-4 bg-background dark:bg-text">
            <div className="font-medium text-sm w-full h-full">
                {referral.fullName}
                <div className="flex gap-2 items-center text-xs font-light text-text/80 dark:text-background/70">
                    {referral.practice}
                </div>
                <div className='flex gap-2 mt-1 text-text/80  dark:text-background/70'>
                    <div className="flex gap-1 items-center text-xs font-light">
                        {referral.totalReferrals} total
                    </div>
                    <div className="flex gap-1 items-center text-xs font-light">
                        {referral.referralsThisMonth} this month
                    </div>
                </div>
            </div>
            <div className="flex text-center justify-end h-full w-full gap-4 text-sm">



                {buttons?.map((btn, index) => (
                    <Button
                        size="sm"
                        key={index}
                        onPress={() => {
                            btn.onClick(referral.id)
                        }}
                        {...btn.props}
                        className={`${btn.classNames ? btn.classNames : "border text-text dark:text-background border-text/30 dark:border-background/50   bg-transparent "
                            }`}
                        startContent={btn?.icon ? btn.icon : <></>}
                    >
                        {btn.label}
                    </Button>
                ))}
                <Button
                    isIconOnly={true}
                    size='sm'
                    className='flex justify-center items-center bg-transparent hover:bg-secondary-200'>
                    <FiEye />
                </Button>

            </div>
        </div>
    );
};

export default RefererCard;