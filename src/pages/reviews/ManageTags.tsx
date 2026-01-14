import { Button, Chip, Progress, useDisclosure } from "@heroui/react";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiCheck, FiCopy, FiSmartphone } from "react-icons/fi";
import { LuNfc, LuQrCode, LuTrash2 } from "react-icons/lu";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import EmptyState from "../../components/common/EmptyState";
import { LoadingState } from "../../components/common/LoadingState";
import Pagination from "../../components/common/Pagination";

import { Link } from "react-router-dom";
import { useFetchLocations } from "../../hooks/settings/useLocation";
import { useFetchTeamMembers } from "../../hooks/settings/useTeam";
import {
  useDeleteNFCDesk,
  useFetchNFCDesks,
  useUpdateNFCDesk,
} from "../../hooks/useNFCDesk";
import { NFCDeskCard } from "../../types/nfcDesk";
import CreateTagModal from "./modal/CreateTagModal";
import TagQrModal from "./modal/TagQrModal";

const ManageTags = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedQrTag, setSelectedQrTag] = useState<NFCDeskCard | null>(null);
  const isDeleteModalOpen = !!deleteId;

  const { data: nfcProps, isLoading: isDesksLoading } = useFetchNFCDesks(
    currentPage,
    9
  );
  const { data: locationsProps, isLoading: isLocationsLoading } =
    useFetchLocations();
  const { data: teamProps, isLoading: isTeamLoading } = useFetchTeamMembers();

  const deleteMutation = useDeleteNFCDesk();
  const updateMutation = useUpdateNFCDesk();

  const tags = nfcProps?.data || [];
  const tagsStats = nfcProps?.stats || {};

  const locations =
    locationsProps?.data ||
    (Array.isArray(locationsProps) ? locationsProps : []);
  const teamMembers = teamProps?.data || [];
  const pagination = nfcProps
    ? {
        totalDocs: nfcProps.totalDocs,
        totalPages: nfcProps.totalPages,
        page: nfcProps.page,
        limit: nfcProps.limit,
      }
    : null;

  const isLoading = isDesksLoading || isLocationsLoading || isTeamLoading;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
  };

  const handleToggleStatus = async (tag: NFCDeskCard) => {
    const newStatus = tag.status === "active" ? "inActive" : "active";
    try {
      await updateMutation.mutateAsync({
        id: tag._id,
        payload: { status: newStatus },
      });
    } catch (error) {
      console.error("Error updating tag status:", error);
    }
  };

  const getLocationNames = (locations: { _id: string; name: string }[]) => {
    if (!locations || locations.length === 0) return "No Location";
    const names = locations.map((location) => location?.name);
    return names.length > 0 ? names.join(", ") : "Unknown Location";
  };

  const hasLocations = locations.length > 0;
  const hasTeamMembers = teamMembers.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-primary/15 bg-background p-4 rounded-xl space-y-5">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-base">NFC Tags & QR Codes</h3>
            <p className="text-xs text-gray-600">
              Create and manage review collection tags for your practice
              locations
            </p>
          </div>
          {hasLocations && hasTeamMembers && (
            <Button
              size="sm"
              radius="sm"
              variant="solid"
              color="primary"
              onPress={onOpen}
              startContent={<AiOutlinePlus className="text-[15px]" />}
            >
              Create New Tag/QR
            </Button>
          )}
        </div>

        {/* Warning Banners */}
        {!isLoading && !hasLocations && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
            <p className="text-sm text-yellow-800">
              Locations are not added. Please add at least one location to
              create NFC tags.
            </p>
            <Button
              as={Link}
              to="/settings/locations"
              size="sm"
              color="warning"
              variant="flat"
              className="bg-yellow-200 text-yellow-800"
            >
              Add Location
            </Button>
          </div>
        )}

        {!isLoading && hasLocations && !hasTeamMembers && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
            <p className="text-sm text-yellow-800">
              No team members found in your locations. Please add team members
              to create NFC tags.
            </p>
            <Button
              as={Link}
              to="/settings/team"
              size="sm"
              color="warning"
              variant="flat"
              className="bg-yellow-200 text-yellow-800"
            >
              Add Team Member
            </Button>
          </div>
        )}

        {/* Tags Grid or States */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingState />
          </div>
        ) : tags.length === 0 ? (
          <EmptyState
            title="No NFC/QR Tags Found"
            message="Create your first review collection tag to start collecting patient feedback."
            icon={<LuNfc size={32} className="text-primary-500" />}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {tags?.map((tag: NFCDeskCard) => (
                <div
                  className="bg-white rounded-xl border border-primary/15 p-4 flex flex-col gap-5"
                  key={tag._id}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <div className={`mt-1`}>
                        {tag.type.toLowerCase() === "nfc" ? (
                          <LuNfc className="text-blue-500 text-xl" />
                        ) : (
                          <LuQrCode className="text-blue-500 text-xl" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="font-medium">{tag.name}</h4>
                        <p className="text-xs text-gray-500">
                          {getLocationNames(tag.locations)}
                        </p>
                      </div>
                    </div>
                    <Chip
                      size="sm"
                      radius="sm"
                      variant="solid"
                      color={tag.status === "active" ? "success" : "danger"}
                      className={`${
                        tag.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      } text-[11px] h-5`}
                    >
                      {tag.status === "active" ? "Active" : "Inactive"}
                    </Chip>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-sky-50 rounded-lg p-3 text-center space-y-0.5">
                      <div className="text-xl font-bold text-sky-600">
                        {tag.totalTap}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        Taps
                      </div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 text-center space-y-0.5">
                      <div className="text-xl font-bold text-emerald-600">
                        {tag.totalReview}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        Reviews
                      </div>
                    </div>
                  </div>

                  {/* Conversion Rate */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-gray-500">
                      <span>Conversion Rate</span>
                      <span className="text-gray-900">
                        {tag.conversionRate}%
                      </span>
                    </div>
                    <Progress
                      aria-label="Conversion rate"
                      value={tag.conversionRate}
                      size="sm"
                      color="primary"
                      classNames={{ track: "bg-gray-100 h-2" }}
                    />
                  </div>

                  {/* URL */}
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-2.5 flex items-end justify-between">
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="text-[11px] text-gray-500">
                        Review URL
                      </div>
                      <div className="text-xs text-gray-700 font-medium truncate">
                        {tag.url}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      radius="sm"
                      variant="light"
                      color={copiedId === tag._id ? "success" : "default"}
                      onPress={() => handleCopy(tag._id, tag.url)}
                      startContent={
                        copiedId === tag._id ? (
                          <FiCheck size={14} />
                        ) : (
                          <FiCopy size={14} />
                        )
                      }
                      className="min-w-auto size-8 p-0"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>Created:</span>
                      <span>
                        {new Date(tag.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {tag.lastScan && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>Last used:</span>
                        <span>
                          {new Date(tag.lastScan).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>ID:</span>
                      <span className="uppercase">{tag.Id}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    {tag.type.toLowerCase() === "nfc" ? (
                      <Button
                        size="sm"
                        radius="sm"
                        variant="ghost"
                        color="default"
                        className="border-small w-full"
                        startContent={<FiSmartphone fontSize={14} />}
                      >
                        Write to NFC
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        radius="sm"
                        variant="ghost"
                        color="default"
                        className="border-small w-full"
                        startContent={<LuQrCode fontSize={14} />}
                        onPress={() => setSelectedQrTag(tag)}
                      >
                        Open QR
                      </Button>
                    )}
                    <Button
                      size="sm"
                      radius="sm"
                      variant="ghost"
                      color="default"
                      className="border-small min-w-[100px]"
                      onPress={() => handleToggleStatus(tag)}
                    >
                      {tag.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      radius="sm"
                      variant="ghost"
                      color="default"
                      className="border-small"
                      isIconOnly
                      onPress={() => handleDelete(tag._id)}
                    >
                      <LuTrash2 className="text-sm text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <Pagination
                identifier="nfc/qr tags"
                items={tags}
                totalItems={pagination.totalDocs}
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                handlePageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
      {/* Overall Performance */}
      <div className="border border-primary/15 bg-background p-4 rounded-xl space-y-4">
        <h4 className="flex items-center gap-2 text-sm">
          <FiSmartphone size={16} />
          Overall Performance
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsBox
            label="Total Tags"
            value={tagsStats?.totalTags || 0}
            bg="bg-sky-50"
            text="text-sky-600"
          />
          <StatsBox
            label="Total Interactions"
            value={tagsStats?.totalInteractions || 0}
            bg="bg-emerald-50"
            text="text-emerald-600"
          />
          <StatsBox
            label="Total Reviews"
            value={tagsStats?.totalReview || 0}
            bg="bg-orange-50"
            text="text-orange-600"
          />
          <StatsBox
            label="Avg. Conversion"
            value={`${tagsStats?.conversionRate}%`}
            bg="bg-purple-50"
            text="text-purple-600"
          />
        </div>
      </div>

      <CreateTagModal isOpen={isOpen} onClose={onClose} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        title="Delete NFC/QR Tag"
        description="Are you sure you want to delete this tag? This action cannot be undone and patients will no longer be directed to your review page using this tag."
      />

      <TagQrModal
        isOpen={!!selectedQrTag}
        onClose={() => setSelectedQrTag(null)}
        tag={selectedQrTag}
      />
    </div>
  );
};

const StatsBox = ({
  label,
  value,
  bg,
  text,
}: {
  label: string;
  value: string | number;
  bg: string;
  text: string;
}) => (
  <div
    className={`${bg} rounded-xl p-4 flex flex-col items-center justify-center gap-0.5`}
  >
    <div className={`text-xl font-bold ${text}`}>{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

export default ManageTags;
