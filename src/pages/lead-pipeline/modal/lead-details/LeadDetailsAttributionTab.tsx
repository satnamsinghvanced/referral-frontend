import { Chip } from "@heroui/react";
import { HiOutlineChartBar, HiOutlineClock, HiOutlineGlobeAlt } from "react-icons/hi";
import { LuMousePointer2 } from "react-icons/lu";

interface LeadDetailsAttributionTabProps {
  lead: any;
}

const LeadDetailsAttributionTab = ({ lead }: LeadDetailsAttributionTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <div className="p-4 border border-foreground/10 rounded-xl space-y-6 bg-content1/50 dark:bg-content1/20">
        <div className="flex items-center gap-2">
          <LuMousePointer2 className="size-5 text-gray-400 dark:text-foreground/40" />
          <h3 className="font-bold text-sm text-foreground">Lead Source</h3>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
            Primary Source
          </p>
          <Chip
            variant="flat"
            className="bg-gray-50 dark:bg-white/5 border border-foreground/10 font-bold px-4 text-foreground rounded-full"
          >
            {lead.source}
          </Chip>
        </div>
      </div>
      <div className="p-4 border border-foreground/10 rounded-xl space-y-6 bg-content1/50 dark:bg-content1/20">
        <div className="flex items-center gap-2">
          <HiOutlineChartBar className="size-5 text-gray-400 dark:text-foreground/40" />
          <h3 className="font-bold text-sm text-foreground">
            Performance Metrics
          </h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium mb-1">
              Response Time
            </p>
            <div className="flex items-center gap-2 text-primary">
              <HiOutlineClock className="size-4" />
              <span className="font-bold text-sm">
                {lead.responseTime || "0"} minutes
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium mb-1">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {lead.tags?.length > 0 ? (
                lead.tags.map((tag: string, i: number) => (
                  <Chip
                    key={i}
                    size="sm"
                    variant="flat"
                    className="bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 font-bold border-none"
                    startContent={<HiOutlineGlobeAlt className="size-3" />}
                  >
                    {tag}
                  </Chip>
                ))
              ) : (
                <span className="text-xs text-gray-400 dark:text-foreground/40 italic">
                  No tags
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsAttributionTab;
