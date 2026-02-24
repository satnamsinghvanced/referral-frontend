import React, { useState, useMemo } from "react";
import {
    Button,
    Card,
    CardBody,
    Input,
    Select,
    SelectItem,
    Badge,
    Avatar,
    Chip,
    Tabs,
    Tab,
    useDisclosure,
} from "@heroui/react";
import {
    HiOutlineLightningBolt,
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
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineCalendar,
    HiOutlineLogout,
    HiOutlineXCircle,
    HiOutlineEye,
    HiStar
} from "react-icons/hi";
import { LuTarget, LuMousePointer2, LuUser, LuMapPin, LuTag } from "react-icons/lu";
import AddLeadModal from "./modal/AddLeadModal";
import LeadCard from "./LeadCard";
import { LeadStatusData } from "../../types/leadTracking";
import { useLeadStatus } from "../../hooks/useLeadTracking";

const LeadTracking = () => {
    const [view, setView] = useState("pipeline");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const summaryStats = [
        {
            title: "Total Leads",
            value: "1,284",
            trend: "up",
            subtext: "+12.5% from last month",
            icon: HiOutlineUsers,
            iconBg: "bg-blue-50 text-blue-600",
        },
        {
            title: "Conversion Rate",
            value: "24.2%",
            trend: "up",
            subtext: "+2.4% from last month",
            icon: HiOutlineChartBar,
            iconBg: "bg-green-50 text-green-600",
        },
        {
            title: "Cost Per Lead",
            value: "$42.50",
            trend: "down",
            subtext: "-8.1% from last month",
            icon: HiOutlineCurrencyDollar,
            iconBg: "bg-purple-50 text-purple-600",
        },
        {
            title: "Show Rate",
            value: "68.5%",
            trend: "up",
            subtext: "+4.2% from last month",
            icon: LuTarget,
            iconBg: "bg-orange-50 text-orange-600",
        },
    ];

    const secondaryStats = [
        {
            title: "Avg Response Time",
            value: "7.7 min",
            icon: HiOutlineClock,
            iconColor: "text-blue-500",
        },
        {
            title: "Pipeline Value",
            value: "$31,700",
            icon: HiOutlineChartBar,
            iconColor: "text-purple-500",
        },
        {
            title: "Top Source",
            value: "Google Ads",
            icon: HiOutlineTrendingUp,
            iconColor: "text-pink-500",
        },
    ];

    const formatTreatment = (t: string) => {
        return t.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    const statusMap: Record<string, { id: string; name: string; icon: any }> = {
        newLead: { id: 'new', name: 'New Lead', icon: HiOutlineClock },
        contacted: { id: 'contacted', name: 'Contacted', icon: HiOutlinePhone },
        appointmentScheduled: { id: 'scheduled', name: 'Appointment Scheduled', icon: HiOutlineCalendar },
        noShow: { id: 'no-show', name: 'No Show', icon: HiOutlineLogout },
        patientWon: { id: 'won', name: 'Patient Won', icon: HiOutlineCheckCircle },
        lost: { id: 'lost', name: 'Patient Lost', icon: HiOutlineXCircle },
    };

    const formatSource = (source: string) => {
        if (!source) return "Unknown";
        const formatted = source.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        if (formatted === "Facebook Ads") return "Facebook Ads";
        if (formatted === "Google Ads") return "Google Ads";
        return formatted;
    };

    const { data: apiResponse, isLoading, isError } = useLeadStatus();
    if (apiResponse) console.log("Lead Data:", apiResponse);

    const leads = useMemo(() => {
        if (!apiResponse) return [];
        const data = apiResponse;
        const allLeads: any[] = [];
        Object.keys(data).forEach(statusKey => {
            const leadsList = data[statusKey as keyof LeadStatusData];
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
                    stage: statusMap[statusKey]?.id || "new"
                }));
                allLeads.push(...leadsInStatus);
            }
        });
        return allLeads;
    }, [apiResponse]);

    const stages = Object.keys(statusMap).map(key => {
        const stageInfo = statusMap[key];
        if (!stageInfo) return null;

        const stageLeads = leads.filter(l => l.stage === stageInfo.id);
        const totalValue = stageLeads.reduce((acc, curr) => {
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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High":
                return "danger";
            case "Medium":
                return "primary";
            case "Low":
                return "default";
            default:
                return "default";
        }
    };

    const getStageStyles = (stageId: string) => {
        switch (stageId) {
            case "new":
                return {
                    bg: "bg-[#f0f9ff]",
                    headerText: "text-sky-700",
                    iconColor: "text-sky-500",
                    bubbleBg: "bg-sky-100/50",
                    border: "border-sky-100/50"
                };
            case "contacted":
                return {
                    bg: "bg-[#eff6ff]",
                    headerText: "text-blue-700",
                    iconColor: "text-blue-500",
                    bubbleBg: "bg-blue-100/50",
                    border: "border-blue-100/50"
                };
            case "scheduled":
                return {
                    bg: "bg-[#f5f3ff]",
                    headerText: "text-purple-700",
                    iconColor: "text-purple-500",
                    bubbleBg: "bg-purple-100/50",
                    border: "border-purple-100/50"
                };
            case "no-show":
                return {
                    bg: "bg-[#fffaf0]",
                    headerText: "text-orange-700",
                    iconColor: "text-orange-500",
                    bubbleBg: "bg-orange-100/50",
                    border: "border-orange-100/50"
                };
            case "won":
                return {
                    bg: "bg-[#f0fdf4]",
                    headerText: "text-green-700",
                    iconColor: "text-green-500",
                    bubbleBg: "bg-green-100/50",
                    border: "border-green-100/50"
                };
            case "lost":
                return {
                    bg: "bg-[#f8fafc]",
                    headerText: "text-slate-700",
                    iconColor: "text-slate-500",
                    bubbleBg: "bg-slate-100/50",
                    border: "border-slate-100/50"
                };
            default:
                return {
                    bg: "bg-gray-50",
                    headerText: "text-gray-700",
                    iconColor: "text-gray-500",
                    bubbleBg: "bg-gray-100",
                    border: "border-gray-100"
                };
        }
    };

    const getStageHeaderColor = (stage: string) => {
        switch (stage) {
            case "new":
                return "text-sky-500";
            case "contacted":
                return "text-blue-500";
            case "scheduled":
                return "text-purple-500";
            case "no-show":
                return "text-orange-500";
            case "won":
                return "text-green-500";
            case "lost":
                return "text-gray-500";
            default:
                return "text-gray-500";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "New Lead":
                return "text-sky-600 bg-sky-50 border-sky-100";
            case "Contacted":
                return "text-blue-600 bg-blue-50 border-blue-100";
            case "Appointment Scheduled":
                return "text-purple-600 bg-purple-50 border-purple-100";
            case "No Show":
                return "text-orange-600 bg-orange-50 border-orange-100";
            case "Patient Won":
                return "text-green-600 bg-green-50 border-green-100";
            case "Lost":
                return "text-gray-600 bg-gray-50 border-gray-100";
            default:
                return "text-gray-600 bg-gray-50 border-gray-100";
        }
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6 bg-slate-50/50 min-h-screen h-full overflow-auto">
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryStats.map((stat, index) => (
                    <Card
                        key={index}
                        shadow="none"
                        className="border border-foreground/10 bg-white dark:bg-background transition-all cursor-pointer hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-lg dark:hover:shadow-primary/10 hover:-translate-y-1"
                    >
                        <CardBody className="flex flex-row items-center justify-between p-4">
                            <div>
                                <p className="text-gray-500 text-xs font-medium mb-1">{stat.title}</p>
                                <h3 className="text-xl font-bold mb-1">{stat.value}</h3>
                                <p className={`text-[10px] flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-500' :
                                    stat.trend === 'down' ? 'text-red-500' : 'text-blue-500'
                                    }`}>
                                    {stat.trend === 'up' && '▲'}
                                    {stat.trend === 'down' && '▼'}
                                    {stat.subtext}
                                </p>
                            </div>
                            <div className={`${stat.iconBg} p-2.5 rounded-xl`}>
                                <stat.icon className="size-5" />
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {secondaryStats.map((stat, index) => (
                    <Card key={index} shadow="none" className="border border-foreground/10 bg-white">
                        <CardBody className="flex flex-row items-center justify-between p-4">
                            <div>
                                <p className="text-gray-500 text-xs font-medium mb-1">{stat.title}</p>
                                <h3 className="text-xl font-bold">{stat.value}</h3>
                            </div>
                            <stat.icon className={`size-6 ${stat.iconColor} opacity-80`} />
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between bg-white p-4 rounded-xl shadow-sm">

                <div className="w-full xl:flex-grow xl:max-w-lg">
                    <Input
                        placeholder="Search leads by name, email, or phone..."
                        startContent={<HiOutlineSearch className="text-gray-400" />}
                        variant="flat"
                        size="sm"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 w-full xl:w-auto items-stretch sm:items-center">

                    <Select
                        placeholder="All Sources"
                        size="sm"
                        className="w-full"
                        variant="flat"
                        defaultSelectedKeys={["All Sources"]}
                        listboxProps={{
                            itemClasses: {
                                base: [
                                    "data-[hover=true]:!bg-orange-100",
                                    "data-[hover=true]:!text-orange-600",
                                    "data-[selected=true]:!bg-orange-100",
                                    "data-[selected=true]:!text-orange-600",
                                    "data-[focus=true]:!bg-orange-100",
                                    "data-[focus=true]:!text-orange-600",
                                ],
                            },
                        }}
                    >
                        <SelectItem key="All Sources">All Sources</SelectItem>
                        <SelectItem key="Google Ads">Google Ads</SelectItem>
                        <SelectItem key="Facebook Ads">Facebook Ads</SelectItem>
                        <SelectItem key="Instagram">Instagram</SelectItem>
                        <SelectItem key="Referral">Referral</SelectItem>
                        <SelectItem key="Website">Website</SelectItem>
                        <SelectItem key="Walk-in">Walk-in</SelectItem>
                        <SelectItem key="Direct Mail">Direct Mail</SelectItem>
                    </Select>

                    <Select
                        placeholder="All Treatments"
                        size="sm"
                        className="w-full"
                        variant="flat"
                        defaultSelectedKeys={["All Treatments"]}
                        listboxProps={{
                            itemClasses: {
                                base: [
                                    "data-[hover=true]:!bg-orange-100",
                                    "data-[hover=true]:!text-orange-600",
                                    "data-[selected=true]:!bg-orange-100",
                                    "data-[selected=true]:!text-orange-600",
                                    "data-[focus=true]:!bg-orange-100",
                                    "data-[focus=true]:!text-orange-600",
                                ],
                            },
                        }}
                    >
                        <SelectItem key="All Treatments">All Treatments</SelectItem>
                        <SelectItem key="Invisalign">Invisalign</SelectItem>
                        <SelectItem key="Traditional Braces">Traditional Braces</SelectItem>
                        <SelectItem key="Surgical Orthodontics">Surgical Orthodontics</SelectItem>
                        <SelectItem key="TMJ Treatment">TMJ Treatment</SelectItem>
                        <SelectItem key="Cosmetic">Cosmetic</SelectItem>
                    </Select>

                    <Select
                        placeholder="All Priorities"
                        size="sm"
                        className="w-full"
                        variant="flat"
                        defaultSelectedKeys={["All Priorities"]}
                        listboxProps={{
                            itemClasses: {
                                base: [
                                    "data-[hover=true]:!bg-orange-100",
                                    "data-[hover=true]:!text-orange-600",
                                    "data-[selected=true]:!bg-orange-100",
                                    "data-[selected=true]:!text-orange-600",
                                    "data-[focus=true]:!bg-orange-100",
                                    "data-[focus=true]:!text-orange-600",
                                ],
                            },
                        }}
                    >
                        <SelectItem key="All Priorities">All Priorities</SelectItem>
                        <SelectItem key="High">High</SelectItem>
                        <SelectItem key="Medium">Medium</SelectItem>
                        <SelectItem key="Low">Low</SelectItem>
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
                        {stages.map((stage) => {
                            const styles = getStageStyles(stage.id);
                            return (
                                <div
                                    key={stage.id}
                                    className="flex flex-col rounded-xl overflow-hidden border border-foreground/5 bg-white"
                                >
                                    {/* Stage Header */}
                                    <div className={`p-3 space-y-1 ${styles.bg} border-b ${styles.border}`}>
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

                                    {/* Lead Cards */}
                                    {leads &&
                                        <div className="p-2  space-y-3 flex-1 bg-gray-100/40">
                                            {leads
                                                .filter((lead) => lead.stage === stage.id)
                                                .map((lead) => (
                                                    <LeadCard
                                                        key={lead.id}
                                                        lead={lead}
                                                        getPriorityColor={getPriorityColor}
                                                    />
                                                ))}
                                        </div>
                                    }
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
                                {leads.map((lead) => (
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
                                            >
                                                <HiOutlineEye className="size-5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            )}
        </div>
    );
};

export default LeadTracking;
