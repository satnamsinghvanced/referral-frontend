import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { HiOutlineUserAdd } from "react-icons/hi";
import { LuUsers } from "react-icons/lu";
import { MdCheck } from "react-icons/md";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import EmptyState from "../../../components/common/EmptyState";
import TeamSkeleton from "../../../components/skeletons/TeamSkeleton";
import {
  useDeleteTeamMember,
  useFetchTeamMembers,
} from "../../../hooks/settings/useTeam";
import { TeamMember } from "../../../services/settings/team";
import PendingTeamMembers from "./PendingTeamMembers";
import TeamMemberActionModal, { TeamFormValues } from "./TeamMemberActionModal";
import { useFetchEmailIntegration } from "../../../hooks/integrations/useEmailMarketing";
import { Link } from "react-router-dom";

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-600",
  officeManager: "bg-blue-100 text-blue-600",
  doctor: "bg-green-100 text-green-600",
  treatmentCoordinator: "bg-purple-100 text-purple-600",
  frontDesk: "bg-yellow-100 text-yellow-600",
};

const invitationStatusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  revoked: "bg-red-100 text-red-700 border-red-200",
  expired: "bg-gray-100 text-gray-600 border-gray-200",
};

const Team: React.FC = () => {
  const { data: membersData, isLoading: membersIsLoading } =
    useFetchTeamMembers();

  const members = membersData?.data;

  const { mutate: deleteMember, isPending: deleteIsPending } =
    useDeleteTeamMember();

  const { data: emailExistingConfig, isLoading: isEmailConfigLoading } =
    useFetchEmailIntegration();

  // Normalize email config to handle both single object and array responses
  const emailConfig = Array.isArray(emailExistingConfig)
    ? emailExistingConfig[0]
    : emailExistingConfig;

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editMemberId, setEditMemberId] = useState<string>("");
  const [modalInitialValues, setModalInitialValues] =
    useState<TeamFormValues | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState<string>("");

  const activeMembers = members?.filter(
    (member: TeamMember) => member.status === "active"
  );
  const pendingMembers = members?.filter(
    (member: TeamMember) => member.status === "pending"
  );

  const handleEdit = (member: TeamMember) => {
    setEditMemberId(member._id);

    // Extract location ID
    const locationId =
      member.locations && member.locations.length > 0
        ? typeof member.locations[0] === "object"
          ? member.locations[0]._id
          : member.locations[0]
        : "";

    // Extract permission IDs
    const permissionIds = member.permissions
      ? member.permissions.map((p: any) => (typeof p === "object" ? p._id : p))
      : [];

    setModalInitialValues({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role?._id || "",
      locations: locationId,
      permissions: permissionIds,
    });
    setInviteModalOpen(true);
  };

  // ✅ Common cancel handler
  const handleCancel = () => {
    setInviteModalOpen(false);
    setEditMemberId("");
    setModalInitialValues(null);
    setIsDeleteModalOpen(false);
    setDeleteMemberId("");
  };

  // ✅ Delete
  const handleDeleteClick = (id: string) => {
    setDeleteMemberId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteMemberId) return;
    deleteMember(deleteMemberId, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Active Members */}
      <Card shadow="none" className="rounded-xl border border-foreground/10">
        <CardHeader className="flex items-center gap-2 px-4 pt-4 pb-0">
          <LuUsers className="size-5" />
          <h4>Team Members ({activeMembers?.length || 0})</h4>
        </CardHeader>
        <CardBody className="p-4 space-y-3">
          {membersIsLoading ? (
            <TeamSkeleton type="active" />
          ) : activeMembers && activeMembers.length > 0 ? (
            activeMembers.map((member: TeamMember) => (
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
                      {member.firstName.charAt(0)}
                      {member.lastName.charAt(0)}
                    </div>
                  )}
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`${
                      roleColors[
                        member.role?.role?.toLowerCase() as keyof typeof roleColors
                      ] ||
                      roleColors[
                        member.role?.role as keyof typeof roleColors
                      ] ||
                      "bg-gray-100 text-gray-600"
                    } inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-medium`}
                  >
                    {member.role?.title || member.role?.role || "No Role"}
                  </span>

                  <span
                    className={`capitalize px-2 py-0.5 text-[11px] font-medium inline-flex items-center gap-1 rounded-md border ${
                      invitationStatusColors[member.status] ||
                      "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    <MdCheck /> {member.status}
                  </span>

                  <Button
                    size="sm"
                    variant="bordered"
                    className="border-small font-medium gap-1.5"
                    onPress={() => handleEdit(member)}
                  >
                    <FiEdit className="size-3.5" /> Edit
                  </Button>

                  {member.role?.role !== "Admin" && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="bordered"
                      color="danger"
                      className="border-small"
                      onPress={() => handleDeleteClick(member._id)}
                    >
                      <FiTrash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={<LuUsers className="w-6 h-6 text-foreground/50" />}
              title="No active members"
              message="Invite team members to collaborate in your practice."
            />
          )}
        </CardBody>
      </Card>

      {/* Pending Members */}
      <PendingTeamMembers
        membersIsLoading={membersIsLoading}
        pendingMembers={pendingMembers}
      />

      {/* Email Integration Warning */}
      {!isEmailConfigLoading && emailConfig?.status !== "Connected" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
          <p className="text-sm text-yellow-800">
            Email Marketing Platform is not connected. You can't invite team
            members until you connect your Email Marketing Platform.
          </p>
          <Button
            as={Link}
            to="/integrations"
            size="sm"
            color="warning"
            variant="flat"
            className="bg-yellow-200 text-yellow-800"
          >
            Connect Email
          </Button>
        </div>
      )}

      {/* Invite Button */}
      {emailConfig?.status === "Connected" && (
        <Button
          variant="bordered"
          size="sm"
          className="w-full flex items-center justify-center gap-2 border-foreground/10 border-small font-medium bg-background"
          onPress={() => {
            setInviteModalOpen(true);
            setEditMemberId("");
            setModalInitialValues(null);
          }}
        >
          <HiOutlineUserAdd className="h-4 w-4" />
          Invite Team Member
        </Button>
      )}

      <TeamMemberActionModal
        isOpen={inviteModalOpen}
        onClose={handleCancel}
        editMemberId={editMemberId}
        initialValues={modalInitialValues}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteIsPending}
        title="Delete Team Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
      />
    </div>
  );
};

export default Team;
