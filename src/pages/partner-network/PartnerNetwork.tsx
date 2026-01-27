import { Button, Input, Pagination, Select, SelectItem } from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
  FiAlertTriangle,
  FiBell,
  FiEdit,
  FiEye,
  FiSearch,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { GrAscend, GrDescend } from "react-icons/gr";
import { IoDocumentOutline } from "react-icons/io5";
import { LuBuilding2 } from "react-icons/lu";
import { TbArchive } from "react-icons/tb";
import MiniStatsCard, { StatCard } from "../../components/cards/MiniStatsCard";
import ComponentContainer from "../../components/common/ComponentContainer";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import { PARTNER_FILTERS, PARTNER_SORT_OPTIONS } from "../../consts/filters";
import { useDebouncedValue } from "../../hooks/common/useDebouncedValue";
import {
  useFetchPartnerDetail,
  useFetchPartners,
} from "../../hooks/usePartner";
import { FetchPartnersParams, Partner } from "../../types/partner";
import ReferrerActionsModal from "../referral-management/referrer-actions/ReferrerActionsModal";
import NotesTasksModal from "./NotesTasksModal";
import PartnerDetailsModal from "./PartnerDetailsModal";
import PartnerNetworkCard from "./PartnerNetworkCard";
import ScheduleVisits from "./schedule-visits/ScheduleVisits";
import { EVEN_PAGINATION_LIMIT } from "../../consts/consts";

const PartnerNetwork = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPracticeEdit, setIsPracticeEdit] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [partnerEditId, setPartnerEditId] = useState("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    null,
  );

  const [isNotesTasksModalOpen, setIsNotesTasksModalOpen] = useState(false);
  const [notesTasksPartner, setNotesTasksPartner] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [params, setParams] = useState<Required<FetchPartnersParams>>({
    page: 1,
    limit: EVEN_PAGINATION_LIMIT,
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

  const handleFieldChange = useCallback((key: string, value: any) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      [key]: value,
    }));
  }, []);

  const handleOpenNotesTasksModal = (
    partnerId: string,
    partnerName: string,
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
        className: "bg-primary text-white",
      },
    ],
    [],
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
        value: isLoading ? "..." : (stats?.totalReferrals ?? 0),
        subheading: `${stats?.monthlyReferrals ?? 0} this month`,
      },
      {
        icon: <FiStar className="text-foreground/60" />,
        heading: "A-Level Practices",
        value: isLoading ? "..." : (stats?.totalALevelPractices ?? 0),
        subheading: `${stats?.aLevelPercentage ?? 0}% of total`,
      },
    ],
    [isLoading, totalPractices, stats],
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
        className:
          "text-orange-600 hover:!bg-orange-50 dark:hover:!bg-orange-500/20",
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
    [],
  );

  return (
    <>
      <ComponentContainer
        headingData={{
          heading: "Partner Network",
          subHeading: "Manage relationships with referring practices",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 justify-between">
          {STATS_CARD_DATA.map((data) => (
            <MiniStatsCard key={data.heading} cardData={data} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 items-start gap-4">
          <div className="space-y-5">
            {/* --- STOPPED REFERRALS ALERT BOX --- */}
            {stoppedReferring.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/30 rounded-xl p-4 space-y-3.5">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <FiAlertTriangle className="text-red-500 dark:text-red-400 size-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-red-900 dark:text-red-200 font-medium text-sm">
                      Referrer Alert: {stoppedReferring.length} Partners Stopped
                      Referring
                    </h4>
                    <p className="text-red-700 dark:text-red-300/80 text-xs">
                      Your top-tier partners have not sent any referrals in over
                      2 months. Immediate action recommended.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {stoppedReferring.map((partner, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-default-100/20 border border-red-200 dark:border-red-500/30 rounded-lg p-2.5 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <p className="font-medium text-sm text-red-900 dark:text-red-200">
                          {partner.name}
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-300/80">
                          Last referral:{" "}
                          {new Date(
                            partner.lastReferralDate,
                          ).toLocaleDateString()}{" "}
                          ({partner.totalDays} days ago)
                        </p>
                      </div>
                      <Button
                        size="sm"
                        radius="sm"
                        variant="bordered"
                        color="danger"
                        className="bg-white dark:bg-default-100/20 border-small dark:border-red-500/30 text-red-600 dark:text-red-400"
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
            <div className="bg-background flex flex-col gap-4 border border-foreground/10 rounded-xl p-4 shadow-none">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Partner Practices</h4>
                </div>

                <div className="space-y-3">
                  <div className="md:flex md:items-center md:gap-3 max-md:space-y-3">
                    <Input
                      size="sm"
                      variant="flat"
                      placeholder="Search partner practices..."
                      value={params.search}
                      onValueChange={(value: string) =>
                        handleFieldChange("search", value)
                      }
                      className="text-xs min-w-fit"
                      startContent={
                        <FiSearch className="text-gray-400 dark:text-foreground/40 h-4 w-4" />
                      }
                      fullWidth
                    />
                    <Select
                      aria-label="Practice Type"
                      placeholder="Practice Type"
                      size="sm"
                      radius="sm"
                      selectedKeys={[params.filter]}
                      disabledKeys={[params.filter]}
                      onSelectionChange={(keys) =>
                        handleFieldChange(
                          "filter",
                          Array.from(keys)[0] as string,
                        )
                      }
                      className="md:min-w-[200px] flex-1"
                    >
                      {PARTNER_FILTERS.map((opt) => (
                        <SelectItem key={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 max-md:w-full">
                      <div className="flex items-center gap-2 max-md:w-full">
                        <span className="text-xs text-gray-600 dark:text-foreground/60 whitespace-nowrap max-md:hidden">
                          Sort by:
                        </span>
                        <Select
                          aria-label="Sort By"
                          placeholder="Sort By"
                          size="sm"
                          radius="sm"
                          selectedKeys={[params.sortBy]}
                          disabledKeys={[params.sortBy]}
                          onSelectionChange={(keys) =>
                            handleFieldChange(
                              "sortBy",
                              Array.from(keys)[0] as string,
                            )
                          }
                          className="md:min-w-[140px] flex-1"
                        >
                          {PARTNER_SORT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </Select>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        isIconOnly
                        onPress={() => {
                          setSortOrder((prev) =>
                            prev === "asc" ? "desc" : "asc",
                          );
                          handleFieldChange(
                            "order",
                            sortOrder === "asc" ? "desc" : "asc",
                          );
                        }}
                        title={
                          sortOrder === "asc"
                            ? "Sort Ascending"
                            : "Sort Descending"
                        }
                        className="border-small dark:border-default-200 col-span-2 md:min-w-auto dark:text-foreground/80"
                      >
                        {sortOrder === "asc" ? <GrAscend /> : <GrDescend />}
                      </Button>
                    </div>
                    {stats?.totalPages && stats.totalPages > 1 && (
                      <p className="text-xs text-gray-600 dark:text-foreground/60">
                        {`Showing ${params.limit * (params.page - 1) + 1} - ${
                          params.limit * params.page > totalPractices
                            ? totalPractices
                            : params.limit * params.page
                        } of ${totalPractices} practices`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isLoading && <LoadingState />}

              {!isLoading && practices.length === 0 && (
                <EmptyState title="No partners found with current filters. Try adjusting your search or filters." />
              )}

              {!isLoading ? (
                <div className="space-y-3">
                  {practices.map((partner: Partner) => (
                    <PartnerNetworkCard
                      key={partner._id}
                      partner={partner}
                      actions={PARTNER_NETWORK_ACTIONS}
                    />
                  ))}
                </div>
              ) : (
                ""
              )}

              {stats?.totalPages && stats.totalPages > 1 ? (
                <Pagination
                  showControls
                  size="sm"
                  radius="sm"
                  page={params.page}
                  onChange={(page) => handleFieldChange("page", page)}
                  total={stats.totalPages}
                  classNames={{
                    base: "flex justify-center py-3",
                    wrapper: "gap-1.5",
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
      </ComponentContainer>

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
