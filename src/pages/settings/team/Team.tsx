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
import { LoadingState } from "../../../components/common/LoadingState";
import Pagination from "../../../components/common/Pagination";
import { usePaginationAdjustment } from "../../../hooks/common/usePaginationAdjustment";

const roleColors: Record<string, string> = {
  admin: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  officeManager:
    "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  doctor:
    "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  treatmentCoordinator:
    "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  frontDesk:
    "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
};

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

const Team: React.FC = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });

  const { data: membersData, isLoading: membersIsLoading } =
    useFetchTeamMembers(filters);

  const members = membersData?.data;

  usePaginationAdjustment({
    totalPages: membersData?.totalPages || 0,
    currentPage: filters.page,
    onPageChange: (page) => setFilters((prev) => ({ ...prev, page })),
    isLoading: membersIsLoading,
  });

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

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

  const handleEdit = (member: TeamMember) => {
    setEditMemberId(member._id);

    // Extract location IDs
    const locationIds = member.locations
      ? member.locations.map((loc: any) =>
          typeof loc === "object" ? loc._id : loc,
        )
      : [];

    // Extract permission IDs
    const permissionIds = member.permissions
      ? member.permissions.map((p: any) => (typeof p === "object" ? p._id : p))
      : [];

    setModalInitialValues({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role?._id || "",
      locations: locationIds,
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
      {/* Email Integration Warning */}
      {!isEmailConfigLoading && emailConfig?.status !== "Connected" && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg p-3 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Email Marketing Platform is not connected. You can't invite team
            members until you connect your Email Marketing Platform.
          </p>
          <Button
            as={Link}
            to="/integrations"
            size="sm"
            color="warning"
            variant="flat"
            className="bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
          >
            Connect Email
          </Button>
        </div>
      )}

      {/* Active Members */}
      <Card
        shadow="none"
        className="rounded-xl border border-foreground/10 bg-background tour-step-team-members"
      >
        <CardHeader className="flex items-center gap-2 px-4 pt-4 pb-0">
          <LuUsers className="size-5" />
          <h4>Team Members ({membersData?.totalData || 0})</h4>
        </CardHeader>
        <CardBody className="p-4 space-y-3">
          {membersIsLoading ? (
            <div className="flex items-center justify-center min-h-[156px]">
              <LoadingState />
            </div>
          ) : members && members.length > 0 ? (
            members.map((member: TeamMember) => (
              <div
                key={member._id}
                className="md:flex md:items-center md:justify-between max-md:space-y-4 p-3 border border-foreground/10 rounded-lg gap-2"
              >
                <div className="flex items-center gap-2.5">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.firstName}
                      className="size-9 rounded-full"
                    />
                  ) : (
                    <div className="size-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                      {member.firstName.charAt(0)}
                      {member.lastName.charAt(0)}
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {member.email}
                    </p>
                    {member.locations && member.locations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.locations.map((loc: any, idx) => (
                          <span
                            key={typeof loc === "object" ? loc._id : idx}
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800 font-medium"
                          >
                            {typeof loc === "object" ? loc.name : "Location"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap max-md:gap-y-3">
                  <span
                    className={`${
                      roleColors[
                        member.role?.role?.toLowerCase() as keyof typeof roleColors
                      ] ||
                      roleColors[
                        member.role?.role as keyof typeof roleColors
                      ] ||
                      "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    } inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-medium`}
                  >
                    {member.role?.title || member.role?.role || "No Role"}
                  </span>

                  <span
                    className={`capitalize px-2 py-0.5 text-[11px] font-medium inline-flex items-center gap-1 rounded-md border ${
                      invitationStatusColors[member.status] ||
                      "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-foreground/10 dark:border-gray-700"
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

          {membersData && membersData.totalPages > 1 && (
            <Pagination
              identifier="team members"
              totalItems={membersData.totalData}
              currentPage={filters.page}
              totalPages={membersData.totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </CardBody>
      </Card>

      {/* Pending Members */}
      <PendingTeamMembers />

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
