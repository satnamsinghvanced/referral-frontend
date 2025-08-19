import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Badge,
  Divider,
  Spacer,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";

// const statusLabels = {
//     updateStatus: 'Update Status',
//     new: "new",
//     contacted: "contacted",
//     scheduled: "scheduled",
//     completed: "completed",
//     cancelled: "cancelled",
// };
const statusLabels = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

const urgencyLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

// const urgencyColors = {
//     low: "success",
//     medium: "warning",
//     high: "danger",
// };

const ReferralCard = ({
  name,
  status,
  urgency,
  referringPatient,
  relationship,
  practice,
  treatment,
  reason,
  phone,
  dateReceived,
  insurance,
  onUpdateStatus,
  referringDoctor,
}) => {
  const [applicationStatus, setApplicationStatus] = useState(status);
  const handleStatusChange = (newStatus) => {
    // If it's an event object (from native select)
    if (newStatus && newStatus.target) {
      newStatus = newStatus.target.value;
    }
    // If it's from NextUI Select (already the value)
    console.log(`Status updated to: ${newStatus}`);
    if (onUpdateStatus) {
      onUpdateStatus(newStatus);
      setApplicationStatus(newStatus);
    }
  };
  return (
    <Card shadow="sm" className="w-full">
      <CardHeader className="justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <p size="lg">{name}</p>
          <div className="flex gap-2">
            {/* {status && (
                            <Badge
                                color="primary"
                                variant="flat"
                                size="sm"
                            >
                                {statusLabels[status] || status}
                            </Badge>
                        )}
                        {urgency && (
                            <Badge
                                color={urgencyColors[urgency]}
                                variant="flat"
                                size="sm"
                            >
                                {urgencyLabels[urgency] || urgency}
                            </Badge>
                        )} */}

            {applicationStatus && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs border capitalize ${
                  applicationStatus === "new"
                    ? "bg-blue-100 text-blue-600 border-blue-300"
                    : applicationStatus === "contacted"
                    ? "bg-yellow-100 text-yellow-600 border-yellow-300"
                    : applicationStatus === "scheduled"
                    ? "bg-green-100 text-green-600 border-green-300"
                    : applicationStatus === "completed"
                    ? "bg-gray-100 text-gray-600 border-gray-300"
                    : applicationStatus === "cancelled"
                    ? "bg-red-100 text-red-600 border-red-300"
                    : "bg-blue-100 text-blue-600 border-blue-300"
                }`}
              >
                {applicationStatus}
              </span>
            )}
            {urgency && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs border
      ${urgency === "low" ? "bg-green-100 text-green-700 border-green-300" : ""}
      ${
        urgency === "medium"
          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
          : ""
      }
      ${urgency === "high" ? "bg-red-100 text-red-700 border-red-300" : ""}`}
              >
                {urgencyLabels[urgency] || urgency}
              </span>
            )}
          </div>
        </div>
        {/* <Button
                    size="sm"
                    variant="bordered"
                    onClick={onUpdateStatus}
                >
                    Update Status
                </Button> */}
        {/* <select
                    value={status}
                    onChange={handleStatusChange}
                    className="text-sm rounded-md border border-gray-300 py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
                >
                    {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key} className="capitalize">
                            {label}
                        </option>
                    ))}
                </select> */}
        {/* 
                <Select
                    aria-label="Select Status"
                    selectedKeys={status ? [status] : []}
                    onSelectionChange={(keys) => {
                        const selectedValue = Array.from(keys)[0];
                        handleStatusChange(selectedValue); // Directly pass the value
                    }}
                    className="max-w-xs"
                    variant="bordered"
                    size="sm"
                    label="Select Status"
                >
                    {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </Select> */}
        <p>...</p>
      </CardHeader>

      <Divider />

      <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p>
            {referringPatient && (
              <>
                <strong>Referring Patient:</strong> {referringPatient}
              </>
            )}
            {referringDoctor && (
              <>
                <strong>Referring Doctor:</strong> {referringDoctor}
              </>
            )}
          </p>
          <p>
            {relationship && (
              <>
                <strong>Relationship:</strong> {relationship}{" "}
              </>
            )}
            {practice && (
              <>
                <strong>Practice:</strong>
                {practice}
              </>
            )}
          </p>
          <p>
            <strong>Treatment:</strong> {treatment}
          </p>
          <p>
            <strong>Reason:</strong> {reason}
          </p>
        </div>

        <div className="sm:text-right">
          <p>
            <strong>Patient Phone:</strong> {phone}
          </p>
          <p>
            <strong>Date Received:</strong> {dateReceived}
          </p>
          <p>
            <strong>Insurance:</strong> {insurance}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default ReferralCard;
