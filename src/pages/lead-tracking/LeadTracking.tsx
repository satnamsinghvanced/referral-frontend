import React, { useState, useMemo } from "react";
import {
    Button,
    Card,
    CardBody,
    Input,
    Select,
    SelectItem,
    Chip,
    useDisclosure,
} from "@heroui/react";
import {
    HiOutlineChartBar,
    HiOutlineUsers,
    HiOutlineClock,
    HiOutlineSearch,
    HiOutlinePlus,
    HiOutlineDownload,
    HiOutlineCog,
    HiOutlineCheckCircle,
    HiOutlineCurrencyDollar,
    HiOutlineTrendingUp,
    HiOutlinePhone,
    HiOutlineCalendar,
    HiOutlineLogout,
    HiOutlineXCircle,
    HiOutlineEye,
    HiStar
} from "react-icons/hi";
import { LuTarget, LuUsers } from "react-icons/lu";
import AddLeadModal from "./modal/AddLeadModal";
import LeadCard from "./LeadCard";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import TrendIndicator from "../../components/common/TrendIndicator";
import LeadDetailsModal from "./modal/LeadDetailsModal";

import { useLeadStatus, useLeadStats } from "../../hooks/useLeadTracking";
import { LEAD_SOURCE, LEAD_PRIORITY, LEAD_TREATMENTS, LEAD_STATUS, STAGE_STYLES, STATUS_COLORS } from "../../consts/LeadTrackingConstants";
import { useDebounce } from "../../hooks/useDebounce";
import Pagination from "../../components/common/Pagination";
import { EVEN_PAGINATION_LIMIT } from "../../consts/consts";

const orangeItemClasses = {
    base: [
        "data-[hover=true]:!bg-orange-100",
        "data-[hover=true]:!text-orange-600",
        "data-[selected=true]:!bg-orange-100",
        "data-[selected=true]:!text-orange-600",
        "data-[focus=true]:!bg-orange-100",
        "data-[focus=true]:!text-orange-600",
    ],
};

const formatTreatment = (t: string) => {
    return LEAD_TREATMENTS[t as keyof typeof LEAD_TREATMENTS] || t.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(val || 0);
};

const statusMap: Record<string, { id: string; name: string; icon: any }> = {
    newLead: { ...LEAD_STATUS.newLead, icon: HiOutlineClock },
    contacted: { ...LEAD_STATUS.contacted, icon: HiOutlinePhone },
    appointmentScheduled: { ...LEAD_STATUS.appointmentScheduled, icon: HiOutlineCalendar },
    noShow: { ...LEAD_STATUS.noShow, icon: HiOutlineLogout },
    patientWon: { ...LEAD_STATUS.patientWon, icon: HiOutlineCheckCircle },
    lost: { ...LEAD_STATUS.lost, icon: HiOutlineXCircle },
};

const formatSource = (source: string) => {
    if (!source) return "Unknown";
    return LEAD_SOURCE[source as keyof typeof LEAD_SOURCE] || source;
};

const getPriorityColor = (priorityLabel: string) => {
    const p = priorityLabel.toLowerCase();
    if (p === "high") return "danger";
    if (p === "medium") return "primary";
    return "default";
};

const getStageStyles = (stageId: string) => STAGE_STYLES[stageId] || {
    bg: "bg-gray-50",
    headerText: "text-gray-700",
    iconColor: "text-gray-500",
    bubbleBg: "bg-gray-100",
    border: "border-gray-100"
};

const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    const entry = Object.entries(STATUS_COLORS).find(([key]) => s.includes(key));
    return entry ? entry[1] : "text-gray-600 bg-gray-50 border-gray-100";
};


const LeadTracking = () => {
    const [view, setView] = useState("pipeline");
    const [page, setPage] = useState(1);
    const [limit] = useState(EVEN_PAGINATION_LIMIT);
    const [search, setSearch] = useState("");
    const [source, setSource] = useState("allSources");
    const [treatment, setTreatment] = useState("allTreatments");
    const [priority, setPriority] = useState("allPriorities");

    const debouncedSearch = useDebounce(search, 500);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onOpenChange: onDetailsOpenChange } = useDisclosure();
    const [selectedLead, setSelectedLead] = useState<any>(null);

    const handleLeadClick = (lead: any) => {
        setSelectedLead(lead);
        onDetailsOpen();
    };
    const { data: apiResponse, isLoading, isError } = useLeadStatus({
        page,
        limit,
        search: debouncedSearch,
        source: source === "allSources" ? "" : source,
        treatments: treatment === "allTreatments" ? "" : treatment,
        priority: priority === "allPriorities" ? "" : priority
    });
    const { data: statsData } = useLeadStats();

    const summaryStats = useMemo<StatCard[]>(() => {
        const stats = statsData;
        return [
            {
                heading: "Total Leads",
                value: stats?.totalLeads?.value?.toLocaleString() || "0",
                icon: <LuUsers className="text-blue-600 dark:text-blue-400" />,
                subheading: (
                    <TrendIndicator
                        status={stats?.totalLeads?.converted > 0 ? "increment" : "decrement"}
                        valueOverride={`${stats?.totalLeads?.converted || 0} converted`}
                    />
                ),
            },
            {
                heading: "Conversion Rate",
                value: `${stats?.conversionRate?.value || 0}%`,
                icon: <HiOutlineChartBar className="text-green-600 dark:text-green-400" />,
                subheading: (
                    <TrendIndicator
                        status={stats?.conversionRate?.growth?.status}
                        percentage={stats?.conversionRate?.growth?.label}
                    />
                ),
            },
            {
                heading: "Cost Per Lead",
                value: formatCurrency(stats?.costPerLead?.value || 0),
                icon: <HiOutlineCurrencyDollar className="text-orange-600 dark:text-orange-400" />,
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
    }, [statsData]);

    const secondaryStats = useMemo<StatCard[]>(() => {
        const stats = statsData;
        return [
            {
                heading: "Avg Response Time",
                value: stats?.avgResponseTime?.value || "0.0 min",
                icon: <HiOutlineClock className="text-blue-600 dark:text-blue-400" />,
            },
            {
                heading: "Pipeline Value",
                value: formatCurrency(stats?.pipelineValue?.value || 0),
                icon: <HiOutlineChartBar className="text-purple-600 dark:text-purple-400" />,
            },
            {
                heading: "Top Source",
                value: formatSource(stats?.topSource) || "Unknown",
                icon: <HiOutlineTrendingUp className="text-pink-600 dark:text-pink-400" />,
            },
        ];
    }, [statsData]);

    const leads = useMemo(() => {
        if (!apiResponse || !apiResponse.groupedLeads) return [];
        const data = apiResponse.groupedLeads;
        const allLeads: any[] = [];
        Object.keys(data).forEach(statusKey => {
            const leadsList = data[statusKey];
            if (Array.isArray(leadsList)) {
                const leadsInStatus = leadsList.map((l: any) => ({
                    id: l._id,
                    name: `${l.firstName} ${l.lastName}`,
                    email: l.email,
                    phone: l.phone,
                    source: formatSource(l.source),
                    status: statusMap[statusKey]?.name || "Unknown",
                    treatments: Array.isArray(l.treatments) ? l.treatments.map(formatTreatment) : [],
                    value: formatCurrency(l.estimatedValue),
                    score: 85,
                    responseTime: '5 min',
                    priority: l.priority ? l.priority.charAt(0).toUpperCase() + l.priority.slice(1) : "Medium",
                    stage: statusMap[statusKey]?.id || "new",
                    assignedTo: l.assignedTo || "Unassigned"
                }));
                allLeads.push(...leadsInStatus);
            }
        });
        return allLeads;
    }, [apiResponse]);

    const stages = useMemo(() => {
        return Object.keys(statusMap).map(key => {
            const stageInfo = statusMap[key];
            if (!stageInfo) return null;

            const stageLeads = leads.filter(l => l.stage === stageInfo.id);
            const totalValue = stageLeads.reduce((acc: number, curr: any) => {
                const val = curr.value || "$0";
                const num = parseInt(val.replace(/[^0-9]/g, ''));
                return acc + (isNaN(num) ? 0 : num);
            }, 0);

            return {
                ...stageInfo,
                count: stageLeads.length,
                value: formatCurrency(totalValue)
            };
        }).filter(Boolean) as any[];
    }, [leads]);

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6 bg-slate-50/50 overflow-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Lead Tracking
                    </h1>
                    <p className="text-gray-500 text-xs sm:text-sm">
                        Monitor and manage patient leads from inquiry to conversion
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <div className="flex gap-2">
                        <Button
                            variant="flat"
                            className="w-full sm:w-auto bg-white dark:bg-background hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all border border-foreground/10"
                            startContent={<HiOutlineCog />}
                        >
                            Automation Setup
                        </Button>
                        <Button
                            variant="flat"
                            className="w-full sm:w-auto bg-white dark:bg-background hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all border border-foreground/10"
                            startContent={<HiOutlineDownload />}
                        >
                            Export
                        </Button>

                    </div>
                    <Button
                        color="primary"
                        className="w-full sm:w-auto"
                        startContent={<HiOutlinePlus />}
                        onPress={onOpen}
                    >
                        Add Lead
                    </Button>
                </div>
            </div>

            <AddLeadModal isOpen={isOpen} onOpenChange={onOpenChange} />
            <LeadDetailsModal
                isOpen={isDetailsOpen}
                onOpenChange={onDetailsOpenChange}
                lead={selectedLead}
            />

            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
                {summaryStats.map((data, i) => (
                    <MiniStatsCard key={i} cardData={data} />
                ))}
            </div>

            {/* Secondary Stats */}
            <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                {secondaryStats.map((data, i) => (
                    <MiniStatsCard key={i} cardData={data} />
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between bg-white p-4 rounded-xl shadow-sm">

                <div className="w-full xl:flex-grow">
                    <Input
                        placeholder="Search leads by name, email, or phone..."
                        startContent={<HiOutlineSearch className="text-gray-400" />}
                        variant="flat"
                        size="sm"
                        value={search}
                        onValueChange={(val) => {
                            setSearch(val);
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
                        selectedKeys={new Set([source])}
                        onSelectionChange={(keys) => {
                            setSource(Array.from(keys)[0] as string);
                            setPage(1);
                        }}
                        listboxProps={{
                            itemClasses: {
                                base: orangeItemClasses.base
                            }
                        }}
                        items={[
                            { key: "allSources", label: "All Sources" },
                            ...Object.entries(LEAD_SOURCE).map(([key, label]) => ({ key, label }))
                        ]}
                    >
                        {(item) => (
                            <SelectItem key={item.key}>{item.label}</SelectItem>
                        )}
                    </Select>

                    <Select
                        placeholder="All Treatments"
                        size="sm"
                        className="w-full"
                        variant="flat"
                        selectedKeys={new Set([treatment])}
                        onSelectionChange={(keys) => {
                            setTreatment(Array.from(keys)[0] as string);
                            setPage(1);
                        }}
                        listboxProps={{
                            itemClasses: {
                                base: orangeItemClasses.base
                            }
                        }}
                        items={[
                            { key: "allTreatments", label: "All Treatments" },
                            ...Object.entries(LEAD_TREATMENTS).map(([key, label]) => ({ key, label }))
                        ]}
                    >
                        {(item) => (
                            <SelectItem key={item.key}>{item.label}</SelectItem>
                        )}
                    </Select>

                    <Select
                        placeholder="All Priorities"
                        size="sm"
                        className="w-full"
                        variant="flat"
                        selectedKeys={new Set([priority])}
                        onSelectionChange={(keys) => {
                            setPriority(Array.from(keys)[0] as string);
                            setPage(1);
                        }}
                        listboxProps={{
                            itemClasses: {
                                base: orangeItemClasses.base
                            }
                        }}
                        items={[
                            { key: "allPriorities", label: "All Priorities" },
                            ...Object.entries(LEAD_PRIORITY).map(([key, label]) => ({ key, label }))
                        ]}
                    >
                        {(item) => (
                            <SelectItem key={item.key}>{item.label}</SelectItem>
                        )}
                    </Select>

                    <div className="flex bg-gray-100 p-1 rounded-lg w-full">
                        <button
                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === 'pipeline' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
                            onClick={() => setView('pipeline')}
                        >
                            Pipeline
                        </button>
                        <button
                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
                            onClick={() => setView('list')}
                        >
                            List
                        </button>
                    </div>

                </div>
            </div>

            {/* Dashboard Content */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : isError ? (
                <div className="flex justify-center items-center h-64 text-red-500 font-bold">
                    Failed to fetch leads
                </div>
            ) : view === 'pipeline' ? (
                <div className="w-full overflow-x-auto h-full min-h-[600px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4  lg:min-w-0 h-fit">
                        {stages.map((stage: any) => {
                            const styles = getStageStyles(stage.id);
                            return (
                                <div
                                    key={stage.id}
                                    className="flex flex-col rounded-xl overflow-hidden border border-foreground/5 bg-white h-fit"
                                >
                                    {/* Stage Header */}
                                    <div className={`p-3 space-y-1 ${styles.bg} border-b ${styles.border} flex-shrink-0`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <stage.icon className={`size-3.5 ${styles.iconColor}`} />
                                                <h4 className={`font-bold text-[10px] uppercase tracking-tight ${styles.headerText}`}>
                                                    {stage.name}
                                                </h4>
                                            </div>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${styles.bubbleBg} ${styles.headerText}`}>
                                                {stage.count}
                                            </span>
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-500/70">
                                            {stage.value}
                                        </div>
                                    </div>

                                    {/* Lead Cards Scrollable Area */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-100/40 max-h-[720px]">
                                        <div className="p-2 space-y-3 min-h-[200px] flex flex-col">
                                            {leads.filter((lead: any) => lead.stage === stage.id).length > 0 ? (
                                                leads
                                                    .filter((lead: any) => lead.stage === stage.id)
                                                    .map((lead: any) => (
                                                        <LeadCard
                                                            key={lead.id}
                                                            lead={lead}
                                                            getPriorityColor={getPriorityColor}
                                                            onPress={handleLeadClick}
                                                        />
                                                    ))
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center opacity-40">
                                                    <HiOutlineUsers className="size-8 text-gray-400 mb-1" />
                                                    <span className="text-[11px] font-medium text-gray-500">No leads</span>
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
                <Card shadow="none" className="border border-foreground/10 bg-white">
                    <CardBody className="p-0 overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-sm">
                            <thead>
                                <tr className="border-b border-foreground/5 bg-gray-50/30">
                                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 uppercase tracking-wider">Lead</th>
                                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 uppercase tracking-wider">Source</th>
                                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 uppercase tracking-wider">Treatment</th>
                                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 uppercase tracking-wider">Value</th>
                                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 uppercase tracking-wider">Score</th>
                                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 uppercase tracking-wider">Response</th>
                                    <th className="text-left text-[10px] py-4 px-6 font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/5">
                                {leads.map((lead: any) => (
                                    <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="font-bold text-foreground">{lead.name}</div>
                                                <div className="text-xs text-gray-400">{lead.email}</div>
                                                <div className="text-xs text-gray-400">{lead.phone}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 border border-gray-100 text-gray-500 uppercase tracking-tighter">
                                                {lead.source}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-md text-xs font-bold border ${getStatusColor(lead.status)}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap gap-2">
                                                {lead.treatments.map((t: string, i: number) => (
                                                    <Chip
                                                        key={i}
                                                        size="sm"
                                                        variant="flat"
                                                        className="bg-sky-50 text-sky-600 text-[10px] font-bold h-6"
                                                    >
                                                        {t}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-foreground">{lead.value}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1">
                                                <HiStar className="text-yellow-400 size-4" />
                                                <span className="font-bold text-gray-600">{lead.score}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className={`text-xs font-bold ${parseInt(lead.responseTime) < 10 ? 'text-green-500' : 'text-red-500'}`}>
                                                {lead.responseTime}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                                className="text-gray-400 hover:text-primary"
                                                onPress={() => handleLeadClick(lead)}
                                            >
                                                <HiOutlineEye className="size-5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {apiResponse?.pagination && (
                            <div className="p-4 border-t border-foreground/5">
                                <Pagination
                                    identifier="Leads"
                                    totalItems={apiResponse.pagination.totalLeads}
                                    totalPages={apiResponse.pagination.totalPages}
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
    );
};

export default LeadTracking;
