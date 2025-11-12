import { Button, Checkbox, Select, SelectItem, Textarea } from "@heroui/react";
import { useFormik } from "formik";
import { Key, useMemo } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSave, BiUserPlus } from "react-icons/bi";
import { FaStethoscope } from "react-icons/fa";
import { FiTrash2, FiUsers } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";
import * as Yup from "yup";
import ActionModal from "../../components/common/ActionModal";
import Input from "../../components/ui/Input";
import { EMAIL_REGEX, PHONE_REGEX } from "../../consts/consts";
import { CATEGORY_OPTIONS } from "../../consts/filters";
import { STAFF_ROLES } from "../../consts/practice";
import { useSpecialties } from "../../hooks/useCommon";
import { useCreateReferrer, useUpdateReferrer } from "../../hooks/useReferral";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";

interface ReferralManagementActionsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editedData?: any;
  setReferrerEditId?: any;
  isPracticeEdit?: boolean;
}

type PracticeAddressErrors = Record<string, string | undefined> | undefined;
type PracticeAddressTouched = Record<string, boolean | undefined> | undefined;

export default function ReferralManagementActions({
  isModalOpen,
  setIsModalOpen,
  editedData = {},
  setReferrerEditId,
  isPracticeEdit,
}: ReferralManagementActionsProps) {
  const { user } = useTypedSelector((state) => state.auth);
  console.log("editedData", editedData);

  const { data: specialties } = useSpecialties();

  const { mutate: createReferrer, isPending: referrerCreationPending } =
    useCreateReferrer();

  const { mutate: updateReferrer, isPending: referrerUpdationPending } =
    useUpdateReferrer();

  const defaultInitialValues: any = {
    type: editedData?.type || "doctor",
    name: editedData?.name || "",
    phone: editedData?.phone || "",
    email: editedData?.email || "",
    practiceName: editedData?.practiceName || "",
    partnershipLevel: editedData?.partnershipLevel || "",
    practiceType: editedData?.practiceType || "",
    practiceAddress: {
      addressLine1: editedData?.practiceAddress?.addressLine1 || "",
      addressLine2: editedData?.practiceAddress?.addressLine2 || "",
      city: editedData?.practiceAddress?.city || "",
      state: editedData?.practiceAddress?.state || "",
      zip: editedData?.practiceAddress?.zip || "",
    },
    website: editedData?.website || "",
    staff: editedData?.staff || [],
    additionalNotes: editedData?.additionalNotes || "",
  };

  const handleFormSubmission = async (values: any) => {
    const staffWithUpdatedRoles = values.staff.map((member: any) => {
      return {
        name: member.name,
        phone: member.phone,
        email: member.email,
        role: member.role,
        isDentist: member.isDentist,
      };
    });

    const payload =
      values.type === "patient"
        ? {
            name: values.name,
            phone: values.phone,
            email: values.email,
            additionalNotes: values.additionalNotes,
          }
        : {
            ...values,
            staff: staffWithUpdatedRoles,
            additionalNotes: values.additionalNotes,
          };

    let referrerId = user?.userId;

    if (editedData?.type) {
      referrerId = editedData?._id;
    }

    if (isPracticeEdit) {
      referrerId = editedData?.referrer_id;
    }

    const mutationPayload = {
      id: referrerId as string,
      type: values.type,
      payload: payload,
    };

    const mutationPromise = new Promise((resolve, reject) => {
      if (editedData?.type || isPracticeEdit) {
        updateReferrer(mutationPayload, {
          onSuccess: (data) => {
            resolve(data);
            setIsModalOpen(false);
            setReferrerEditId("");
          },
          onError: (error) => reject(error),
        });
      } else {
        createReferrer(mutationPayload, {
          onSuccess: (data) => {
            resolve(data);
            setIsModalOpen(false);
            formik.resetForm();
          },
          onError: (error) => reject(error),
        });
      }
    });

    try {
      await mutationPromise;
    } catch (error) {
      console.error("Referrer creation failed:", error);
    }
  };

  const formik = useFormik({
    initialValues: defaultInitialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      type: Yup.string().required("Referrer type is required"),
      name: Yup.string().required("Full name is required"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(PHONE_REGEX, "Phone must be in format (XXX) XXX-XXXX"),
      email: Yup.string()
        .required("Email is required")
        .matches(EMAIL_REGEX, "Invalid email format"),
      practiceName: Yup.string().when("type", {
        is: "doctor",
        then: (schema) => schema.required("Practice name is required"),
      }),
      partnershipLevel: Yup.string().when("type", {
        is: "doctor",
        then: (schema) => schema.required("Referrer level is required"),
      }),
      practiceType: Yup.string().when("type", {
        is: "doctor",
        then: (schema) => schema.required("Type of practice is required"),
      }),
      website: Yup.string().matches(
        /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i,
        "Website must be a valid URL.(https://example.com or www.example.com"
      ),
      practiceAddress: Yup.object().shape({
        addressLine1: Yup.string().when(["$type"], {
          is: (type: string) => type === "doctor",
          then: (schema) => schema.required("Address Line 1 is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        addressLine2: Yup.string().nullable(),
        city: Yup.string().when(["$type"], {
          is: (type: string) => type === "doctor",
          then: (schema) => schema.required("City is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        state: Yup.string().when(["$type"], {
          is: (type: string) => type === "doctor",
          then: (schema) => schema.required("State is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        zip: Yup.number()
          .typeError("ZIP must be a number")
          .integer("ZIP must be a whole number")
          .min(10000, "ZIP code must be 5 digits (e.g., 10000)")
          .max(99999, "ZIP code must be 5 digits (e.g., 99999)")
          .when(["$type"], {
            is: (type: string) => type === "doctor",
            then: (schema) => schema.required("ZIP is required"),
            otherwise: (schema) => schema.notRequired(),
          }),
      }),
      staff: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required("Name is required"),
          role: Yup.array()
            .min(1, "At least one Role/Title must be selected.")
            .required("Role/Title is required"),
          email: Yup.string().matches(EMAIL_REGEX, "Invalid email format"),
          phone: Yup.string().nullable(),
          isDentist: Yup.boolean().nullable(),
        })
      ),
    }),
    onSubmit: handleFormSubmission,
  });

  const fieldGroups = useMemo(() => {
    const basicFields: {
      id: keyof typeof formik.values;
      label: string;
      type: string;
      placeholder?: string;
      isFullWidth?: boolean;
      isRequired?: boolean;
    }[] = [
      {
        id: "name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter full name",
        isRequired: true,
      },
      {
        id: "phone",
        label: "Phone",
        type: "tel",
        placeholder: "e.g., (123) 456-7890",
        isRequired: true,
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: "e.g., johndoe@gmail.com",
        isFullWidth: true,
        isRequired: true,
      },
    ];

    const doctorFields: {
      id: keyof typeof formik.values;
      label: string;
      type: string;
      options?: { _id: string; title: string }[];
      placeholder?: string;
      isFullWidth?: boolean;
      isRequired?: boolean;
      subFields?: Array<{
        id: keyof typeof formik.values;
        placeholder?: string;
        type: string;
        isRequired?: boolean;
      }>;
    }[] = [
      {
        id: "practiceName",
        label: "Practice Name",
        type: "text",
        placeholder: "Enter practice name",
        isRequired: true,
      },
      {
        id: "partnershipLevel",
        label: "Referrer Level",
        type: "select",
        options: CATEGORY_OPTIONS,
        placeholder: "Select level",
        isRequired: true,
      },
      {
        id: "practiceType",
        label: "Type of Practice",
        type: "select",
        options: specialties,
        placeholder: "Select specialty",
        isFullWidth: true,
        isRequired: true,
      },
      {
        id: "practiceAddress",
        label: "Practice Address",
        type: "group",
        isFullWidth: true,
        isRequired: true,
        subFields: [
          {
            id: "addressLine1",
            placeholder: "123 Main Street, Suite 100",
            isRequired: true,
            type: "text",
          },
          {
            id: "addressLine2",
            placeholder: "Address Line 2 (Optional)",
            type: "text",
          },
          {
            id: "city",
            placeholder: "City",
            type: "text",
            isRequired: true,
          },
          {
            id: "state",
            placeholder: "State",
            type: "text",
            isRequired: true,
          },
          {
            id: "zip",
            placeholder: "Zip",
            type: "number",
            isRequired: true,
          },
        ],
      },
      {
        id: "website",
        label: "Website",
        type: "url",
        placeholder: "https://www.practice.com",
        isFullWidth: true,
      },
    ];

    const staffMemberFields: {
      id: string;
      label: string;
      type: string;
      options?: { _id: string; title: string }[];
      placeholder?: string;
      isFullWidth?: boolean;
      multiple?: boolean;
      isRequired?: boolean;
    }[] = [
      {
        id: "name",
        label: "Name",
        type: "text",
        placeholder: "Dr. John Smith",
        isRequired: true,
      },
      {
        id: "role",
        label: "Role/Title",
        type: "select",
        options: STAFF_ROLES,
        placeholder: "Select Role",
        isRequired: true,
        multiple: true,
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: "john.smith@practice.com",
      },
      {
        id: "phone",
        label: "Phone",
        type: "tel",
        placeholder: "(555) 123-4567",
      },
      {
        id: "isDentist",
        label: "This person is a doctor/dentist",
        type: "checkbox",
        isFullWidth: true,
      },
    ];

    const notesField: {
      id: keyof typeof formik.values;
      label: string;
      type: string;
      placeholder?: string;
      minRows?: number;
    }[] = [
      {
        id: "additionalNotes",
        label: "Notes (optional)",
        type: "textarea",
        placeholder: "Any additional information about this referrer...",
        minRows: 2,
      },
    ];

    return {
      basic: basicFields,
      doctor: doctorFields,
      staffMember: staffMemberFields,
      notes: notesField,
    };
  }, [specialties]);

  const renderField = (field: {
    id: keyof typeof formik.values;
    label: string;
    type: string;
    options?: { _id: string; title: string }[];
    placeholder?: string;
    minRows?: number;
    isFullWidth?: boolean;
    isRequired?: boolean;
    multiple?: boolean;
    subFields?: Array<{
      id: keyof typeof formik.values;
      placeholder?: string;
      isRequired?: boolean;
    }>;
  }) => {
    const {
      id,
      label,
      type,
      options,
      multiple,
      placeholder,
      minRows,
      isFullWidth,
      isRequired,
      subFields,
    } = field;

    switch (type) {
      case "select":
        return (
          <div
            key={id as Key}
            className={`w-full ${isFullWidth ? "col-span-3" : ""}`}
          >
            <Select
              name={id as string}
              radius="sm"
              size="sm"
              label={label}
              labelPlacement="outside"
              placeholder={placeholder || "Select an option"}
              selectionMode={multiple ? "multiple" : "single"}
              selectedKeys={
                multiple
                  ? Array.isArray(formik.values[id])
                    ? formik.values[id]
                    : []
                  : formik.values[id]
                  ? [formik.values[id]]
                  : []
              }
              onSelectionChange={(keys) => {
                const selectedKeysArray = Array.from(keys);
                const finalValue = multiple
                  ? selectedKeysArray
                  : selectedKeysArray[0] || "";
                formik.setFieldValue(id as string, finalValue);
                formik.setFieldTouched(id as string, true, false);
              }}
              isInvalid={
                !!(formik.touched[id as string] && formik.errors[id as string])
              }
              errorMessage={
                formik.touched[id as string] && formik.errors[id as string]
                  ? (formik.errors[id as string] as string)
                  : undefined
              }
              classNames={{
                base: "gap-2 !mt-0",
                label: "static !translate-y-0",
              }}
              isRequired={isRequired as boolean}
            >
              {(options || []).map((opt: any) => (
                <SelectItem key={opt?._id} className="capitalize">
                  {opt?.title}
                </SelectItem>
              ))}
            </Select>
          </div>
        );

      case "textarea":
        return (
          <div key={id as Key} className="w-full">
            <Textarea
              name={id as string}
              size="sm"
              label={label}
              labelPlacement="outside"
              placeholder={placeholder || ""}
              value={formik.values[id]}
              onValueChange={(value) =>
                formik.setFieldValue(id as string, value)
              }
              onBlur={formik.handleBlur}
              isInvalid={
                !!(formik.touched[id as string] && formik.errors[id as string])
              }
              errorMessage={
                formik.touched[id as string] && formik.errors[id as string]
                  ? (formik.errors[id as string] as string)
                  : undefined
              }
              minRows={minRows || 3}
              className="text-sm"
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={id as Key} className="w-full">
            <Checkbox
              name={id as string}
              size="sm"
              isSelected={formik.values[id as string]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              classNames={{ label: "text-xs" }}
            >
              {label}
            </Checkbox>
            {formik.touched[id as string] && formik.errors[id as string] && (
              <div className="text-xs text-red-500 mt-1 ml-6">
                {formik.errors[id as string] as string}
              </div>
            )}
          </div>
        );

      case "group":
        return (
          <div key={field.id as Key} className="space-y-2">
            {subFields?.map((sub: any, index: number) => {
              const fieldPath = `practiceAddress.${sub.id}`;
              const addressErrors = formik.errors
                .practiceAddress as PracticeAddressErrors;
              const addressTouched = formik.touched
                .practiceAddress as PracticeAddressTouched;

              const subIdKey = sub.id as string;
              const isTouched = addressTouched?.[subIdKey];
              const errorText = addressErrors?.[subIdKey];

              return (
                <Input
                  key={sub.id}
                  name={fieldPath}
                  type={sub.type}
                  label={index === 0 ? "Practice Address" : ""}
                  labelPlacement="outside-top"
                  size="sm"
                  placeholder={sub.placeholder || ""}
                  value={
                    formik.values.practiceAddress[
                      sub.id as keyof typeof formik.values.practiceAddress
                    ] as string
                  }
                  onChange={(val) =>
                    formik.setFieldValue(
                      fieldPath,
                      sub.type === "tel" ? formatPhoneNumber(val) : val
                    )
                  }
                  isRequired={sub.isRequired}
                  touched={isTouched as boolean}
                  error={errorText as string}
                />
              );
            })}
          </div>
        );

      default:
        return (
          <div
            key={id as Key}
            className={`w-full ${isFullWidth ? "md:col-span-2" : ""}`}
          >
            <Input
              key={id as Key}
              name={id as string}
              type={type}
              label={label}
              placeholder={placeholder || ""}
              labelPlacement="outside-top"
              size="sm"
              value={formik.values[id] as string}
              onChange={(val) =>
                formik.setFieldValue(
                  id as string,
                  type === "tel" ? formatPhoneNumber(val) : val
                )
              }
              onBlur={formik.handleBlur}
              isRequired={isRequired}
              error={formik.errors[field.id as string] as string}
              touched={formik.touched[field.id as string] as boolean}
              isDisabled={
                id === "email" && (editedData?.type || isPracticeEdit)
              }
              classNames={{ base: "data-disabled:opacity-60" }}
            />
          </div>
        );
    }
  };

  const renderArrayField = (
    field: (typeof fieldGroups.staffMember)[number],
    index: number
  ) => {
    const fieldName = `staff[${index}].${field.id}`;
    const valuePath = formik.values.staff[index]?.[field.id];

    const staffErrors = formik.errors.staff as any[] | undefined;
    const staffTouched = formik.touched.staff as any[] | undefined;

    console.log(staffErrors, "stafferror");

    const isTouched = staffTouched?.[index]?.[field.id];
    let errorText = staffErrors?.[index]?.[field.id];

    switch (field.type) {
      case "select":
        return (
          <div
            key={fieldName as Key}
            className={`w-full ${field.isFullWidth ? "col-span-3" : ""}`}
          >
            <Select
              name={fieldName as string}
              radius="sm"
              size="sm"
              label={field.label}
              labelPlacement="outside"
              placeholder={field.placeholder || "Select an option"}
              selectionMode={field.multiple ? "multiple" : "single"}
              selectedKeys={
                field.multiple
                  ? Array.isArray(valuePath)
                    ? valuePath
                    : []
                  : valuePath
                  ? [valuePath]
                  : []
              }
              onSelectionChange={(keys) => {
                const selectedKeysArray = Array.from(keys);
                const finalValue = field.multiple
                  ? selectedKeysArray
                  : selectedKeysArray[0] || "";
                formik.setFieldValue(fieldName as string, finalValue);
                formik.setFieldTouched(fieldName as string, true, false);
              }}
              isInvalid={!!(isTouched && errorText)}
              errorMessage={
                isTouched && errorText ? (errorText as string) : undefined
              }
              classNames={{
                base: "gap-2 !mt-0",
                label: "static !translate-y-0",
              }}
              isRequired={true}
            >
              {(field.options || []).map((opt: any) => (
                <SelectItem key={opt?._id} className="capitalize">
                  {opt?.title}
                </SelectItem>
              ))}
            </Select>
          </div>
        );

      case "checkbox":
        return (
          <div key={fieldName as Key} className="w-full">
            <Checkbox
              name={fieldName as string}
              size="sm"
              isSelected={valuePath}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              classNames={{ label: "text-xs" }}
            >
              {field.label}
            </Checkbox>
            {isTouched && errorText && (
              <div className="text-xs text-red-500 mt-1 ml-6">
                {errorText as string}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div
            key={fieldName as Key}
            className={`w-full ${field.isFullWidth ? "md:col-span-2" : ""}`}
          >
            <Input
              name={fieldName as string}
              type={field.type}
              label={field.label}
              placeholder={field.placeholder || ""}
              labelPlacement="outside-top"
              size="sm"
              value={valuePath as string}
              onChange={(val) => {
                let finalValue: any = val;

                if (field.type === "tel") {
                  finalValue = formatPhoneNumber(val);
                }

                formik.setFieldValue(fieldName as string, finalValue);
              }}
              onBlur={formik.handleBlur}
              isRequired={field.isRequired}
              error={errorText as string}
              touched={isTouched as boolean}
            />
          </div>
        );
    }
  };

  const handleAddStaff = () => {
    const staffArray = formik.values.staff;
    const lastStaffMember = staffArray[staffArray.length - 1];

    const isLastMemberValid =
      staffArray.length === 0 ||
      (lastStaffMember?.name &&
        lastStaffMember?.role &&
        (Array.isArray(lastStaffMember.role)
          ? lastStaffMember.role.length > 0
          : lastStaffMember.role !== ""));

    if (!isLastMemberValid) {
      // Optionally, you might want to show a notification/toast here
      // to inform the user that they must fill the current staff member's
      // required fields before adding a new one.
      // Also manually touch the fields to show validation errors if not already touched
      if (lastStaffMember) {
        formik.setFieldTouched(
          `staff[${staffArray.length - 1}].name`,
          true,
          true
        );
        formik.setFieldTouched(
          `staff[${staffArray.length - 1}].role`,
          true,
          true
        );
      }

      return;
    }

    const newStaffMember = {
      name: "",
      role: [],
      email: "",
      phone: "",
      isDentist: false,
    };

    const newStaff = [...formik.values.staff, newStaffMember];
    formik.setFieldValue("staff", newStaff);
  };

  const handleRemoveStaff = (index: number) => {
    const newStaff = formik.values.staff.filter(
      (_: any, i: number) => i !== index
    );
    formik.setFieldValue("staff", newStaff);
  };

  let modalTitle = "Add New Referrer (Enhanced v2.0)";
  let modalDescription =
    "Add a new doctor or patient referrer to your Practice ROI platform. Track referrals and generate QR codes.";
  let saveButtonText = "Add Referrer";
  let saveButtonIcon = <AiOutlinePlus fontSize={15} />;

  if (isPracticeEdit) {
    modalTitle = `Edit Practice - ${editedData?.practiceName}`;
    modalDescription = `Update practice information, manage staff members, and edit relationship details for ${editedData?.practiceName}.`;
    saveButtonText = "Save Changes";
    saveButtonIcon = <BiSave fontSize={15} />;
  }

  if (editedData?.type) {
    modalTitle = "Edit Referrer (Enhanced v2.0)";
    modalDescription = "Edit your doctor or patient referrer.";
    saveButtonText = "Update Referrer";
    saveButtonIcon = <BiSave fontSize={15} />;
  }

  return (
    <ActionModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      heading={modalTitle}
      description={modalDescription}
      buttons={[
        {
          text: "Cancel",
          onPress: () => setIsModalOpen(false),
          color: "default",
          variant: "bordered",
          className:
            "border-foreground/10 border text-foreground hover:bg-background",
        },
        {
          text: saveButtonText,
          icon: saveButtonIcon,
          onPress: formik.handleSubmit,
          color: "primary",
          variant: "solid",
          isLoading: referrerCreationPending || referrerUpdationPending,
        },
      ]}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 py-1 h-fit w-full"
      >
        {!isPracticeEdit && (
          <div className="border border-primary/20 rounded-lg p-4">
            <Select
              size="sm"
              label="Referrer Type"
              labelPlacement="outside"
              isRequired
              placeholder="Select type"
              selectedKeys={[formik.values.type]}
              disabledKeys={[formik.values.type]}
              onSelectionChange={(keys) =>
                formik.setFieldValue(
                  "type",
                  Array.from(keys)[0] as "doctor" | "patient"
                )
              }
              classNames={{ label: "text-sm font-medium" }}
              isDisabled={editedData?.type ? true : false}
            >
              <SelectItem key="doctor">Doctor Referrer</SelectItem>
              <SelectItem key="patient">Patient Referrer</SelectItem>
            </Select>
          </div>
        )}

        <div className="border border-primary/20 rounded-lg p-4">
          <h5 className="text-sm font-medium mb-3">Basic Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2.5">
            {fieldGroups.basic.map(renderField)}
          </div>
        </div>

        {formik.values.type === "doctor" && (
          <div className="border border-primary/20 rounded-lg p-4">
            <h5 className="text-sm font-medium mb-3">Practice Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2.5">
              {fieldGroups.doctor.map((f) => (
                <div
                  key={f.id as string}
                  className={f.isFullWidth ? "md:col-span-2" : ""}
                >
                  {renderField(f)}
                </div>
              ))}
            </div>
          </div>
        )}

        {formik.values.type === "doctor" && (
          <div className="border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium">Doctors & Staff Members</h5>
              <Button
                size="sm"
                variant="bordered"
                color="default"
                startContent={<BiUserPlus fontSize={18} />}
                className="border-small"
                onPress={handleAddStaff}
                type="button"
              >
                Add Staff
              </Button>
            </div>

            {formik.values.staff.length === 0 ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-foreground/20 rounded-lg py-6 mb-4 gap-3">
                <FiUsers className="inline mr-2 text-4xl text-default-400" />
                <span className="text-sm text-gray-500">
                  No additional staff members added yet
                </span>
                <Button
                  size="sm"
                  variant="bordered"
                  color="default"
                  startContent={<BiUserPlus fontSize={18} />}
                  className="border-small"
                  onPress={handleAddStaff}
                  type="button"
                >
                  Add First Staff Member
                </Button>
              </div>
            ) : (
              formik.values.staff.map((member: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-between gap-2">
                      {member.isDentist ? (
                        <FaStethoscope className="text-blue-600 text-[15px] w-4" />
                      ) : (
                        <LuUserRound />
                      )}
                      <span className="text-sm font-medium">
                        Staff Member {index + 1}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      isIconOnly
                      onPress={() => handleRemoveStaff(index)}
                      type="button"
                    >
                      <FiTrash2 className="text-base" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2.5">
                    {fieldGroups.staffMember.map((f) => {
                      const isExperienceField = f.id === "experience";
                      const isDoctor = member.isDentist;

                      if (isExperienceField && !isDoctor) {
                        return null;
                      }

                      return (
                        <div
                          key={`${f.id as string}-${index}`}
                          className={f.isFullWidth ? "md:col-span-2" : ""}
                        >
                          {renderArrayField(f, index)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="border border-primary/20 rounded-lg p-4">
          <h5 className="text-sm font-medium mb-3">Additional Information</h5>
          <div className="grid grid-cols-1 gap-4">
            {fieldGroups.notes.map(renderField)}
          </div>
        </div>
      </form>
    </ActionModal>
  );
}
