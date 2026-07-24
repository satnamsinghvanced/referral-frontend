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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
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
import LeadAutomations from "./LeadAutomations";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";

import { AiOutlinePlus } from "react-icons/ai";
import ComponentContainer from "../../components/common/ComponentContainer";
import Pagination from "../../components/common/Pagination";
import { EVEN_PAGINATION_LIMIT } from "../../consts/consts";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import {
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  LEAD_TREATMENTS,
  STAGE_STYLES,
} from "../../consts/lead-pipeline";
import { useDebounce } from "../../hooks/useDebounce";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useLeadStats, useLeadStatus, useUpdateLead, useReorderLeads, useDeleteLead, useExportLeadsPDF } from "../../hooks/useLeadPipeline";
import ReferralStatusChip from "../../components/chips/ReferralStatusChip";
import EmptyState from "../../components/common/EmptyState";
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
  const queryClient = useQueryClient();
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
    onClose: onDetailsClose,
    onOpenChange: onDetailsOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [leadToDelete, setLeadToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const handleLeadClick = (lead: any) => {
    setSelectedLeadId(lead.id || lead._id);
    onDetailsOpen();
  };

  const location = useLocation();
  useEffect(() => {
    if (location.state?.openLeadId) {
      setSelectedLeadId(location.state.openLeadId);
      onDetailsOpen();
      // Clear location state from browser history to avoid reopening on reload
      window.history.replaceState({}, document.title);
    }
  }, [location.state, onDetailsOpen]);
  const {
    data: leadsData,
    isLoading,
    isError,
  } = useLeadStatus({ ...filters, search: debouncedSearch });

  const { mutateAsync: updateLeadMutate } = useUpdateLead();
  const { mutateAsync: reorderLeadsMutate } = useReorderLeads();
  const { mutateAsync: deleteLeadMutate } = useDeleteLead();
  const { mutate: exportLeadsPDF, isPending: isExporting } = useExportLeadsPDF();

  const handleDeleteLead = (lead: any) => {
    setLeadToDelete(lead);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    setIsDeleting(true);
    try {
      await deleteLeadMutate(leadToDelete.id || leadToDelete._id);
      onDeleteClose();
      onDetailsClose();
    } catch (err) {
      console.error("Failed to delete lead:", err);
    } finally {
      setIsDeleting(false);
      setLeadToDelete(null);
    }
  };
  const [localGroupedLeads, setLocalGroupedLeads] = useState<any>(null);
  const [draggedLead, setDraggedLead] = useState<{ id: string; status: string } | null>(null);
  const [draggedOverColumnId, setDraggedOverColumnId] = useState<string | null>(null);
  const [draggedOverLeadId, setDraggedOverLeadId] = useState<string | null>(null);

  useEffect(() => {
    if (leadsData?.groupedLeads) {
      setLocalGroupedLeads(leadsData.groupedLeads);
    }
  }, [leadsData]);

  const handleDragStart = (e: React.DragEvent, id: string, status: string) => {
    setDraggedLead({ id, status });
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
    setDraggedOverColumnId(null);
    setDraggedOverLeadId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string, targetLeadId?: string) => {
    e.preventDefault();
    setDraggedOverColumnId(null);
    setDraggedOverLeadId(null);

    if (!draggedLead) return;
    const { id: leadId, status: sourceStatus } = draggedLead;

    const previousGroupedLeads = { ...localGroupedLeads };
    const newGroupedLeads = { ...localGroupedLeads };

    const sourceArray = newGroupedLeads[sourceStatus] ? [...newGroupedLeads[sourceStatus]] : [];
    const leadIndex = sourceArray.findIndex((l: any) => (l.id || l._id) === leadId);
    if (leadIndex === -1) return;

    const [movedLead] = sourceArray.splice(leadIndex, 1);
    newGroupedLeads[sourceStatus] = sourceArray;
    
    const updatedMovedLead = { ...movedLead, status: targetStatus };

    let targetArray = newGroupedLeads[targetStatus] ? [...newGroupedLeads[targetStatus]] : [];
    
    if (sourceStatus === targetStatus) {
      targetArray = sourceArray; 
    }

    if (targetLeadId) {
      const insertIndex = targetArray.findIndex((l: any) => (l.id || l._id) === targetLeadId);
      if (insertIndex !== -1) {
        targetArray.splice(insertIndex, 0, updatedMovedLead);
      } else {
        targetArray.push(updatedMovedLead);
      }
    } else {
      targetArray.push(updatedMovedLead);
    }
    
    newGroupedLeads[targetStatus] = targetArray;

    setLocalGroupedLeads(newGroupedLeads);

    const queryKey = ["leadStatus", { ...filters, search: debouncedSearch }];

    // Optimistically update query cache
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        groupedLeads: newGroupedLeads
      };
    });

    try {
      const targetIds = newGroupedLeads[targetStatus].map((l: any) => l._id || l.id);
      const sourceIds = sourceStatus !== targetStatus
        ? newGroupedLeads[sourceStatus].map((l: any) => l._id || l.id)
        : undefined;

      await reorderLeadsMutate({
        leadId,
        targetStatus,
        targetIds,
        sourceStatus,
        sourceIds,
      });
    } catch (err) {
      setLocalGroupedLeads(previousGroupedLeads);
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          groupedLeads: previousGroupedLeads
        };
      });
      addToast({
        title: "Error",
        description: "Failed to update lead status. Relocating lead back.",
        color: "danger"
      });
    }
  };

  const selectedLead = useMemo(() => {
    const dataToUse = localGroupedLeads || leadsData?.groupedLeads;
    if (!selectedLeadId || !dataToUse) return null;
    for (const stageLeads of Object.values(dataToUse)) {
      const found = (stageLeads as any[]).find(
        (l: any) => (l.id || l._id) === selectedLeadId
      );
      if (found) return found;
    }
    return null;
  }, [selectedLeadId, localGroupedLeads, leadsData]);

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
        value: stats?.pipelineValue?.value ? "$" + stats?.pipelineValue?.value : "$0",
        icon: (
          <HiOutlineChartBar className="text-purple-600 dark:text-purple-400" />
        ),
      },
      {
        heading: "Top Source",
        value: stats?.topSource ? stats?.topSource : "loading...",
        icon: (
          <HiOutlineTrendingUp className="text-pink-600 dark:text-pink-400" />
        ),
      },
    ];
  }, [stats]);
  const stages = useMemo(() => {
    const dataToUse = localGroupedLeads || leadsData?.groupedLeads;
    if (!dataToUse) return [];
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
        dataToUse[
        status.key as keyof typeof dataToUse
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
  }, [localGroupedLeads, leadsData]);
  const allLeads = useMemo(() => {
    const dataToUse = localGroupedLeads || leadsData?.groupedLeads;
    if (!dataToUse) return [];
    return Object.values(dataToUse).flat();
  }, [localGroupedLeads, leadsData]);
  const HEADING_DATA = {
    heading: view === "automations" ? "Lead Automations" : "Lead Tracking",
    subHeading: view === "automations"
      ? "Configure automated SMS, emails, and notifications triggered by lead events."
      : "Monitor and manage patient leads from inquiry to conversion",
    buttons: view === "automations" ? [] : [
      {
        label: "Automation Setup",
        onClick: () => {
          setView("automations");
        },
        icon: <HiOutlineCog fontSize={15} />,
        variant: "ghost" as const,
        color: "default" as const,
        className: "border-small",
      },
      {
        label: "Export",
        onClick: () => {
          exportLeadsPDF({
            search: debouncedSearch,
            source: filters.source,
            treatments: filters.treatment,
            priority: filters.priority,
          });
        },
        isLoading: isExporting,
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
        {view !== "automations" && (
          <>
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
                  aria-label="Search leads"
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
                  aria-label="Filter by source"
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
                  aria-label="Filter by treatment"
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
                  aria-label="Filter by priority"
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
          </>
        )}
        { isLoading ? (
          <div className="flex justify-center items-center h-72 border border-foreground/10 rounded-xl bg-background shadow-none">
            <Spinner size="sm" label="Loading leads..." color="primary" />
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-72 border border-foreground/10 rounded-xl bg-background shadow-none">
            <EmptyState
              icon={
                <HiOutlineExclamationCircle className="size-10 text-danger" />
              }
              title="Connection Error"
              message="We encountered an issue fetching your lead data. Please try again."
            />
          </div>
        ) : view === "automations" ? (
          <LeadAutomations onBack={() => setView("pipeline")} />
        ) : view === "pipeline" ? (
          <div className="w-full overflow-x-auto h-full min-h-[600px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4  lg:min-w-0 h-fit">
                  {stages.map((stage: any) => {
                    const styles = getStageStyles(stage.id);
                    return (
                      <div
                        key={stage.id}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={() => setDraggedOverColumnId(stage.id)}
                        onDragLeave={() => setDraggedOverColumnId(null)}
                        onDrop={(e) => handleDrop(e, stage.id)}
                        className={`flex flex-col rounded-xl overflow-hidden border transition-all duration-200 bg-white dark:bg-content1 h-fit ${
                          draggedOverColumnId === stage.id
                            ? "border-primary/50 dark:border-primary/70 shadow-lg scale-[1.01] bg-primary/5 dark:bg-primary/10"
                            : "border-foreground/5 dark:border-foreground/10"
                        }`}
                      >
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
                                  onDelete={handleDeleteLead}
                                  draggable={true}
                                  onDragStart={(e) => handleDragStart(e, lead.id || lead._id, stage.id)}
                                  onDragEnd={handleDragEnd}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDraggedOverLeadId(lead.id || lead._id);
                                  }}
                                  onDragLeave={() => {
                                    setDraggedOverLeadId(null);
                                  }}
                                  onDrop={(e) => {
                                    e.stopPropagation();
                                    handleDrop(e, stage.id, lead.id || lead._id);
                                  }}
                                  isDraggedOver={draggedOverLeadId === (lead.id || lead._id)}
                                />
                              ))
                            ) : (
                              <div className="flex-1 flex flex-col items-center justify-center py-5 text-center opacity-40">
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
                      {allLeads.length > 0 ? (
                        allLeads.map((lead: any) => (
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
                                  {formatPhoneNumber(lead.phone)}
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-10">
                            <div className="sticky left-0 w-[calc(100vw-40px)] sm:w-[calc(100vw-60px)] lg:w-[calc(100vw-310px)] xl:w-full max-w-full flex justify-center">
                              <EmptyState
                                title="No leads available"
                                icon={
                                  <HiOutlineUsers className="size-8 text-gray-400 dark:text-foreground/20" />
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {leadsData?.pagination && (
                    <div className="p-4 border-t border-foreground/5">
                      <Pagination
                        identifier="Leads"
                        totalItems={leadsData.pagination.totalLeads}
                        totalPages={leadsData.pagination.totalPages}
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
        onDelete={handleDeleteLead}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Lead"
        description={`Are you sure you want to delete lead ${leadToDelete?.name || `${leadToDelete?.firstName || ""}\u00a0${leadToDelete?.lastName || ""}`.trim() || "this lead"}? This action cannot be undone.`}
      />
    </ComponentContainer>
  );
};

export default LeadTracking;
