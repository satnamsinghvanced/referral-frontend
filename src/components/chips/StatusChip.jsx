import { Chip } from '@heroui/react'

const StatusChip = ({ applicationStatus }) => {
  return (
      <Chip
          size="sm"
          className={`capitalize ${applicationStatus === "new"
              ? "bg-blue-100 text-blue-700"
              : applicationStatus === "contacted"
                  ? "bg-yellow-100 text-yellow-600"
                  : applicationStatus === "scheduled"
                      ? "bg-green-100 text-green-600"
                      : applicationStatus === "completed"
                          ? "bg-gray-100 text-gray-600"
                          : applicationStatus === "cancelled"
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-700"
              }`}
      >
          {applicationStatus}
      </Chip>
  )
}

export default StatusChip