import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { PiFunnelX } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { LoadingState } from "../../../components/common/LoadingState";
import Pagination from "../../../components/common/Pagination";
import {
  CAMPAIGN_CATEGORIES,
  CAMPAIGN_STATUSES,
} from "../../../consts/campaign";
import {
  useArchiveCampaign,
  useCampaigns,
  useDeleteCampaign,
  useDuplicateCampaign,
} from "../../../hooks/useCampaign";
import { ICampaign, ICampaignFilters } from "../../../types/campaign";
import CampaignCard from "./CampaignCard";
import CampaignActionModal from "./modal/CampaignActionModal";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";

const CAMPAIGNS = [
  {
    id: 1,
    title: "New Referral Partner Outreach",
    subtitle: "Partnership Opportunity - Referral Retriever",
    recipients: 245,
    createdDate: "1/15/2024",
    status: "active",
    metrics: {
      sent: 245,
      openRate: "68.5%",
      clickRate: "24.3%",
      conversions: 12,
    },
    actions: ["Edit", "Duplicate", "Pause", "View Report", "Archive"],
  },
  {
    id: 2,
    title: "Patient Thank You Series",
    subtitle: "Thank you for choosing our practice!",
    recipients: 892,
    createdDate: "1/10/2024",
    status: "active",
    metrics: {
      sent: 892,
      openRate: "82.1%",
      clickRate: "31.7%",
      conversions: 45,
    },
    actions: ["Edit", "Duplicate", "Pause", "View Report", "Archive"],
  },
  {
    id: 3,
    title: "Monthly Practice Newsletter",
    subtitle: "January Updates & New Services",
    recipients: 1247,
    createdDate: "1/20/2024",
    scheduledDate: "2/1/2024",
    status: "scheduled",
    actions: ["Edit", "Duplicate", "View Report", "Archive"],
  },
  {
    id: 4,
    title: "Referral Partner Check-in",
    subtitle: "How can we better serve your patients?",
    recipients: 58,
    createdDate: "1/22/2024",
    status: "draft",
    actions: ["Edit", "Duplicate", "Send Now", "View Report", "Archive"],
  },
];

const INITIAL_FILTERS: ICampaignFilters = {
  page: 1,
  limit: 10,
  search: "",
  status: "" as any,
  category: "" as any,
};

const Campaigns = () => {
  const [currentFilters, setCurrentFilters] =
    useState<ICampaignFilters>(INITIAL_FILTERS);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<ICampaign | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

  const { data, isLoading } = useCampaigns(currentFilters);
  const deleteMutation = useDeleteCampaign();
  const archiveMutation = useArchiveCampaign();
  const duplicateMutation = useDuplicateCampaign();

  const handleFilterChange = (key: keyof ICampaignFilters, value: any) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleDelete = (id: string) => {
    setCampaignToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (campaignToDelete) {
      deleteMutation.mutate(
        { id: campaignToDelete },
        {
          onSuccess: () => {
            setIsDeleteModalOpen(false);
            setCampaignToDelete(null);
          },
        },
      );
    }
  };

  const handleArchive = (id: string) => {
    archiveMutation.mutate({ id });
  };

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate({ id });
  };

  const handleEdit = (campaign: ICampaign) => {
    setEditingCampaign(campaign);
    setIsActionModalOpen(true);
  };

  const campaigns = data?.campaigns || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-foreground/10 bg-background">
        <div data-slot="card-content" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Input
                placeholder="Search referrals..."
                size="sm"
                value={currentFilters.search as string}
                onValueChange={(value) =>
                  setCurrentFilters((prev) => ({ ...prev, search: value }))
                }
                startContent={
                  <FiSearch className="text-gray-600 dark:text-foreground/60" />
                }
              />
            </div>
            <Select
              aria-label="Statuses"
              placeholder="All Statuses"
              size="sm"
              selectedKeys={[currentFilters.status as string]}
              disabledKeys={[currentFilters.status as string]}
              onSelectionChange={(keys) =>
                handleFilterChange("status", Array.from(keys)[0] as string)
              }
            >
              <>
                <SelectItem key="all">All Statuses</SelectItem>
                {CAMPAIGN_STATUSES.map((status) => (
                  <SelectItem key={status.value}>{status.label}</SelectItem>
                ))}
              </>
            </Select>

            <Select
              aria-label="Categories"
              placeholder="All categories"
              size="sm"
              selectedKeys={[currentFilters.category as string]}
              disabledKeys={[currentFilters.category as string]}
              onSelectionChange={(keys) =>
                handleFilterChange("category", Array.from(keys)[0] as string)
              }
            >
              <>
                <SelectItem key="all">All Categories</SelectItem>
                {CAMPAIGN_CATEGORIES.map((source) => (
                  <SelectItem key={source.value}>{source.label}</SelectItem>
                ))}
              </>
            </Select>

            <div className="flex items-center gap-3">
              <Button
                onPress={() => setCurrentFilters(INITIAL_FILTERS)}
                size="sm"
                variant="ghost"
                color="default"
                className="border-small flex-1"
                startContent={<PiFunnelX className="h-4 w-4" />}
              >
                Clear Filters
              </Button>
              <Button
                onPress={() => {
                  setEditingCampaign(null);
                  setIsActionModalOpen(true);
                }}
                size="sm"
                variant="solid"
                color="primary"
                className="flex-1"
              >
                Create Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingState />
          </div>
        ) : campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onEdit={handleEdit}
              onArchive={handleArchive}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-foreground/50">
            No campaigns found matching your criteria.
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          identifier="campaigns"
          limit={currentFilters.limit as number}
          totalItems={pagination.totalCount || 0}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          handlePageChange={(page) =>
            setCurrentFilters((prev) => ({ ...prev, page }))
          }
        />
      )}

      <CampaignActionModal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setEditingCampaign(null);
        }}
        editingCampaign={editingCampaign}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Campaign"
        description="Are you sure you want to delete this campaign? This action cannot be undone."
      />
    </div>
  );
};

export default Campaigns;
