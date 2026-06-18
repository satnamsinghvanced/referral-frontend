import { Button, Chip } from "@heroui/react";
import {
  HiOutlineEye,
  HiOutlineArchive,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineStar,
} from "react-icons/hi";
import {
  CONVERSATION_TAGS,
  Conversation,
} from "../../../consts/conversations";
import { getAvatarColor, getInitials, getPlatformLabel } from "../utils";

interface LeadSidebarProps {
  selectedConversation: Conversation | null;
  onViewLead?: (conv: Conversation) => void;
  onArchiveLead?: (conv: Conversation) => void;
}

export default function LeadSidebar({
  selectedConversation,
  onViewLead,
  onArchiveLead,
}: LeadSidebarProps) {
  if (!selectedConversation) return null;

  return (
    <div className="w-[280px] min-w-[250px] border-l border-foreground/10 overflow-y-auto hidden xl:block">
      <div className="p-5 flex flex-col items-center border-b border-foreground/10">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3 ${getAvatarColor(
            selectedConversation.patientName,
          )}`}
        >
          {getInitials(selectedConversation.patientName)}
        </div>
        <h3 className="text-sm font-bold text-foreground">
          {selectedConversation.patientName}
        </h3>
        <p className="text-[11px] text-gray-400 dark:text-foreground/40 mt-0.5">
          {getPlatformLabel(selectedConversation.platform)}
        </p>
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant="flat"
            className="text-xs h-7"
            startContent={<HiOutlineEye className="size-3" />}
            onClick={() => onViewLead?.(selectedConversation)}
          >
            View Lead
          </Button>
          <Button
            size="sm"
            variant="flat"
            className="text-xs h-7"
            startContent={<HiOutlineArchive className="size-3" />}
            onClick={() => onArchiveLead?.(selectedConversation)}
          >
            Archive
          </Button>
        </div>
      </div>
      <div className="p-4 border-b border-foreground/10">
        <h4 className="text-[10px] font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider mb-3">
          Contact Info
        </h4>
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <HiOutlineMail className="size-3.5 text-gray-400 dark:text-foreground/40 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 dark:text-foreground/40">
                Email
              </p>
              <p className="text-xs text-foreground font-medium">
                {selectedConversation.patientEmail}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <HiOutlinePhone className="size-3.5 text-gray-400 dark:text-foreground/40 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 dark:text-foreground/40">
                Phone
              </p>
              <p className="text-xs text-foreground font-medium">
                {selectedConversation.patientPhone}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <HiOutlineLocationMarker className="size-3.5 text-gray-400 dark:text-foreground/40 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 dark:text-foreground/40">
                Location
              </p>
              <p className="text-xs text-foreground font-medium">
                {selectedConversation.patientLocation}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border-b border-foreground/10">
        <h4 className="text-[10px] font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider mb-3">
          Lead Info
        </h4>
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <HiOutlineCurrencyDollar className="size-3.5 text-gray-400 dark:text-foreground/40 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 dark:text-foreground/40">
                Estimated Value
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                ${selectedConversation.estimatedValue.toLocaleString()}
              </p>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-foreground/40 mb-1.5 flex items-center gap-1">
              <HiOutlineStar className="size-3" /> Treatment Interest
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedConversation.treatmentInterest.map((treatment) => (
                <Chip
                  key={treatment}
                  size="sm"
                  variant="flat"
                  className="text-[10px] h-5 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 font-semibold"
                >
                  {treatment}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-[10px] font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider mb-3">
          Tags
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {selectedConversation.tags.map((tag) => {
            const tagDef = CONVERSATION_TAGS.find((t) => t.key === tag);
            return (
              <Chip
                key={tag}
                size="sm"
                variant="flat"
                className={`text-[10px] h-5 font-semibold ${
                  tagDef?.color ||
                  "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                {tag}
              </Chip>
            );
          })}
        </div>
      </div>
    </div>
  );
}
