import { Button, Select, SelectItem, Tab, Tabs } from "@heroui/react";
import { useMemo, useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { LuDownload, LuEye, LuMousePointer, LuTarget } from "react-icons/lu";
import MiniStatsCard from "../../../components/cards/MiniStatsCard";
import Audience from "./Audience";
import Devices from "./Devices";
import Overview from "./Overview";
import Performance from "./Performance";
import { ANALYTICS_FILTER_OPTIONS } from "../../../consts/campaign";
import {
  useAnalyticsOverview,
  useEmailAnalyticsExport,
} from "../../../hooks/useCampaign";
import { AnalyticsFilter } from "../../../types/campaign";

const INITIAL_FILTERS: { filter: AnalyticsFilter } = {
  filter: "last30days",
};

const Analytics = () => {
  const [currentFilters, setCurrentFilters] = useState(INITIAL_FILTERS);
  const { data: overview, isLoading } = useAnalyticsOverview(
    currentFilters.filter,
  );
  const exportMutation = useEmailAnalyticsExport();

  const STAT_CARD_DATA = useMemo(() => {
    if (!overview?.stats) return [];
    return overview.stats.map((stat) => ({
      icon: stat.title.includes("Sent") ? (
        <FaRegEnvelope className="text-blue-500" />
      ) : stat.title.includes("Open") ? (
        <LuEye className="text-green-500" />
      ) : stat.title.includes("Click") ? (
        <LuMousePointer className="text-orange-500" />
      ) : (
        <LuTarget className="text-purple-500" />
      ),
      heading: stat.title,
      value: stat.totalValue,
      subheading: (
        <span
          className={
            stat.lastPeriod.trend === "up" ? "text-green-500" : "text-red-500"
          }
        >
          {stat.lastPeriod.trend === "up" ? "+" : ""}
          {stat.lastPeriod.percentage}% from last period
        </span>
      ),
    }));
  }, [overview]);

  const handleFilterChange = (value: AnalyticsFilter) => {
    setCurrentFilters({ filter: value });
  };

  const handleExport = () => {
    exportMutation.mutate(currentFilters.filter);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {STAT_CARD_DATA.map((data, i) => (
          <MiniStatsCard key={i} cardData={data} />
        ))}
      </div>
      <div className="flex items-center gap-3 border-foreground/10 border rounded-xl bg-background p-4">
        <div className="flex items-center gap-3">
          <Select
            aria-label="Filter"
            placeholder="All filters"
            size="sm"
            radius="sm"
            selectedKeys={[currentFilters.filter]}
            disabledKeys={[currentFilters.filter]}
            onSelectionChange={(keys) =>
              handleFilterChange(Array.from(keys)[0] as AnalyticsFilter)
            }
            className="min-w-[160px]"
          >
            {ANALYTICS_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>
        {/* <Button
          onPress={() => setCurrentFilters(INITIAL_FILTERS)}
          size="sm"
          variant="ghost"
          color="default"
          className="border-small"
          startContent={<HiOutlineRefresh className="size-3.5" />}
        >
          Refresh
        </Button> */}
        <Button
          onPress={handleExport}
          isLoading={exportMutation.isPending}
          size="sm"
          variant="ghost"
          color="default"
          className="border-small"
          startContent={
            !exportMutation.isPending && <LuDownload className="size-3.5" />
          }
        >
          Export
        </Button>
      </div>
      <div className="space-y-4 md:space-y-5">
        <div className="space-y-2">
          <Tabs
            aria-label="Options"
            variant="light"
            radius="full"
            classNames={{
              base: "bg-primary/15 dark:bg-background rounded-full p-1 w-full",
              tabList: "flex w-full rounded-full p-0 gap-0",
              tab: "flex-1 h-9 text-sm font-medium transition-all",
              cursor: "rounded-full bg-white dark:bg-primary",
              tabContent:
                "dark:group-data-[selected=true]:text-primary-foreground text-default-500 dark:text-foreground/60 transition-colors",
            }}
            className="w-full"
          >
            <Tab key="overview" title="Overview">
              <Overview filter={currentFilters.filter} />
            </Tab>

            <Tab key="performance" title="Performance">
              <Performance filter={currentFilters.filter} />
            </Tab>

            <Tab key="audience" title="Audience">
              <Audience filter={currentFilters.filter} />
            </Tab>

            <Tab key="devices" title="Devices">
              <Devices filter={currentFilters.filter} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
