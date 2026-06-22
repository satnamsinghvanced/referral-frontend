import { LuGlobe } from "react-icons/lu";
import { HiOutlineChat, HiOutlineClock } from "react-icons/hi";
import { FiSmartphone } from "react-icons/fi";
import MiniStatsCard from "../../../components/cards/MiniStatsCard";

interface ChatWidgetStatsProps {
  stats?: {
    activeWebsites: number;
    totalConversations: number;
    smsOptIns: number;
    avgResponseTime: string;
  };
}

export default function ChatWidgetStats({ stats }: ChatWidgetStatsProps) {
  const statsData = [
    {
      heading: "Active Websites",
      value: stats ? stats.activeWebsites.toString() : "0",
      icon: <LuGlobe className="text-blue-500 text-xl shrink-0" />
    },
    {
      heading: "Total Conversations",
      value: stats ? stats.totalConversations.toLocaleString() : "0",
      icon: <HiOutlineChat className="text-emerald-500 text-xl shrink-0" />
    },
    {
      heading: "SMS Opt-ins",
      value: stats ? stats.smsOptIns.toLocaleString() : "0",
      icon: <FiSmartphone className="text-purple-500 text-xl shrink-0" />
    },
    {
      heading: "Avg Response Time",
      value: stats ? stats.avgResponseTime : "2.3m",
      icon: <HiOutlineClock className="text-orange-500 text-xl shrink-0" />
    }
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statsData.map((data, i) => (
        <MiniStatsCard key={i} cardData={data} />
      ))}
    </div>
  );
}
