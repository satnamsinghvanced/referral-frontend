import { Button, Input, Select, SelectItem } from "@heroui/react";
import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { PiFunnelX } from "react-icons/pi";
import EmptyState from "../../../components/common/EmptyState";
import { LoadingState } from "../../../components/common/LoadingState";
import Pagination from "../../../components/common/Pagination";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import { AUDIENCE_SEGMENT_STATUSES } from "../../../consts/campaign";
import { useDebouncedValue } from "../../../hooks/common/useDebouncedValue";
import {
  useAudiences,
  useCreateAudience,
  useDeleteAudience,
  useUpdateAudience,
} from "../../../hooks/useCampaign";
import {
  AudienceFilters,
  AudienceSegment,
  AudienceStatus,
  Segment,
} from "../../../types/campaign";
import SegmentCard from "./SegmentCard";
import CreateSegmentModal, {
  SegmentFormValues,
} from "./modal/CreateSegmentModal";
import BulkImportSegmentsModal from "./modal/BulkImportSegmentsModal";

const INITIAL_FILTERS: AudienceFilters = {
  page: 1,
  limit: 5,
  search: "",
  filter: "" as AudienceStatus,
};

const Audiences: React.FC = () => {
  const [currentFilters, setCurrentFilters] =
    useState<AudienceFilters>(INITIAL_FILTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<
    SegmentFormValues | undefined
  >(undefined);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [segmentToDeleteId, setSegmentToDeleteId] = useState<string | null>(
    null,
  );
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Debounce search
  const debouncedSearch = useDebouncedValue(currentFilters.search, 500);

  // Query
  const { data, isLoading } = useAudiences({
    ...currentFilters,
    search: debouncedSearch as string,
  });

  const createMutation = useCreateAudience();
  const updateMutation = useUpdateAudience();
  const deleteMutation = useDeleteAudience();
  const handleCreateSegment = (values: SegmentFormValues) => {
    const payload: Partial<AudienceSegment> = {
      name: values.name,
      description: values.description,
      type: values.audienceType as any,
      activity: values.lastActivity,
      location: values.location,
      status: (values.status as any) || "Active",
      tags: [] as string[],
    };

    if (values.practiceSize) payload.practiceSize = values.practiceSize;
    if (values.partnerLevel) payload.partnerLevel = values.partnerLevel;

    if (values._id) {
      updateMutation.mutate(
        { id: values._id, payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingSegment(undefined);
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleEdit = (segment: Segment) => {
    const audience = audiences.find((a) => a._id === segment.id);
    if (audience) {
      setEditingSegment({
        _id: audience._id,
        name: audience.name,
        description: audience.description,
        audienceType: audience.type,
        lastActivity: audience.activity || "",
        location: audience.location || "",
        practiceSize: audience.practiceSize,
        partnerLevel: audience.partnerLevel,
        status: audience.status,
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setSegmentToDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (segmentToDeleteId) {
      deleteMutation.mutate(segmentToDeleteId, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSegmentToDeleteId(null);
        },
      });
    }
  };

  const handleExport = (id: string) => {
    const audience = audiences.find((a) => a._id === id);
    if (audience) {
      const dataStr = JSON.stringify(audience, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `${audience.name
        .replace(/\s+/g, "_")
        .toLowerCase()}_segment.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleFilterChange = (key: keyof AudienceFilters, value: any) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const audiences = data?.audiences || [];
  const pagination = data?.pagination;

  const mapToSegment = (audience: AudienceSegment): Segment => ({
    id: audience._id as any,
    name: audience.name,
    description: audience.description,
    type: audience.type,
    status: audience.status.toLowerCase() as "active" | "inactive",
    contacts:
      (audience.referrers?.length || 0) +
      (audience.practices?.length || 0) +
      (audience.referrals?.length || 0),
    campaigns: 0,
    updatedAt: new Date(audience.updatedAt).toLocaleDateString(),
    tags: audience.tags || [],
    avgOpenRate: "0%",
    avgClickRate: "0%",
    size:
      (audience.referrers?.length || 0) +
      (audience.practices?.length || 0) +
      (audience.referrals?.length || 0),
  });

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-foreground/10 bg-background">
        <div data-slot="card-content" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative col-span-2">
                <Input
                  placeholder="Search segments..."
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
                selectedKeys={[currentFilters.filter as string]}
                disabledKeys={[currentFilters.filter as string]}
                onSelectionChange={(keys) =>
                  handleFilterChange("filter", Array.from(keys)[0] as string)
                }
              >
                <>
                  <SelectItem key="">All Statuses</SelectItem>
                  {AUDIENCE_SEGMENT_STATUSES.map((status) => (
                    <SelectItem key={status.value}>{status.label}</SelectItem>
                  ))}
                </>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                className="border-small flex-1"
                startContent={<PiFunnelX className="h-4 w-4" />}
                onPress={() => setCurrentFilters(INITIAL_FILTERS)}
              >
                Clear Filters
              </Button>

              {/* <Button
                size="sm"
                radius="sm"
                variant="ghost"
                color="default"
                className="border-small flex-1"
                startContent={<LuUpload className="size-3.5" />}
                onPress={() => setIsImportModalOpen(true)}
              >
                Import
              </Button> */}

              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                className="flex-1"
                startContent={<AiOutlinePlus className="size-[15px]" />}
                onPress={() => {
                  setEditingSegment(undefined);
                  setIsModalOpen(true);
                }}
              >
                Create Segment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CreateSegmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSegment(undefined);
        }}
        onSubmit={handleCreateSegment}
        initialValues={editingSegment}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <BulkImportSegmentsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSegmentToDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Audience Segment"
        description="Are you sure you want to delete this audience segment? This action cannot be undone."
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingState />
        </div>
      ) : audiences.length === 0 ? (
        <EmptyState
          title="No audience segments found"
          message="Create a new segment to get started."
        />
      ) : (
        <div className="space-y-4">
          {audiences.map((audience) => (
            <SegmentCard
              key={audience._id}
              segment={mapToSegment(audience)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExport={handleExport}
            />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          identifier="audiences"
          limit={currentFilters.limit as number}
          totalItems={pagination.totalCount}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          handlePageChange={(page) =>
            setCurrentFilters((prev) => ({ ...prev, page }))
          }
        />
      )}
    </div>
  );
};

export default Audiences;
