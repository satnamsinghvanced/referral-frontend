import { Chip } from "@heroui/react";
import {
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineUserGroup,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { LuMousePointer2, LuLayers, LuTarget } from "react-icons/lu";
import { FaInstagram, FaFacebook, FaGoogle } from "react-icons/fa";
import { useLocationContext } from "../../../../providers/LocationContext";

interface LeadDetailsAttributionTabProps {
  lead: any;
}

const LeadDetailsAttributionTab = ({ lead }: LeadDetailsAttributionTabProps) => {
  const { locations, getLocationColor } = useLocationContext();

  const rawLocId =
    lead?.locationId?._id ||
    (typeof lead?.locationId === "string" ? lead?.locationId : null);
  const matchedLoc = rawLocId
    ? locations?.find((l: any) => l._id === rawLocId)
    : null;
  const locName = matchedLoc?.name || lead?.patientLocation || "Primary Practice";
  const locColor = matchedLoc ? getLocationColor(matchedLoc._id) : "#0ea5e9";

  const getSourceMeta = (source: string = "") => {
    const s = source.toLowerCase();
    if (s.includes("instagram")) {
      return {
        name: "Instagram",
        category: "Social Inbound Channel",
        Icon: FaInstagram,
        color: "#E1306C",
        badgeBg: "bg-pink-500/10 text-pink-500 dark:text-pink-400 border-pink-500/20",
        iconBg: "bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 text-pink-500",
      };
    }
    if (s.includes("facebook")) {
      return {
        name: s.includes("ad") ? "Facebook Ads" : "Facebook",
        category: s.includes("ad") ? "Paid Social Campaign" : "Social Inbound Channel",
        Icon: FaFacebook,
        color: "#1877F2",
        badgeBg: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20",
        iconBg: "bg-blue-500/15 text-blue-500",
      };
    }
    if (s.includes("google")) {
      return {
        name: s.includes("ad") ? "Google Ads" : "Google Search",
        category: "Paid Search Campaign",
        Icon: FaGoogle,
        color: "#EA4335",
        badgeBg: "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20",
        iconBg: "bg-red-500/15 text-red-500",
      };
    }
    if (s.includes("referral")) {
      return {
        name: "Patient Referral",
        category: "Referral Network",
        Icon: HiOutlineUserGroup,
        color: "#10B981",
        badgeBg: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20",
        iconBg: "bg-emerald-500/15 text-emerald-500",
      };
    }
    if (s.includes("phone") || s.includes("call") || s.includes("ivr")) {
      return {
        name: "Phone Call / IVR",
        category: "Inbound Telephony",
        Icon: HiOutlinePhone,
        color: "#8B5CF6",
        badgeBg: "bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20",
        iconBg: "bg-purple-500/15 text-purple-500",
      };
    }
    return {
      name: source ? source.charAt(0).toUpperCase() + source.slice(1) : "Website Inbound",
      category: "Organic Web Inflow",
      Icon: HiOutlineGlobeAlt,
      color: "#0ea5e9",
      badgeBg: "bg-sky-500/10 text-sky-500 dark:text-sky-400 border-sky-500/20",
      iconBg: "bg-sky-500/15 text-sky-500",
    };
  };

  const getStatusLabel = (status: string = "") => {
    switch (status) {
      case "newLead":
      case "New":
        return { label: "New Lead", color: "bg-blue-500/15 text-blue-500 border-blue-500/30" };
      case "contacted":
        return { label: "Contacted", color: "bg-amber-500/15 text-amber-500 border-amber-500/30" };
      case "appointmentScheduled":
        return { label: "Appointment Scheduled", color: "bg-purple-500/15 text-purple-400 border-purple-500/30" };
      case "patientWon":
        return { label: "Patient Won", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" };
      case "noShow":
        return { label: "No Show", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" };
      case "lost":
        return { label: "Lost", color: "bg-gray-500/15 text-gray-400 border-gray-500/30" };
      default:
        return { label: status || "Active", color: "bg-sky-500/15 text-sky-400 border-sky-500/30" };
    }
  };

  const sourceMeta = getSourceMeta(lead?.source);
  const statusMeta = getStatusLabel(lead?.status);
  const createdDate = lead?.createdAt
    ? new Date(lead.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently captured";

  const SourceIcon = sourceMeta.Icon;

  return (
    <div className="pt-4 space-y-5">
      {/* Top 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Primary Lead Source */}
        <div className="p-5 border border-foreground/10 rounded-2xl bg-content1/50 dark:bg-content1/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LuMousePointer2 className="size-4.5 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Lead Acquisition</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sourceMeta.badgeBg}`}>
                {sourceMeta.category}
              </span>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-gray-50/60 dark:bg-white/[0.03] border border-foreground/5">
              <div className={`p-3 rounded-xl ${sourceMeta.iconBg} shrink-0`}>
                <SourceIcon className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-gray-400 dark:text-foreground/40">
                  Primary Source
                </p>
                <h4 className="text-base font-extrabold text-foreground capitalize truncate">
                  {sourceMeta.name}
                </h4>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-foreground/5">
            <div>
              <p className="text-[11px] text-gray-400 dark:text-foreground/40 font-medium mb-1">
                First Touchpoint
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <HiOutlineCalendar className="size-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{createdDate}</span>
              </div>
            </div>

            <div>
              <p className="text-[11px] text-gray-400 dark:text-foreground/40 font-medium mb-1">
                Attributed Location
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground truncate">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: locColor }}
                />
                <span className="truncate">{locName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Tracking & Metadata */}
        <div className="p-5 border border-foreground/10 rounded-2xl bg-content1/50 dark:bg-content1/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LuLayers className="size-4.5 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Campaign & Metadata</h3>
              </div>
              <span className="text-[10px] text-gray-400 dark:text-foreground/40 font-medium">
                Inflow Details
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-foreground/5">
                <span className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                  Lifecycle Stage
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusMeta.color}`}>
                  {statusMeta.label}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-foreground/5">
                <span className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                  Assigned Team Member
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {lead?.assignedTo?.name || lead?.assignedTo || "Unassigned"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                  Estimated Value
                </span>
                <span className="text-sm font-bold text-emerald-500">
                  ${(lead?.estimatedValue || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-foreground/5">
            <div className="flex items-center gap-1.5 mb-2">
              <HiOutlineTag className="size-3.5 text-gray-400" />
              <span className="text-[11px] font-medium text-gray-400 dark:text-foreground/40">
                Lead Tags
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[26px]">
              {lead?.tags && Array.isArray(lead.tags) && lead.tags.length > 0 ? (
                lead.tags.map((tag: string, i: number) => (
                  <Chip
                    key={i}
                    size="sm"
                    variant="flat"
                    className="bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold text-[10px] border-none h-6"
                  >
                    {tag}
                  </Chip>
                ))
              ) : (
                <span className="text-xs text-gray-400 dark:text-foreground/40 italic">
                  No tags associated
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
