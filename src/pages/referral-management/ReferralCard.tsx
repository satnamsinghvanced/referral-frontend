import { Button } from "@heroui/react";
import UrgencyChip from "../../components/chips/UrgencyChip";

interface ReferralCardProps {
  referral: {
    _id: string;
    name: string;
    practiceName: string;
    practiceAddress: string;
    createdAt: string;
    urgency: string;
    addedVia: string;
  };
  actions: any;
  urgencyLabels: Record<string, string>;
}

const ReferralCard = ({
  referral,
  urgencyLabels,
  actions,
}: ReferralCardProps) => {
  return (
    <div className="flex justify-between border border-foreground/10  rounded-lg p-4 bg-background ">
      <div className="font-medium text-sm w-full h-full capitalize flex flex-col gap-0.5">
        <p>{referral.name}</p>
        <div className="flex gap-2 items-center text-xs font-light">
          <p className="flex gap-1 items-center">{referral.referredBy.name}</p>
          <p className="p-0.5 bg-foreground/50 rounded-full aspect-square h-fit w-fit"></p>
          <p>{referral.referredBy.practiceName}</p>
        </div>
        <div className="flex gap-2 items-center text-xs font-light">
          <p className="flex gap-1 items-center">{referral.treatment}</p>
          <p className="p-0.5 bg-foreground/50 rounded-full aspect-square h-fit w-fit"></p>
          <p>{referral.createdAt.slice(0, 10)}</p>
          <p className="p-0.5 bg-foreground/50 rounded-full aspect-square h-fit w-fit"></p>
          <p>via {referral?.addedVia}</p>
        </div>
      </div>
      <div className="flex items-center text-center justify-end h-full w-full gap-2 text-sm self-center">
        <div className="capitalize self-center">
          {referral.urgency ? (
            <UrgencyChip
              urgency={urgencyLabels[referral.urgency] || referral.urgency}
            />
          ) : (
            <UrgencyChip urgency={urgencyLabels["new"] || "new"} />
          )}
        </div>
        {Array.isArray(actions) &&
          actions.map((action: any) => (
            <Button
              key={action.label}
              size="sm"
              isIconOnly={true}
              onPress={() => {
                if (action.label === "Call") {
                  action.function(referral.mobile || "N/A"); // pass phone number
                } else {
                  action.function(referral._id); // pass referral ID for view/edit
                }
              }}
              variant={action.variant || "light"}
              color={action.color || "default"}
            >
              {action.icon}
            </Button>
          ))}
      </div>
    </div>
  );
};

export default ReferralCard;

// ------------------------------------- OLD DESIGN --------------------------------

// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   Chip,
//   Divider,
//   Popover,
//   PopoverContent,
//   PopoverTrigger
// } from "@heroui/react";
// import { CiCalendar, CiStethoscope, } from "react-icons/ci";
// import { FiCheckCircle, FiMail, FiPhone, FiUser } from "react-icons/fi";
// import { IoCallOutline } from "react-icons/io5";
// import { LuBuilding2, LuUserRoundCheck } from "react-icons/lu";
// import { RxDotsHorizontal } from "react-icons/rx";
// import { useState } from "react";
// import { urgencyLabels } from "../../Utils/consts";
// import StatusChip from "../../components/chips/StatusChip";
// import UrgencyChip from "../../components/chips/UrgencyChip";

// const statusLabels = [
//   { value: "contacted", label: "Contacted", icon: <IoCallOutline /> },
//   { value: "scheduled", label: "Scheduled", icon: <CiCalendar /> },
//   { value: "completed", label: "Completed", icon: <FiCheckCircle /> },
// ]

// const urgencyColors = {
//   low: "success",
//   medium: "warning",
//   high: "danger",
// };

// const preferredTimeLabels = {
//   morning: "Morning",
//   afternoon: "Afternoon",
//   evening: "Evening",
//   afterSchool: "After School",
//   lunchBreak: "Lunch Break",
//   weekend: "Weekend"
// };
// interface ReferralCardProps {
//   uniqueId: string;
//   fullName: string;
//   status: string;
//   urgency?: string;
//   email: string;
//   age?: number;
//   phoneNumber: string;
//   referringByName: string;
//   relationshipName?: string;
//   referringPracticeName?: string;
//   referringSpecialty?: string;
//   referringPhoneNumber?: string;
//   referringEmail?: string;
//   referringFax?: string;
//   referringWebsite?: string;
//   practiceAddress?: string;
//   practiceAddressCity?: string;
//   practiceAddressState?: string;
//   practiceAddressZip?: string;
//   treatmentType?: string;
//   insuranceProvider?: string;
//   preferredTime?: string;
//   reasonForReferral?: string;
//   notes?: string;
//   createdAt: string;
//   role: 'doctor' | 'patient';
//   onUpdateStatus?: (newStatus: string) => void;
// }

// const ReferralCard = ({
//   uniqueId,
//   fullName,
//   status,
//   urgency,
//   email,
//   age,
//   phoneNumber,
//   referringByName,
//   relationshipName,
//   referringPracticeName,
//   referringSpecialty,
//   referringPhoneNumber,
//   referringEmail,
//   referringFax,
//   referringWebsite,
//   practiceAddress,
//   practiceAddressCity,
//   practiceAddressState,
//   practiceAddressZip,
//   treatmentType,
//   insuranceProvider,
//   preferredTime,
//   reasonForReferral,
//   notes,
//   createdAt,
//   role,
//   onUpdateStatus,
// }: ReferralCardProps) => {
//   const [applicationStatus, setApplicationStatus] = useState(status);
//   const [isOpen, setIsOpen] = useState(false);

//   const handleStatusChange = (newStatus: any) => {
//     if (newStatus && newStatus?.target) {
//       newStatus = newStatus?.target?.value;
//     }
//     if (onUpdateStatus) {
//       onUpdateStatus(newStatus);
//       setApplicationStatus(newStatus);

//     }
//     setIsOpen(false);
//   };

//   const formatDate = (dateString:string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getAddress = () => {
//     if (!practiceAddress && !practiceAddressCity && !practiceAddressState && !practiceAddressZip) {
//       return null;
//     }
//     return `${practiceAddress}, ${practiceAddressCity}, ${practiceAddressState} ${practiceAddressZip}`;
//   };

//   return (
//     <Card shadow="none" className="w-full  transition-all duration-300 p-3 border border-foreground/10  hover:bg-foreground/2">
//       <CardHeader className="flex gap-2 justify-between w-full">
//         <div className="flex gap-2">
//           <Chip size="sm" variant="flat" color="default" className="border bg-transparent border-foreground/20 text-xs">
//             {uniqueId}
//           </Chip>
//           {urgency && (
//             <UrgencyChip urgency={urgencyLabels[urgency] || urgency} />
//           )}
//           {applicationStatus && (
//             <StatusChip applicationStatus={applicationStatus} />
//           )}

//         </div>
//         <div className="flex">
//           <Popover placement="right" size="sm" shouldCloseOnScroll={true}>
//             <PopoverTrigger>
//               <Button size="sm" className="bg-transparent hover:bg-foreground/10">
//                 <RxDotsHorizontal />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="border border-foreground/5 shadow-sm" >
//               {/* <div className="px-1 py-2"> */}
//               <div className="px-0 py-1 space-y-1 flex flex-col gap-1">
//                 {statusLabels.map(({ value, label, icon }) => (
//                   <Button
//                     size="sm"
//                     key={value}
//                     onPress={() => handleStatusChange(value)}
//                     variant="light"
//                     className="w-full text-left flex items-center justify-start  m-0"
//                   >
//                     {icon} Make as {label}
//                   </Button>
//                 ))}
//               </div>
//               {/* </div> */}
//             </PopoverContent>
//           </Popover>
//         </div>

//       </CardHeader>

//       {/* <Divider /> */}

//       <CardBody className="flex text-xs gap-3  !pt-0">
//         <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Patient Information */}
//           <div className="mb-0">
//             <p className="text-foreground text-sm uppercase font-semibold mb-2">Patient Information</p>
//             <div className="space-y-1">
//               <p className="flex items-center gap-1">
//                 <FiUser />
//                 <span className="font-medium">{fullName}</span>
//                 <span className="font-light text-foreground/90"> ({age && `${age} years old`})</span>
//               </p>
//               <p className="flex items-center gap-1">
//                 <FiPhone />
//                 <span className="font-light text-foreground/90">{phoneNumber}</span>
//               </p>
//               <p className="flex items-center gap-1">
//                 <FiMail />
//                 <span className="font-light text-foreground/90">{email}</span>
//               </p>
//               <p className="flex items-center gap-1">
//                 <CiCalendar />
//                 <span className="font-light">Received:</span>
//                 <span className="font-light text-foreground/90 ">{formatDate(createdAt)}</span>
//               </p>

//               {/* <p>
//                 <span className="font-medium">Phone:</span>
//                 <span className="font-light text-foreground/90"> {phoneNumber}</span>
//               </p> */}
//               {/* {age && (
//                 <p>
//                   <span className="font-medium">Age:</span>
//                   <span className="font-light text-foreground/90"> {age}</span>
//                 </p>
//               )} */}
//             </div>
//           </div>

//           {/* Referrer Information */}
//           <div className="mb-0">
//             <p className="text-foreground text-sm uppercase font-semibold mb-2">
//               {role === 'doctor' ? 'Referring Doctor' : 'Referring Patient'}
//             </p>
//             <div className="space-y-1">
//               <p className="flex items-center gap-1">
//                 {relationshipName ?
//                   <LuUserRoundCheck />
//                   :
//                   <CiStethoscope />
//                 }
//                 <span className="font-light text-foreground/90">{referringByName}</span>
//               </p>
//               {relationshipName &&
//                 <p className="flex items-center gap-1">
//                   <LuBuilding2 className="text-extralight" />
//                   <span className="font-light text-foreground/90">{relationshipName}</span>
//                 </p>}
//               {referringPracticeName &&
//                 <p className="flex items-center gap-1">
//                   <FiUser />
//                   <span className="font-light text-foreground/90">{referringPracticeName}</span>
//                 </p>
//               }
//               {/* {referringSpecialty
//                 && <p><span className="font-medium">Specialty:</span>
//                   <span className="font-light text-foreground/90">{referringSpecialty}</span>
//                 </p>
//               } */}
//               {referringPhoneNumber &&
//                 <p className="flex items-center gap-1">
//                   <FiPhone />
//                   <span className="font-light text-foreground/90">{referringPhoneNumber}</span>
//                 </p>
//               }
//               {referringEmail &&
//                 <p className="flex items-center gap-1">
//                   <FiMail />
//                   <span className="font-light text-foreground/90">{referringEmail}</span>
//                 </p>
//               }
//               {/* {getAddress()
//                 && <p><span className="font-medium">Address:</span>
//                   <span className="font-light text-foreground/90">{getAddress()}</span>
//                 </p>
//               } */}
//             </div>
//           </div>
//         </div>
//         <Divider className="bg-foreground/10" />
//         <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Treatment Information */}
//           <div className="mb-0">
//             <p className="text-foreground text-sm uppercase font-semibold mb-2">Treatment Details</p>
//             <div className="space-y-1">
//               {treatmentType && <p><span className="font-medium">Type:</span> <span className="font-light text-foreground/90">{treatmentType}</span></p>}
//               {insuranceProvider && <p><span className="font-medium">Insurance:</span> <span className="font-light text-foreground/90">{insuranceProvider}</span></p>}
//               {preferredTime && <p><span className="font-medium">Preferred Time:</span> <span className="font-light text-foreground/90">{preferredTimeLabels[preferredTime] || preferredTime}</span></p>}
//               {/* {urgency && <p><span className="font-medium">Urgency:</span> <span className="font-light text-foreground/90">{urgencyLabels[urgency]}</span></p>} */}
//             </div>
//           </div>

//           {/* Additional Information */}
//           <div className="mb-0">
//             <p className="text-foreground text-sm uppercase font-semibold mb-2">Notes</p>
//             <div className="space-y-1">

//               {notes && (
//                 <p>
//                   <span className="font-light text-foreground/90">{notes}</span>
//                 </p>
//               )}
//               {reasonForReferral && (
//                 <p><span className="font-medium">Reason:</span> <span className="font-light text-foreground/90">{reasonForReferral}</span></p>
//               )}
//               {/* <p>
//                 <span className="font-medium">Date Received:</span> <span className="font-light text-foreground/90 ">{formatDate(dateReceived)}</span>
//               </p> */}
//             </div>
//           </div>
//         </div>
//       </CardBody>

//       {/* <Divider /> */}

//       {/* <CardFooter>
//         <div className="flex justify-between items-center w-full">
//           <span className="text-xs text-foreground">
//             Referral Type: {role === 'doctor' ? 'Doctor' : 'Patient'}
//           </span>
//           <div className="flex gap-2">
//             <Button size="sm" color="primary" variant="flat">
//               View Details
//             </Button>
//             <Button size="sm" color="secondary" variant="flat">
//               Contact Patient
//             </Button>
//           </div>
//         </div>
//       </CardFooter> */}
//     </Card>
//   );
// };

// export default ReferralCard;
