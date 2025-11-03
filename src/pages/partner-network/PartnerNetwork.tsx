import { Pagination } from "@heroui/react";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiEdit, FiEye, FiStar, FiUsers } from "react-icons/fi";
import { IoDocumentOutline } from "react-icons/io5";
import { LuBuilding2 } from "react-icons/lu";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import {
  useFetchPartnerDetail,
  useFetchPartners,
} from "../../hooks/usePartner"; // Import the custom hook
import { FetchPartnersParams, Partner } from "../../types/partner"; // Import types
import { PARTNER_FILTERS, PARTNER_SORT_OPTIONS } from "../../utils/filters";
import ReferralManagementActions from "../referral-management/ReferralManagementActions";
import NotesTasksModal from "./NotesTasksModal";
import PartnerDetailsModal from "./PartnerDetailsModal";
import PartnerNetworkCard from "./PartnerNetworkCard";
import PartnerNetworkHeader from "./PartnerNetworkHeader";
import ScheduleVisits from "./schedule-visits/ScheduleVisits";

const PartnerNetwork = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPracticeEdit, setIsPracticeEdit] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [partnerEditId, setPartnerEditId] = useState("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    null
  );
  const [isNotesTasksModalOpen, setIsNotesTasksModalOpen] = useState(false);
  const [notesTasksPartner, setNotesTasksPartner] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [params, setParams] = useState<FetchPartnersParams>({
    page: 1,
    limit: 10,
    sortBy: "name",
    order: sortOrder,
    filter: "allPractices", // Default filter value
  });

  // Fetch data using the hook and current parameters
  const { data, isLoading } = useFetchPartners(params);

  const { data: singlePartnerData } = useFetchPartnerDetail(partnerEditId);

  console.log(data, "PARTNERS");

  const practices = data?.data || [];
  const stats = data;

  const handleOpen = () => {
    setIsPracticeEdit(false);
    setIsModalOpen(true);
  };

  // Handlers to update the state, which triggers a re-fetch
  const handleFilterChange = (value: any) => {
    setParams((prev) => ({ ...prev, filter: value, page: 1 }));
  };

  const handleSortChange = (value: any) => {
    setParams((prev) => ({ ...prev, sortBy: value, page: 1 }));
  };

  const handleSortOrderChange = (order: "asc" | "desc") => {
    console.log(order, "ORDER HAI");
    setSortOrder(order);
    setParams((prev) => ({ ...prev, order }));
  };

  const HEADING_DATA_BUTTONS_LIST = [
    // {
    //   label: "Bulk Select",
    //   onClick: () => alert("Bulk Select Clicked"),
    //   icon: <TbCheckbox fontSize={16} />,
    //   variant: "bordered" as const, // Use 'as const' for literal types in an array
    //   color: "default" as const,
    //   className: "border-small",
    // },
    {
      label: "Add Practice",
      onClick: handleOpen,
      icon: <AiOutlinePlus fontSize={15} />,
      variant: "solid" as const,
      color: "primary" as const,
    },
  ];

  const STATS_CARD_DATA: StatCard[] = [
    {
      icon: <LuBuilding2 className="text-[17px] mt-1 text-foreground/60" />,
      heading: "Total Practices",
      value: isLoading ? "..." : stats?.totalPractices ?? 0, // Use fetched total
      subheading: `${
        stats?.activePractices ? stats?.activePractices : 0
      } active practices`,
    },
    {
      icon: <FiUsers className="text-[17px] mt-1 text-foreground/60" />,
      heading: "Total Referrals",
      value: isLoading ? "..." : stats?.totalReferrals ?? 0, // Use fetched total
      subheading: `${
        stats?.monthlyReferrals ? stats?.monthlyReferrals : 0
      } this month`,
    },
    {
      icon: <FiStar className="text-[17px] mt-1 text-foreground/60" />,
      heading: "A-Level Practices",
      value: isLoading ? "..." : stats?.totalALevelPractices ?? 0, // Use fetched total
      subheading: `${
        stats?.aLevelPercentage ? stats?.aLevelPercentage : 0
      }% of total`,
    },
    // {
    //   icon: <FiTarget className="text-[17px] mt-1 text-foreground/60" />,
    //   heading: "Avg. Score",
    //   value: isLoading ? "..." : "N/A", // Placeholder for derived metric
    //   subheading: "0 improvement",
    // },
  ];

  const handleOpenNotesTasksModal = (
    partnerId: string,
    partnerName: string
  ) => {
    setNotesTasksPartner({ id: partnerId, name: partnerName });
    setIsNotesTasksModalOpen(true);
  };

  const PARTNER_NETWORK_ACTIONS = [
    {
      label: "Notes",
      function: (id: string, name: string) => {
        handleOpenNotesTasksModal(id, name);
      },
      icon: <IoDocumentOutline className="size-3.5" />,
      variant: "light" as const,
      color: "secondary" as const,
    },
    {
      label: "View",
      function: (id: string) => {
        setSelectedPartnerId(id);
        setIsViewModalOpen(true);
      },
      icon: <FiEye className="size-3.5" />,
      variant: "light" as const,
      color: "primary" as const,
    },
    {
      label: "Edit",
      function: (id: string) => {
        setPartnerEditId(id);
        setIsModalOpen(true);
      },
      icon: <FiEdit className="size-3.5" />,
      variant: "light" as const,
      color: "success" as const,
    },
  ];

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="sticky top-0 bg-background text-foreground">
          <PartnerNetworkHeader
            heading="Partner Network"
            subHeading="Manage relationships with referring practices"
            buttons={HEADING_DATA_BUTTONS_LIST}
            filters={[
              {
                label: "Practice Type",
                options: PARTNER_FILTERS,
                selectedValue: params.filter,
                onChange: handleFilterChange,
              },
            ]}
            sortOptions={PARTNER_SORT_OPTIONS}
            selectedSortOption={params.sortBy}
            onSortChange={handleSortChange}
            sortOrder={sortOrder}
            onSortOrderChange={handleSortOrderChange}
          />
        </div>
        <div className="flex flex-col gap-2 md:px-7 px-4 py-4 md:py-[31px] overflow-auto space-y-5">
          <div className="flex flex-col gap-5">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-between">
              {STATS_CARD_DATA.map((data) => (
                <MiniStatsCard key={data.heading} cardData={data} />
              ))}
            </div>

            {/* Partner List */}
            <div className="flex flex-col gap-4 border border-primary/15 rounded-xl p-4 bg-background/80">
              <div className="font-medium text-sm">Partner Practices</div>
              {isLoading && (
                <div className="text-gray-600 text-xs text-center">
                  Loading partners...
                </div>
              )}
              {!isLoading && practices.length === 0 && (
                <div className="text-gray-600 text-xs text-center">
                  No partners found with current filters.
                </div>
              )}

              {practices.map((partner: Partner) => (
                <PartnerNetworkCard
                  key={partner._id}
                  partner={partner}
                  actions={PARTNER_NETWORK_ACTIONS}
                />
              ))}

              {stats?.totalPages && stats.totalPages > 1 ? (
                <Pagination
                  showControls
                  size="sm"
                  radius="sm"
                  initialPage={1}
                  page={params.page as number}
                  onChange={(page) => {
                    setParams((prev) => ({ ...prev, page }));
                  }}
                  total={stats?.totalPages as number}
                  classNames={{
                    base: "flex justify-end py-3",
                    wrapper: "gap-1.5",
                    item: "cursor-pointer",
                    prev: "cursor-pointer",
                    next: "cursor-pointer",
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>
          <ScheduleVisits practices={practices} />
        </div>
      </div>

      <ReferralManagementActions
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editedData={singlePartnerData || null}
        setReferrerEditId={setPartnerEditId}
        isPracticeEdit={isPracticeEdit}
      />

      <PartnerDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        partnerId={selectedPartnerId}
        primaryButtonHandler={(practiceId: any) => {
          setPartnerEditId(practiceId || "");
          setIsViewModalOpen(false);
          setIsModalOpen(true);
        }}
      />

      <NotesTasksModal
        isOpen={isNotesTasksModalOpen}
        onClose={() => setIsNotesTasksModalOpen(false)}
        practice={notesTasksPartner}
        // notes={MOCK_NOTES}
        // tasks={MOCK_TASKS}
        onAddNote={() => alert("Add note not implemented")}
        onAddTask={() => alert("Add task not implemented")}
        onDeleteNote={() => alert("Delete note not implemented")}
        onDeleteTask={() => alert("Delete task not implemented")}
      />
    </>
  );
};

export default PartnerNetwork;
