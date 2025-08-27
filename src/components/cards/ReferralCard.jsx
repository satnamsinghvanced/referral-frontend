import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@heroui/react";
import { CiCalendar, CiStethoscope, } from "react-icons/ci";
import { FiCheckCircle, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import { LuBuilding2, LuUserRoundCheck } from "react-icons/lu";
import { RxDotsHorizontal } from "react-icons/rx";

import { useState } from "react";
import StatusChip from "../chips/StatusChip";
import UrgencyChip from "../chips/UrgencyChip";

const statusLabels = [
  { value: "contacted", label: "Contacted", icon: <IoCallOutline /> },
  { value: "scheduled", label: "Scheduled", icon: <CiCalendar /> },
  { value: "completed", label: "Completed", icon: <FiCheckCircle /> },
]

const urgencyLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const urgencyColors = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const preferredTimeLabels = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  afterSchool: "After School",
  lunchBreak: "Lunch Break",
  weekend: "Weekend"
};

const ReferralCard = ({
  uniqueId,
  fullName,
  status,
  urgency,
  email,
  age,
  phoneNumber,
  referringByName,
  relationshipName,
  referringPracticeName,
  referringSpecialty,
  referringPhoneNumber,
  referringEmail,
  referringFax,
  referringWebsite,
  practiceAddress,
  practiceAddressCity,
  practiceAddressState,
  practiceAddressZip,
  treatmentType,
  insuranceProvider,
  preferredTime,
  reasonForReferral,
  notes,
  createdAt,
  role,
  onUpdateStatus,
}) => {
  const [applicationStatus, setApplicationStatus] = useState(status);
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (newStatus) => {
    if (newStatus && newStatus.target) {
      newStatus = newStatus.target.value;
    }
    if (onUpdateStatus) {
      onUpdateStatus(newStatus);
      setApplicationStatus(newStatus);

    }
    setIsOpen(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAddress = () => {
    if (!practiceAddress && !practiceAddressCity && !practiceAddressState && !practiceAddressZip) {
      return null;
    }
    return `${practiceAddress}, ${practiceAddressCity}, ${practiceAddressState} ${practiceAddressZip}`;
  };

  return (
    <Card shadow="sm" className="w-full hover:shadow-lg transition-all duration-300 p-3">
      <CardHeader className="flex gap-2 justify-between w-full">
        <div className="flex gap-2">
          <Chip size="sm" variant="flat" color="default" className="border bg-transparent border-text/20 text-xs">
            {uniqueId}
          </Chip>
          {urgency && (
            <UrgencyChip urgency={urgencyLabels[urgency] || urgency} />
          )}
          {applicationStatus && (
            <StatusChip applicationStatus={applicationStatus} />
          )}

        </div>
        <div className="flex">
          {/* <Select
            aria-label="Update status"
            selectedKeys={applicationStatus ? [applicationStatus] : []}
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys)[0];
              handleStatusChange(selectedValue);
            }}
            className="min-w-[150px] z-20"
            variant="bordered"
            size="sm"
            placeholder="Update Status"
            isOpen={isOpen}
            onOpenChange={(open) => setIsOpen(open)}
            classNames={{
              trigger: "border-0 border-transparent bg-transparent text-transparent",
            }}
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </Select>
          <Button
            aria-label="Change Status"
            onPress={() => setIsOpen(!isOpen)}
            className=" ml-2 z-21"
          >
            ---
          </Button> */}
          <Popover placement="right" size="sm" shouldCloseOnScroll={true} backdrop="">
            <PopoverTrigger>
              <Button size="sm" className="bg-transparent hover:bg-text/10">
                <RxDotsHorizontal />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="border border-text/5 shadow-sm" >
              {/* <div className="px-1 py-2"> */}
              <div className="px-0 py-1 space-y-1 flex flex-col gap-1">
                {statusLabels.map(({ value, label, icon }) => (
                  <Button
                    size="sm"
                    key={value}
                    onPress={() => handleStatusChange(value)}
                    variant="light"
                    className="w-full text-left flex items-center justify-start  m-0"
                  >
                    {icon} Make as {label}
                  </Button>
                ))}
              </div>
              {/* </div> */}
            </PopoverContent>
          </Popover>
        </div>
        {/* <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">

            <p className="font-semibold text-lg">{fullName}</p>
            <Chip size="sm" variant="flat" color="primary" className="text-xs">
              {uniqueId}
            </Chip>
            {age && (
              <Chip size="sm" variant="flat" color="default" className="text-xs">
                Age: {age}
              </Chip>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge
              color={urgencyColors[urgency]}
              variant="flat"
              size="sm"
              className="capitalize"
            >
              {urgencyLabels[urgency] || urgency}
            </Badge>
            <Badge
              color="default"
              variant="flat"
              size="sm"
              className="capitalize"
            >
              {applicationStatus}
            </Badge>
            <Badge
              color="secondary"
              variant="flat"
              size="sm"
              className="capitalize"
            >
              {role === 'doctor' ? 'Doctor Referral' : 'Patient Referral'}
            </Badge>
          </div>
        </div> */}


      </CardHeader>

      {/* <Divider /> */}

      {/* <CardBody className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm "> */}
      <CardBody className="flex text-xs gap-3  !pt-0">
        <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Information */}
          <div className="mb-0">
            <p className="text-text text-sm uppercase font-semibold mb-2">Patient Information</p>
            <div className="space-y-1">
              <p className="flex items-center gap-1">
                <FiUser />
                <span className="font-medium">{fullName}</span>
                <span className="font-light text-text/90"> ({age && `${age} years old`})</span>
              </p>
              <p className="flex items-center gap-1">
                <FiPhone />
                <span className="font-light text-text/90">{phoneNumber}</span>
              </p>
              <p className="flex items-center gap-1">
                <FiMail />
                <span className="font-light text-text/90">{email}</span>
              </p>
              <p className="flex items-center gap-1">
                <CiCalendar />
                <span className="font-light">Received:</span>
                <span className="font-light text-text/90 ">{formatDate(createdAt)}</span>
              </p>

              {/* <p>
                <span className="font-medium">Phone:</span>
                <span className="font-light text-text/90"> {phoneNumber}</span>
              </p> */}
              {/* {age && (
                <p>
                  <span className="font-medium">Age:</span>
                  <span className="font-light text-text/90"> {age}</span>
                </p>
              )} */}
            </div>
          </div>

          {/* Referrer Information */}
          <div className="mb-0">
            <p className="text-text text-sm uppercase font-semibold mb-2">
              {role === 'doctor' ? 'Referring Doctor' : 'Referring Patient'}
            </p>
            <div className="space-y-1">
              <p className="flex items-center gap-1">
                {relationshipName ?
                  <LuUserRoundCheck />
                  :
                  <CiStethoscope />
                }
                <span className="font-light text-text/90">{referringByName}</span>
              </p>
              {relationshipName &&
                <p className="flex items-center gap-1">
                  <LuBuilding2 className="text-extralight" />
                  <span className="font-light text-text/90">{relationshipName}</span>
                </p>}
              {referringPracticeName &&
                <p className="flex items-center gap-1">
                  <FiUser />
                  <span className="font-light text-text/90">{referringPracticeName}</span>
                </p>
              }
              {/* {referringSpecialty
                && <p><span className="font-medium">Specialty:</span>
                  <span className="font-light text-text/90">{referringSpecialty}</span>
                </p>
              } */}
              {referringPhoneNumber &&
                <p className="flex items-center gap-1">
                  <FiPhone />
                  <span className="font-light text-text/90">{referringPhoneNumber}</span>
                </p>
              }
              {referringEmail &&
                <p className="flex items-center gap-1">
                  <FiMail />
                  <span className="font-light text-text/90">{referringEmail}</span>
                </p>
              }
              {/* {getAddress()
                && <p><span className="font-medium">Address:</span>
                  <span className="font-light text-text/90">{getAddress()}</span>
                </p>
              } */}
            </div>
          </div>
        </div>
        <Divider className="bg-text/10" />
        <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Treatment Information */}
          <div className="mb-0">
            <p className="text-text text-sm uppercase font-semibold mb-2">Treatment Details</p>
            <div className="space-y-1">
              {treatmentType && <p><span className="font-medium">Type:</span> <span className="font-light text-text/90">{treatmentType}</span></p>}
              {insuranceProvider && <p><span className="font-medium">Insurance:</span> <span className="font-light text-text/90">{insuranceProvider}</span></p>}
              {preferredTime && <p><span className="font-medium">Preferred Time:</span> <span className="font-light text-text/90">{preferredTimeLabels[preferredTime] || preferredTime}</span></p>}
              {/* {urgency && <p><span className="font-medium">Urgency:</span> <span className="font-light text-text/90">{urgencyLabels[urgency]}</span></p>} */}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-0">
            <p className="text-text text-sm uppercase font-semibold mb-2">Notes</p>
            <div className="space-y-1">

              {notes && (
                <p>
                  <span className="font-light text-text/90">{notes}</span>
                </p>
              )}
              {reasonForReferral && (
                <p><span className="font-medium">Reason:</span> <span className="font-light text-text/90">{reasonForReferral}</span></p>
              )}
              {/* <p>
                <span className="font-medium">Date Received:</span> <span className="font-light text-text/90 ">{formatDate(dateReceived)}</span>
              </p> */}
            </div>
          </div>
        </div>
      </CardBody>

      {/* <Divider /> */}

      {/* <CardFooter>
        <div className="flex justify-between items-center w-full">
          <span className="text-xs text-text">
            Referral Type: {role === 'doctor' ? 'Doctor' : 'Patient'}
          </span>
          <div className="flex gap-2">
            <Button size="sm" color="primary" variant="flat">
              View Details
            </Button>
            <Button size="sm" color="secondary" variant="flat">
              Contact Patient
            </Button>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default ReferralCard;