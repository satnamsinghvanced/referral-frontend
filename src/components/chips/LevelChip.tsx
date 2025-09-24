import { Chip } from '@heroui/react';

interface LevelChipProps {
    level: string;
}

const LevelChip = ({ level }: LevelChipProps) => { 
    const normalizedLevel = level.toLowerCase();
 
    const getClassName = () => {
        switch (normalizedLevel) {
            case 'a-level':
                return 'bg-green-100 text-green-700';
            case 'b-level':
                return 'bg-yellow-100 text-yellow-700';
            case 'c-level':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };
 
    const displayText = level.charAt(0).toUpperCase() + level.slice(1);

    return (
        <Chip size="sm" className={`capitalize ${getClassName()}`}>
            {displayText}
        </Chip>
    );
};

export default LevelChip;
