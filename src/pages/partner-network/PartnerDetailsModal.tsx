import {
  Button,
  Card,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import {
  LuBuilding2,
  LuCalendarDays,
  LuGlobe,
  LuMail,
  LuMapPin,
  LuPhone,
  LuSquareCheckBig,
  LuSquarePen,
  LuStar,
  LuStickyNote,
  LuTrendingUp,
  LuUsers,
} from "react-icons/lu"; // More comprehensive icon imports
import LevelChip from "../../components/chips/LevelChip";
import { LoadingState } from "../../components/common/LoadingState";
import { useFetchPartnerDetail } from "../../hooks/usePartner";
import { PartnerPractice } from "../../types/partner"; // Adjust path as necessary
import { formatDateToReadable } from "../../utils/formatDateToReadable";

interface PartnerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId: string | null; // ID of the partner to display
  primaryButtonHandler?: any;
}

const PartnerDetailsModal = ({
  isOpen,
  onClose,
  partnerId,
  primaryButtonHandler,
}: PartnerDetailsModalProps) => {
  const {
    data: partnerData,
    isLoading,
    isError,
  } = useFetchPartnerDetail(partnerId || "");

  if (!isOpen) return null;

  // Placeholder for when data is loading or not available
  const displayData: PartnerPractice | null = partnerData || null;

  // Function to format date (assuming lastContact/lastUpdated are ISO strings)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString; // Fallback
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="md"
    >
      <ModalContent className="max-h-[92vh] flex flex-col">
        <ModalHeader className="flex flex-col gap-2 flex-shrink-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h4 className="text-base font-medium leading-snug flex items-center space-x-2 text-foreground">
                <LuBuilding2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>{displayData?.practiceName || "Loading Partner..."}</span>
              </h4>
              {displayData?.partnershipLevel && (
                <LevelChip level={displayData.partnershipLevel} />
              )}
            </div>
          </div>
          <p className="text-gray-600 dark:text-foreground/60 text-xs font-normal">
            View detailed information about{" "}
            {displayData?.practiceName || "the practice"}, including practice
            details, staff members, activity summary, and relationship metrics.
          </p>
        </ModalHeader>

        <ModalBody className="px-4 pt-0 pb-4 h-full overflow-auto">
          {isLoading ? (
            <div className="flex-1 min-h-[500px] flex items-center justify-center">
              <LoadingState />
            </div>
          ) : isError || !displayData ? (
            <div className="flex-1 flex items-center justify-center text-red-600 text-sm">
              <p>Failed to load partner details.</p>
            </div>
          ) : (
            <div className="flex-1 space-y-3">
              {/* Top Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="rounded-xl border border-foreground/10 text-center px-4 py-3 shadow-none justify-center dark:bg-default-100/20">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {displayData.totalReferrals ?? 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-foreground/40">
                    Total Referrals
                  </div>
                </Card>
                <Card className="rounded-xl border border-foreground/10 text-center px-4 py-3 shadow-none justify-center dark:bg-default-100/20">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {displayData.monthlyReferrals ?? 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-foreground/40">
                    This Month
                  </div>
                </Card>
                <Card className="rounded-xl border border-foreground/10 text-center px-4 py-3 shadow-none justify-center dark:bg-default-100/20">
                  <div className="flex flex-col items-center space-y-2">
                    <LuStar className="size-5 text-yellow-600 dark:text-yellow-400" />
                    <LevelChip level={displayData.partnershipLevel} />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-foreground/40 mt-1">
                    Partnership Level
                  </div>
                </Card>
              </div>

              {/* Practice Information Card */}
              <Card className="rounded-xl border border-foreground/10 shadow-none dark:bg-default-100/20">
                <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 pt-4 has-data-[slot=card-action]:grid-cols-[1fr_auto]">
                  <h4 className="leading-none flex items-center space-x-2 text-sm font-normal text-foreground">
                    <LuBuilding2 className="size-4" />
                    <span>Practice Information</span>
                  </h4>
                </CardHeader>
                <div className="px-4 space-y-4 pb-4">
                  <div className="flex items-center space-x-2">
                    <LuMapPin className="size-4 min-w-4 min-h-4 text-gray-400" />
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-foreground">
                        Address
                      </div>
                      <div className="text-xs text-gray-600 dark:text-foreground/60">
                        {displayData?.practiceAddress?.addressLine1},{" "}
                        {displayData?.practiceAddress?.city},{" "}
                        {displayData?.practiceAddress?.state},{" "}
                        {displayData?.practiceAddress?.zip}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <LuPhone className="size-4 min-w-4 min-h-4 text-gray-400" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          Phone
                        </div>
                        <div className="text-xs text-gray-600 dark:text-foreground/60">
                          {displayData.practicePhone
                            ? displayData.practicePhone
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LuMail className="size-4 min-w-4 min-h-4 text-gray-400" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          Email
                        </div>
                        <div className="text-xs text-gray-600 dark:text-foreground/60 wrap-break-word max-w-[150px]">
                          {displayData.email ? displayData.email : "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LuSquareCheckBig className="size-4 min-w-4 min-h-4 text-gray-400" />{" "}
                      {/* Reused icon, match screenshot if specific icon available */}
                      <div className="flex flex-col space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          Status
                        </div>
                        <Chip
                          size="sm"
                          radius="sm"
                          className={`border-transparent text-[11px] h-5 ${
                            displayData.status
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                          }`}
                        >
                          {displayData.status ? "Active" : "Inactive"}
                        </Chip>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LuStar className="size-4 min-w-4 min-h-4 text-yellow-600" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          Partnership Level
                        </div>
                        <div className="flex items-center space-x-2">
                          <LevelChip level={displayData.partnershipLevel} />
                        </div>
                      </div>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <LuClock className="size-4 min-w-4 min-h-4 text-gray-400" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium">Last Contact</div>
                        <div className="text-xs text-gray-600">
                          {formatDate(displayData.lastContact)}
                        </div>
                      </div>
                    </div> */}
                    <div className="flex items-center space-x-2">
                      <LuBuilding2 className="size-4 min-w-4 min-h-4 text-gray-400" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          Practice Type
                        </div>
                        {/* This field is not directly in your Partner type, placeholder or derive if possible */}
                        <div className="text-xs text-gray-600 dark:text-foreground/60">
                          General Dentistry
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LuCalendarDays className="size-4 min-w-4 min-h-4 text-gray-400" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          Last Updated
                        </div>
                        {/* Assuming a 'lastUpdated' field exists or can be derived */}
                        <div className="text-xs text-gray-600 dark:text-foreground/60">
                          {formatDateToReadable(
                            (displayData as any).updatedAt,
                            true,
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {displayData.website && (
                    <div className="flex items-center space-x-2">
                      <LuGlobe className="size-4 min-w-4 min-h-4 text-gray-400" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          Website
                        </div>
                        <div className="text-xs text-gray-600 dark:text-foreground/60 wrap-break-word max-w-[150px]">
                          {displayData.website}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Staff Members Card */}
              <Card className="rounded-xl border border-foreground/10 shadow-none dark:bg-default-100/20">
                <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 pt-4 has-data-[slot=card-action]:grid-cols-[1fr_auto]">
                  <h4 className="leading-none flex items-center space-x-2 text-sm font-normal text-foreground">
                    <LuUsers className="size-4" />
                    <span>Staff Members</span>
                  </h4>
                </CardHeader>
                <div className="px-4 pb-4">
                  <div className="space-y-4">
                    {/* Dummy staff member as per screenshot */}
                    {displayData.staff && displayData.staff.length === 0 && (
                      <p className="text-xs text-gray-600 dark:text-foreground/40 text-center">
                        No staff members available.
                      </p>
                    )}
                    {displayData.staff &&
                      displayData.staff.map((staff: any) => (
                        <div
                          className="flex items-center space-x-2.5 p-3 bg-gray-50 dark:bg-default-100/40 rounded-lg"
                          key={staff._id}
                        >
                          <div className="size-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <LuUsers className="size-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 space-y-0.5">
                            <div className="text-sm font-medium text-foreground">
                              {staff.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-foreground/60">
                              {staff.role}
                            </div>
                            {staff.specialties && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {staff.specialties.length > 0 &&
                                  staff.specialties.map(
                                    (specialty: string, index: number) => (
                                      <Chip
                                        key={`specialty-${index}`}
                                        size="sm"
                                        radius="sm"
                                        className="border-transparent bg-[#e0f2fe] dark:bg-blue-900/30 text-[#0c4a6e] dark:text-blue-300 text-[11px] h-5"
                                      >
                                        {specialty}
                                      </Chip>
                                    ),
                                  )}
                              </div>
                            )}
                          </div>
                          {staff.isDentist && staff.experience && (
                            <div className="text-right">
                              <div className="text-xs font-medium text-foreground">
                                {staff.experience}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-foreground/40">
                                Experience
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </Card>

              {/* Activity Summary Card */}
              <Card className="rounded-xl border border-foreground/10 shadow-none dark:bg-default-100/20">
                <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 pt-4 has-data-[slot=card-action]:grid-cols-[1fr_auto]">
                  <h4 className="leading-none flex items-center space-x-2 text-sm font-normal text-foreground">
                    <LuTrendingUp className="size-4" />
                    <span>Activity Summary</span>
                  </h4>
                </CardHeader>
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2.5 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <LuStickyNote className="size-4 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {displayData.noteCount ?? 0}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-foreground/60">
                          Notes
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2.5 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <LuSquareCheckBig className="size-4 text-orange-600 dark:text-orange-400" />
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {displayData.pendingTaskCount ?? 0}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-foreground/60">
                          Pending Tasks
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Notes Card (example from screenshot) */}
              {displayData.additionalNotes && (
                <Card className="rounded-xl border border-foreground/10 shadow-none dark:bg-default-100/20">
                  <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 pt-4 has-data-[slot=card-action]:grid-cols-[1fr_auto]">
                    <h4 className="leading-none flex items-center space-x-2 text-sm font-normal text-foreground">
                      <LuStickyNote className="size-4" />
                      <span>Notes</span>
                    </h4>
                  </CardHeader>
                  <div className="px-4 pb-4">
                    {/* This would be dynamic, mapping over actual notes */}
                    <div className="p-3 bg-gray-50 dark:bg-default-100/40 rounded-lg">
                      <p className="text-xs text-gray-700 dark:text-foreground/80 whitespace-pre-wrap">
                        {displayData.additionalNotes}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </ModalBody>
        {/* Footer with buttons */}
        <ModalFooter className="flex-shrink-0 flex justify-end px-4 py-4 border-t border-foreground/10">
          <Button
            variant="bordered"
            size="sm"
            className="border-small dark:border-default-200 dark:text-foreground/70"
            onPress={onClose}
          >
            Close
          </Button>
          <Button
            variant="solid"
            color="primary"
            size="sm"
            radius="sm"
            onPress={() => primaryButtonHandler(partnerId)}
          >
            <LuSquarePen className="size-3.5" />
            Edit Practice
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PartnerDetailsModal;
