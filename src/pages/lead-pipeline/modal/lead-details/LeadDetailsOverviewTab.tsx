import { Button, Chip, Input, Select, SelectItem } from "@heroui/react";
import {
  HiOutlineCalendar,
  HiOutlineChat,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineMail,
  HiOutlinePencil,
  HiOutlinePhone,
  HiOutlineUser,
} from "react-icons/hi";
import { LuBriefcase, LuTarget } from "react-icons/lu";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "../../../../consts/lead-pipeline";

interface LeadDetailsOverviewTabProps {
  lead: any;
  formik: any;
  teamMembers: any;
  loadingTeam: boolean;
  onSendEmailClick: () => void;
  onSendSmsClick: () => void;
}

const LeadDetailsOverviewTab = ({
  lead,
  formik,
  teamMembers,
  loadingTeam,
  onSendEmailClick,
  onSendSmsClick,
}: LeadDetailsOverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
      <div className="lg:col-span-6 space-y-4">
        <div className="p-4 border border-foreground/10 rounded-xl space-y-6 bg-content1/50 dark:bg-content1/20">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineUser className="size-5 text-gray-400 dark:text-foreground/40" />
            <h3 className="font-bold text-sm text-foreground">
              Contact Information
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                <HiOutlineMail className="size-5 text-gray-400 dark:text-foreground/40" />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                  Email
                </p>
                <p
                  className="text-sm font-bold text-foreground cursor-pointer hover:text-purple-500 transition-colors"
                  onClick={onSendEmailClick}
                >
                  {lead.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                <HiOutlinePhone className="size-5 text-gray-400 dark:text-foreground/40" />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                  Phone
                </p>
                <p className="text-sm font-bold text-foreground">
                  {lead.phone}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-6">
            <Button
              fullWidth
              variant="bordered"
              startContent={<HiOutlineMail className="size-4" />}
              className="justify-start font-medium text-gray-700 dark:text-foreground/80 border-foreground/10"
              onPress={onSendEmailClick}
            >
              Send Email
            </Button>
            <Button
              fullWidth
              variant="bordered"
              startContent={<HiOutlineChat className="size-4" />}
              className="justify-start font-medium text-gray-700 dark:text-foreground/80 border-foreground/10"
              onPress={onSendSmsClick}
            >
              Send SMS
            </Button>
          </div>
        </div>
      </div>
      <div className="lg:col-span-6 space-y-4">
        <div className="p-4 border border-foreground/10 rounded-xl space-y-6 bg-content1/50 dark:bg-content1/20">
          <div className="flex items-center gap-2 mb-2">
            <LuTarget className="size-5 text-gray-400 dark:text-foreground/40" />
            <h3 className="font-bold text-sm text-foreground">
              Lead Details
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <Select
              label="Status"
              className="bg-default-100 data-[hover=true]:bg-default-200 rounded-small"
              size="sm"
              disableAnimation
              selectedKeys={formik.values.status ? [formik.values.status] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                if (selected) {
                  formik.setFieldValue("status", selected);
                }
              }}
              popoverProps={{
                disableAnimation: true,
                shouldCloseOnScroll: false,
              }}
            >
              {LEAD_STATUSES.map((status) => (
                <SelectItem key={status.key} textValue={status.label}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Priority"
              className="bg-default-100 data-[hover=true]:bg-default-200 rounded-small"
              size="sm"
              disableAnimation
              selectedKeys={formik.values.priority ? [formik.values.priority] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                if (selected) {
                  formik.setFieldValue("priority", selected);
                }
              }}
              popoverProps={{
                disableAnimation: true,
                shouldCloseOnScroll: false,
              }}
            >
              {LEAD_PRIORITIES.map((priority) => (
                <SelectItem key={priority.key} textValue={priority.label}>
                  {priority.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Assigned To"
              className="bg-default-100 data-[hover=true]:bg-default-200 rounded-small"
              size="sm"
              disableAnimation
              startContent={
                loadingTeam ? (
                  <LuBriefcase className="text-default-400 size-4 animate-pulse mr-1" />
                ) : (
                  <LuBriefcase className="text-default-400 size-4 mr-1" />
                )
              }
              selectedKeys={formik.values.assignedTo ? [formik.values.assignedTo] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                if (selected) {
                  formik.setFieldValue("assignedTo", selected);
                }
              }}
              popoverProps={{
                disableAnimation: true,
                shouldCloseOnScroll: false,
              }}
            >
              {[
                { _id: "Unassigned", firstName: "Unassigned", lastName: "" },
                ...(teamMembers?.data || []),
              ].map((member: any) => (
                <SelectItem
                  key={member._id}
                  textValue={
                    member._id === "Unassigned"
                      ? "Unassigned"
                      : `${member.firstName} ${member.lastName}`
                  }
                >
                  {member._id === "Unassigned"
                    ? "Unassigned"
                    : `${member.firstName} ${member.lastName}`}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Estimated Value"
              className="bg-default-100 data-[hover=true]:bg-default-200 rounded-small "
              value={formik.values.estimatedValue.toString()}
              onValueChange={(val) =>
                formik.setFieldValue("estimatedValue", val)
              }
              startContent={
                <HiOutlineCurrencyDollar className="text-gray-400 dark:text-foreground/40" />
              }
              size="sm"
              type="number"
            />
          </div>
        </div>
      </div>
      <div className="lg:col-span-12">
        <div className="p-4 border border-foreground/10 rounded-xl bg-content1/50 dark:bg-content1/20">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlinePencil className="size-5 text-gray-400 dark:text-foreground/40" />
            <h3 className="font-bold text-sm text-foreground">
              Treatment Interest
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lead.treatments?.map((t: string, i: number) => (
              <Chip
                key={i}
                variant="flat"
                size="sm"
                className="bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 font-bold px-3 border-none"
              >
                {t}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
        <div className="p-4 border border-foreground/10 rounded-xl flex items-center gap-4 bg-content1/50 dark:bg-content1/20">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/40 text-blue-500 dark:text-blue-400 rounded-xl">
            <HiOutlineClock className="size-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
              Created
            </p>
            <p className="text-sm font-bold text-foreground">
              {new Date(lead.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="p-4 border border-foreground/10 rounded-xl flex items-center gap-4 bg-content1/50 dark:bg-content1/20">
          <div className="p-3 bg-green-50 dark:bg-green-900/40 text-green-500 dark:text-green-400 rounded-xl">
            <HiOutlineCalendar className="size-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
              Last Contact
            </p>
            <p className="text-sm font-bold text-foreground">
              {lead.lastContact
                ? new Date(lead.lastContact).toLocaleDateString()
                : "Never"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsOverviewTab;
