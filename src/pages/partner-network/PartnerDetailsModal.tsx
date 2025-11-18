import {
  Button,
  Card,
  CardHeader,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import {
  LuBuilding2,
  LuMail,
  LuMapPin,
  LuPhone,
  LuGlobe,
  LuClock,
  LuCalendarDays,
  LuUsers,
  LuSquareCheckBig,
  LuStickyNote,
  LuTrendingUp,
  LuStar,
  LuSquarePen,
  LuX,
} from "react-icons/lu"; // More comprehensive icon imports
import { Partner, PartnerPractice } from "../../types/partner"; // Adjust path as necessary
import { useFetchPartnerDetail } from "../../hooks/usePartner";
import LevelChip from "../../components/chips/LevelChip";
import { LoadingState } from "../../components/common/LoadingState";

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
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="md"
    >
      <ModalContent className="fixed top-[50%] left-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg p-5 shadow-lg max-h-[90vh] overflow-hidden flex flex-col">
        <ModalHeader className="flex flex-col gap-2 text-center sm:text-left flex-shrink-0 p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h4 className="text-base font-medium leading-snug flex items-center space-x-2">
                <LuBuilding2 className="h-5 w-5 text-blue-600" />
                <span>{displayData?.practiceName || "Loading Partner..."}</span>
              </h4>
              {displayData?.partnershipLevel && (
                <LevelChip level={displayData.partnershipLevel} />
              )}
            </div>
          </div>
          <p className="text-gray-600 text-xs font-normal">
            View detailed information about{" "}
            {displayData?.practiceName || "the practice"}, including practice
            details, staff members, activity summary, and relationship metrics.
          </p>
        </ModalHeader>

        {isLoading ? (
          <div className="min-h-[500px] flex items-center justify-center">
            <LoadingState />
          </div>
        ) : isError || !displayData ? (
          <div className="flex-1 flex items-center justify-center text-red-600 text-sm">
            <p>Failed to load partner details.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 px-1">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="rounded-xl border border-primary/15 text-center px-4 py-3 shadow-none justify-center">
                <div className="text-xl font-bold text-blue-600">
                  {displayData.totalReferrals ?? 0}
                </div>
                <div className="text-xs text-gray-600">Total Referrals</div>
              </Card>
              <Card className="rounded-xl border border-primary/15 text-center px-4 py-3 shadow-none justify-center">
                <div className="text-xl font-bold text-green-600">
                  {displayData.monthlyReferrals ?? 0}
                </div>
                <div className="text-xs text-gray-600">This Month</div>
              </Card>
              <Card className="rounded-xl border border-primary/15 text-center px-4 py-3 shadow-none justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <LuStar className="size-5 text-yellow-600" />
                  <LevelChip level={displayData.partnershipLevel} />
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Partnership Level
                </div>
              </Card>
            </div>

            {/* Practice Information Card */}
            <Card className="rounded-xl border border-primary/15 shadow-none">
              <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 pt-4 has-data-[slot=card-action]:grid-cols-[1fr_auto]">
                <h4 className="leading-none flex items-center space-x-2 text-sm font-normal">
                  <LuBuilding2 className="size-4" />
                  <span>Practice Information</span>
                </h4>
              </CardHeader>
              <div className="px-4 space-y-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <LuMapPin className="size-4 min-w-4 min-h-4 text-gray-400" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium">Address</div>
                        <div className="text-xs text-gray-600">
                          {displayData?.practiceAddress?.addressLine1},{" "}
                          {displayData?.practiceAddress?.addressLine2 ||
                            displayData?.practiceAddress?.city}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LuPhone className="size-4 min-w-4 min-h-4 text-gray-400" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium">Phone</div>
                        <div className="text-xs text-gray-600">
                          {displayData.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LuMail className="size-4 min-w-4 min-h-4 text-gray-400" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium">Email</div>
                        <div className="text-xs text-gray-600 wrap-break-word max-w-[150px]">
                          {displayData.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LuGlobe className="size-4 min-w-4 min-h-4 text-gray-400" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium">Website</div>
                        <div className="text-xs text-gray-600 wrap-break-word max-w-[150px]">
                          {displayData.website}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <LuSquareCheckBig className="size-4 min-w-4 min-h-4 text-gray-400" />{" "}
                      {/* Reused icon, match screenshot if specific icon available */}
                      <div className="flex flex-col space-y-0.5">
                        <div className="text-xs font-medium">Status</div>
                        <Chip
                          size="sm"
                          radius="sm"
                          className={`border-transparent text-[11px] h-5 ${
                            displayData.status
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {displayData.status ? "Active" : "Inactive"}
                        </Chip>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LuStar className="size-4 min-w-4 min-h-4 text-yellow-600" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium">
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
                        <div className="text-xs font-medium">Practice Type</div>
                        {/* This field is not directly in your Partner type, placeholder or derive if possible */}
                        <div className="text-xs text-gray-600">
                          General Dentistry
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LuCalendarDays className="size-4 min-w-4 min-h-4 text-gray-400" />
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium">Last Updated</div>
                        {/* Assuming a 'lastUpdated' field exists or can be derived */}
                        <div className="text-xs text-gray-600">
                          {formatDate(
                            (displayData as any).lastUpdated || "Oct 22, 2025"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Staff Members Card */}
            <Card className="rounded-xl border border-primary/15 shadow-none">
              <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 pt-4 has-data-[slot=card-action]:grid-cols-[1fr_auto]">
                <h4 className="leading-none flex items-center space-x-2 text-sm font-normal">
                  <LuUsers className="size-4" />
                  <span>Staff Members</span>
                </h4>
              </CardHeader>
              <div className="px-4 pb-4">
                <div className="space-y-4">
                  {/* Dummy staff member as per screenshot */}
                  {displayData.staff && displayData.staff.length === 0 && (
                    <p className="text-xs text-gray-600 text-center">
                      No staff members available.
                    </p>
                  )}
                  {displayData.staff &&
                    displayData.staff.map((staff: any) => (
                      <div className="flex items-center space-x-2.5 p-3 bg-gray-50 rounded-lg">
                        <div className="size-9 bg-blue-100 rounded-full flex items-center justify-center">
                          <LuUsers className="size-4 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="text-sm font-medium">
                            {staff.name}
                          </div>
                          <div className="text-xs text-gray-600">
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
                                      className="border-transparent bg-[#e0f2fe] text-[#0c4a6e] text-[11px] h-5"
                                    >
                                      {specialty}
                                    </Chip>
                                  )
                                )}
                            </div>
                          )}
                        </div>
                        {staff.isDentist && staff.experience && (
                          <div className="text-right">
                            <div className="text-xs font-medium">
                              {staff.experience}
                            </div>
                            <div className="text-xs text-gray-600">
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
            <Card className="rounded-xl border border-primary/15 shadow-none">
              <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 pt-4 has-data-[slot=card-action]:grid-cols-[1fr_auto]">
                <h4 className="leading-none flex items-center space-x-2 text-sm font-normal">
                  <LuTrendingUp className="size-4" />
                  <span>Activity Summary</span>
                </h4>
              </CardHeader>
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2.5 p-3 bg-blue-50 rounded-lg">
                    <LuStickyNote className="size-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-semibold">
                        {displayData.noteCount ?? 0}
                      </div>
                      <div className="text-xs text-gray-600">Notes</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2.5 p-3 bg-orange-50 rounded-lg">
                    <LuSquareCheckBig className="size-4 text-orange-600" />
                    <div>
                      <div className="text-sm font-semibold">
                        {displayData.pendingTaskCount ?? 0}
                      </div>
                      <div className="text-xs text-gray-600">Pending Tasks</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notes Card (example from screenshot) */}
            {displayData.additionalNotes && (
              <Card className="rounded-xl border border-primary/15 shadow-none">
                <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 pt-4 has-data-[slot=card-action]:grid-cols-[1fr_auto]">
                  <h4 className="leading-none flex items-center space-x-2 text-sm font-normal">
                    <LuStickyNote className="size-4" />
                    <span>Notes</span>
                  </h4>
                </CardHeader>
                <div className="px-4 pb-4">
                  {/* This would be dynamic, mapping over actual notes */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-700 whitespace-pre-wrap">
                      {displayData.additionalNotes}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Footer with buttons */}
        <div className="flex-shrink-0 flex justify-end space-x-2 pt-4 border-t border-primary/15">
          <Button
            variant="bordered"
            size="sm"
            className="border-small"
            onPress={onClose}
          >
            Close
          </Button>
          <Button
            color="primary"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onPress={() => primaryButtonHandler(partnerId)}
          >
            <LuSquarePen className="size-3.5" />
            Edit Practice
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default PartnerDetailsModal;
