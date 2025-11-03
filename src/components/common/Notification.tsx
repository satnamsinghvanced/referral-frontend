import { Badge, Button } from '@heroui/react';
import { FaRegBell } from 'react-icons/fa';

const Notification = () => {

    const onBadgeClick = () => {
        console.log("Badge clicked");
    };

    return (
        <Button isIconOnly={true} className="p-0 m-0 bg-transparent" onPress={onBadgeClick} disableAnimation={true}>
            <Badge className="bg-[#fb2c36] p-1 text-background  !rounded-lg !text-xs" content="5" shape='rectangle'>
                <FaRegBell className='h-4 w-4' />
            </Badge>
        </Button>
    )
}

export default Notification