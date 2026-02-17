import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import EmptyState from "../../../components/common/EmptyState";
import TeamSkeleton from "../../../components/skeletons/TeamSkeleton";
import {
  useFetchPendingTeamMembers,
  useResendInvite,
} from "../../../hooks/settings/useTeam";
import { TeamMember } from "../../../services/settings/team";
import { formatDateToYYYYMMDD } from "../../../utils/formatDateToYYYYMMDD";
import { LoadingState } from "../../../components/common/LoadingState";
import Pagination from "../../../components/common/Pagination";
import { usePaginationAdjustment } from "../../../hooks/common/usePaginationAdjustment";

const invitationStatusColors: Record<string, string> = {
  active:
    "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  pending:
    "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  revoked:
    "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  expired:
    "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-foreground/10 dark:border-gray-700",
};

const PendingTeamMembers = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const { data: pendingMembersData, isLoading: membersIsLoading } =
    useFetchPendingTeamMembers(filters);

  const pendingMembers = pendingMembersData?.data;

  usePaginationAdjustment({
    totalPages: pendingMembersData?.totalPages || 0,
    currentPage: filters.page,
    onPageChange: (page) => setFilters((prev) => ({ ...prev, page })),
    isLoading: membersIsLoading,
  });

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const { mutate: resendInvite } = useResendInvite();
  const [resendingId, setResendingId] = useState<string | null>(null);

  const handleResend = (id: string) => {
    setResendingId(id);
    resendInvite(id, {
      onSettled: () => setResendingId(null),
    });
  };

  return (
    <Card
      shadow="none"
      className="rounded-xl border border-foreground/10 bg-background"
    >
      <CardHeader className="flex items-center gap-2 px-4 pt-4 pb-0">
        <FiMail className="w-5 h-5" />
        <h4>Pending Invitations ({pendingMembersData?.totalData || 0})</h4>
      </CardHeader>
      <CardBody className="p-4 space-y-3">
        {membersIsLoading ? (
          <div className="flex items-center justify-center min-h-[156px]">
            <LoadingState />
          </div>
        ) : pendingMembers && pendingMembers.length > 0 ? (
          pendingMembers.map((member: TeamMember) => (
            <div
              key={member._id}
              className="md:flex md:items-center md:justify-between max-md:space-y-3 p-3 border border-yellow-200 dark:border-yellow-900/50 rounded-lg bg-yellow-50 dark:bg-yellow-900/10"
            >
              <div className="flex items-center gap-2.5">
                <span className="size-9 min-w-9 min-h-9 bg-yellow-100 dark:bg-yellow-900/30 inline-flex items-center justify-center rounded-full">
                  <FiMail className="size-5 text-yellow-600 dark:text-yellow-400" />
                </span>
                <div className="space-y-0.5">
                  <p className="font-medium text-sm">{member.email}</p>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Invited as{" "}
                    {member.role?.title || member.role?.role || "No Role"}
                    {member.locations && member.locations.length > 0 && (
                      <>
                        {" "}
                        at{" "}
                        {member.locations
                          .map((loc: any) =>
                            typeof loc === "object" ? loc.name : "Location",
                          )
                          .join(", ")}
                      </>
                    )}
                    {" on "}
                    {member.createdAt
                      ? formatDateToYYYYMMDD(member.createdAt)
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`capitalize px-2 py-0.5 text-[11px] font-medium inline-flex items-center gap-1 rounded-md border ${
                    invitationStatusColors[member.status] ||
                    "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-foreground/10 dark:border-gray-700"
                  }`}
                >
                  {member.status}
                </span>

                <Button
                  key={member._id}
                  size="sm"
                  variant="bordered"
                  onPress={() => handleResend(member._id)}
                  isLoading={resendingId === member._id}
                  className="border-small bg-background"
                >
                  Resend
                </Button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={
              <FiMail className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            }
            title="No pending invitations"
            message="All invitations have been accepted or none have been sent yet."
          />
        )}

        {pendingMembersData && pendingMembersData.totalPages > 1 && (
          <Pagination
            identifier="pending team members"
            totalItems={pendingMembersData.totalData}
            currentPage={filters.page}
            totalPages={pendingMembersData.totalPages}
            handlePageChange={handlePageChange}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default PendingTeamMembers;
