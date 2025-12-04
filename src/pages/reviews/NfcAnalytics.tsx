import { Card, Chip } from "@heroui/react"; // Assuming 'Card' and 'Chip' are available
import { useState } from "react";
import { FiUsers, FiWifi } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { MdOutlineLocationOn } from "react-icons/md";

// Mock Data (as defined above)
const dashboardCards = [
  {
    id: "1",
    title: "Front Desk Card",
    location: "Downtown Office",
    totalTaps: 142,
    conversions: 89,
    conversionRate: 62.7,
    lastUsed: "1/20/2024",
    users: [
      {
        initials: "MB",
        name: "Michael Brown",
        taps: 2,
        last: "1/19/2024",
        status: "Reviewed",
      },
      {
        initials: "ED",
        name: "Emily Davis",
        taps: 1,
        last: "1/18/2024",
        status: "Pending",
      },
      {
        initials: "AS",
        name: "Adam Smith",
        taps: 0,
        last: "N/A",
        status: "New",
      },
    ],
  },
  {
    id: "2",
    title: "Waiting Room Card",
    location: "Downtown Office",
    totalTaps: 87,
    conversions: 52,
    conversionRate: 59.8,
    lastUsed: "1/19/2024",
    users: [
      {
        initials: "JS",
        name: "Jessica Stone",
        taps: 5,
        last: "1/19/2024",
        status: "Reviewed",
      },
      {
        initials: "PK",
        name: "Peter King",
        taps: 3,
        last: "1/17/2024",
        status: "Pending",
      },
    ],
  },
  {
    id: "3",
    title: "Checkout Counter",
    location: "Westside Clinic",
    totalTaps: 98,
    conversions: 71,
    conversionRate: 72.4,
    lastUsed: "1/20/2024",
    users: [],
  },
];

// Helper to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "Reviewed":
      return "bg-green-100 text-green-700 border-green-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

/**
 * Renders a single dashboard card.
 * @param {object} props - Card data and state handlers.
 */
const NfcCard = ({ data, isOpen, toggleUsers }: any) => {
  const {
    title,
    location,
    totalTaps,
    conversions,
    conversionRate,
    lastUsed,
    users,
  } = data;
  const progressBarWidth = `${conversionRate}%`;

  return (
    // Card component from @heroui/react
    <Card
      className="p-4 border border-primary/15 shadow-none transition-shadow hover:shadow-lg cursor-pointer flex flex-col"
      isPressable
      disableAnimation
      onPress={() => toggleUsers(data.id)}
    >
      <div className="flex items-center font-medium mb-2">
        <FiWifi className="text-xl text-blue-600" />
        <span className="ml-1.5 text-base">{title}</span>
      </div>
      <div className="flex items-center text-xs text-gray-600 mb-4">
        <GrLocation className="text-base" />
        <span className="ml-1">{location}</span>
      </div>

      {/* Taps & Conversions Stats */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 mr-2 text-center p-3 bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg">
          <p className="text-xl font-bold text-sky-700">{totalTaps}</p>
          <p className="text-xs text-gray-600">Total Taps</p>
        </div>
        <div className="flex-1 ml-2 text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
          <p className="text-xl font-bold text-green-700">{conversions}</p>
          <p className="text-xs text-gray-600">Conversions</p>
        </div>
      </div>

      {/* Conversion Rate Bar */}
      <div className="flex flex-col justify-start">
        <div className="flex justify-between items-center text-sm font-medium">
          <p className="text-xs text-gray-600">Conversion Rate</p>
          <span className="text-xs text-gray-900">
            {conversionRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-primary-100 rounded-full h-1.5 mt-1">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: progressBarWidth }}
          ></div>
        </div>
        <span className="text-xs text-gray-600 mt-3 text-left">
          Last used: {lastUsed}
        </span>
      </div>

      {/* Associated Users Section (Initially hidden) */}
      {isOpen && (
        <div
          className={`mt-4 border-t border-primary/15 pt-4 transition-all duration-300 ${
            isOpen
              ? "h-auto opacity-100 visible"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex items-center text-sm text-gray-700 font-medium mb-3">
            <FiUsers className="mr-2" />
            Associated Users ({users.length})
          </div>

          <div className="space-y-2 max-h-[110px] overflow-auto">
            {users.map((user: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
              >
                <div className="flex items-center justify-start">
                  {/* User Initials Badge */}
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-foreground flex items-center justify-center text-xs font-medium mr-2">
                    {user.initials}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {user.taps} taps • Last: {user.last}
                    </p>
                  </div>
                </div>
                <Chip
                  size="sm"
                  radius="sm"
                  className={`text-[11px] font-medium h-5 border ${getStatusColor(
                    user.status
                  )}`}
                >
                  {user.status}
                </Chip>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-xs text-gray-600 text-center py-2">
                No associated users to display.
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

// Main component
export default function NfcAnalytics() {
  // State to track which card's user list is open (null or the card ID)
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  // Toggle function for click interaction
  const toggleUsers = (id: string) => {
    setOpenCardId(openCardId === id ? null : id);
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => (
          <NfcCard
            key={card.id}
            data={card}
            isOpen={openCardId === card.id}
            toggleUsers={toggleUsers}
          />
        ))}
      </div>
    </div>
  );
}
