import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  Input,
} from "@heroui/react";
import { useFormik } from "formik";
import { Key, useMemo } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSave } from "react-icons/bi";
import * as Yup from "yup";
import {
  EMAIL_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
  ZIP_CODE_REGEX,
} from "../../../consts/consts";
import { STAFF_ROLES } from "../../../consts/practice";
import { useSpecialties } from "../../../hooks/useCommon";
import {
  useCreateReferrer,
  useUpdateReferrer,
} from "../../../hooks/useReferral";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";

// Sub-components
import AdditionalNotesSection from "./AdditionalNotesSection";
import BasicInfoSection from "./BasicInfoSection";
import CommunitySection from "./CommunitySection";
import DoctorSection from "./DoctorSection";
import EventSection from "./EventSection";
import GoogleSection from "./GoogleSection";
import ReferrerTypeSelector from "./ReferrerTypeSelector";
import SocialMediaSection from "./SocialMediaSection";
import StaffSection from "./StaffSection";

interface ReferrerActionsModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editedData?: any;
  setReferrerEditId?: any;
  isPracticeEdit?: boolean;
  setSelectedTab?: any;
}

type PracticeAddressErrors = Record<string, string | undefined> | undefined;
type PracticeAddressTouched = Record<string, boolean | undefined> | undefined;

const CLEAN_INITIAL_VALUES = {
  type: "doctor",
  name: "",
  phone: "",
  email: "",
  practiceName: "",
  partnershipLevel: "",
  practiceType: "",
  practiceAddress: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
  },
  website: "",
  staff: [],
  additionalNotes: "",
  communityreferrer: {
    orgName: "",
    orgAddress: "",
    orgUrl: "",
  },
  googlereferrer: {
    glSource: "",
    glPlatform: "",
    glUrl: "",
  },
  socialmediareferrer: {
    smPlatform: "",
    smSource: "",
  },
  eventreferrer: {
    evName: "",
    evLocation: "",
    evType: "",
    evUrl: "",
  },
  status: "",
};

export default function ReferrerActionsModal({
  isModalOpen,
  setIsModalOpen,
  editedData = {},
  setReferrerEditId,
  isPracticeEdit,
  setSelectedTab,
}: ReferrerActionsModalProps) {
  const { user } = useTypedSelector((state) => state.auth);
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
    communityreferrer: {
      orgName: editedData?.communityreferrer?.orgName || "",
      orgAddress: editedData?.communityreferrer?.orgAddress || "",
      orgUrl: editedData?.communityreferrer?.orgUrl || "",
    },
    googlereferrer: {
      glSource: editedData?.googlereferrer?.glSource || "",
      glPlatform: editedData?.googlereferrer?.glPlatform || "",
      glUrl: editedData?.googlereferrer?.glUrl || "",
    },
    socialmediareferrer: {
      smPlatform: editedData?.socialmediareferrer?.smPlatform || "",
      smSource: editedData?.socialmediareferrer?.smSource || "",
    },
    eventreferrer: {
      evName: editedData?.eventreferrer?.evName || "",
      evLocation: editedData?.eventreferrer?.evLocation || "",
      evType: editedData?.eventreferrer?.evType || "",
      evUrl: editedData?.eventreferrer?.evUrl || "",
    },
    status: editedData?.status || "",
  };

  const handleFormSubmission = async (values: any) => {
    const basePayload = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      additionalNotes: values.additionalNotes,
    };

    let payload: any = { ...basePayload };

    switch (values.type) {
      case "doctor":
        payload = {
          ...payload,
          practiceName: values.practiceName,
          partnershipLevel: values.partnershipLevel,
          practiceType: values.practiceType,
          practiceAddress: values.practiceAddress,
          website: values.website,
          staff: values.staff.map((member: any) => ({
            name: member.name,
            phone: member.phone,
            email: member.email,
            role: member.role,
            isDentist: member.isDentist,
          })),
          status: values.status || "active",
        };
        break;
      case "communityreferrer":
        payload.communityreferrer = values.communityreferrer;
        break;
      case "googlereferrer":
        payload.googlereferrer = values.googlereferrer;
        break;
      case "socialmediareferrer":
        payload.socialmediareferrer = values.socialmediareferrer;
        break;
      case "eventreferrer":
        payload.eventreferrer = values.eventreferrer;
        break;
      case "patient":
      default:
        break;
    }

    let referrerId = user?.userId;

    if (editedData?.type) {
      referrerId = editedData?._id;
    }

    if (isPracticeEdit) {
      referrerId = editedData?.referrer_id;
    }

    const mutationPromise = new Promise((resolve, reject) => {
      if (editedData?.type || isPracticeEdit) {
        updateReferrer(
          {
            id: referrerId as string,
            type: values.type,
            payload: payload,
          },
          {
            onSuccess: (data) => {
              resolve(data);
              setIsModalOpen(false);
              setReferrerEditId("");
            },
            onError: (error) => reject(error),
          }
        );
      } else {
        createReferrer(
          {
            type: values.type,
            payload: payload,
          },
          {
            onSuccess: (data) => {
              resolve(data);
              setIsModalOpen(false);
              formik.resetForm();
              setSelectedTab?.("Referrers");
            },
            onError: (error) => reject(error),
          }
        );
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
      name: Yup.string()
        .required("Full name is required")
        .matches(
          NAME_REGEX,
          "Full name can only contain letters, spaces, hyphens, apostrophes, and full stops"
        )
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name must be less than 100 characters"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(PHONE_REGEX, "Phone must be in format (XXX) XXX-XXXX"),
      email: Yup.string()
        .required("Email is required")
        .matches(EMAIL_REGEX, "Invalid email format"),
      practiceName: Yup.string().when("type", {
        is: "doctor",
        then: (schema) =>
          schema
            .required("Practice name is required")
            .matches(
              NAME_REGEX,
              "Practice name can only contain letters, spaces, hyphens, apostrophes, and full stops"
            )
            .min(2, "Practice name must be at least 2 characters")
            .max(100, "Practice name must be less than 100 characters"),
      }),
      partnershipLevel: Yup.string().when("type", {
        is: "doctor",
        then: (schema) => schema.required("Referrer level is required"),
      }),
      practiceType: Yup.string().when("type", {
        is: "doctor",
        then: (schema) => schema.required("Type of practice is required"),
      }),
      status: Yup.string().when(["type"], {
        is: (type: string) => type === "doctor" && isPracticeEdit,
        then: (schema) => schema.required("Status is required"),
        otherwise: (schema) => schema.notRequired(),
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
        zip: Yup.string()
          .matches(ZIP_CODE_REGEX, "ZIP code must be exactly 5 digits")
          .when(["$type"], {
            is: (type: string) => type === "doctor",
            then: (schema) => schema.required("ZIP is required"),
            otherwise: (schema) => schema.notRequired(),
          }),
      }),
      staff: Yup.array().of(
        Yup.object().shape({
          name: Yup.string()
            .required("Name is required")
            .matches(
              NAME_REGEX,
              "Name can only contain letters, spaces, hyphens, apostrophes, and full stops"
            )
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be less than 100 characters"),
          role: Yup.string().required("Role/Title is required"),
          email: Yup.string().matches(EMAIL_REGEX, "Invalid email format"),
          phone: Yup.string().nullable(),
          isDentist: Yup.boolean().nullable(),
        })
      ),
      communityreferrer: Yup.object().when("type", {
        is: "communityreferrer",
        then: () =>
          Yup.object().shape({
            orgName: Yup.string().required("Organization name is required"),
            orgAddress: Yup.string().optional(),
            orgUrl: Yup.string().url("Invalid URL").optional(),
          }),
      }),
      googlereferrer: Yup.object().when("type", {
        is: "googlereferrer",
        then: () =>
          Yup.object().shape({
            glSource: Yup.string().required("Source is required"),
            glPlatform: Yup.string().optional(),
            glUrl: Yup.string().url("Invalid URL").optional(),
          }),
      }),
      socialmediareferrer: Yup.object().when("type", {
        is: "socialmediareferrer",
        then: () =>
          Yup.object().shape({
            smPlatform: Yup.string().required("Platform is required"),
            smSource: Yup.string().optional(),
          }),
      }),
      eventreferrer: Yup.object().when("type", {
        is: "eventreferrer",
        then: () =>
          Yup.object().shape({
            evName: Yup.string().required("Event name is required"),
            evLocation: Yup.string().optional(),
            evType: Yup.string().required("Event type is required"),
            evUrl: Yup.string().url("Invalid URL").optional(),
          }),
      }),
    }),
    onSubmit: handleFormSubmission,
  });

  const getNestedValue = (path: string) => {
    return path
      .split(".")
      .reduce((obj: any, key: string) => obj?.[key], formik.values);
  };

  const getNestedError = (path: string) => {
    return path
      .split(".")
      .reduce((obj: any, key: string) => obj?.[key], formik.errors);
  };

  const getNestedTouched = (path: string) => {
    return path
      .split(".")
      .reduce((obj: any, key: string) => obj?.[key], formik.touched);
  };

  const staffMemberFields = useMemo(
    () => [
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
    ],
    []
  );

  const renderField = (field: {
    id: string;
    label: string;
    type: string;
    options?: { _id: string; title: string }[];
    placeholder?: string;
    minRows?: number;
    isFullWidth?: boolean;
    isRequired?: boolean;
    multiple?: boolean;
    subFields?: Array<{
      id: string;
      type?: string;
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

    const value = getNestedValue(id);
    const error = getNestedError(id);
    const touched = getNestedTouched(id);

    switch (type) {
      case "select":
        return (
          <div
            key={id as Key}
            className={`w-full ${isFullWidth ? "md:col-span-2" : ""}`}
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
                  ? Array.isArray(value)
                    ? value
                    : []
                  : value
                  ? [value]
                  : []
              }
              disabledKeys={
                multiple
                  ? Array.isArray(value)
                    ? value
                    : []
                  : value
                  ? [value]
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
              isInvalid={!!(touched && error)}
              errorMessage={touched && error ? (error as string) : undefined}
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
              value={value as string}
              onValueChange={(val) => formik.setFieldValue(id as string, val)}
              onBlur={formik.handleBlur}
              isInvalid={!!(touched && error)}
              errorMessage={touched && error ? (error as string) : undefined}
              minRows={minRows || 5}
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
              isSelected={value as boolean}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              classNames={{ label: "text-xs" }}
            >
              {label}
            </Checkbox>
            {touched && error && (
              <div className="text-xs text-red-500 mt-1 ml-6">
                {error as string}
              </div>
            )}
          </div>
        );

      case "group":
        return (
          <div key={field.id as Key} className="space-y-2">
            <p className="text-xs">
              {label} <span className="text-red-500">*</span>
            </p>
            <div className="space-y-2">
              {subFields?.map((sub: any) => {
                const fieldPath = `practiceAddress.${sub.id}`;
                const addressErrors = formik.errors
                  .practiceAddress as PracticeAddressErrors;
                const addressTouched = formik.touched
                  .practiceAddress as PracticeAddressTouched;

                const subIdKey = sub.id as string;
                const isSubTouched = addressTouched?.[subIdKey];
                const errorText = addressErrors?.[subIdKey];

                return (
                  <Input
                    key={sub.id}
                    name={fieldPath}
                    type={sub.type}
                    label={""}
                    labelPlacement="outside"
                    size="sm"
                    radius="sm"
                    variant="flat"
                    placeholder={sub.placeholder || ""}
                    value={
                      formik.values.practiceAddress[
                        sub.id as keyof typeof formik.values.practiceAddress
                      ] as string
                    }
                    onValueChange={(val) => {
                      let newValue = val;
                      if (sub.type === "tel") {
                        newValue = formatPhoneNumber(val);
                      } else if (sub.id === "zip") {
                        newValue = val.replace(/\D/g, "").slice(0, 5);
                      }
                      formik.setFieldValue(fieldPath, newValue);
                    }}
                    {...(sub.id === "zip" ? { maxLength: 5 } : {})}
                    onBlur={() => formik.setFieldTouched(fieldPath)}
                    isRequired={!!sub.isRequired}
                    isInvalid={!!(isSubTouched && errorText)}
                    errorMessage={
                      isSubTouched && errorText
                        ? (errorText as string)
                        : undefined
                    }
                  />
                );
              })}
              <p className="text-xs text-gray-500 italic">
                Note: Please ensure the address is accurate as it will be
                verified with Google Maps.
              </p>
            </div>
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
              labelPlacement="outside"
              size="sm"
              radius="sm"
              variant="flat"
              value={value as string}
              onValueChange={(val) =>
                formik.setFieldValue(
                  id as string,
                  type === "tel" ? formatPhoneNumber(val) : val
                )
              }
              onBlur={formik.handleBlur}
              isRequired={!!isRequired}
              isInvalid={!!(touched && error)}
              errorMessage={touched && error ? (error as string) : undefined}
              isDisabled={
                id === "email" && (editedData?.type || isPracticeEdit)
              }
              classNames={{ base: "data-disabled:opacity-60" }}
            />
          </div>
        );
    }
  };

  const renderArrayField = (field: any, index: number) => {
    const fieldName = `staff[${index}].${field.id}`;
    const valuePath = formik.values.staff[index]?.[field.id];

    const staffErrors = formik.errors.staff as any[] | undefined;
    const staffTouched = formik.touched.staff as any[] | undefined;

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
              disabledKeys={
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
              labelPlacement="outside"
              size="sm"
              radius="sm"
              variant="flat"
              value={valuePath as string}
              onValueChange={(val) => {
                let finalValue: any = val;

                if (field.type === "tel") {
                  finalValue = formatPhoneNumber(val);
                }

                formik.setFieldValue(fieldName as string, finalValue);
              }}
              onBlur={formik.handleBlur}
              isRequired={!!field.isRequired}
              isInvalid={!!(isTouched && errorText)}
              errorMessage={
                isTouched && errorText ? (errorText as string) : undefined
              }
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
      role: "",
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    formik.resetForm({ values: CLEAN_INITIAL_VALUES });
  };

  let modalTitle = "Add New Referrer";
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
    modalTitle = "Edit Referrer";
    modalDescription = "Edit your doctor or patient referrer.";
    saveButtonText = "Update Referrer";
    saveButtonIcon = <BiSave fontSize={15} />;
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={handleCloseModal}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="md"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 px-4 py-4">
          <h4 className="text-base font-medium">{modalTitle}</h4>
          <p className="text-xs text-gray-500 font-normal">
            {modalDescription}
          </p>
        </ModalHeader>
        <ModalBody className="px-4 py-0 overflow-y-auto">
          <form
            id="referrer-actions-form"
            onSubmit={formik.handleSubmit}
            className="space-y-3 pb-0.5 h-fit w-full"
          >
            <ReferrerTypeSelector
              formik={formik}
              isPracticeEdit={!!isPracticeEdit}
              editedData={editedData}
            />

            <BasicInfoSection formik={formik} renderField={renderField} />

            {formik.values.type === "doctor" && (
              <DoctorSection
                formik={formik}
                renderField={renderField}
                specialties={specialties || []}
                isPracticeEdit={!!isPracticeEdit}
              />
            )}

            {formik.values.type === "communityreferrer" && (
              <CommunitySection formik={formik} renderField={renderField} />
            )}

            {formik.values.type === "googlereferrer" && (
              <GoogleSection formik={formik} renderField={renderField} />
            )}

            {formik.values.type === "socialmediareferrer" && (
              <SocialMediaSection formik={formik} renderField={renderField} />
            )}

            {formik.values.type === "eventreferrer" && (
              <EventSection formik={formik} renderField={renderField} />
            )}

            {formik.values.type === "doctor" && (
              <StaffSection
                formik={formik}
                handleAddStaff={handleAddStaff}
                handleRemoveStaff={handleRemoveStaff}
                renderArrayField={renderArrayField}
                staffMemberFields={staffMemberFields}
              />
            )}

            <AdditionalNotesSection formik={formik} renderField={renderField} />
          </form>
        </ModalBody>
        <ModalFooter className="p-4">
          <Button
            onPress={handleCloseModal}
            color="default"
            variant="bordered"
            size="sm"
            className="border-foreground/10 border text-foreground hover:bg-background"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="referrer-actions-form"
            color="primary"
            variant="solid"
            size="sm"
            startContent={saveButtonIcon}
            isLoading={referrerCreationPending || referrerUpdationPending}
            isDisabled={!formik.isValid || !formik.dirty}
          >
            {saveButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
