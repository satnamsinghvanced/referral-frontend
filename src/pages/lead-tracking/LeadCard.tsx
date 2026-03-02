import { Card, CardBody, Chip } from "@heroui/react";
import { HiStar } from "react-icons/hi";
import { LuMapPin } from "react-icons/lu";
import PriorityLevelChip from "../../components/chips/PriorityLevelChip";

interface LeadCardProps {
  lead: {
    id: number;
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
}

const LeadCard = ({ lead, onPress }: LeadCardProps) => {
  return (
    <Card
      key={lead.id}
      shadow="none"
      onPress={() => onPress?.(lead)}
      isPressable
      className="group border border-foreground/10 bg-white dark:bg-content1 transition-all cursor-pointer hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-lg dark:hover:shadow-primary/10 hover:-translate-y-0.5"
    >
      <CardBody className="p-3 space-y-2.5">
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

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-foreground/60 font-medium">
            <LuMapPin className="size-3 opacity-60" />
            <span className="truncate">{lead.source}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {lead.treatments.map((treatment, idx) => (
              <Chip
                key={idx}
                size="sm"
                variant="flat"
                className="text-[9px] h-4.5 bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 px-1.5 font-bold"
              >
                {treatment}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-foreground/5 dark:border-white/5">
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
  );
};

export default LeadCard;
