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
} from "@heroui/react";
import {
  FiCalendar,
  FiCheckCircle,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
} from "react-icons/fi";
import { LuPhoneIncoming } from "react-icons/lu"; // Used for phone type icon
import { MdChatBubbleOutline } from "react-icons/md";
import { TbMessageChatbot } from "react-icons/tb"; // Used for transcription icon

const PlaybackTab = ({ data }: any) => (
  <div className="flex-1 outline-none space-y-4">
    <Card className="bg-card text-card-foreground flex flex-col rounded-xl border border-primary/15 shadow-none">
      <CardBody className="p-4">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-sm mb-0.5">{data.callerName}</h4>
            <p className="text-xs text-gray-600">
              {data.callerPhone} &bull; {data.date}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Sentiment Chip */}
            <Chip
              size="sm"
              radius="sm"
              variant="flat"
              color="success"
              className="capitalize bg-green-100 text-green-800 text-[11px] h-5 px-1"
            >
              {data.sentiment}
            </Chip>
            {/* Source Chip */}
            <Chip
              size="sm"
              radius="sm"
              variant="bordered"
              className="capitalize text-blue-600 border-blue-200 text-[11px] h-5 px-2 bg-blue-50/50 border-small"
            >
              {data.source}
            </Chip>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="space-y-4 mt-6">
          {/* Play/Pause/Skip Buttons */}
          <div className="flex items-center justify-center space-x-2.5 mb-3">
            <Button
              variant="bordered"
              className="min-w-8 h-8 rounded-md px-0 border-small border-primary/15 text-gray-700 hover:bg-gray-50"
            >
              <FiSkipBack className="size-3.5" />
            </Button>
            <Button
              color="primary"
              className="min-w-9 h-9 px-0 rounded-md shadow-md"
            >
              <FiPause className="size-3.5" />
            </Button>
            <Button
              variant="bordered"
              className="min-w-8 h-8 rounded-md px-0 border-small border-primary/15 text-gray-700 hover:bg-gray-50"
            >
              <FiSkipForward className="size-3.5" />
            </Button>
            <Button
              variant="bordered"
              className="min-w-8 h-8 rounded-md px-0 border-small border-primary/15 text-gray-700 hover:bg-gray-50"
            >
              <FiVolume2 className="size-3.5" />
            </Button>
          </div>

          {/* Progress Bar & Timeline */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-600">
              <span>0:00</span>
              <span>{data.duration}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 cursor-pointer">
              {/* Progress Range */}
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-200"
                style={{ width: "30%" }}
              ></div>
            </div>
          </div>

          {/* Volume Slider & Speed Select */}
          <div className="flex items-center space-x-4">
            {/* Volume Slider */}
            <div className="flex items-center space-x-2 flex-1">
              <FiVolume2 className="h-4 w-4 text-gray-500" />
              {/* Simplified Slider Placeholder */}
              <div className="flex-1 h-2 bg-primary-500 rounded-full relative">
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-background border border-primary-500 rounded-full shadow-md right-0"></div>
              </div>
            </div>

            {/* Speed Select */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">Speed:</span>
              <Select
                placeholder="1x"
                size="sm"
                radius="sm"
                className="w-20"
                classNames={{
                  trigger: "h-8 border-gray-300 bg-gray-100",
                }}
              >
                <SelectItem key="0.5x">0.5x</SelectItem>
                <SelectItem key="1x">1x</SelectItem>
                <SelectItem key="1.5x">1.5x</SelectItem>
                <SelectItem key="2x">2x</SelectItem>
              </Select>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  </div>
);

const TranscriptionTab = ({ data }: any) => (
  <div className="flex-1 outline-none space-y-4">
    <Card className="bg-card text-card-foreground flex flex-col rounded-xl border border-primary/15 shadow-none">
      <CardBody className="p-4 space-y-4">
        <div className="flex items-center space-x-2 text-sm font-medium">
          <MdChatBubbleOutline className="h-5 w-5" />
          <span>Call Transcription</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-gray-800 leading-relaxed text-xs">
          {data.transcription}
        </div>
      </CardBody>
    </Card>
  </div>
);

const DetailsTab = ({ data }: any) => (
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
                {data.duration}
              </p>
              <p className="flex items-center justify-between text-xs">
                <span className="w-24 inline-block text-gray-600">Type:</span>{" "}
                <span className="inline-flex items-center gap-1.5">
                  <LuPhoneIncoming className="size-3.5 text-green-600" />{" "}
                  {data.type}
                </span>
              </p>
              <p className="flex items-center justify-between text-xs">
                <span className="w-24 inline-block text-gray-600">Status:</span>{" "}
                <span className="inline-flex items-center gap-1.5">
                  <FiCheckCircle className="size-3.5 text-green-600" />{" "}
                  {data.status}
                </span>
              </p>
              <p className="flex items-center justify-between text-xs">
                <span className="w-24 inline-block text-gray-600">
                  Call SID:
                </span>{" "}
                {data.callSid}
              </p>
              <p className="flex items-center justify-between text-xs border-t border-primary/15 pt-3 mt-3">
                <span className="w-24 inline-block text-gray-600">
                  Recording:
                </span>{" "}
                <span className="text-green-600">{data.recordingStatus}</span>
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Notes & Actions */}
        <Card className="shadow-none border border-primary/15">
          <CardBody className="space-y-3">
            <h4 className="text-sm font-medium">Notes & Actions</h4>
            <div className="space-y-3">
              <p className="p-3 bg-gray-50 rounded-lg text-gray-800 text-xs">
                {data.notes}
              </p>

              {/* Checkboxes Placeholder */}
              <div className="flex flex-col space-y-2 text-xs">
                <div>
                  <Checkbox
                    isSelected={data.followUpRequired}
                    size="sm"
                    classNames={{ label: "text-xs" }}
                  >
                    Follow-up required
                  </Checkbox>
                </div>
                <div>
                  <Checkbox
                    isSelected={data.appointmentScheduled}
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

export default function CallRecordingModal({ isOpen, onClose, data }: any) {
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
            Call Recording - {data.callerName}
          </h2>
          <p
            data-slot="dialog-description"
            className="text-xs text-gray-600 mt-2 font-normal"
          >
            Listen to the call recording, view transcription, and manage call
            details for {data.callerName}.
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
