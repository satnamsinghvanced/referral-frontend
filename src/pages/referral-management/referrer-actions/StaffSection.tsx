import { Button } from "@heroui/react";
import { FormikProps } from "formik";
import { BiUserPlus } from "react-icons/bi";
import { FaStethoscope } from "react-icons/fa";
import { FiTrash2, FiUsers } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";

interface StaffSectionProps {
  formik: FormikProps<any>;
  handleAddStaff: () => void;
  handleRemoveStaff: (index: number) => void;
  renderArrayField: (field: any, index: number) => any;
  staffMemberFields: any[];
}
export default function StaffSection({
  formik,
  handleAddStaff,
  handleRemoveStaff,
  renderArrayField,
  staffMemberFields,
}: StaffSectionProps) {
  return (
    <div className="border border-foreground/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-sm font-medium dark:text-white">
          Doctors & Staff Members
        </h5>
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
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-foreground/20 rounded-lg py-6 gap-3">
          <FiUsers className="inline mr-2 text-4xl text-default-400 dark:text-foreground/40" />
          <span className="text-sm text-gray-500 dark:text-foreground/60">
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
        <div className="space-y-4">
          {formik.values.staff.map((member: any, index: number) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-content1 p-4 rounded-lg border border-foreground/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-between gap-2">
                  {member.isDentist ? (
                    <FaStethoscope className="text-blue-600 dark:text-blue-500 text-[15px] w-4" />
                  ) : (
                    <LuUserRound className="dark:text-foreground/60" />
                  )}
                  <span className="text-sm font-medium dark:text-white">
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
                {staffMemberFields.map((f) => {
                  const isExperienceField = f.id === "experience";
                  const isDoctor = member.isDentist;

                  if (isExperienceField && !isDoctor) {
                    return null;
                  }

                  return (
                    <div
                      key={`${f.id}-${index}`}
                      className={f.isFullWidth ? "md:col-span-2" : ""}
                    >
                      {renderArrayField(f, index)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
