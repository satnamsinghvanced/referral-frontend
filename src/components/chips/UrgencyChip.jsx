import { Chip } from '@heroui/react'

const UrgencyChip = ({ urgency }) => {
    const urgencyToLowercase = urgency.toLowerCase();
    return (
        <Chip
            size="sm"
            className={`rounded-full text-xs
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