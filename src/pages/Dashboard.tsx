import ComponentContainer from "../components/common/ComponentContainer";

type Color = "sky" | "orange" | "emerald" | "purple";

interface QuickAction {
  label: string;
  icon: string;
  color: Color;
}

const Dashboard = () => {
  const headingData = {
    heading: "Dashboard Overview",
    subHeading:
      "Welcome back! Here's what's happening with your referrals today.",
  };

  const stats = [
    {
      title: "Total Referrals",
      value: "247",
      change: "↗ +12% from last month",
      icon: "👥",
      color: "sky",
    },
    {
      title: "Active Campaigns",
      value: "12",
      change: "↗ +2 this month",
      icon: "📢",
      color: "orange",
    },
    {
      title: "Reviews",
      value: "1,248",
      change: "↗ 4.8 avg rating",
      icon: "⭐",
      color: "emerald",
    },
    {
      title: "ROI",
      value: "284%",
      change: "↗ +12% vs last month",
      icon: "🎯",
      color: "purple",
    },
  ];

  const quickActions: QuickAction[] = [
    { label: "Add Referral", icon: "👥", color: "sky" },
    { label: "Marketing Calendar", icon: "📅", color: "orange" },
    { label: "View Reviews", icon: "⭐", color: "emerald" },
    { label: "Analytics", icon: "📊", color: "purple" },
  ];

  const colorClasses: Record<
    Color,
    { bg: string; text: string; border: string; hover: string }
  > = {
    sky: {
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
      hover: "hover:bg-sky-100",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      hover: "hover:bg-orange-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      hover: "hover:bg-emerald-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      hover: "hover:bg-purple-100",
    },
  };

  const recentActivities = [
    {
      icon: "👥",
      iconBg: "bg-sky-50",
      title: "New referral from Dr. Smith",
      description: "Patient: John Doe - Orthodontic consultation",
      time: "2 hours ago",
    },
    {
      icon: "⭐",
      iconBg: "bg-yellow-50",
      title: "5-star review received",
      description: 'Sarah Johnson - "Excellent service and care!"',
      time: "4 hours ago",
    },
    {
      icon: "📢",
      iconBg: "bg-orange-50",
      title: "Marketing campaign launched",
      description: "Back-to-School Smile Campaign - Social Media",
      time: "6 hours ago",
    },
  ];

  const systemStatuses = [
    {
      name: "Google Calendar",
      status: "✓ Connected",
      bg: "bg-green-100",
      text: "text-green-800",
    },
    {
      name: "Review Tracking",
      status: "✓ Active",
      bg: "bg-green-100",
      text: "text-green-800",
    },
    {
      name: "NFC System",
      status: "✓ Online",
      bg: "bg-green-100",
      text: "text-green-800",
    },
  ];

  return (
    <ComponentContainer headingData={headingData}>
      <div className="container mx-auto">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-full mx-auto">
            <div className="mb-6">
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Navigation is now active!</span>{" "}
                  Click on any metric card, quick action button, or activity
                  item to navigate to different sections.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats?.map((item, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-lg shadow p-6 border border-${item.color}-100 cursor-pointer hover:shadow-lg hover:border-${item.color}-200 transition-all`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-sm">{item.title}</h1>
                    <div
                      className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <span className={`text-${item.color}-600 text-lg`}>
                        {item.icon}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg mt-4 mb-0.5 font-bold ">
                    {item.value}
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-emerald-600">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h1 className="text-lg mb-4">Quick Actions</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, i) => {
                  const color = colorClasses[action.color];
                  return (
                    <button
                      key={i}
                      className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer text-sm
                   ${color.bg} ${color.text} ${color.border} ${color.hover}`}
                    >
                      <span>{action.icon}</span>
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <div className={`p-2 rounded-lg ${activity.iconBg}`}>
                          <span className="text-lg">{activity.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📱</span>NFC & QR Tracking
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Active Codes
                      </span>
                      <span className="bg-sky-100 text-sky-800 px-2 py-1 rounded text-sm font-medium">
                        67
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Scans Today</span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">
                        23
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Conversion Rate
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm font-medium">
                        78%
                      </span>
                    </div>
                    <button className="w-full mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors cursor-pointer">
                      📱 Generate New Code
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    System Status
                  </h3>
                  <div className="space-y-2">
                    {systemStatuses.map((system, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-600">{system.name}</span>
                        <span
                          className={`${system.bg} ${system.text} px-2 py-1 rounded text-sm`}
                        >
                          {system.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentContainer>
  );
};

export default Dashboard;
