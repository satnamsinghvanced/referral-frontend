import { Button, Select, SelectItem, Tab, Tabs } from "@heroui/react";
import { useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";
import { LuDownload, LuEye, LuMousePointer, LuTarget } from "react-icons/lu";
import MiniStatsCard from "../../../components/cards/MiniStatsCard";
import Overview from "./Overview";
import Performance from "./Performance";
import Audience from "./Audience";
import Devices from "./Devices";

const INITIAL_FILTERS = {
  filter: "30days",
};

const Analytics = () => {
  const STAT_CARD_DATA = [
    {
      icon: <FaRegEnvelope className="text-blue-500" />,
      heading: "Total Sent",
      value: "1.1K",
      subheading: "+245 from last period",
    },
    {
      icon: <LuEye className="text-green-500" />,
      heading: "Avg Open Rate",
      value: "75.3%",
      subheading: "Industry avg: 22%",
    },
    {
      icon: <LuMousePointer className="text-orange-500" />,
      heading: "Avg Click Rate",
      value: "28.0%",
      subheading: "Industry avg: 3.5%",
    },
    {
      icon: <LuTarget className="text-purple-500" />,
      heading: "Conversions",
      value: "57",
      subheading: "+34 from last period",
    },
  ];

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
        <Button
          onPress={() => setCurrentFilters(INITIAL_FILTERS)}
          size="sm"
          variant="ghost"
          color="default"
          className="border-small"
          startContent={<HiOutlineRefresh className="size-3.5" />}
        >
          Refresh
        </Button>
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
        <div className="">
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
              <div className="mt-5">
                <Overview />
              </div>
            </Tab>

            <Tab key="performance" title="Performance">
              <div className="mt-5">
                <Performance />
              </div>
            </Tab>

            <Tab key="audience" title="Audience">
              <div className="mt-5">
                <Audience />
              </div>
            </Tab>

            <Tab key="devices" title="Devices">
              <div className="mt-5">
                <Devices />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
