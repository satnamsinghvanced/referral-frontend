import { Button, Input, Pagination, Select, SelectItem } from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
  FiEdit,
  FiEye,
  FiFilter,
  FiStar,
  FiUsers,
  FiAlertTriangle,
  FiBell,
  FiSearch,
} from "react-icons/fi";
import { GrAscend, GrDescend } from "react-icons/gr";
import { IoDocumentOutline } from "react-icons/io5";
import { LuBuilding2 } from "react-icons/lu";
import { TbArchive } from "react-icons/tb";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { PARTNER_FILTERS, PARTNER_SORT_OPTIONS } from "../../consts/filters";
import {
  useFetchPartnerDetail,
  useFetchPartners,
} from "../../hooks/usePartner";
import { FetchPartnersParams, Partner } from "../../types/partner";
import NotesTasksModal from "./NotesTasksModal";
import PartnerDetailsModal from "./PartnerDetailsModal";
import PartnerNetworkCard from "./PartnerNetworkCard";
import PartnerNetworkHeader from "./PartnerNetworkHeader";
import ScheduleVisits from "./schedule-visits/ScheduleVisits";
import ReferrerActionsModal from "../referral-management/referrer-actions/ReferrerActionsModal";
import { useDebouncedValue } from "../../hooks/common/useDebouncedValue";

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
    search: "",
    sortBy: "name",
    order: "asc",
    filter: "allPractices",
  });

  const debouncedSearch = useDebouncedValue(params.search, 500);

  useEffect(() => {
    setParams((prev: any) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  const { data, isLoading } = useFetchPartners({
    ...params,
    search: debouncedSearch as string,
  });
  const { data: singlePartnerData } = useFetchPartnerDetail(partnerEditId);

  const practices = data?.data || [];
  const stoppedReferring = data?.stoppedReferring || []; // New data from updated types
  const stats = data;
  const totalPractices = stats?.totalPractices ?? 0;

  const handleOpen = () => {
    setPartnerEditId("");
    setIsPracticeEdit(false);
    setIsModalOpen(true);
  };

  const updateParams = useCallback(
    (newParams: Partial<FetchPartnersParams>) => {
      setParams((prev) => ({ ...prev, ...newParams, page: 1 }));
    },
    []
  );

  const handleOpenNotesTasksModal = (
    partnerId: string,
    partnerName: string
  ) => {
    setNotesTasksPartner({ id: partnerId, name: partnerName });
    setIsNotesTasksModalOpen(true);
  };

  // Helper to trigger action from the Alert Box
  const handleAlertAction = (partnerName: string) => {
    // Find the ID from the practices list by name
    const partner = practices.find((p) => p.name === partnerName);
    if (partner) {
      handleOpenNotesTasksModal(partner._id, partner.name);
    } else {
      // Fallback if ID isn't in current page: you might need the API to return the ID in stoppedReferring
      console.warn("Partner ID not found in current list");
    }
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
        icon: <LuBuilding2 className="text-foreground/60" />,
        heading: "Total Practices",
        value: isLoading ? "..." : totalPractices,
        subheading: `${stats?.activePractices ?? 0} active practices`,
      },
      {
        icon: <FiUsers className="text-foreground/60" />,
        heading: "Total Referrals",
        value: isLoading ? "..." : stats?.totalReferrals ?? 0,
        subheading: `${stats?.monthlyReferrals ?? 0} this month`,
      },
      {
        icon: <FiStar className="text-foreground/60" />,
        heading: "A-Level Practices",
        value: isLoading ? "..." : stats?.totalALevelPractices ?? 0,
        subheading: `${stats?.aLevelPercentage ?? 0}% of total`,
      },
    ],
    [isLoading, totalPractices, stats]
  );

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
        className: "text-orange-600 hover:!bg-orange-50",
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
          setIsPracticeEdit(true);
          setIsModalOpen(true);
        },
        icon: <FiEdit className="size-3.5" />,
        variant: "light" as const,
        color: "success" as const,
      },
    ],
    []
  );

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="sticky top-0 bg-background text-foreground z-10">
          <PartnerNetworkHeader
            heading="Partner Network"
            subHeading="Manage relationships with referring practices"
            buttons={HEADING_DATA_BUTTONS_LIST}
          />
        </div>

        <div className="flex flex-col md:p-6 p-4 overflow-auto space-y-4 md:space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-between">
            {STATS_CARD_DATA.map((data) => (
              <MiniStatsCard key={data.heading} cardData={data} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            <div className="space-y-5">
              {/* --- STOPPED REFERRALS ALERT BOX --- */}
              {stoppedReferring.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-red-100 rounded-full">
                      <FiAlertTriangle className="text-red-500 size-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-red-900 font-medium text-sm">
                        Referrer Alert: {stoppedReferring.length} Partners
                        Stopped Referring
                      </h4>
                      <p className="text-red-700 text-xs">
                        Your top-tier partners have not sent any referrals in
                        over 2 months. Immediate action recommended.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {stoppedReferring.map((partner, index) => (
                      <div
                        key={index}
                        className="bg-white border border-red-200 rounded-lg p-2.5 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <p className="font-medium text-sm text-red-900">
                            {partner.name}
                          </p>
                          <p className="text-xs text-red-700">
                            Last referral:{" "}
                            {new Date(
                              partner.lastReferralDate
                            ).toLocaleDateString()}{" "}
                            ({partner.totalDays} days ago)
                          </p>
                        </div>
                        <Button
                          size="sm"
                          radius="sm"
                          variant="bordered"
                          color="danger"
                          className="bg-white border-small"
                          startContent={<FiBell className="size-3.5" />}
                          onPress={() => handleAlertAction(partner.name)}
                        >
                          Take Action
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- PARTNER PRACTICES LIST --- */}
              <div className="bg-background flex flex-col gap-4 border border-primary/15 rounded-xl p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Partner Practices</h4>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        size="sm"
                        variant="flat"
                        placeholder="Search partner practices..."
                        value={params.search as string}
                        onValueChange={(value: string) =>
                          updateParams({ search: value })
                        }
                        className="text-xs min-w-fit"
                        startContent={
                          <FiSearch className="text-gray-400 h-4 w-4" />
                        }
                        fullWidth
                      />
                      <Select
                        aria-label="Practice Type"
                        placeholder="Practice Type"
                        size="sm"
                        radius="sm"
                        selectedKeys={[params.filter as string]}
                        onSelectionChange={(keys) =>
                          updateParams({
                            filter: Array.from(keys)[0] as string,
                          })
                        }
                        className="md:min-w-[200px] flex-1"
                      >
                        {PARTNER_FILTERS.map((opt) => (
                          <SelectItem key={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 col-span-4 md:col-span-auto">
                          <span className="text-xs text-gray-600 whitespace-nowrap max-md:hidden">
                            Sort by:
                          </span>
                          <Select
                            aria-label="Sort By"
                            placeholder="Sort By"
                            size="sm"
                            radius="sm"
                            selectedKeys={[params.sortBy as string]}
                            onSelectionChange={(keys) =>
                              updateParams({
                                sortBy: Array.from(keys)[0] as string,
                              })
                            }
                            className="md:min-w-[140px] flex-1"
                          >
                            {PARTNER_SORT_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          isIconOnly
                          onPress={() => {
                            setSortOrder((prev) =>
                              prev === "asc" ? "desc" : "asc"
                            );
                            updateParams({
                              order: sortOrder,
                            });
                          }}
                          title={
                            sortOrder === "asc"
                              ? "Sort Ascending"
                              : "Sort Descending"
                          }
                          className="border-small col-span-2 md:min-w-auto"
                        >
                          {sortOrder === "asc" ? <GrAscend /> : <GrDescend />}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600">
                        {`Showing ${practices.length} of ${totalPractices} practices`}
                      </p>
                    </div>
                  </div>
                </div>

                {isLoading && <LoadingState />}

                {!isLoading && practices.length === 0 && (
                  <EmptyState title="No partners found with current filters. Try adjusting your search or filters." />
                )}

                {!isLoading && (
                  <div className="space-y-3">
                    {practices.map((partner: Partner) => (
                      <PartnerNetworkCard
                        key={partner._id}
                        partner={partner}
                        actions={PARTNER_NETWORK_ACTIONS}
                      />
                    ))}
                  </div>
                )}

                {stats?.totalPages && stats.totalPages > 1 && (
                  <Pagination
                    showControls
                    size="sm"
                    radius="sm"
                    page={params.page as number}
                    onChange={(page) =>
                      setParams((prev) => ({ ...prev, page }))
                    }
                    total={stats.totalPages}
                    classNames={{
                      base: "flex justify-center py-3",
                      wrapper: "gap-1.5",
                    }}
                  />
                )}
              </div>
            </div>

            <ScheduleVisits
              isHistoryModalOpen={isHistoryModalOpen}
              setIsHistoryModalOpen={setIsHistoryModalOpen}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReferrerActionsModal
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
          setIsPracticeEdit(true);
          setIsViewModalOpen(false);
          setIsModalOpen(true);
        }}
      />

      <NotesTasksModal
        isOpen={isNotesTasksModalOpen}
        onClose={() => setIsNotesTasksModalOpen(false)}
        practice={notesTasksPartner}
      />
    </>
  );
};

export default PartnerNetwork;
