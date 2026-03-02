import {
  addToast,
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { useMemo, useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineChat,
  HiOutlineClock,
  HiOutlineCog,
  HiOutlineCurrencyDollar,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlineSearch,
  HiOutlineTrendingUp,
  HiOutlineUsers,
  HiStar,
} from "react-icons/hi";
import { LuTarget, LuUsers } from "react-icons/lu";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import TrendIndicator from "../../components/common/TrendIndicator";
import LeadCard from "./LeadCard";
import AddLeadModal from "./modal/AddLeadModal";
import LeadDetailsModal from "./modal/LeadDetailsModal";

import { AiOutlinePlus } from "react-icons/ai";
import ComponentContainer from "../../components/common/ComponentContainer";
import Pagination from "../../components/common/Pagination";
import { EVEN_PAGINATION_LIMIT } from "../../consts/consts";
import {
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  LEAD_TREATMENTS,
  STAGE_STYLES,
} from "../../consts/lead-tracking";
import { useDebounce } from "../../hooks/useDebounce";
import { useLeadStats, useLeadStatus } from "../../hooks/useLeadTracking";
import ReferralStatusChip from "../../components/chips/ReferralStatusChip";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const getStageStyles = (stageId: string) =>
  STAGE_STYLES[stageId] || {
    bg: "bg-gray-50",
    headerText: "text-gray-700",
    iconColor: "text-gray-500",
    bubbleBg: "bg-gray-100",
    border: "border-gray-100",
  };

const LeadTracking = () => {
  const [view, setView] = useState("pipeline");
  const [page, setPage] = useState(1);
  const [limit] = useState(EVEN_PAGINATION_LIMIT);

  const [filters, setFilters] = useState({
    page: 1,
    limit: EVEN_PAGINATION_LIMIT,
    search: "",
    source: "allSources",
    treatment: "allTreatments",
    priority: "allPriorities",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onOpenChange: onDetailsOpenChange,
  } = useDisclosure();
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    onDetailsOpen();
  };
  const {
    data: leadsData,
    isLoading,
    isError,
  } = useLeadStatus({ ...filters, search: debouncedSearch });

  const { data: stats } = useLeadStats();

  const SUMMARY_STATS = useMemo<StatCard[]>(() => {
    return [
      {
        heading: "Total Leads",
        value: stats?.totalLeads?.value?.toLocaleString() || "0",
        icon: <LuUsers className="text-blue-600 dark:text-blue-400" />,
        subheading: (
          <TrendIndicator
            status={
              stats?.totalLeads?.converted > 0 ? "increment" : "decrement"
            }
            valueOverride={`${stats?.totalLeads?.converted || 0} converted`}
          />
        ),
      },
      {
        heading: "Conversion Rate",
        value: `${stats?.conversionRate?.value || 0}%`,
        icon: (
          <HiOutlineChartBar className="text-green-600 dark:text-green-400" />
        ),
        subheading: (
          <TrendIndicator
            status={stats?.conversionRate?.growth?.status}
            percentage={stats?.conversionRate?.growth?.label}
          />
        ),
      },
      {
        heading: "Cost Per Lead",
        value: stats?.costPerLead?.value,
        icon: (
          <HiOutlineCurrencyDollar className="text-orange-600 dark:text-orange-400" />
        ),
        subheading: (
          <TrendIndicator
            status={stats?.costPerLead?.growth?.status}
            percentage={stats?.costPerLead?.growth?.label}
          />
        ),
      },
      {
        heading: "Show Rate",
        value: `${stats?.showRate?.value || 0}%`,
        icon: <LuTarget className="text-purple-600 dark:text-purple-400" />,
        subheading: (
          <TrendIndicator
            status={stats?.showRate?.growth?.status}
            percentage={stats?.showRate?.growth?.label}
          />
        ),
      },
    ];
  }, [stats]);

  const SECONDARY_STATS = useMemo<StatCard[]>(() => {
    return [
      {
        heading: "Avg Response Time",
        value: stats?.avgResponseTime?.value || "0.0 min",
        icon: <HiOutlineClock className="text-blue-600 dark:text-blue-400" />,
      },
      {
        heading: "Pipeline Value",
        value: stats?.pipelineValue?.value,
        icon: (
          <HiOutlineChartBar className="text-purple-600 dark:text-purple-400" />
        ),
      },
      {
        heading: "Top Source",
        value: stats?.topSource || "Unknown",
        icon: (
          <HiOutlineTrendingUp className="text-pink-600 dark:text-pink-400" />
        ),
      },
    ];
  }, [stats]);

  const stages = useMemo(() => {
    if (!leadsData?.data?.groupedLeads) return [];

    const statusMap: Record<string, any> = {
      newLead: { icon: HiOutlineUsers, name: "New Lead" },
      contacted: { icon: HiOutlineChat, name: "Contacted" },
      appointmentScheduled: { icon: HiOutlineCalendar, name: "Appointment" },
      noShow: { icon: HiOutlineClock, name: "No Show" },
      patientWon: { icon: LuTarget, name: "Won" },
      lost: { icon: HiOutlineUsers, name: "Lost" },
    };

    return LEAD_STATUSES.map((status) => {
      const leads =
        leadsData.data.groupedLeads[
          status.key as keyof typeof leadsData.data.groupedLeads
        ] || [];
      const totalValue = leads.reduce(
        (sum: number, lead: any) => sum + (Number(lead.estimatedValue) || 0),
        0,
      );

      return {
        id: status.key,
        name: status.label,
        count: leads.length,
        value: `$${totalValue.toLocaleString()}`,
        icon: statusMap[status.key]?.icon || HiOutlineUsers,
        leads: leads,
      };
    });
  }, [leadsData]);

  const allLeads = useMemo(() => {
    if (!leadsData?.data?.groupedLeads) return [];
    return Object.values(leadsData.data.groupedLeads).flat();
  }, [leadsData]);

  const HEADING_DATA = {
    heading: "Lead Tracking",
    subHeading: "Monitor and manage patient leads from inquiry to conversion",
    buttons: [
      {
        label: "Automation Setup",
        onClick: () => {
          addToast({
            title: "Coming Soon",
            description: "Automation Setup functionality is in progress",
            color: "primary",
          });
        },
        icon: <HiOutlineCog fontSize={15} />,
        variant: "ghost" as const,
        color: "default" as const,
        className: "border-small",
      },
      {
        label: "Export",
        onClick: () => {
          addToast({
            title: "Coming Soon",
            description: "Export functionality is in progress",
            color: "primary",
          });
        },
        icon: <HiOutlineDownload fontSize={15} />,
        variant: "ghost" as const,
        color: "default" as const,
        className: "border-small",
      },

      {
        label: "Add Lead",
        onClick: onOpen,
        icon: <AiOutlinePlus fontSize={15} />,
        variant: "solid" as const,
        color: "primary" as const,
      },
    ],
  };

  return (
    <ComponentContainer headingData={HEADING_DATA}>
      <div className="flex flex-col gap-4 md:gap-5">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
          {SUMMARY_STATS.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-3 md:gap-4">
          {SECONDARY_STATS.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))}
        </div>

        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between border border-foreground/10 rounded-xl p-4 bg-background shadow-none">
          <div className="w-full xl:flex-grow">
            <Input
              placeholder="Search leads by name, email, or phone..."
              startContent={
                <HiOutlineSearch className="text-gray-400 dark:text-foreground/40" />
              }
              variant="flat"
              size="sm"
              value={filters.search}
              onValueChange={(val) => {
                setFilters((prev) => ({ ...prev, search: val }));
                setPage(1);
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 w-full items-stretch sm:items-center">
            <Select
              placeholder="All Sources"
              size="sm"
              className="w-full"
              variant="flat"
              items={[
                { key: "allSources", label: "All Sources" },
                ...LEAD_SOURCES,
              ]}
              selectedKeys={new Set([filters.source])}
              onSelectionChange={(keys) => {
                setFilters((prev) => ({
                  ...prev,
                  source: Array.from(keys)[0] as string,
                }));
                setPage(1);
              }}
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>

            <Select
              placeholder="All Treatments"
              size="sm"
              className="w-full"
              variant="flat"
              items={[
                { key: "allTreatments", label: "All Treatments" },
                ...LEAD_TREATMENTS,
              ]}
              selectedKeys={new Set([filters.treatment])}
              onSelectionChange={(keys) => {
                setFilters((prev) => ({
                  ...prev,
                  treatment: Array.from(keys)[0] as string,
                }));
                setPage(1);
              }}
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>

            <Select
              placeholder="All Priorities"
              size="sm"
              className="w-full"
              variant="flat"
              items={[
                { key: "allPriorities", label: "All Priorities" },
                ...LEAD_PRIORITIES,
              ]}
              selectedKeys={new Set([filters.priority])}
              onSelectionChange={(keys) => {
                setFilters((prev) => ({
                  ...prev,
                  priority: Array.from(keys)[0] as string,
                }));
                setPage(1);
              }}
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>

            <div className="flex bg-gray-100 dark:bg-default-100 p-1 rounded-lg w-full">
              <button
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === "pipeline" ? "bg-white dark:bg-content2 shadow-sm text-primary" : "text-gray-500 dark:text-foreground/40"}`}
                onClick={() => setView("pipeline")}
              >
                Pipeline
              </button>
              <button
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === "list" ? "bg-white dark:bg-content2 shadow-sm text-primary" : "text-gray-500 dark:text-foreground/40"}`}
                onClick={() => setView("list")}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-96 border border-foreground/10 rounded-xl bg-background shadow-none">
            <LoadingState />
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-96 border border-foreground/10 rounded-xl bg-background shadow-none">
            <EmptyState
              icon={
                <HiOutlineExclamationCircle className="size-10 text-danger" />
              }
              title="Connection Error"
              message="We encountered an issue fetching your lead data. Please try again."
            />
          </div>
        ) : allLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 border border-foreground/10 rounded-xl bg-background shadow-none">
            <EmptyState
              icon={<HiOutlineSearch className="size-8 text-gray-400" />}
              title="No Leads Found"
              message={
                filters.search
                  ? `No results for "${filters.search}". Try a different term or clear filters.`
                  : "Start adding leads to see them here."
              }
            />
          </div>
        ) : view === "pipeline" ? (
          <div className="w-full overflow-x-auto h-full min-h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4  lg:min-w-0 h-fit">
              {stages.map((stage: any) => {
                const styles = getStageStyles(stage.id);
                return (
                  <div
                    key={stage.id}
                    className="flex flex-col rounded-xl overflow-hidden border border-foreground/5 dark:border-foreground/10 bg-white dark:bg-content1 h-fit"
                  >
                    {/* Stage Header */}
                    <div
                      className={`p-3 space-y-1 ${styles.bg} border-b ${styles.border} flex-shrink-0`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <stage.icon
                            className={`size-3.5 ${styles.iconColor}`}
                          />
                          <h4
                            className={`font-bold text-[10px] uppercase tracking-tight ${styles.headerText}`}
                          >
                            {stage.name}
                          </h4>
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${styles.bubbleBg} ${styles.headerText}`}
                        >
                          {stage.count}
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-gray-500/70 dark:text-foreground/40">
                        {stage.value}
                      </div>
                    </div>

                    {/* Lead Cards Scrollable Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-100/40 dark:bg-black/10 max-h-[720px]">
                      <div className="p-2 space-y-3 min-h-[200px] flex flex-col">
                        {stage.leads?.length > 0 ? (
                          stage.leads.map((lead: any) => (
                            <LeadCard
                              key={lead.id || lead._id}
                              lead={{
                                ...lead,
                                id: lead.id || lead._id,
                                name:
                                  lead.name ||
                                  `${lead.firstName} ${lead.lastName}`,
                                value: `$${(lead.estimatedValue || 0).toLocaleString()}`,
                              }}
                              onPress={handleLeadClick}
                            />
                          ))
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center opacity-40">
                            <EmptyState
                              title="No leads"
                              icon={
                                <HiOutlineUsers className="size-8 text-gray-400 dark:text-gray-700" />
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <Card
            shadow="none"
            className="border border-foreground/10 bg-white dark:bg-content1"
          >
            <CardBody className="p-0 overflow-x-auto">
              <table className="w-full min-w-[1000px] text-sm">
                <thead>
                  <tr className="border-b border-foreground/5 bg-gray-50/30 dark:bg-white/5">
                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider">
                      Treatment
                    </th>
                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider">
                      Response
                    </th>
                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 dark:text-foreground/40 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  {allLeads.map((lead: any) => (
                    <tr
                      key={lead.id || lead._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="font-bold text-foreground">
                            {lead.name || `${lead.firstName} ${lead.lastName}`}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-foreground/40">
                            {lead.email}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-foreground/40">
                            {lead.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 dark:text-foreground/60 uppercase tracking-tighter">
                          {lead.source}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <ReferralStatusChip status={lead.status} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          {lead.treatments.map((t: string, i: number) => (
                            <Chip
                              key={i}
                              size="sm"
                              variant="flat"
                              className="bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 text-[10px] font-bold h-6"
                            >
                              {t}
                            </Chip>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-foreground">
                          ${(lead.estimatedValue || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <HiStar className="text-yellow-400 size-4" />
                          <span className="font-bold text-gray-600 dark:text-foreground/60">
                            {lead.score || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div
                          className={`text-xs font-bold ${parseInt(lead.responseTime || "0") < 10 ? "text-green-500" : "text-red-500"}`}
                        >
                          {lead.responseTime || "0"}m
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          className="text-gray-400 dark:text-foreground/40 hover:text-primary"
                          onPress={() => handleLeadClick(lead)}
                        >
                          <HiOutlineEye className="size-5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {leadsData?.data?.pagination && (
                <div className="p-4 border-t border-foreground/5">
                  <Pagination
                    identifier="Leads"
                    totalItems={leadsData.data.pagination.totalLeads}
                    totalPages={leadsData.data.pagination.totalPages}
                    currentPage={page}
                    handlePageChange={setPage}
                    limit={limit}
                  />
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </div>

      <AddLeadModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <LeadDetailsModal
        isOpen={isDetailsOpen}
        onOpenChange={onDetailsOpenChange}
        lead={selectedLead}
      />
    </ComponentContainer>
  );
};

export default LeadTracking;
