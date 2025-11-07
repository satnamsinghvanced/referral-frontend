import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Checkbox,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { HiOutlineUserAdd } from "react-icons/hi";
import { FiEdit, FiTrash2, FiMail, FiLoader } from "react-icons/fi";
import { MdCheck } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { useFormik } from "formik";
import * as Yup from "yup";
import ActionModal from "../../components/common/ActionModal";
import Input from "../../components/ui/Input";
import {
  useFetchTeamMembers,
  useDeleteTeamMember,
  useResendInvite,
  useInviteTeamMember,
  useUpdateTeamMember,
} from "../../hooks/settings/useTeam";
import { formatDateToYYYYMMDD } from "../../utils/formatDateToYYYYMMDD";
import { usePermissions, useRoles } from "../../hooks/useCommon";
// import Button from "../../components/ui/Button";
import { RiDeleteBinLine } from "react-icons/ri";
import EmptyState from "../../components/common/EmptyState";
import TeamSkeleton from "../../components/skeletons/TeamSkeleton";
import { useFetchLocations } from "../../hooks/settings/useLocation";

interface TeamMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  locations: string[];
  role: { role: string; _id: string };
  invitationStatus: string;
  avatar?: string;
  invitedAt: string;
  permissions?: string[];
}

interface TeamFormValues {
  firstName: string;
  lastName: string;
  email: string;
  locations: string[];
  role: string;
  permissions: string[];
}

type UpdatePayload = {
  firstName: string;
  lastName: string;
  locations: string[];
  role: string;
  permissions: string[];
};

type AddPayload = UpdatePayload & { email: string };

const roleColors: Record<string, string> = {
  Admin: "bg-red-100 text-red-600",
  Manager: "bg-blue-100 text-blue-600",
  Staff: "bg-yellow-100 text-yellow-600",
  Doctor: "bg-green-100 text-green-600",
};

const invitationStatusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  revoked: "bg-red-100 text-red-700 border-red-200",
  expired: "bg-gray-100 text-gray-600 border-gray-200",
};

const Team: React.FC = () => {
  const { data: roles } = useRoles();
  const { data: permissions } = usePermissions();
  const { data: locations } = useFetchLocations();
  const { data: members, isLoading: membersIsLoading } = useFetchTeamMembers();
  const { mutate: inviteMember, isPending: addIsPending } =
    useInviteTeamMember();
  const { mutate: updateMember, isPending: updateIsPending } =
    useUpdateTeamMember();
  const { mutate: deleteMember, isPending: deleteIsPending } =
    useDeleteTeamMember();
  const { mutate: resendInvite } = useResendInvite();

  const [resendingId, setResendingId] = useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editMemberId, setEditMemberId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState<string>("");

  const activeMembers = members?.filter(
    (member: TeamMember) => member.invitationStatus === "active"
  );
  const pendingMembers = members?.filter(
    (member: TeamMember) => member.invitationStatus === "pending"
  );

  const TeamSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    locations: Yup.array().required("Practice Location is required"),
    role: Yup.string().required("Role is required"),
    permissions: Yup.array()
      .of(Yup.string())
      .required("Permissions are required"),
  });

  console.log(permissions);

  const formik = useFormik<TeamFormValues>({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      locations: [],
      role: "",
      permissions: permissions?.map((item: any) => item._id),
    },
    validationSchema: TeamSchema,
    onSubmit: (values) => {
      let payload: UpdatePayload | AddPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        locations: values.locations,
        role: values.role,
        permissions: values.permissions,
      };

      if (editMemberId) {
        updateMember(
          { id: editMemberId, data: payload },
          {
            onSuccess: () => {
              setInviteModalOpen(false);
              setEditMemberId("");
            },
          }
        );
      } else {
        payload = { ...payload, email: values.email };
        inviteMember(payload, {
          onSuccess: () => {
            setInviteModalOpen(false);
            setEditMemberId("");
            formik.resetForm();
          },
        });
      }
    },
  });

  console.log(formik.values.permissions, "HEEEEE");

  const handleEdit = (member: TeamMember) => {
    setEditMemberId(member._id);
    formik.setValues({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role._id,
      locations: member.locations,
      permissions: member.permissions || [],
    });
    setInviteModalOpen(true);
  };

  const handleResend = (id: string) => {
    setResendingId(id);
    resendInvite(id, {
      onSettled: () => setResendingId(null),
    });
  };

  // ✅ Common cancel handler
  const handleCancel = () => {
    setInviteModalOpen(false);
    setEditMemberId("");
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
    <div className="space-y-6">
      {/* Active Members */}
      <Card shadow="none" className="rounded-xl border border-foreground/10">
        <CardHeader className="flex items-center gap-2 px-5 pt-5 pb-0">
          <LuUsers className="w-5 h-5" />
          <p>Team Members ({activeMembers?.length || 0})</p>
        </CardHeader>
        <CardBody className="p-5 space-y-3">
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
                      roleColors[member.role.role] ||
                      "bg-gray-100 text-gray-600"
                    } inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-medium`}
                  >
                    {member.role.role}
                  </span>

                  <span
                    className={`capitalize px-2 py-0.5 text-[11px] font-medium inline-flex items-center gap-1 rounded-md border ${
                      invitationStatusColors[member.invitationStatus] ||
                      "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    <MdCheck /> {member.invitationStatus}
                  </span>

                  <Button
                    size="sm"
                    variant="bordered"
                    className="border-small font-medium gap-1.5"
                    onPress={() => handleEdit(member)}
                  >
                    <FiEdit className="size-3.5" /> Edit
                  </Button>

                  {member.role.role !== "Admin" && (
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
      <Card shadow="none" className="rounded-xl border border-foreground/10">
        <CardHeader className="flex items-center gap-2 px-5 pt-5 pb-0">
          <FiMail className="w-5 h-5" />
          <p>Pending Invitations ({pendingMembers?.length || 0})</p>
        </CardHeader>
        <CardBody className="p-5 space-y-3">
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
                      Invited as {member.role.role} on{" "}
                      {formatDateToYYYYMMDD(member.invitedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`capitalize px-2 py-0.5 text-[11px] font-medium inline-flex items-center gap-1 rounded-md border ${
                      invitationStatusColors[member.invitationStatus] ||
                      "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {member.invitationStatus}
                  </span>

                  <Button
                    key={member._id}
                    size="sm"
                    variant="bordered"
                    onPress={() => handleResend(member._id)}
                    isLoading={resendingId === member._id}
                    className="border-small bg-white"
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

      {/* Invite Button */}
      <Button
        variant="bordered"
        size="sm"
        className="w-full flex items-center justify-center gap-2 border-foreground/10 border-small font-medium bg-background"
        onPress={() => {
          setInviteModalOpen(true);
          setEditMemberId("");
          formik.resetForm();
        }}
      >
        <HiOutlineUserAdd className="h-4 w-4" />
        Invite Team Member
      </Button>

      {/* Modal */}
      <ActionModal
        isOpen={inviteModalOpen}
        onClose={() => {
          setInviteModalOpen(false);
          setEditMemberId("");
        }}
        heading={editMemberId ? "Edit Team Member" : "Invite Team Member"}
        description="Send an invitation to join your orthodontic practice team. They'll receive an email with setup instructions."
        size="md"
        scrollable
        buttons={[
          {
            text: "Cancel",
            onPress: () => {
              setInviteModalOpen(false);
              setEditMemberId("");
            },
            variant: "bordered",
            className: "text-foreground border-foreground/10",
          },
          {
            text: editMemberId ? "Update Member" : "Send Invitation",
            onPress: formik.handleSubmit,
            color: "primary",
            isLoading: editMemberId ? updateIsPending : addIsPending,
            isDisabled:
              formik.values.permissions?.length === 0 ||
              formik.values.locations?.length === 0 ||
              !formik.dirty ||
              !formik.isValid,
          },
        ]}
      >
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 text-sm"
        >
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="firstName"
              name="firstName"
              label="First Name"
              labelPlacement="outside"
              placeholder="Enter first name"
              value={formik.values.firstName}
              onChange={(val) => formik.setFieldValue("firstName", val)}
              formik={formik}
              isRequired
            />
            <Input
              id="lastName"
              name="lastName"
              label="Last Name"
              labelPlacement="outside"
              placeholder="Enter last name"
              value={formik.values.lastName}
              onChange={(val) => formik.setFieldValue("lastName", val)}
              formik={formik}
              isRequired
            />
          </div>

          <Input
            id="email"
            name="email"
            label="Email Address"
            labelPlacement="outside"
            placeholder="Enter email address"
            value={formik.values.email}
            onChange={(val) => formik.setFieldValue("email", val)}
            formik={formik}
            isRequired
          />

          <Select
            label="Practice Location"
            labelPlacement="outside"
            placeholder="Select a practice location"
            selectedKeys={new Set(formik.values.locations)}
            onSelectionChange={(keys) => {
              formik.setFieldValue("locations", Array.from(keys));
            }}
            selectionMode="multiple"
            isRequired
          >
            {(locations || []).map((location: any) => (
              <SelectItem key={location._id}>{location.name}</SelectItem>
            ))}
          </Select>

          <Select
            label="Role"
            labelPlacement="outside"
            placeholder="Select a role"
            selectedKeys={[formik.values.role]}
            onSelectionChange={(keys) => {
              const selectedRoleId = Array.from(keys)[0] || "";
              formik.setFieldValue("role", selectedRoleId);
            }}
            isRequired
          >
            {roles?.map((role: any) => (
              <SelectItem
                key={role._id}
                textValue={
                  role.role +
                  `${role?.description ? ` - ${role.description}` : ""}`
                }
              >
                {role.role}
                {role?.description && ` - ${role.description}`}
              </SelectItem>
            ))}
          </Select>

          <div>
            <p className="text-sm mb-2">Permissions</p>
            <div className="grid grid-cols-2 gap-2">
              {permissions?.map((perm: any) => (
                <Checkbox
                  key={perm._id}
                  isSelected={formik.values.permissions?.includes(perm._id)}
                  onValueChange={(checked) => {
                    const updated = checked
                      ? [...formik.values.permissions, perm._id]
                      : formik.values.permissions.filter((p) => p !== perm._id);
                    formik.setFieldValue("permissions", updated);
                  }}
                  size="sm"
                  isRequired
                >
                  {perm.title}
                </Checkbox>
              ))}
            </div>
            {formik.values.permissions?.length === 0 && (
              <p className="text-xs text-danger-500 mt-2.5">
                Atleast one permission is required
              </p>
            )}
          </div>
        </form>
      </ActionModal>

      <ActionModal
        isOpen={isDeleteModalOpen}
        heading="Delete Team Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
        onClose={handleCancel}
        buttons={[
          {
            text: "Cancel",
            onPress: handleCancel,
            variant: "light",
            color: "default",
            className: "border border-foreground/10",
          },
          {
            text: "Delete",
            onPress: handleDeleteConfirm,
            color: "danger",
            className: "bg-red-700 text-background",
            icon: <RiDeleteBinLine className="size-4" />,
            isLoading: deleteIsPending,
          },
        ]}
      />
    </div>
  );
};

export default Team;
