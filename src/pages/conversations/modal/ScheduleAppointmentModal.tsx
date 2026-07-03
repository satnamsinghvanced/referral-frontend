import React from "react";
import { Modal, ModalContent, ModalBody, Button, Select, SelectItem, Textarea, Switch, addToast } from "@heroui/react";
import { Conversation } from "../../../consts/conversations";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { HiOutlineClock } from "react-icons/hi";
import { useFormik } from "formik";
import * as Yup from "yup";

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Conversation | null;
}

const APPOINTMENT_TYPES = [
  "New Patient Consultation",
  "Records Appointment",
  "Treatment Start",
  "Follow-Up Visit",
  "Retainer Check",
  "Emergency Visit",
];

const PROVIDERS = [
  { key: "dr-johnson", label: "Dr. Sarah Johnson" },
  { key: "dr-smith", label: "Dr. Michael Smith" },
];

const ScheduleAppointmentModal = ({ isOpen, onClose, lead }: ScheduleAppointmentModalProps) => {

  const validationSchema = Yup.object().shape({
    appointmentType: Yup.string().required("Required"),
    date: Yup.string().required("Date is required"),
    time: Yup.string().required("Time is required"),
    provider: Yup.string().required("Provider is required"),
    notes: Yup.string().max(500, "Notes too long").nullable(),
    sendReminder: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      appointmentType: "New Patient Consultation",
      date: "",
      time: "",
      provider: "dr-johnson",
      notes: "",
      sendReminder: true,
    },
    validationSchema,
    onSubmit: (values) => {
      addToast({
        title: "Appointment Scheduled",
        description: `Appointment for ${lead?.patientName || ""} (${values.appointmentType}) has been confirmed.`,
        color: "success",
      });
      onClose();
      formik.resetForm();
    },
  });

  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      size="md"
      scrollBehavior="inside"
      classNames={{
        base: "max-sm:!mx-3 max-sm:!my-4 !m-0 w-full max-w-[480px] bg-white dark:bg-content1",
        closeButton: "text-white hover:bg-white/25 z-50 top-3 right-3",
      }}
    >
      <ModalContent className="overflow-hidden">
        {(onClose) => (
          <>
            <div className="bg-[#10b981] px-5 py-4">
              <h3 className="font-bold text-[15px] sm:text-[16px] leading-tight text-white">Schedule Appointment</h3>
              <p className="text-white/85 text-[12px] sm:text-[13px] mt-0.5">{lead.patientName}</p>
            </div>

            <ModalBody className="px-5 py-4 gap-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Appointment Type
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {APPOINTMENT_TYPES.map((type) => (
                    <div
                      key={type}
                      onClick={() => formik.setFieldValue("appointmentType", type)}
                      className={`cursor-pointer rounded-lg px-2.5 sm:px-3 py-2 text-[11.5px] sm:text-[12.5px] font-medium transition-all text-center ${formik.values.appointmentType === type
                        ? "border-[1.5px] border-[#10b981] text-[#10b981] bg-[#e6fcf5]/40"
                        : "border border-slate-200 dark:border-default-200 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                        }`}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                    Date
                  </label>
                  <div className="border border-slate-200 dark:border-default-200 rounded-lg px-3 flex items-center h-9 bg-white dark:bg-default-100">
                    <input
                      type="text"
                      name="date"
                      placeholder="dd-mm-yyyy"
                      maxLength={10}
                      className="w-full text-[12px] sm:text-[12.5px] text-slate-600 dark:text-slate-200 outline-none bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      value={formik.values.date}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, "");
                        let formatted = "";
                        if (raw.length <= 2) {
                          formatted = raw;
                        } else if (raw.length <= 4) {
                          formatted = `${raw.slice(0, 2)}-${raw.slice(2)}`;
                        } else {
                          formatted = `${raw.slice(0, 2)}-${raw.slice(2, 4)}-${raw.slice(4, 8)}`;
                        }
                        formik.setFieldValue("date", formatted);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.errors.date && formik.touched.date && (
                    <div className="text-red-500 text-[10px] mt-0.5">{formik.errors.date}</div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                    Time
                  </label>
                  <div className="border border-slate-200 dark:border-default-200 rounded-lg px-3 flex items-center h-9 bg-white dark:bg-default-100 gap-2">
                    <HiOutlineClock className="size-3.5 text-slate-400 shrink-0" />
                    <input
                      type="time"
                      name="time"
                      className="w-full text-[12.5px] text-slate-600 dark:text-slate-200 outline-none bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 [&::-webkit-calendar-picker-indicator]:dark:invert cursor-pointer"
                      value={formik.values.time}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.errors.time && formik.touched.time && (
                    <div className="text-red-500 text-[10px] mt-0.5">{formik.errors.time}</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                  Provider
                </label>
                <Select
                  size="sm"
                  radius="sm"
                  variant="bordered"
                  selectedKeys={[formik.values.provider]}
                  onChange={(e) => formik.setFieldValue("provider", e.target.value)}
                  classNames={{
                    trigger: "border-slate-200 dark:border-default-200 rounded-lg shadow-none h-9 min-h-9 data-[hover=true]:border-slate-300",
                    value: "text-[12px] sm:text-[12.5px] text-slate-600 dark:text-slate-200",
                  }}
                >
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p.key} textValue={p.label}>
                      {p.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                  Notes
                </label>
                <Textarea
                  size="sm"
                  radius="sm"
                  variant="bordered"
                  name="notes"
                  placeholder="Any special notes or preparation instructions..."
                  minRows={3}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  classNames={{
                    inputWrapper: "border-slate-200 dark:border-default-200 rounded-lg shadow-none",
                    input: "text-[12px] sm:text-[12.5px] text-slate-600 dark:text-slate-200 placeholder:text-slate-400",
                  }}
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <h4 className="text-[12.5px] sm:text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                    Send appointment reminder
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    SMS + email, 24 hrs before
                  </p>
                </div>
                <Switch
                  isSelected={formik.values.sendReminder}
                  onValueChange={(val) => formik.setFieldValue("sendReminder", val)}
                  classNames={{
                    wrapper: "group-data-[selected=true]:bg-[#10b981]"
                  }}
                  size="md"
                />
              </div>

              <div className="flex gap-2.5 pb-1">
                <Button
                  className="flex-[2] font-bold bg-[#10b981] text-white text-[12.5px] sm:text-[13px] h-9 rounded-lg"
                  startContent={<HiOutlineCheckCircle className="text-[16px] shrink-0" />}
                  onPress={() => formik.handleSubmit()}
                >
                  Confirm Appointment
                </Button>
                <Button
                  variant="bordered"
                  className="flex-1 font-semibold text-slate-600 dark:text-slate-300 border-slate-200 dark:border-default-300 text-[12.5px] sm:text-[13px] h-9 rounded-lg"
                  onPress={onClose}
                >
                  Cancel
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ScheduleAppointmentModal;
