import { Button, Card, CardBody, CardHeader, addToast, Tooltip } from "@heroui/react";
import React, { useState } from "react";
import { FiEdit, FiPlus, FiLock } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { LuTrash2 } from "react-icons/lu";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import EmptyState from "../../../components/common/EmptyState";
import { useDeleteLocation, useFetchLocations } from "../../../hooks/settings/useLocation";
import { usePlanGuard } from "../../../hooks/usePlanGuard";
import { Location } from "../../../types/common";
import LocationActionModal from "./LocationActionModal";
import { LoadingState } from "../../../components/common/LoadingState";
import Pagination from "../../../components/common/Pagination";
import { usePaginationAdjustment } from "../../../hooks/common/usePaginationAdjustment";

const Locations: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editLocationId, setEditLocationId] = useState<string>("");
  const [deleteLocationId, setDeleteLocationId] = useState<string>("");
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const { data: locationsData, isLoading: locationsIsLoading } = useFetchLocations({ page, limit: LIMIT });
  const locations = locationsData?.data;
  const totalPages = locationsData?.totalPages || 1;
  const totalLocations = locationsData?.totalData || locations?.length || 0;
  
  const { getLimit, planName } = usePlanGuard();
  const maxLocations = getLimit("locations");
  const isLocationsLimitReached = maxLocations !== -1 && totalLocations >= maxLocations;

  usePaginationAdjustment({
    totalPages: totalPages,
    currentPage: page,
    onPageChange: (newPage) => setPage(newPage),
    isLoading: locationsIsLoading,
  });
  const { mutate: deleteLocation, isPending: deleteLocationIsPending } = useDeleteLocation();

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditLocationId("");
    setDeleteLocationId("");
  };

  const handleAddLocationClick = () => {
    if (isLocationsLimitReached) {
      addToast({
        title: "Location Limit Reached",
        description: `Your current plan allows up to ${maxLocations} location${maxLocations === 1 ? "" : "s"}. Please upgrade your plan to add more.`,
        color: "warning",
      });
      return;
    }
    setEditLocationId("");
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditLocationId(id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteLocationId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteLocation(deleteLocationId, {
      onSuccess: () => {
        handleCancel();
      },
    });
  };

  return (
    <>
      <Card className="rounded-xl shadow-none border border-foreground/10 bg-background">
        <CardHeader className="flex items-center justify-between gap-3 flex-wrap px-4 pt-4 pb-1">
          <div className="flex items-center gap-2">
            <GrLocation className="size-5" />
            <h4 className="text-base">Practice Locations</h4>
            {maxLocations !== -1 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {totalLocations} / {maxLocations}
              </span>
            )}
          </div>
          {!locationsIsLoading && (
            isLocationsLimitReached ? (
              <Tooltip
                content={`Plan limit reached (${totalLocations}/${maxLocations} locations). Upgrade plan to add more.`}
                placement="top"
              >
                <span>
                  <Button
                    size="sm"
                    radius="sm"
                    variant="flat"
                    color="default"
                    className="opacity-75"
                    onPress={handleAddLocationClick}
                  >
                    <FiLock className="size-[14px] text-amber-500" />
                    Add Location
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                onPress={handleAddLocationClick}
              >
                <FiPlus className="size-[15px]" />
                Add Location
              </Button>
            )
          )}
        </CardHeader>

        <CardBody className="p-4 space-y-3">
          {locationsIsLoading && (
            <div className="flex items-center justify-center min-h-[160px]">
              <LoadingState />
            </div>
          )}

          {!locationsIsLoading && (!locations || locations.length === 0) && (
            <EmptyState
              icon={<GrLocation className="h-6 w-6" />}
              title="No Practice Locations Found"
              message="Add your first practice location to get started."
            />
          )}
          {!locationsIsLoading && locations && locations?.length > 0 && (
            <div className="space-y-3">
              {locations?.map((loc: Location) => (
                <div
                  key={loc._id}
                  className="p-3 border border-foreground/10 rounded-lg flex items-start justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2 max-sm:flex-col-reverse max-sm:items-start">
                      <h4 className="font-medium text-sm">{loc.name}</h4>
                      {loc.isPrimary && (
                        <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-medium w-fit whitespace-nowrap shrink-0 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {`${loc.address.street}, ${loc.address.city}, ${loc.address.state}, ${loc.address.zipcode}`}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {loc.phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="bordered"
                      className="border-foreground/10 border-small"
                      onPress={() => loc._id && handleEdit(loc._id)}
                    >
                      <FiEdit className="size-3.5" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="bordered"
                      className="border-foreground/10 text-red-600 border-small"
                      onPress={() => loc._id && handleDeleteClick(loc._id)}
                    >
                      <LuTrash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              identifier="locations"
              totalItems={totalLocations}
              currentPage={page}
              totalPages={totalPages}
              handlePageChange={setPage}
            />
          )}
        </CardBody>
      </Card>

      <LocationActionModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        editLocationId={editLocationId}
        locationsCount={totalLocations}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onClose={handleCancel}
        isLoading={deleteLocationIsPending}
      />
    </>
  );
};

export default Locations;
