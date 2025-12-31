import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import EmptyState from "../../../components/common/EmptyState";
import TeamSkeleton from "../../../components/skeletons/TeamSkeleton";
import { useResendInvite } from "../../../hooks/settings/useTeam";
import { TeamMember } from "../../../services/settings/team";
import { formatDateToYYYYMMDD } from "../../../utils/formatDateToYYYYMMDD";

const invitationStatusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  revoked: "bg-red-100 text-red-700 border-red-200",
  expired: "bg-gray-100 text-gray-600 border-gray-200",
};

interface PendingTeamMembersProps {
  membersIsLoading: boolean;
  pendingMembers: TeamMember[] | undefined;
}

const PendingTeamMembers: React.FC<PendingTeamMembersProps> = ({
  membersIsLoading,
  pendingMembers,
}) => {
  const { mutate: resendInvite } = useResendInvite();
  const [resendingId, setResendingId] = useState<string | null>(null);

  const handleResend = (id: string) => {
    setResendingId(id);
    resendInvite(id, {
      onSettled: () => setResendingId(null),
    });
  };

  return (
    <Card shadow="none" className="rounded-xl border border-foreground/10">
      <CardHeader className="flex items-center gap-2 px-4 pt-4 pb-0">
        <FiMail className="w-5 h-5" />
        <h4>Pending Invitations ({pendingMembers?.length || 0})</h4>
      </CardHeader>
      <CardBody className="p-4 space-y-3">
        {membersIsLoading ? (
          <TeamSkeleton type="pending" />
        ) : pendingMembers && pendingMembers.length > 0 ? (
          pendingMembers.map((member: TeamMember) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-3 border border-yellow-200 rounded-lg bg-yellow-50"
            >
              <div className="flex items-center gap-2.5">
                <span className="size-9 bg-yellow-100 inline-flex items-center justify-center rounded-full">
                  <FiMail className="size-5 text-yellow-600" />
                </span>
                <div className="space-y-0.5">
                  <p className="font-medium text-sm">{member.email}</p>
                  <p className="text-xs text-gray-600">
                    Invited as{" "}
                    {member.role?.title || member.role?.role || "No Role"} on{" "}
                    {member.invitedAt
                      ? formatDateToYYYYMMDD(member.invitedAt)
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`capitalize px-2 py-0.5 text-[11px] font-medium inline-flex items-center gap-1 rounded-md border ${
                    invitationStatusColors[member.status] ||
                    "bg-gray-100 text-gray-600 border-gray-200"
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
            icon={<FiMail className="w-6 h-6 text-yellow-600" />}
            title="No pending invitations"
            message="All invitations have been accepted or none have been sent yet."
          />
        )}
      </CardBody>
    </Card>
  );
};

export default PendingTeamMembers;
