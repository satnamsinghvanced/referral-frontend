import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Tab,
  Tabs,
  Textarea,
  addToast,
} from "@heroui/react";
import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiPause,
  FiSave,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
} from "react-icons/fi";
import { LuPhoneIncoming, LuPhoneOutgoing } from "react-icons/lu";
import { MdChatBubbleOutline } from "react-icons/md";
import { useUpdateCallRecord } from "../../../hooks/useCall";
import { CallRecord } from "../../../types/call";

const PlaybackTab = ({ data }: { data: CallRecord }) => (
  <div className="flex-1 outline-none space-y-4">
    <Card className="bg-card text-card-foreground flex flex-col rounded-xl border border-primary/15 shadow-none">
      <CardBody className="p-4">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm mb-0.5">
              {data.contact.name || data.contact.phone || "Unknown"}
            </h4>
            <p className="text-xs text-gray-600">
              {data.contact.phone || data.from} &bull; {data.date}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Source Chip - Hardcoded to Twilio for now as it's not in API */}
            <Chip
              size="sm"
              radius="sm"
              variant="bordered"
              className="capitalize text-blue-600 border-blue-200 text-[11px] h-5 px-2 bg-blue-50/50 border-small"
            >
              Twilio
            </Chip>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="space-y-4 mt-6">
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
            <div className="text-center text-sm text-gray-500 py-4">
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
    <Card className="bg-card text-card-foreground flex flex-col rounded-xl border border-primary/15 shadow-none">
      <CardBody className="p-4 space-y-4">
        <div className="flex items-center space-x-2 text-sm font-medium">
          <MdChatBubbleOutline className="h-5 w-5" />
          <span>Call Transcription</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-gray-800 leading-relaxed text-xs max-h-60 overflow-y-auto">
          {data.transcriptionText || "No transcription available."}
        </div>
      </CardBody>
    </Card>
  </div>
);

const DetailsTab = ({ data }: { data: CallRecord }) => {
  const { mutate: updateRecord, isPending } = useUpdateCallRecord();
  const [notes, setNotes] = useState(data.notes || "");
  const [followUp, setFollowUp] = useState(data.followUp || false);
  const [appointment, setAppointment] = useState(data.appointment || false);

  useEffect(() => {
    setNotes(data.notes || "");
    setFollowUp(data.followUp || false);
    setAppointment(data.appointment || false);
  }, [data]);

  const handleSave = () => {
    updateRecord(
      {
        id: data._id,
        payload: {
          notes,
          followUp,
          appointment,
        },
      },
      {
        onSuccess: () => {
          addToast({
            title: "Success",
            description: "Call record updated successfully.",
            color: "success",
          });
        },
        onError: () => {
          addToast({
            title: "Error",
            description: "Failed to update call record.",
            color: "danger",
          });
        },
      }
    );
  };

  return (
    <div className="flex-1 outline-none space-y-4">
      <div>
        <div className="grid grid-cols-2 gap-3">
          {/* Call Information */}
          <Card className="shadow-none border border-primary/15">
            <CardBody className="space-y-3">
              <h4 className="text-sm font-medium">Call Information</h4>
              <div className="space-y-3 text-sm">
                <p className="flex items-center justify-between text-xs">
                  <span className="w-24 inline-block text-gray-600">
                    Duration:
                  </span>{" "}
                  {data.duration}s
                </p>
                <p className="flex items-center justify-between text-xs transition-colors">
                  <span className="w-24 inline-block text-gray-600">Type:</span>{" "}
                  <span className="inline-flex items-center gap-1.5">
                    {data.direction === "Incoming" ? (
                      <LuPhoneIncoming className="size-3.5 text-green-600" />
                    ) : (
                      <LuPhoneOutgoing className="size-3.5 text-blue-600" />
                    )}{" "}
                    {data.direction}
                  </span>
                </p>
                <p className="flex items-center justify-between text-xs">
                  <span className="w-24 inline-block text-gray-600">
                    Status:
                  </span>{" "}
                  <span className="inline-flex items-center gap-1.5">
                    <FiCheckCircle className="size-3.5 text-green-600" />{" "}
                    {data.status}
                  </span>
                </p>
                <p className="flex items-center justify-between text-xs">
                  <span className="w-24 inline-block text-gray-600">
                    Call SID:
                  </span>{" "}
                  <span className="font-mono text-[10px] text-gray-500">
                    {data.callSid}
                  </span>
                </p>
                <p className="flex items-center justify-between text-xs border-t border-primary/15 pt-3 mt-3">
                  <span className="w-24 inline-block text-gray-600">
                    Recording:
                  </span>{" "}
                  <span
                    className={
                      data.recordingUrl ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {data.recordingUrl ? "Available" : "Unavailable"}
                  </span>
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Notes & Actions */}
          <Card className="shadow-none border border-primary/15">
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Notes & Actions</h4>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onPress={handleSave}
                  isLoading={isPending}
                  className="h-7 min-w-16"
                >
                  Save
                </Button>
              </div>
              <div className="space-y-3">
                <Textarea
                  placeholder="Review notes..."
                  value={notes}
                  onValueChange={setNotes}
                  minRows={3}
                  classNames={{
                    input: "text-xs",
                  }}
                  variant="faded"
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
                </div>

                {/* Schedule Follow-up Button */}
                <div className="border-t border-primary/15 pt-2 mt-4">
                  <Button color="primary" size="sm" radius="sm" fullWidth>
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
      content: <DetailsTab data={data} />,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
      size="2xl"
    >
      <ModalContent>
        <ModalHeader className="p-5 pb-0 flex-col">
          <h2
            data-slot="dialog-title"
            className="leading-none font-medium text-base"
          >
            Call Recording -{" "}
            {data.contact.name || data.contact.phone || "Unknown"}
          </h2>
          <p
            data-slot="dialog-description"
            className="text-xs text-gray-600 mt-2 font-normal"
          >
            Listen to the call recording, view transcription, and manage call
            details for{" "}
            {data.contact.name || data.contact.phone || "this contact"}.
          </p>
        </ModalHeader>
        <ModalBody className="px-5 py-5">
          <Tabs
            aria-label="Dynamic tabs"
            items={tabs}
            classNames={{
              tabList: "flex w-full rounded-full bg-primary/10",
              tab: "flex-1 px-4 py-1 text-sm font-medium transition-all",
              cursor: "rounded-full",
              panel: "p-0",
            }}
            className="text-background w-full"
          >
            {(item) => (
              <Tab key={item.key} title={item.label}>
                <div>{item.content}</div>
              </Tab>
            )}
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
