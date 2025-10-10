import ActionModal from "../../components/common/ActionModal";
import { useFormik } from "formik";
import { AiOutlinePlus } from "react-icons/ai";
import * as Yup from "yup";
import { Textarea, Select, SelectItem, Button, Checkbox } from "@heroui/react";
import { useState, useMemo } from "react";
import Input from "../../components/ui/Input";
import { specialtyOptions } from "../../utils/filters";
import { BiUserPlus } from "react-icons/bi";
import { FiTrash2, FiUsers } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";

interface ReferralManagementActionsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editedData?: any;
}

export default function ReferralManagementActions({
  isModalOpen,
  setIsModalOpen,
  editedData = {},
}: ReferralManagementActionsProps) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      role: editedData?.role || "doctor",
      fullName: editedData?.fullName || "",
      patientPhone: editedData?.patientPhone || "",
      email: editedData?.email || "",
      referringPracticeName: editedData?.referringPracticeName || "",
      referringSpecialty: editedData?.referringSpecialty || "",
      practiceAddress1: editedData?.practiceAddress1 || "",
      practiceAddress2: editedData?.practiceAddress2 || "",
      practiceAddress3: editedData?.practiceAddress3 || "",
      practicePhone: editedData?.practicePhone || "",
      practiceEmail: editedData?.practiceEmail || "",
      website: editedData?.website || "",
      staffMemberName: editedData?.staffMemberName || "",
      staffMemberRole: editedData?.staffMemberRole || "",
      staffMemberEmail: editedData?.staffMemberEmail || "",
      staffMemberPhone: editedData?.staffMemberPhone || "",
      staffMemberIsDoctor: editedData?.staffMemberIsDoctor || false,
      notes: editedData?.notes || "",
    },
    validationSchema: Yup.object({
      role: Yup.string().required("Referrer type is required"),
      fullName: Yup.string().required("Full name is required"),
      patientPhone: Yup.string().required("Phone number is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      referringPracticeName: Yup.string().when("role", {
        is: "doctor",
        then: (schema) => schema.required("Practice name is required"),
      }),
      referringSpecialty: Yup.string().when("role", {
        is: "doctor",
        then: (schema) => schema.required("Specialty is required"),
      }),
      practiceAddress1: Yup.string().when("role", {
        is: "doctor",
        then: (schema) => schema.required("Address Line 1 is required"),
      }),
      practiceAddress2: Yup.string(), // optional
      practiceAddress3: Yup.string(), // optional
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        console.log("✅ Submitting:", values);
        // Replace with API call / Tanstack mutation
        setTimeout(() => {
          setLoading(false);
          setIsModalOpen(false);
        }, 800);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
  });

  const fieldGroups = useMemo(() => {
    const basicFields: {
      id: keyof typeof formik.values;
      label: string;
      type: string;
      placeholder?: string;
      isFullWidth?: boolean;
    }[] = [
      {
        id: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "Enter full name",
      },
      {
        id: "patientPhone",
        label: "Phone",
        type: "tel",
        placeholder: "e.g., (123) 456-7890",
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: "e.g., johndoe@gmail.com",
        isFullWidth: true,
      },
    ];

    const doctorFields: {
      id: keyof typeof formik.values;
      label: string;
      type: string;
      options?: string[];
      placeholder?: string;
      isFullWidth?: boolean;
      subFields?: Array<{
        id: keyof typeof formik.values;
        placeholder?: string;
        isRequired?: boolean;
      }>;
    }[] = [
      {
        id: "referringPracticeName",
        label: "Practice Name",
        type: "text",
        placeholder: "Enter practice name",
      },
      {
        id: "referringSpecialty",
        label: "Referrer Level",
        type: "select",
        options: specialtyOptions,
        placeholder: "Select level",
      },
      {
        id: "referringSpecialty",
        label: "Type of Practice",
        type: "select",
        options: specialtyOptions,
        placeholder: "Select specialty",
        isFullWidth: true,
      },
      {
        id: "practiceAddress1", // ✅ Changed
        label: "Practice Address",
        type: "group", // ✅ special type
        isFullWidth: true,
        subFields: [
          {
            id: "practiceAddress1",
            placeholder: "123 Main Street, Suite 100",
            isRequired: true,
          },
          { id: "practiceAddress2", placeholder: "Address Line 2 (Optional)" },
          { id: "practiceAddress3", placeholder: "City, State ZIP (Optional)" },
        ],
      },
      {
        id: "practicePhone",
        label: "Practice Phone",
        type: "tel",
        placeholder: "Enter practice phone",
      },
      {
        id: "practiceEmail",
        label: "Practice Email",
        type: "email",
        placeholder: "Enter practice email",
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
      id: keyof typeof formik.values;
      label: string;
      type: string;
      options?: string[];
      placeholder?: string;
      isFullWidth?: boolean;
    }[] = [
      {
        id: "staffMemberName",
        label: "Name",
        type: "text",
        placeholder: "Dr. John Smith",
      },
      {
        id: "staffMemberRole",
        label: "Role/Title",
        type: "text",
        placeholder: "General Dentist, Hygienist",
      },
      {
        id: "staffMemberEmail",
        label: "Email",
        type: "email",
        placeholder: "john.smith@practice.com",
      },
      {
        id: "staffMemberPhone",
        label: "Phone",
        type: "tel",
        placeholder: "(555) 123-4567",
      },
      {
        id: "staffMemberIsDoctor",
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
        id: "notes",
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
  }, []);

  const renderField = (field: {
    id: keyof typeof formik.values;
    label: string;
    type: string;
    options?: string[];
    placeholder?: string;
    minRows?: number;
    isFullWidth?: boolean;
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
      placeholder,
      minRows,
      isFullWidth,
      subFields,
    } = field;

    switch (type) {
      case "select":
        return (
          <div key={id} className={`w-full ${isFullWidth ? "col-span-3" : ""}`}>
            <Select
              name={id}
              radius="sm"
              size="sm"
              label={label}
              labelPlacement="outside"
              placeholder={placeholder || "Select an option"}
              selectedKeys={formik.values[id] ? [formik.values[id]] : []}
              onSelectionChange={(keys) =>
                formik.setFieldValue(id, Array.from(keys)[0] || "")
              }
            >
              {(options || []).map((opt: string) => (
                <SelectItem key={opt} className="capitalize">
                  {opt}
                </SelectItem>
              ))}
            </Select>
          </div>
        );

      case "textarea":
        return (
          <div key={id} className="w-full">
            <Textarea
              name={id}
              size="sm"
              label={label}
              labelPlacement="outside"
              placeholder={placeholder || ""}
              value={formik.values[id]}
              onChange={(e) => formik.setFieldValue(id, e.target.value)}
              onBlur={formik.handleBlur}
              minRows={minRows || 3}
              className="text-sm"
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={id} className="w-full">
            <Checkbox size="sm" classNames={{ label: "text-xs" }}>
              {label}
            </Checkbox>
          </div>
        );

      case "group":
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-xs">{field.label}</label>
            {subFields?.map((sub: any) => (
              <Input
                key={sub.id}
                name={sub.id}
                label={""}
                size="sm"
                placeholder={sub.placeholder || ""}
                value={
                  formik.values[sub.id as keyof typeof formik.values] as string
                }
                onChange={(val) => formik.setFieldValue(sub.id, val)}
                isRequired={sub.isRequired}
              />
            ))}
          </div>
        );

      default:
        return (
          <div key={id} className={`w-full ${isFullWidth ? "col-span-2" : ""}`}>
            <Input
              key={id}
              name={id}
              type={type}
              label={label}
              placeholder={placeholder || ""}
              labelPlacement="outside-top"
              size="sm"
              value={formik.values[id] as string}
              onChange={(val) => formik.setFieldValue(id, val)}
              isRequired
            />
          </div>
        );
    }
  };

  interface StaffMember {
    id: number;
    values: {
      staffMemberName: string;
      staffMemberRole: string;
      staffMemberEmail: string;
      staffMemberPhone: string;
      staffMemberIsDoctor: boolean;
    };
  }

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);

  const handleAddStaff = () => {
    setStaffMembers((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        values: {
          staffMemberName: "",
          staffMemberRole: "",
          staffMemberEmail: "",
          staffMemberPhone: "",
          staffMemberIsDoctor: false,
        },
      },
    ]);
  };

  const handleRemoveStaff = (id: number) => {
    setStaffMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <ActionModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      heading="Add New Referrer (Enhanced v2.0)"
      description="Add a new doctor or patient referrer to your Practice ROI platform. Track referrals and generate QR codes."
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
          text: "Add Referrer",
          icon: <AiOutlinePlus fontSize={15} />,
          onPress: formik.submitForm,
          color: "primary",
          variant: "solid",
          isLoading: loading,
        },
      ]}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 py-1 h-fit w-full"
      >
        {/* Referrer Type */}
        <div className="border border-primary/20 rounded-lg p-4">
          {/* <h5 className="text-sm font-medium mb-3">Referrer Type *</h5> */}
          <Select
            size="sm"
            label="Referrer Type"
            labelPlacement="outside"
            isRequired
            placeholder="Select type"
            selectedKeys={[formik.values.role]}
            onSelectionChange={(keys) =>
              formik.setFieldValue(
                "role",
                Array.from(keys)[0] as "doctor" | "patient"
              )
            }
            classNames={{ label: "text-sm font-medium" }}
          >
            <SelectItem key="doctor">Doctor Referrer</SelectItem>
            <SelectItem key="patient">Patient Referrer</SelectItem>
          </Select>
        </div>

        {/* Basic Information */}
        <div className="border border-primary/20 rounded-lg p-4">
          <h5 className="text-sm font-medium mb-3">Basic Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldGroups.basic.map(renderField)}
          </div>
        </div>

        {/* Doctor-only Practice Information */}
        {formik.values.role === "doctor" && (
          <div className="border border-primary/20 rounded-lg p-4">
            <h5 className="text-sm font-medium mb-3">Practice Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldGroups.doctor.map((f) => (
                <div
                  key={f.id}
                  className={f.isFullWidth ? "md:col-span-2" : ""}
                >
                  {renderField(f)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor-only Practice Information */}
        {formik.values.role === "doctor" &&
          (() => {
            return (
              <div className="border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-medium">
                    Doctors & Staff Members
                  </h5>
                  <Button
                    size="sm"
                    variant="bordered"
                    color="default"
                    startContent={<BiUserPlus fontSize={18} />}
                    className="border-small"
                    onPress={handleAddStaff}
                  >
                    Add Staff
                  </Button>
                </div>

                {staffMembers.length === 0 ? (
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
                    >
                      Add First Staff Member
                    </Button>
                  </div>
                ) : (
                  staffMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center justify-between gap-2">
                          <LuUserRound />
                          <span className="text-sm font-medium">
                            Staff Member {index + 1}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          isIconOnly
                          onPress={() => handleRemoveStaff(member.id)}
                        >
                          <FiTrash2 className="text-base" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fieldGroups.staffMember.map((f) => (
                          <div
                            key={`${f.id}-${member.id}`}
                            className={f.isFullWidth ? "md:col-span-2" : ""}
                          >
                            {renderField(f)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })()}

        {/* Additional Notes */}
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
