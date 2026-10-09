import { Card, CardBody, Chip, Button } from "@heroui/react";
import { useMemo } from "react";
import { HiStar, HiOutlineCalendar } from "react-icons/hi";
import { LuMapPin } from "react-icons/lu";
import { FiTrash2 } from "react-icons/fi";
import PriorityLevelChip from "../../components/chips/PriorityLevelChip";
import { useLocationContext } from "../../providers/LocationContext";

interface LeadCardProps {
  lead: {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    source: string;
    status: string;
    treatments: string[];
    value: string;
    responseTime: string;
    priority: string;
    stage: string;
    location?: any;
    locationId?: any;
    scheduledAppointment?: {
      appointmentType?: string;
      date?: string;
      time?: string;
      notes?: string;
      sendReminder?: boolean;
      scheduledAt?: string;
    };
  };
  onPress?: (lead: any) => void;
  onDelete?: (lead: any) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDraggedOver?: boolean;
}

const LeadCard = ({ lead, onPress, onDelete, draggable, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop, isDraggedOver }: LeadCardProps) => {
  const { locations, getLocationColor } = useLocationContext();

  const locationBadge = useMemo(() => {
    const rawLocId = lead.locationId?._id || (typeof lead.locationId === "string" ? lead.locationId : null);
    if (!rawLocId) {
      return { name: "Not Assigned", color: "#9ca3af" };
    }
    const found = locations?.find((l) => l._id === rawLocId);
    if (found) {
      return { name: found.name, color: getLocationColor(found._id) };
    }
    return { name: "Not Assigned", color: "#9ca3af" };
  }, [locations, lead.locationId, getLocationColor]);

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className="relative"
    >
      {isDraggedOver && (
        <div className="absolute -top-1 left-0 right-0 h-1 bg-primary rounded-full z-10 animate-pulse" />
      )}
      <Card
        key={lead.id}
        shadow="none"
        isPressable={Boolean(onPress)}
        onPress={() => onPress?.(lead)}
        onClick={() => onPress?.(lead)}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="group border border-foreground/10 bg-white dark:bg-content1 transition-all cursor-pointer hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-lg dark:hover:shadow-primary/10 hover:-translate-y-0.5 w-full min-h-[142px] h-auto relative"
      >
        <CardBody className="p-3 h-full flex flex-col justify-between space-y-2 relative">
          <div className="space-y-1.5 min-w-0">
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <h5 className="font-bold text-[11px] transition-colors group-hover:text-primary dark:text-white truncate">
                  {lead.name}
                </h5>
                <p className="text-[10px] text-gray-400 dark:text-foreground/40 truncate">
                  {lead.email}
                </p>
              </div>
              <PriorityLevelChip level={lead.priority} />
            </div>
            <div className="flex items-center justify-between gap-1 text-[10px] text-gray-500 dark:text-foreground/60 font-medium">
              <div className="flex items-center gap-1 min-w-0">
                <LuMapPin className="size-3 opacity-60 shrink-0" />
                <span className="truncate">{lead.source}</span>
              </div>
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold border shrink-0"
                style={{
                  backgroundColor: `${locationBadge.color}15`,
                  color: locationBadge.color,
                  borderColor: `${locationBadge.color}40`,
                }}
              >
                <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: locationBadge.color }} />
                <span className="truncate max-w-[85px]">{locationBadge.name}</span>
              </span>
            </div>
          </div>

          {lead.scheduledAppointment?.date && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-600 dark:text-purple-300 font-medium">
              <HiOutlineCalendar className="size-3 text-purple-500 shrink-0" />
              <span className="font-bold truncate">{lead.scheduledAppointment.date}</span>
              {lead.scheduledAppointment.time && (
                <>
                  <span className="opacity-40">•</span>
                  <span className="truncate">{lead.scheduledAppointment.time}</span>
                </>
              )}
            </div>
          )}

          <div className="h-5 flex items-center overflow-hidden">
            {lead.treatments && lead.treatments.length > 0 ? (
              <div className="flex gap-1 overflow-hidden">
                {lead.treatments.map((treatment, idx) => (
                  <Chip
                    key={idx}
                    size="sm"
                    variant="flat"
                    className="text-[9px] h-4.5 bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 px-1.5 font-bold flex-shrink-0"
                  >
                    {treatment}
                  </Chip>
                ))}
              </div>
            ) : (
              <div className="h-4.5" />
            )}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-foreground/5 dark:border-white/5 flex-shrink-0">
            <span className="font-bold text-[10px] text-foreground">
              {lead.value}
            </span>
            <div className="flex items-center gap-1.5">
            
              {onDelete && (
                <div className="w-0 group-hover:w-6 overflow-visible transition-all duration-150 flex items-center justify-end">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    className="min-w-6 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(lead);
                    }}
                  >
                    <FiTrash2 className="size-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default LeadCard;
