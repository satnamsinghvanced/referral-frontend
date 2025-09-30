import { Chip } from '@heroui/react'

interface StatusChipProps {
    applicationStatus: string;
}   

const StatusChip = ({ applicationStatus }: StatusChipProps) => {
    return (
        <Chip
            size="sm"
            className={`capitalize ${applicationStatus === "new"
                ? "bg-sky-100 text-sky-700"
                : applicationStatus === "contacted"
                    ? "bg-yellow-100 text-yellow-600"
                    : applicationStatus === "scheduled"
                        ? "bg-green-100 text-green-600"
                        : applicationStatus === "completed"
                            ? "bg-gray-100 text-gray-600 dark:text-gray-400"
                            : applicationStatus === "cancelled"
                                ? "bg-red-100 text-red-600"
                                : "bg-sky-100 text-sky-700"
                }`}
        >
            {applicationStatus}
        </Chip>
    )
}

export default StatusChip