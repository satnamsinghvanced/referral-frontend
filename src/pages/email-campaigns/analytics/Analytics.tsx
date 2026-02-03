import { Button, Select, SelectItem, Tab, Tabs } from "@heroui/react";
import { useMemo, useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { LuDownload, LuEye, LuMousePointer, LuTarget } from "react-icons/lu";
import MiniStatsCard from "../../../components/cards/MiniStatsCard";
import { LoadingState } from "../../../components/common/LoadingState";
import { useAnalyticsOverview } from "../../../hooks/useCampaign";
import Audience from "./Audience";
import Devices from "./Devices";
import Overview from "./Overview";
import Performance from "./Performance";

const INITIAL_FILTERS = {
  filter: "30days",
};

const Analytics = () => {
  const { data: overview, isLoading } = useAnalyticsOverview();

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

  const [currentFilters, setCurrentFilters] = useState(INITIAL_FILTERS);

  const handleFilterChange = (key: string, value: string) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {isLoading ? (
          <div className="col-span-4 flex justify-center py-10">
            <LoadingState />
          </div>
        ) : (
          STAT_CARD_DATA.map((data, i) => (
            <MiniStatsCard key={i} cardData={data} />
          ))
        )}
      </div>
      <div className="flex items-center gap-3 border-foreground/10 border rounded-xl bg-background p-4">
        <div className="flex items-center gap-3">
          <Select
            aria-label="Filter"
            placeholder="All filters"
            size="sm"
            radius="sm"
            selectedKeys={[currentFilters.filter] as string[]}
            disabledKeys={[currentFilters.filter] as string[]}
            onSelectionChange={(keys) =>
              handleFilterChange("filter", Array.from(keys)[0] as string)
            }
            className="min-w-[160px]"
          >
            <SelectItem key="7days">Last 7 days</SelectItem>
            <SelectItem key="30days">Last 30 days</SelectItem>
            <SelectItem key="90days">Last 90 days</SelectItem>
            <SelectItem key="lastYear">Last year</SelectItem>
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
          onPress={() => setCurrentFilters(INITIAL_FILTERS)}
          size="sm"
          variant="ghost"
          color="default"
          className="border-small"
          startContent={<LuDownload className="size-3.5" />}
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
              <Overview />
            </Tab>

            <Tab key="performance" title="Performance">
              <Performance />
            </Tab>

            <Tab key="audience" title="Audience">
              <Audience />
            </Tab>

            <Tab key="devices" title="Devices">
              <Devices />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
