import {
  Button,
  Card,
  CardBody,
  Chip,
  Switch,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { useState, useMemo } from "react";
import { BsLightningCharge } from "react-icons/bs";
import {
  FiCheckCircle,
  FiClock,
  FiMail,
  FiMessageSquare,
  FiRefreshCw,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import { HiOutlineBell, HiOutlineClock, HiOutlineCog, HiOutlineExclamationCircle } from "react-icons/hi";
import { LoadingState } from "../../components/common/LoadingState";
import {
  useLeadAutomations,
  useLeadAutomationOverview,
  useLeadAutomationPerformance,
  useToggleLeadAutomation,
} from "../../hooks/useLeadAutomation";
import LeadAutomationModal from "./modal/LeadAutomationModal";

interface LeadAutomationsProps {
  onBack?: () => void;
}

const LeadAutomations = ({ onBack }: LeadAutomationsProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "workflows" | "performance">("overview");
  const { data: automationsResponse, isLoading, isError } = useLeadAutomations();
  const { data: overviewResponse } = useLeadAutomationOverview();
  const overviewData = overviewResponse?.data;
  const { data: performanceResponse } = useLeadAutomationPerformance();
  const perfData = performanceResponse?.data;
  const { mutateAsync: toggleAutomation } = useToggleLeadAutomation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedAutomation, setSelectedAutomation] = useState<any>(null);

  const automationsFromApi = useMemo(() => {
    return Array.isArray(automationsResponse)
      ? automationsResponse
      : automationsResponse?.data || [];
  }, [automationsResponse]);

  const displayedWorkflows = useMemo(() => {
    return automationsFromApi;
  }, [automationsFromApi]);

  const activeCount = useMemo(() => {
    return displayedWorkflows.filter((w: any) => w.isActive).length;
  }, [displayedWorkflows]);

  const totalCount = displayedWorkflows.length;

  const handleConfigureClick = (workflow: any) => {
    setSelectedAutomation(workflow);
    onOpen();
  };

  const handleToggle = async (workflow: any) => {
    const id = workflow._id || workflow.id;
    if (id) {
      try {
        await toggleAutomation(id);
      } catch (err) {
        console.error("Toggle failed:", err);
      }
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Send SMS":
        return <FiMessageSquare className="size-4 text-sky-500 shrink-0" />;
      case "Send Email":
        return <FiMail className="size-4 text-indigo-500 shrink-0" />;
      case "Send Notification":
      case "Internal Notification":
        return <HiOutlineBell className="size-4 text-amber-500 shrink-0" />;
      default:
        return <FiMessageSquare className="size-4 text-gray-500 shrink-0" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Tabs Bar (Overview | Active Workflows | Performance) */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as "overview" | "workflows" | "performance")}
        aria-label="Lead Automation Setup Tabs"
        variant="light"
        radius="full"
        classNames={{
          base: "bg-primary/15 dark:bg-background rounded-full p-1 w-full flex-shrink-0",
          tabList: "flex w-full rounded-full p-0 gap-0",
          tab: "flex-1 h-9 text-sm font-medium transition-all",
          cursor: "rounded-full bg-white dark:bg-primary",
          tabContent:
            "dark:group-data-[selected=true]:text-primary-foreground text-default-500 dark:text-foreground/60 transition-colors",
        }}
        className="w-full"
      >
        <Tab key="overview" title="Overview" />
        <Tab key="workflows" title="Active Workflows" />
        <Tab key="performance" title="Performance" />
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center items-center h-80 border border-foreground/10 rounded-2xl bg-background shadow-none">
          <LoadingState />
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-80 border border-foreground/10 rounded-2xl bg-background shadow-none p-6 text-center">
          <div className="space-y-2">
            <HiOutlineExclamationCircle className="size-10 text-danger mx-auto" />
            <h4 className="font-bold text-sm text-foreground">Connection Error</h4>
            <p className="text-xs text-gray-500">Could not load automations. Please refresh and try again.</p>
          </div>
        </div>
      ) : (
        <>
          {/* ============================================================== */}
          {/* TAB 1: OVERVIEW */}
          {/* ============================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Active Automations */}
                <Card className="border border-foreground/10 rounded-2xl p-5 shadow-sm bg-white dark:bg-[#14171f]">
                  <CardBody className="p-0">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-gray-500 dark:text-foreground/60">
                        Active Automations
                      </span>
                      <BsLightningCharge className="size-5 text-sky-500 shrink-0" />
                    </div>
                    <div className="mt-3">
                      <span className="text-3xl font-bold text-foreground dark:text-white">
                        {overviewData?.activeAutomations ?? perfData?.overview?.activeAutomations ?? activeCount}
                      </span>
                      <p className="text-xs text-gray-400 dark:text-foreground/45 mt-1">
                        of {overviewData?.totalAutomations ?? perfData?.overview?.totalAutomations ?? totalCount} total
                      </p>
                    </div>
                  </CardBody>
                </Card>

                {/* Avg Response Time */}
                <Card className="border border-foreground/10 rounded-2xl p-5 shadow-sm bg-white dark:bg-[#14171f]">
                  <CardBody className="p-0">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-gray-500 dark:text-foreground/60">
                        Avg Response Time
                      </span>
                      <HiOutlineClock className="size-5 text-emerald-500 shrink-0" />
                    </div>
                    <div className="mt-3">
                      <span className="text-3xl font-bold text-foreground dark:text-white">
                        {overviewData?.avgResponseTime ?? perfData?.overview?.avgResponseTime ?? "0 min"}
                      </span>
                      <p className="text-xs text-gray-400 dark:text-foreground/50 font-medium mt-1">
                        {overviewData?.improvement ?? perfData?.overview?.improvementPercent ?? "No messages sent yet"}
                      </p>
                    </div>
                  </CardBody>
                </Card>

                {/* Automation Rate */}
                <Card className="border border-foreground/10 rounded-2xl p-5 shadow-sm bg-white dark:bg-[#14171f]">
                  <CardBody className="p-0">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-gray-500 dark:text-foreground/60">
                        Automation Rate
                      </span>
                      <FiTrendingUp className="size-5 text-purple-500 shrink-0" />
                    </div>
                    <div className="mt-3">
                      <span className="text-3xl font-bold text-foreground dark:text-white">
                        {overviewData?.automationRate ?? perfData?.overview?.automationRate ?? "0%"}
                      </span>
                      <p className="text-xs text-gray-400 dark:text-foreground/45 mt-1">
                        of communications
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Recommended Best Practices */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-foreground dark:text-white">
                  Recommended Best Practices
                </h3>

                <div className="space-y-3">
                  {/* Speed to Lead Protocol */}
                  <div className="border border-blue-500/20 dark:border-blue-900/60 bg-blue-50/50 dark:bg-[#0c1828]/90 rounded-xl p-4 flex items-start gap-3.5">
                    <FiCheckCircle className="size-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-foreground dark:text-white">
                        Speed to Lead Protocol
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                        Industry research shows that responding to leads within 5 minutes increases conversion by 400%. Your automated SMS response helps you achieve this benchmark consistently.
                      </p>
                    </div>
                  </div>

                  {/* No-Show Recovery */}
                  <div className="border border-purple-500/20 dark:border-purple-900/60 bg-purple-50/50 dark:bg-[#1a1029]/90 rounded-xl p-4 flex items-start gap-3.5">
                    <FiCheckCircle className="size-4 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-foreground dark:text-white">
                        No-Show Recovery
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                        Automated follow-ups for no-shows can recover 35-40% of missed appointments. The immediate SMS helps maintain engagement while the opportunity is fresh.
                      </p>
                    </div>
                  </div>

                  {/* Multi-Channel Engagement */}
                  <div className="border border-emerald-500/20 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-[#0c241c]/90 rounded-xl p-4 flex items-start gap-3.5">
                    <FiCheckCircle className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-foreground dark:text-white">
                        Multi-Channel Engagement
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                        Using both SMS and Email in your automation mix ensures you reach patients through their preferred channel. SMS for urgent/immediate, Email for detailed information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: ACTIVE WORKFLOWS */}
          {/* ============================================================== */}
          {activeTab === "workflows" && (
            <div className="space-y-4">
              <div className="space-y-4">
                {displayedWorkflows.map((item: any, index: number) => {
                  const cardKey = item._id || item.id || `default-${index}`;
                  return (
                    <Card
                      key={cardKey}
                      shadow="none"
                      className="border border-foreground/10 rounded-2xl bg-white dark:bg-[#14171f] transition-all shadow-sm"
                    >
                      <CardBody className="p-5 space-y-3.5">
                        {/* Top row: Toggle Switch, Title, Status Chip, Configure Button */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <Switch
                              size="sm"
                              isSelected={Boolean(item.isActive)}
                              onChange={() => handleToggle(item)}
                              aria-label={`Toggle ${item.name}`}
                            />
                            <h4 className="font-bold text-sm md:text-base text-foreground leading-tight">
                              {item.name}
                            </h4>
                            <Chip
                              size="sm"
                              variant="flat"
                              color={item.isActive ? "success" : "default"}
                              className="text-[10px] h-5 font-bold"
                            >
                              {item.isActive ? "Active" : "Inactive"}
                            </Chip>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="bordered"
                              startContent={<HiOutlineCog className="size-3.5" />}
                              className="text-xs h-8 border-foreground/15 font-semibold text-foreground hover:bg-foreground/5 cursor-pointer"
                              onPress={() => handleConfigureClick(item)}
                            >
                              Configure
                            </Button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-500 dark:text-foreground/70 leading-normal">
                          {item.description || "No description provided."}
                        </p>

                        {/* Trigger, Action, Delay metadata */}
                        <div className="flex items-center gap-5 md:gap-7 flex-wrap text-xs text-gray-600 dark:text-foreground/80 pt-1">
                          <div className="flex items-center gap-1.5">
                            <FiRefreshCw className="size-3.5 text-gray-400 shrink-0" />
                            <span>
                              Trigger: <strong className="text-foreground">{item.triggerEvent}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {getActionIcon(item.action)}
                            <span>
                              Action: <strong className="text-foreground">{item.action}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FiClock className="size-3.5 text-gray-400 shrink-0" />
                            <span>
                              Delay:{" "}
                              <strong className="text-foreground">
                                {item.delayAmount === 0
                                  ? "Immediately"
                                  : `${item.delayAmount} ${item.delayUnit || "minutes"}`}
                              </strong>
                            </span>
                          </div>
                        </div>

                        {/* Message Template container */}
                        <div className="p-3 bg-gray-50 dark:bg-white/5 border border-foreground/5 rounded-xl">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            Message Template:
                          </span>
                          <p className="text-xs italic text-gray-700 dark:text-foreground/90 leading-relaxed font-sans">
                            "{item.messageTemplate}"
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: PERFORMANCE */}
          {/* ============================================================== */}
          {activeTab === "performance" && (
            <div className="space-y-4">
              {/* Top 2 Cards: Effectiveness & Time Saved */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Automation Effectiveness */}
                <Card className="border border-foreground/10 rounded-2xl p-5 shadow-sm bg-white dark:bg-[#14171f]">
                  <CardBody className="p-0 space-y-4">
                    <h3 className="text-sm font-bold text-foreground dark:text-white">
                      Automation Effectiveness
                    </h3>

                    <div className="space-y-3.5 pt-1">
                      {/* Bar 1 */}
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-semibold text-gray-600 dark:text-foreground/80">Speed to Lead SMS</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {perfData?.effectiveness?.speedToLeadPercent ?? 0}% sent within 5 min
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${perfData?.effectiveness?.speedToLeadPercent ?? 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Bar 2 */}
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-semibold text-gray-600 dark:text-foreground/80">No-Show Recovery Rate</span>
                          <span className="font-bold text-sky-600 dark:text-sky-400">
                            {perfData?.effectiveness?.noShowRecoveryRate ?? 0}% rescheduled
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-500 rounded-full transition-all"
                            style={{ width: `${perfData?.effectiveness?.noShowRecoveryRate ?? 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Bar 3 */}
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-semibold text-gray-600 dark:text-foreground/80">Appointment Reminder Open Rate</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            {perfData?.effectiveness?.reminderOpenRate ?? 0}% opened
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all"
                            style={{ width: `${perfData?.effectiveness?.reminderOpenRate ?? 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Bar 4 */}
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-semibold text-gray-600 dark:text-foreground/80">Re-engagement Success</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            {perfData?.effectiveness?.reengagementSuccess ?? 0}% re-activated
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${perfData?.effectiveness?.reengagementSuccess ?? 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Time Saved */}
                <Card className="border border-foreground/10 rounded-2xl p-5 shadow-sm bg-white dark:bg-[#14171f] flex flex-col justify-between">
                  <CardBody className="p-0 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-sm font-bold text-foreground dark:text-white">
                        Time Saved
                      </h3>

                      <div className="text-center py-4">
                        <span className="text-4xl md:text-5xl font-black text-sky-500">
                          {perfData?.timeSaved?.hoursSavedPerWeek ?? 0}
                        </span>
                        <p className="text-xs font-semibold text-foreground dark:text-white mt-1">
                          hours saved per week
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-foreground/45">
                          through automated communications
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-foreground/10 pt-3 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-foreground/60">SMS sent automatically</span>
                        <span className="font-bold text-foreground dark:text-white">
                          {perfData?.timeSaved?.smsSentAutomatically ?? 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-foreground/60">Emails sent automatically</span>
                        <span className="font-bold text-foreground dark:text-white">
                          {perfData?.timeSaved?.emailsSentAutomatically ?? 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-foreground/60">Follow-ups triggered</span>
                        <span className="font-bold text-foreground dark:text-white">
                          {perfData?.timeSaved?.followUpsTriggered ?? 0}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Bottom Card: ROI Impact */}
              <Card className="border border-foreground/10 rounded-2xl p-5 shadow-sm bg-white dark:bg-[#14171f]">
                <CardBody className="p-0">
                  <h3 className="text-sm font-bold text-foreground dark:text-white mb-4">
                    ROI Impact
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-foreground/10">
                    <div className="pt-2 md:pt-0">
                      <span className="text-2xl md:text-3xl font-black text-emerald-500">
                        {perfData?.roi?.conversionRateIncrease ?? "0%"}
                      </span>
                      <p className="text-xs font-bold text-foreground mt-1">
                        Lead Conversion Rate
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-foreground/45">
                        vs. manual follow-up
                      </p>
                    </div>

                    <div className="pt-4 md:pt-0">
                      <span className="text-2xl md:text-3xl font-black text-sky-500">
                        {perfData?.roi?.responseTimePercent ?? "0%"}
                      </span>
                      <p className="text-xs font-bold text-foreground mt-1">
                        Response Time
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-foreground/45">
                        {perfData?.roi?.responseTimeChange ?? "No messages sent yet"}
                      </p>
                    </div>

                    <div className="pt-4 md:pt-0">
                      <span className="text-2xl md:text-3xl font-black text-purple-600 dark:text-purple-400">
                        {perfData?.roi?.additionalRevenue ?? "$0"}
                      </span>
                      <p className="text-xs font-bold text-foreground mt-1">
                        Additional Revenue
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-foreground/45">
                        from recovered no-shows
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Configure / Edit Modal */}
      <LeadAutomationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        automation={selectedAutomation}
      />
    </div>
  );
};

export default LeadAutomations;