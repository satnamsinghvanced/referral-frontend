import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Chip,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
  Textarea,
  addToast,
} from "@heroui/react";
import { getLocalTimeZone, now } from "@internationalized/date";
import { useEffect, useState } from "react";
import { FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { LuPhoneIncoming, LuPhoneOutgoing } from "react-icons/lu";
import { MdChatBubbleOutline } from "react-icons/md";
import { useUpdateCallRecord } from "../../../hooks/useCall";
import { CallRecord } from "../../../types/call";
import { formatDateToReadable } from "../../../utils/formatDateToReadable";

const PlaybackTab = ({ data }: { data: CallRecord }) => (
  <div className="flex-1 outline-none space-y-4">
    <Card className="bg-card text-card-foreground flex flex-col rounded-xl border border-foreground/10 shadow-none">
      <CardBody className="p-4">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm mb-0.5">
              {data.contact.name || data.contact.phone || "Unknown"}
            </h4>
            <p className="text-xs text-gray-600 dark:text-foreground/60">
              {data.contact.phone || data.from} &bull;{" "}
              {formatDateToReadable(data.date, true)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Source Chip - Hardcoded to Twilio for now as it's not in API */}
            <Chip
              size="sm"
              radius="sm"
              variant="bordered"
              className="capitalize text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 text-[11px] h-5 bg-blue-50/50 dark:bg-blue-900/10 border-small"
            >
              Twilio
            </Chip>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="space-y-4 mt-4">
          {data.recordingUrl ? (
            <audio
              controls
              src={data.recordingUrl}
              className="w-full h-10"
              style={{ borderRadius: "8px" }}
            >
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div className="text-center text-sm text-gray-500 dark:text-foreground/40 py-4">
              No recording available.
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  </div>
);

const TranscriptionTab = ({ data }: { data: CallRecord }) => (
  <div className="flex-1 outline-none space-y-4">
    <Card className="bg-card text-card-foreground flex flex-col rounded-xl border border-foreground/10 shadow-none">
      <CardBody className="p-4 space-y-4">
        <div className="flex items-center space-x-2 text-sm font-medium">
          <MdChatBubbleOutline className="h-5 w-5" />
          <span>Call Transcription</span>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-content1 rounded-lg text-gray-800 dark:text-foreground/80 leading-relaxed text-xs max-h-60 overflow-y-auto font-medium italic">
          {data.transcriptionText || "No transcription available."}
        </div>
      </CardBody>
    </Card>
  </div>
);

const DetailsTab = ({
  data,
  onClose,
}: {
  data: CallRecord;
  onClose: () => void;
}) => {
  const { mutate: updateRecord, isPending } = useUpdateCallRecord();
  const [notes, setNotes] = useState(data.notes || "");
  const [followUp, setFollowUp] = useState(data.followUp || false);
  const [appointment, setAppointment] = useState(data.appointment || false);
  const [appointmentDate, setAppointmentDate] = useState(data.date || "");

  useEffect(() => {
    setNotes(data.notes || "");
    setFollowUp(data.followUp || false);
    setAppointment(data.appointment || false);
    setAppointmentDate(data.date || "");
  }, [data]);

  const handleSave = () => {
    updateRecord(
      {
        id: data._id,
        payload: {
          notes,
          followUp,
          appointment,
          date: appointmentDate,
        },
      },
      {
        onSuccess: () => {
          addToast({
            title: "Success",
            description: "Call record updated successfully.",
            color: "success",
          });
          onClose();
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "Failed to update call record.",
            color: "danger",
          });
        },
      },
    );
  };

  return (
    <div className="flex-1 outline-none space-y-4">
      <div>
        <div className="md:grid md:grid-cols-2 md:gap-3 max-md:space-y-3">
          {/* Call Information */}
          <Card className="shadow-none border border-foreground/10">
            <CardBody className="space-y-3">
              <h4 className="text-sm font-medium">Call Information</h4>
              <div className="space-y-3 text-sm">
                <p className="flex items-center justify-between text-xs">
                  <span className="w-24 inline-block text-gray-600 dark:text-foreground/60">
                    Duration:
                  </span>{" "}
                  {data.duration}s
                </p>
                <p className="flex items-center justify-between text-xs transition-colors">
                  <span className="w-24 inline-block text-gray-600 dark:text-foreground/60">
                    Type:
                  </span>{" "}
                  <span className="inline-flex items-center gap-1.5">
                    {data.direction === "Incoming" ? (
                      <LuPhoneIncoming className="size-3.5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <LuPhoneOutgoing className="size-3.5 text-purple-600 dark:text-purple-400" />
                    )}{" "}
                    {data.direction}
                  </span>
                </p>
                <p className="flex items-center justify-between text-xs">
                  <span className="w-24 inline-block text-gray-600 dark:text-foreground/60">
                    Status:
                  </span>{" "}
                  <span className="inline-flex items-center gap-1.5 capitalize font-semibold">
                    {data.status === "completed" ? (
                      <FiCheckCircle className="size-3.5 text-green-600 dark:text-green-400" />
                    ) : (
                      <FiXCircle className="size-3.5 text-danger-500 dark:text-danger-400" />
                    )}
                    {data.status}
                  </span>
                </p>
                <p className="flex items-center justify-between text-xs">
                  <span className="w-24 inline-block text-gray-600 dark:text-foreground/60">
                    Call SID:
                  </span>{" "}
                  <span className="font-mono text-[11px] text-gray-500 dark:text-foreground/40">
                    {data.callSid}
                  </span>
                </p>
                <p className="flex items-center justify-between text-xs border-t border-foreground/10 pt-3 mt-3">
                  <span className="w-24 inline-block text-gray-600 dark:text-foreground/60">
                    Recording:
                  </span>{" "}
                  <span
                    className={
                      data.recordingUrl
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400 dark:text-foreground/30"
                    }
                  >
                    {data.recordingUrl ? "Available" : "Unavailable"}
                  </span>
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Notes & Actions */}
          <Card className="shadow-none border border-foreground/10">
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Notes & Actions</h4>
              </div>
              <div className="space-y-3">
                <Textarea
                  size="sm"
                  radius="sm"
                  placeholder="Review notes..."
                  value={notes}
                  onValueChange={setNotes}
                  minRows={3}
                  classNames={{
                    input: "text-xs",
                  }}
                  variant="flat"
                />

                {/* Checkboxes */}
                <div className="flex flex-col space-y-2 text-xs">
                  <div>
                    <Checkbox
                      isSelected={followUp}
                      onValueChange={setFollowUp}
                      size="sm"
                      classNames={{ label: "text-xs" }}
                    >
                      Follow-up required
                    </Checkbox>
                  </div>
                  <div>
                    <Checkbox
                      isSelected={appointment}
                      onValueChange={setAppointment}
                      size="sm"
                      classNames={{ label: "text-xs" }}
                    >
                      Appointment scheduled
                    </Checkbox>
                  </div>
                  {appointment && (
                    <DatePicker
                      key="date"
                      id="appointmentDate"
                      name="date"
                      aria-label="Appointment Date"
                      size="sm"
                      radius="sm"
                      hideTimeZone
                      minValue={now(getLocalTimeZone())}
                      granularity="minute"
                      onChange={(dateObject: any) => {
                        if (dateObject) {
                          // Extract parts, pad with leading zeros
                          const year = dateObject.year;
                          const month = String(dateObject.month).padStart(
                            2,
                            "0",
                          );
                          const day = String(dateObject.day).padStart(2, "0");
                          const hour = String(dateObject.hour).padStart(2, "0");
                          const minute = String(dateObject.minute).padStart(
                            2,
                            "0",
                          );
                          const second = String(dateObject.second).padStart(
                            2,
                            "0",
                          );
                          const millisecond = String(
                            dateObject.millisecond,
                          ).padStart(3, "0");

                          const localDateTimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;
                          setAppointmentDate(localDateTimeString);
                        } else {
                          setAppointmentDate("");
                        }
                      }}
                    />
                  )}
                </div>

                {/* Schedule Follow-up Button */}
                <div className="border-t border-foreground/10 pt-2 mt-4">
                  <Button
                    color="primary"
                    size="sm"
                    radius="sm"
                    fullWidth
                    onPress={handleSave}
                    isLoading={isPending}
                  >
                    <FiCalendar className="size-3.5" />
                    <span>Schedule Follow-up</span>
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface CallRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CallRecord | null;
}

export default function CallRecordingModal({
  isOpen,
  onClose,
  data,
}: CallRecordingModalProps) {
  if (!data) return null;

  const tabs = [
    {
      key: "playback",
      label: "Playback",
      content: <PlaybackTab data={data} />,
    },
    {
      key: "transcription",
      label: "Transcription",
      content: <TranscriptionTab data={data} />,
    },
    {
      key: "details",
      label: "Details",
      content: <DetailsTab data={data} onClose={onClose} />,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      classNames={{
        base: `max-lg:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="2xl"
    >
      <ModalContent>
        <ModalHeader className="p-4 pb-0 flex-col">
          <h2
            data-slot="dialog-title"
            className="leading-none font-medium text-base"
          >
            Call Recording -{" "}
            {data.contact.name || data.contact.phone || "Unknown"}
          </h2>
          <p
            data-slot="dialog-description"
            className="text-xs text-gray-600 dark:text-foreground/60 mt-2 font-normal"
          >
            Listen to the call recording, view transcription, and manage call
            details for{" "}
            {data.contact.name || data.contact.phone || "this contact"}.
          </p>
        </ModalHeader>
        <ModalBody className="px-4 py-4">
          <div className="">
            <Tabs
              aria-label="Dynamic tabs"
              items={tabs}
              variant="light"
              radius="full"
              classNames={{
                base: "bg-primary/15 dark:bg-background rounded-full p-1 w-full",
                tabList: "flex w-full rounded-full p-0 gap-0",
                tab: "flex-1 h-9 text-sm font-medium transition-all",
                cursor: "rounded-full bg-white dark:bg-primary",
                tabContent:
                  "dark:group-data-[selected=true]:text-primary-foreground text-default-500 dark:text-foreground/60 transition-colors",
                panel: "p-0 pt-3",
              }}
              className="w-full"
            >
              {(item) => (
                <Tab key={item.key} title={item.label}>
                  <div>{item.content}</div>
                </Tab>
              )}
            </Tabs>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
