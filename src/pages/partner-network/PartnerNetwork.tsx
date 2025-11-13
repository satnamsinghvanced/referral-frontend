import { Pagination } from "@heroui/react";
import { useCallback, useState, useMemo } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiEdit, FiEye, FiStar, FiUsers } from "react-icons/fi";
import { IoDocumentOutline } from "react-icons/io5";
import { LuBuilding2 } from "react-icons/lu";
import { TbArchive } from "react-icons/tb";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import { PARTNER_FILTERS, PARTNER_SORT_OPTIONS } from "../../consts/filters";
import {
  useFetchPartnerDetail,
  useFetchPartners,
} from "../../hooks/usePartner";
import { FetchPartnersParams, Partner } from "../../types/partner";
import ReferralManagementActions from "../referral-management/ReferralManagementActions";
import NotesTasksModal from "./NotesTasksModal";
import PartnerDetailsModal from "./PartnerDetailsModal";
import PartnerNetworkCard from "./PartnerNetworkCard";
import PartnerNetworkHeader from "./PartnerNetworkHeader";
import VisitHistoryModal from "./schedule-visits/history-modal/VisitHistoryModal";
import ScheduleVisits from "./schedule-visits/ScheduleVisits";
import { LoadingState } from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";

const PartnerNetwork = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
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
    filter: "allPractices",
  });

  const { data, isLoading } = useFetchPartners(params);
  const { data: singlePartnerData } = useFetchPartnerDetail(partnerEditId);

  const practices = data?.data || [];
  const stats = data;
  const totalPractices = stats?.totalPractices ?? 0;

  const handleOpen = () => {
    setIsPracticeEdit(false);
    setIsModalOpen(true);
  };

  const updateParams = useCallback(
    (newParams: Partial<FetchPartnersParams>) => {
      setParams((prev) => ({ ...prev, ...newParams, page: 1 }));
    },
    []
  );

  const handleFilterChange = (value: any) => {
    updateParams({ filter: value });
  };

  const handleSortChange = (value: any) => {
    updateParams({ sortBy: value });
  };

  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setParams((prev) => ({ ...prev, order }));
  };

  const HEADING_DATA_BUTTONS_LIST = useMemo(
    () => [
      {
        label: "Visit History",
        onClick: () => setIsHistoryModalOpen(true),
        icon: <TbArchive fontSize={15} />,
        variant: "ghost" as const,
        color: "default" as const,
        className: "border-small",
      },
      {
        label: "Add Practice",
        onClick: handleOpen,
        icon: <AiOutlinePlus fontSize={15} />,
        variant: "solid" as const,
        color: "primary" as const,
      },
    ],
    []
  );

  const STATS_CARD_DATA: StatCard[] = useMemo(
    () => [
      {
        icon: <LuBuilding2 className="text-[17px] mt-1 text-foreground/60" />,
        heading: "Total Practices",
        value: isLoading ? "..." : totalPractices,
        subheading: `${
          stats?.activePractices ? stats.activePractices : 0
        } active practices`,
      },
      {
        icon: <FiUsers className="text-[17px] mt-1 text-foreground/60" />,
        heading: "Total Referrals",
        value: isLoading ? "..." : stats?.totalReferrals ?? 0,
        subheading: `${
          stats?.monthlyReferrals ? stats.monthlyReferrals : 0
        } this month`,
      },
      {
        icon: <FiStar className="text-[17px] mt-1 text-foreground/60" />,
        heading: "A-Level Practices",
        value: isLoading ? "..." : stats?.totalALevelPractices ?? 0,
        subheading: `${
          stats?.aLevelPercentage ? stats.aLevelPercentage : 0
        }% of total`,
      },
    ],
    [isLoading, totalPractices, stats]
  );

  const handleOpenNotesTasksModal = (
    partnerId: string,
    partnerName: string
  ) => {
    setNotesTasksPartner({ id: partnerId, name: partnerName });
    setIsNotesTasksModalOpen(true);
  };

  const PARTNER_NETWORK_ACTIONS = useMemo(
    () => [
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
    ],
    []
  );

  const handleHistoryModalClose = useCallback(() => {
    setIsHistoryModalOpen(false);
  }, []);

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
            visibleItems={practices?.length}
            totalItems={totalPractices}
          />
        </div>
        <div className="flex flex-col gap-2 md:px-7 px-4 py-4 md:py-[31px] overflow-auto space-y-5">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-between">
              {STATS_CARD_DATA.map((data) => (
                <MiniStatsCard key={data.heading} cardData={data} />
              ))}
            </div>

            <div className="flex flex-col gap-4 border border-primary/15 rounded-xl p-4 bg-background/80">
              <div className="font-medium text-sm">Partner Practices</div>
              {isLoading && <LoadingState />}
              {!isLoading && practices.length === 0 && (
                <EmptyState title="No partners found with current filters." />
              )}

              {!isLoading &&
                practices.map((partner: Partner) => (
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
          <ScheduleVisits
            isHistoryModalOpen={isHistoryModalOpen}
            setIsHistoryModalOpen={setIsHistoryModalOpen}
          />
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
        onAddNote={() => console.log("Add note not implemented")}
        onAddTask={() => console.log("Add task not implemented")}
        onDeleteNote={() => console.log("Delete note not implemented")}
        onDeleteTask={() => console.log("Delete task not implemented")}
      />
    </>
  );
};

export default PartnerNetwork;
