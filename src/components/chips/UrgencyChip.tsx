import { Chip } from '@heroui/react';

interface UrgencyChipProps {
    urgency: string;
}

const UrgencyChip = ({ urgency }: UrgencyChipProps) => {
    const urgencyToLowercase = urgency.toLowerCase();
    return (
        <Chip
            size="sm"
            className={`rounded-full text-xs px-3
             ${urgencyToLowercase === "new" ? "bg-blue-100 text-blue-700" : ""}
             ${urgencyToLowercase === "low" ? "bg-green-100 text-green-700" : ""}
             ${urgencyToLowercase === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : ""
                }
             ${urgencyToLowercase === "high" ? "bg-red-100 text-red-700" : ""}`}
        >
            {urgency}
        </Chip>
    )
}

export default UrgencyChip