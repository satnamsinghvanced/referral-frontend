import {
  Button,
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import {
  fromDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { useEffect, useState } from "react";
import { LuCalendar } from "react-icons/lu";
import { EventDetails, TaskApiData } from "../../types/partner";
import { useScheduleTaskEvent } from "../../hooks/usePartner";
import { formatCalendarDate } from "../../utils/formatCalendarDate";

interface ScheduleTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskApiData; // The task details to pre-populate the event
  practice: any;
  onSchedule: (eventDetails: EventDetails) => void;
}

// Dummy options for Time, Duration, and Event Type
const TIME_OPTIONS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];
const DURATION_OPTIONS = [
  { value: "30min", label: "30 minutes" },
  { value: "60min", label: "1 hour" },
  { value: "1hr", label: "1.5 hours" },
  { value: "2hrs", label: "2 hours" },
];
const EVENT_TYPE_OPTIONS = [
  { value: "meeting", label: "Meeting" },
  { value: "practiceVisit", label: "Practice Visit" },
  { value: "phoneCall", label: "Phone Call" },
  { value: "follow-up", label: "Follow-up" },
];

const ScheduleTaskModal = ({
  isOpen,
  onClose,
  task,
  practice,
  onSchedule,
}: ScheduleTaskModalProps) => {
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    taskId: task?._id,
    title: task.title,
    description: task.description,
    date: task.dueDate || "",
    time: TIME_OPTIONS[1] as string,
    duration: DURATION_OPTIONS[1]?.value as string,
    eventType: EVENT_TYPE_OPTIONS[0]?.value as string,
    location: "",
    notes: "",
  });

  const { mutate: scheduleTaskEvent } = useScheduleTaskEvent();

  // Effect to reset state when a new task is passed or modal opens
  useEffect(() => {
    if (isOpen) {
      setEventDetails({
        taskId: task?._id,
        title: task.title,
        description: task.description,
        date: task.dueDate || "",
        time: TIME_OPTIONS[1] as string,
        duration: DURATION_OPTIONS[1]?.value as string,
        eventType: task.category || (EVENT_TYPE_OPTIONS[0]?.value as string),
        location: "",
        notes: "",
      });
    }
  }, [isOpen, task]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof EventDetails, value: string) => {
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    scheduleTaskEvent(eventDetails);
    onClose();
  };

  const isFormValid =
    eventDetails.title &&
    eventDetails.date &&
    eventDetails.time &&
    eventDetails.duration &&
    eventDetails.eventType;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        base: `max-sm:!m-3 !m-0`,
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="p-5 flex flex-col gap-4 !my-2">
        <ModalHeader className="flex flex-col gap-2 text-center sm:text-left flex-shrink-0 p-0">
          <h4 className="text-base leading-none font-medium flex items-center space-x-2">
            <LuCalendar className="size-5" />
            <span>Schedule Task - {practice?.name}</span>
          </h4>
          <p className="text-gray-600 text-xs font-normal text-left">
            Create a calendar event for this task and integrate it with your
            practice schedule.
          </p>
        </ModalHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <Card className="rounded-xl border border-primary/15 shadow-none">
              <CardHeader className="px-4 pt-4">
                <h4 className="text-sm">Event Details</h4>
              </CardHeader>
              <CardBody className="px-4 pb-4 pt-0 space-y-4">
                <div>
                  <Input
                    size="sm"
                    radius="sm"
                    label="Event Title"
                    labelPlacement="outside-top"
                    placeholder="Enter event title"
                    name="title"
                    value={eventDetails.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Textarea
                    size="sm"
                    radius="sm"
                    label="Description"
                    labelPlacement="outside-top"
                    name="description"
                    value={eventDetails.description}
                    onChange={handleInputChange}
                    className="min-h-[80px]"
                    classNames={{ inputWrapper: "py-2", input: "max-h-[80px]" }}
                    placeholder="Event description"
                  />
                </div>

                <div>
                  <DatePicker
                    label="Date"
                    labelPlacement="outside"
                    size="sm"
                    radius="sm"
                    hideTimeZone
                    minValue={today(getLocalTimeZone())}
                    value={
                      eventDetails.date
                        ? parseDate(eventDetails.date.split("T")[0] as string)
                        : null
                    }
                    onChange={(value) =>
                      setEventDetails({
                        ...eventDetails,
                        date: formatCalendarDate(value),
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Select
                      size="sm"
                      radius="sm"
                      label="Time"
                      labelPlacement="outside"
                      placeholder="Select time"
                      value={eventDetails.time}
                      onChange={(event) =>
                        handleSelectChange("time", event.target.value)
                      }
                    >
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={time}>{time}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Select
                      size="sm"
                      radius="sm"
                      label="Duration (minutes)"
                      labelPlacement="outside"
                      placeholder="Select duration"
                      value={eventDetails.duration}
                      onChange={(event) =>
                        handleSelectChange("duration", event.target.value)
                      }
                    >
                      {DURATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
                <div>
                  <Select
                    size="sm"
                    radius="sm"
                    label="Event Type"
                    labelPlacement="outside"
                    placeholder="Select event type"
                    value={eventDetails.eventType}
                    onChange={(event) =>
                      handleSelectChange("eventType", event.target.value)
                    }
                  >
                    {EVENT_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type.value}>{type.label}</SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <Input
                    size="sm"
                    radius="sm"
                    label="Location"
                    labelPlacement="outside-top"
                    placeholder="Meeting location or 'Phone Call'"
                    name="location"
                    value={eventDetails.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Textarea
                    size="sm"
                    radius="sm"
                    label="Additional Notes"
                    labelPlacement="outside-top"
                    name="notes"
                    value={eventDetails.notes}
                    onChange={handleInputChange}
                    className="min-h-[60px] resize-none"
                    classNames={{ inputWrapper: "py-2" }}
                    placeholder="Any additional notes for this event"
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button
            size="sm"
            radius="sm"
            color="primary"
            className="flex-1"
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <LuCalendar className="size-4" />
            Schedule Event
          </Button>
          <Button
            size="sm"
            radius="sm"
            variant="bordered"
            onPress={onClose}
            className="border-small flex-1"
          >
            Cancel
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleTaskModal;
