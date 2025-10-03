import React, { useState } from "react";
import { Card, CardHeader, CardBody, Button, Badge } from "@heroui/react";
import { HiOutlineUserAdd } from "react-icons/hi";
import { FiEdit, FiTrash2, FiMail } from "react-icons/fi";
import {
  useFetchTeamMembers,
  useFetchPendingInvites,
  useDeleteTeamMember,
  useResendInvite,
} from "../../hooks/settings/useTeam";
import { MdCheck } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { formatDateToYYYYMMDD } from "../../utils/formatDateToYYYYMMDD";

interface TeamMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: { role: "Admin" | "Manager" | "Staff" | string };
  invitationStatus: string;
  avatar?: string;
  invitedAt: string;
}

const roleColors: Record<string, string> = {
  Admin: "bg-red-100 text-red-600",
  Manager: "bg-blue-100 text-blue-600",
  Staff: "bg-yellow-100 text-yellow-600",
};

const Team: React.FC = () => {
  const { data: members } = useFetchTeamMembers();
  const deleteMember = useDeleteTeamMember();
  const resendInvite = useResendInvite();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const activeMembers = members?.filter(
    (member: TeamMember) => member.invitationStatus === "active"
  );

  const pendingMembers = members?.filter(
    (member: TeamMember) => member.invitationStatus === "pending"
  );

  return (
    <div className="space-y-6">
      {/* Team Members */}
      <Card shadow="none" className="rounded-xl border border-foreground/10">
        <CardHeader className="flex items-center gap-2 px-5 pt-5 pb-0">
          <LuUsers className="w-5 h-5" />
          <p>Team Members ({activeMembers?.length || 0})</p>
        </CardHeader>
        <CardBody className="p-5 space-y-3">
          {activeMembers?.map((member: TeamMember) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-3 border border-foreground/10 rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.firstName}
                    className="size-9 rounded-full"
                  />
                ) : (
                  <div className="size-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                  </div>
                )}
                <div className="space-y-0.5">
                  <p className="font-medium text-sm">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`${
                    roleColors[member.role.role] || "bg-gray-100 text-gray-600"
                  } inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-medium w-fit whitespace-nowrap shrink-0
                  `}
                >
                  {member.role.role}
                </span>
                <span className="capitalize px-2 py-0.5 text-[11px] font-medium border border-green-200 text-green-700 inline-flex items-center gap-1 rounded-lg">
                  <MdCheck /> {member.invitationStatus}
                </span>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => {}}
                  className="border-small font-medium gap-1.5"
                >
                  <FiEdit className="size-3.5" />
                  Edit
                </Button>
                {member.role.role !== "Admin" && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="bordered"
                    className="text-red-600 border-small"
                    onPress={() => deleteMember(member.id)}
                  >
                    <FiTrash2 className="size-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Pending Invitations */}
      <Card shadow="none" className="rounded-xl border border-foreground/10">
        <CardHeader className="flex items-center gap-2 px-5 pt-5 pb-0">
          <FiMail className="w-5 h-5" />
          <p>Pending Invitations ({pendingMembers?.length || 0})</p>
        </CardHeader>
        <CardBody className="p-5 space-y-3">
          {pendingMembers?.map((member: TeamMember) => (
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
                  <p className="text-xs text-gray-500">
                    Invited as {member.role.role} on{" "}
                    {formatDateToYYYYMMDD(member?.invitedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="bordered"
                  className="border-small bg-background"
                  onPress={() => resendInvite(member._id)}
                >
                  Resend
                </Button>
                {/* <Button
                  isIconOnly
                  size="sm"
                  variant="bordered" 
                  className="text-red-600"
                  onPress={() => deleteMember(invite.id)}
                >
                  <FiTrash2 className="size-4" />
                </Button> */}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Invite Team Member Button */}
      <Button
        variant="bordered"
        size="sm"
        className="w-full flex items-center justify-center gap-2 border-foreground/10 border-small font-medium bg-background"
        onPress={() => setInviteModalOpen(true)}
      >
        <HiOutlineUserAdd className="h-4 w-4" />
        Invite Team Member
      </Button>

      {/* TODO: Invite Modal */}
      {inviteModalOpen && <div>{/* Your invite modal here */}</div>}
    </div>
  );
};

export default Team;
