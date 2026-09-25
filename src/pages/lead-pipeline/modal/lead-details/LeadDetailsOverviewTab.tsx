import { useState, useMemo } from "react";
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
  HiOutlineLocationMarker,
  HiCheck,
  HiX,
} from "react-icons/hi";
import { LuBriefcase, LuTarget } from "react-icons/lu";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "../../../../consts/lead-pipeline";
import { useLocationContext } from "../../../../providers/LocationContext";
import { formatPhoneNumber } from "../../../../utils/formatPhoneNumber";

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
  const [isEditingContact, setIsEditingContact] = useState(false);
  const { locations, getLocationColor } = useLocationContext();

  const locationOptions = useMemo(() => {
    return [
      { id: "unassigned", name: "Not Assigned", color: "#9ca3af", address: "No location assigned" },
      ...(locations || []).map((loc, index) => ({
        id: loc._id,
        name: loc.name,
        color: getLocationColor(loc._id, index),
        address: [loc.address?.city, loc.address?.state].filter(Boolean).join(", "),
      })),
    ];
  }, [locations, getLocationColor]);

  const handleSaveContact = async () => {
    await formik.handleSubmit();
    setIsEditingContact(false);
  };

  const handleCancelContact = () => {
    formik.resetForm();
    setIsEditingContact(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
      <div className="lg:col-span-6 space-y-4">
        <div className="p-4 border border-foreground/10 rounded-xl space-y-4 bg-content1/50 dark:bg-content1/20">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <HiOutlineUser className="size-5 text-gray-400 dark:text-foreground/40 shrink-0" />
              <h3 className="font-bold text-sm text-foreground truncate">
                Contact Information
              </h3>
            </div>
            {!isEditingContact ? (
              <Button
                size="sm"
                variant="light"
                color="primary"
                startContent={<HiOutlinePencil className="size-3.5" />}
                className="h-7 px-2.5 text-xs font-semibold shrink-0"
                onPress={() => setIsEditingContact(true)}
              >
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  size="sm"
                  variant="light"
                  color="default"
                  startContent={<HiX className="size-3.5" />}
                  className="h-7 px-2 text-xs"
                  onPress={handleCancelContact}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  color="primary"
                  startContent={<HiCheck className="size-3.5" />}
                  className="h-7 px-2.5 text-xs font-bold"
                  onPress={handleSaveContact}
                >
                  Save
                </Button>
              </div>
            )}
          </div>

          {!isEditingContact ? (
            <>
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg shrink-0 mt-0.5">
                    <HiOutlineUser className="size-4 text-gray-400 dark:text-foreground/40" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 flex-1 min-w-0">
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-400 dark:text-foreground/40 font-medium uppercase tracking-tight">
                        First Name
                      </p>
                      <p className="text-sm font-bold text-foreground truncate">
                        {lead.firstName || lead.name?.split(" ")[0] || "—"}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-400 dark:text-foreground/40 font-medium uppercase tracking-tight">
                        Last Name
                      </p>
                      <p className="text-sm font-bold text-foreground truncate">
                        {lead.lastName || lead.name?.split(" ").slice(1).join(" ") || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg shrink-0 mt-0.5">
                    <HiOutlineMail className="size-4 text-gray-400 dark:text-foreground/40" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-400 dark:text-foreground/40 font-medium uppercase tracking-tight">
                      Email
                    </p>
                    <p
                      className="text-sm font-bold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                      onClick={onSendEmailClick}
                      title="Click to send email"
                    >
                      {lead.email || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg shrink-0 mt-0.5">
                    <HiOutlinePhone className="size-4 text-gray-400 dark:text-foreground/40" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-400 dark:text-foreground/40 font-medium uppercase tracking-tight">
                      Phone
                    </p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {formatPhoneNumber(lead.phone) || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg shrink-0 mt-0.5">
                    <HiOutlineLocationMarker className="size-4 text-gray-400 dark:text-foreground/40" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-400 dark:text-foreground/40 font-medium uppercase tracking-tight">
                      Practice Location
                    </p>
                    <div className="mt-1">
                      {(() => {
                        const locId = lead.locationId?._id || (typeof lead.locationId === "string" ? lead.locationId : null);
                        const locObj = locId ? locations?.find((l) => l._id === locId) : null;
                        const locName = locObj?.name || "Not Assigned";
                        const locColor = locObj ? getLocationColor(locObj._id) : "#9ca3af";
                        return (
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border"
                            style={{
                              backgroundColor: `${locColor}15`,
                              color: locColor,
                              borderColor: `${locColor}40`,
                            }}
                          >
                            <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: locColor }} />
                            <span>{locName}</span>
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <Button
                  fullWidth
                  variant="bordered"
                  size="sm"
                  startContent={<HiOutlineMail className="size-4" />}
                  className="justify-start font-medium text-gray-700 dark:text-foreground/80 border-foreground/10 h-8"
                  onPress={onSendEmailClick}
                >
                  Send Email
                </Button>
                <Button
                  fullWidth
                  variant="bordered"
                  size="sm"
                  startContent={<HiOutlineChat className="size-4" />}
                  className="justify-start font-medium text-gray-700 dark:text-foreground/80 border-foreground/10 h-8"
                  onPress={onSendSmsClick}
                >
                  Send SMS
                </Button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2.5 gap-y-4 pt-1">
              <Input
                label="First Name"
                labelPlacement="outside"
                placeholder="First name"
                size="sm"
                radius="sm"
                variant="flat"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isRequired
              />
              <Input
                label="Last Name"
                labelPlacement="outside"
                placeholder="Last name"
                size="sm"
                radius="sm"
                variant="flat"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className="col-span-1 sm:col-span-2">
                <Input
                  label="Email Address"
                  labelPlacement="outside"
                  placeholder="example@email.com"
                  size="sm"
                  radius="sm"
                  variant="flat"
                  type="email"
                  name="email"
                  value={formik.values.email}
                  isReadOnly
                  isDisabled
                  startContent={<HiOutlineMail className="text-default-400 size-4" />}
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <Input
                  label="Phone Number"
                  labelPlacement="outside"
                  placeholder="(XXX) XXX-XXXX"
                  size="sm"
                  radius="sm"
                  variant="flat"
                  name="phone"
                  value={formik.values.phone}
                  onValueChange={(val) => formik.setFieldValue("phone", formatPhoneNumber(val))}
                  onBlur={formik.handleBlur}
                  startContent={<HiOutlinePhone className="text-default-400 size-4" />}
                  isRequired
                />
              </div>
              {locations && locations.length > 0 && (
                <div className="col-span-1 sm:col-span-2">
                  <Select
                    items={locationOptions}
                    label="Practice Location"
                    labelPlacement="outside"
                    placeholder="Select location"
                    size="sm"
                    radius="sm"
                    variant="flat"
                    disableAnimation
                    selectedKeys={formik.values.locationId ? [formik.values.locationId] : ["unassigned"]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      formik.setFieldValue("locationId", selected === "unassigned" ? "" : (selected || ""));
                    }}
                    renderValue={(items) => {
                      return items.map((item) => {
                        const opt = locationOptions.find((o) => o.id === item.key);
                        const color = opt?.color || "#9ca3af";
                        return (
                          <div key={item.key} className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs font-medium text-foreground truncate">
                              {opt?.name || item.textValue}
                            </span>
                          </div>
                        );
                      });
                    }}
                    popoverProps={{
                      classNames: {
                        content: "w-[300px] max-w-full p-0 shadow-xl rounded-xl border border-foreground/10 overflow-hidden bg-background text-foreground",
                      },
                      disableAnimation: true,
                      shouldCloseOnScroll: false,
                    }}
                    listboxProps={{
                      topContent: (
                        <div className="px-3.5 py-2 border-b border-foreground/10 bg-foreground/[0.02]">
                          <span className="text-[10px] font-bold text-foreground/50 tracking-wider uppercase">
                            Select Practice Location
                          </span>
                        </div>
                      ),
                      itemClasses: {
                        base: "rounded-lg py-2 px-2.5 data-[hover=true]:bg-foreground/5 data-[selectable=true]:focus:bg-foreground/5",
                      },
                    }}
                  >
                    {(opt) => (
                      <SelectItem key={opt.id} textValue={opt.name}>
                        <div className="flex items-start gap-2.5 min-w-0 pr-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 shadow-xs"
                            style={{ backgroundColor: opt.color }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold leading-tight text-foreground truncate">
                              {opt.name}
                            </p>
                            {opt.address && (
                              <p className="text-[10px] text-foreground/60 leading-tight truncate mt-0.5 font-normal">
                                {opt.address}
                              </p>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                </div>
              )}
            </div>
          )}
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
