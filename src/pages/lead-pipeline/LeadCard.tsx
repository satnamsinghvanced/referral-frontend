import { Card, CardBody, Chip } from "@heroui/react";
import { HiStar } from "react-icons/hi";
import { LuMapPin } from "react-icons/lu";
import PriorityLevelChip from "../../components/chips/PriorityLevelChip";

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
    score: number;
    responseTime: string;
    priority: string;
    stage: string;
  };
  onPress?: (lead: any) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDraggedOver?: boolean;
}

const LeadCard = ({ lead, onPress, draggable, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop, isDraggedOver }: LeadCardProps) => {
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
        onPress={() => onPress?.(lead)}
        isPressable
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="group border border-foreground/10 bg-white dark:bg-content1 transition-all cursor-pointer hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-lg dark:hover:shadow-primary/10 hover:-translate-y-0.5 w-full h-[142px]"
      >
        <CardBody className="p-3 h-full flex flex-col justify-between space-y-0">
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
            <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-foreground/60 font-medium">
              <LuMapPin className="size-3 opacity-60" />
              <span className="truncate">{lead.source}</span>
            </div>
          </div>
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
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-gray-500 dark:text-foreground/60">
              <HiStar className="text-yellow-400 size-3" />
              <span>{lead.score}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default LeadCard;
