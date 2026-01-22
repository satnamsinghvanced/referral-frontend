import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFetchLocations } from "../../../hooks/settings/useLocation";
import {
  useInviteTeamMember,
  useUpdateTeamMember,
} from "../../../hooks/settings/useTeam";
import { usePermissions, useRoles } from "../../../hooks/useCommon";
import { Permission, Role } from "../../../types/common";
import { NAME_REGEX } from "../../../consts/consts";

interface TeamMemberActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMemberId: string;
  initialValues?: TeamFormValues | null;
}

export interface TeamFormValues {
  firstName: string;
  lastName: string;
  email: string;
  locations: string[]; // Changed from string to string[]
  role: string;
  permissions: string[];
}

type UpdatePayload = {
  firstName: string;
  lastName: string;
  locations: string[]; // Changed from string to string[]
  role: string;
  permissions: string[];
};

type AddPayload = UpdatePayload & { email: string };

const TeamSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .matches(
      NAME_REGEX,
      "First name can only contain letters, spaces, hyphens, apostrophes, and full stops",
    )
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .matches(
      NAME_REGEX,
      "Last name can only contain letters, spaces, hyphens, apostrophes, and full stops",
    )
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  locations: Yup.array()
    .of(Yup.string())
    .min(1, "At least one practice location is required")
    .required("Practice Location is required"),
  role: Yup.string().required("Role is required"),
  permissions: Yup.array()
    .of(Yup.string())
    .min(1, "At least one permission is required")
    .required("Permissions are required"),
});

const TeamMemberActionModal: React.FC<TeamMemberActionModalProps> = ({
  isOpen,
  onClose,
  editMemberId,
  initialValues,
}) => {
  const { data: roles } = useRoles();
  const { data: permissions } = usePermissions();
  const { data: locationsData } = useFetchLocations();
  const locations = locationsData?.data || [];

  const { mutate: inviteMember, isPending: addIsPending } =
    useInviteTeamMember();
  const { mutate: updateMember, isPending: updateIsPending } =
    useUpdateTeamMember();

  const formik = useFormik<TeamFormValues>({
    enableReinitialize: true,
    initialValues: initialValues || {
      firstName: "",
      lastName: "",
      email: "",
      locations: [],
      role: roles?.[0]?._id || "",
      permissions: roles?.[0]?.permissions?.map((p: Permission) => p._id) || [],
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
              onClose();
            },
          },
        );
      } else {
        payload = { ...payload, email: values.email };
        inviteMember(payload, {
          onSuccess: () => {
            onClose();
            formik.resetForm();
          },
        });
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      (!formik.values.locations || formik.values.locations.length === 0) &&
      locations &&
      locations.length > 0
    ) {
      const primaryLoc =
        locations.find((l: any) => l.isPrimary) || locations[0];
      if (primaryLoc) {
        formik.setFieldValue("locations", [primaryLoc._id]);
      }
    }
  }, [locations, formik.values.locations]);

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
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 px-4 py-4">
          <h4 className="text-base font-medium">
            {editMemberId ? "Edit Team Member" : "Invite Team Member"}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
            Send an invitation to join your orthodontic practice team. They'll
            receive an email with setup instructions.
          </p>
        </ModalHeader>
        <ModalBody className="px-4 py-0">
          <form
            id="team-invite-form"
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-4 text-sm"
          >
            <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1 max-md:gap-4">
              <Input
                size="sm"
                radius="sm"
                variant="flat"
                id="firstName"
                name="firstName"
                label="First Name"
                labelPlacement="outside"
                placeholder="Enter first name"
                value={formik.values.firstName}
                onValueChange={(val) => formik.setFieldValue("firstName", val)}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(formik.touched.firstName && formik.errors.firstName)
                }
                errorMessage={
                  formik.touched.firstName &&
                  (formik.errors.firstName as string)
                }
                isRequired
              />
              <Input
                size="sm"
                radius="sm"
                variant="flat"
                id="lastName"
                name="lastName"
                label="Last Name"
                labelPlacement="outside"
                placeholder="Enter last name"
                value={formik.values.lastName}
                onValueChange={(val) => formik.setFieldValue("lastName", val)}
                onBlur={formik.handleBlur}
                isInvalid={
                  !!(formik.touched.lastName && formik.errors.lastName)
                }
                errorMessage={
                  formik.touched.lastName && (formik.errors.lastName as string)
                }
                isRequired
              />
            </div>

            <Input
              size="sm"
              radius="sm"
              variant="flat"
              id="email"
              name="email"
              label="Email Address"
              labelPlacement="outside"
              placeholder="Enter email address"
              value={formik.values.email}
              onValueChange={(val) => formik.setFieldValue("email", val)}
              onBlur={formik.handleBlur}
              isInvalid={!!(formik.touched.email && formik.errors.email)}
              errorMessage={
                formik.touched.email && (formik.errors.email as string)
              }
              isRequired
              isDisabled={!!editMemberId} // Disable email on edit as usually identity shouldn't change
            />

            <Select
              size="sm"
              radius="sm"
              variant="flat"
              label="Practice Location"
              labelPlacement="outside"
              placeholder="Select practice locations"
              selectionMode="multiple"
              selectedKeys={new Set(formik.values.locations)}
              onSelectionChange={(keys) => {
                formik.setFieldValue("locations", Array.from(keys) as string[]);
              }}
              onBlur={() => formik.setFieldTouched("locations", true)}
              isInvalid={
                !!(formik.touched.locations && formik.errors.locations)
              }
              errorMessage={
                formik.touched.locations && (formik.errors.locations as string)
              }
              isRequired
            >
              {(locations || []).map((location: any) => (
                <SelectItem key={location._id}>{location.name}</SelectItem>
              ))}
            </Select>

            <Select
              size="sm"
              radius="sm"
              variant="flat"
              label="Role"
              labelPlacement="outside"
              placeholder="Select a role"
              selectedKeys={formik.values.role ? [formik.values.role] : []}
              disabledKeys={formik.values.role ? [formik.values.role] : []}
              onSelectionChange={(keys) => {
                const selectedRoleId = Array.from(keys)[0] || "";
                formik.setFieldValue("role", selectedRoleId);

                // Update permissions to defaults for this role
                const selectedRole = roles?.find(
                  (r: Role) => r._id === selectedRoleId,
                );
                if (selectedRole && selectedRole.permissions) {
                  const defaultPermIds = selectedRole.permissions.map(
                    (p: Permission) => p._id,
                  );
                  formik.setFieldValue("permissions", defaultPermIds);
                }
              }}
              isRequired
              renderValue={(items) => {
                return items.map((item) => {
                  const role = roles?.find((r: any) => r._id === item.key);
                  return (
                    <div key={item.key} className="flex flex-col">
                      <span className="text-sm font-normal">
                        {role?.title || role?.role}
                      </span>
                      {role?.description && (
                        <span className="text-tiny text-default-500 dark:text-gray-400">
                          {role.description}
                        </span>
                      )}
                    </div>
                  );
                });
              }}
              classNames={{ trigger: "h-auto py-0.5" }}
            >
              {(roles || [])?.map((role: any) => {
                return (
                  <SelectItem key={role._id} textValue={role.title}>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{role.title}</span>
                      {role.description && (
                        <span className="text-tiny text-gray-500 dark:text-gray-400">
                          {role.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </Select>

            <div className="flex flex-col">
              <p className="text-xs mb-3">Permissions</p>
              <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1 max-md:gap-3">
                {permissions?.map((perm: any) => (
                  <Checkbox
                    size="sm"
                    radius="sm"
                    key={perm._id}
                    isSelected={formik.values.permissions?.includes(perm._id)}
                    onValueChange={(checked) => {
                      const updated = checked
                        ? [...formik.values.permissions, perm._id]
                        : formik.values.permissions.filter(
                            (p) => p !== perm._id,
                          );
                      formik.setFieldValue("permissions", updated);
                    }}
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
        </ModalBody>
        <ModalFooter className="p-4">
          <Button
            onPress={onClose}
            variant="ghost"
            color="default"
            size="sm"
            radius="sm"
            className="border-small"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="team-invite-form"
            color="primary"
            size="sm"
            radius="sm"
            isLoading={editMemberId ? updateIsPending : addIsPending}
            isDisabled={
              formik.values.permissions?.length === 0 ||
              formik.values.locations?.length === 0 ||
              !formik.dirty ||
              !formik.isValid
            }
          >
            {editMemberId ? "Update Member" : "Send Invitation"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TeamMemberActionModal;
