import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import React from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import { LuFilter } from "react-icons/lu";
import LevelChip from "../../../../components/chips/LevelChip";
import { Partner, SelectReferrersTabProps } from "../../../../types/partner";

export const SelectReferrersTab: React.FC<SelectReferrersTabProps> = ({
  filters,
  setFilters,
  selectedReferrersState,
  handleReferrerToggle,
  handleSelectAll,
  handleClearAll,
  showRoutePreview,
  setShowRoutePreview,
  practices,
  categoryOptions,
  mockOptimizedRouteData,
  data,
}) => {
  // --- Filtering and Data Calculation Logic ---
  const filteredReferrers = practices.filter(
    (r: Partner) =>
      r.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.category === "" || r.level === filters.category)
  );

  const selectedReferrerObjects: Partner[] = practices.filter((r: Partner) =>
    selectedReferrersState.includes(r._id)
  );

  return (
    <div className="space-y-3 h-full">
      <div className="flex justify-between items-center text-sm gap-2.5 px-1">
        <Input
          placeholder="Search referrers..."
          size="sm"
          fullWidth
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          classNames={{
            inputWrapper: "border-none shadow-none bg-gray-100",
          }}
          startContent={<IoSearch className="text-gray-400 text-base" />}
        />
        <Select
          key="Categories"
          size="sm"
          radius="sm"
          aria-label="Categories"
          selectedKeys={[filters.category]}
          onSelectionChange={(keys: any) => {
            const category = Array.from(keys).join("") as string;
            setFilters({ ...filters, category });
          }}
          className="w-[220px]"
          classNames={{ value: "text-xs" }}
          startContent={<LuFilter className="text-gray-400 text-base" />}
        >
          <>
            <SelectItem key="" classNames={{ title: "text-xs" }}>
              All Categories
            </SelectItem>
            {categoryOptions.map((opt: any) => (
              <SelectItem key={opt._id} classNames={{ title: "text-xs" }}>
                {opt.shortTitle}
              </SelectItem>
            ))}
          </>
        </Select>
      </div>

      <div className="flex justify-between items-center text-xs px-1">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="border-small"
            onPress={handleSelectAll}
          >
            Select All ({filteredReferrers.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="border-small"
            onPress={handleClearAll}
          >
            Clear All
          </Button>
        </div>
        <p className="">
          <span>{selectedReferrersState.length}</span> of {practices.length}{" "}
          referrers selected
        </p>
      </div>

      {selectedReferrerObjects.length > 0 && (
        <Card className="shadow-none border border-primary/15 bg-blue-50/50">
          <CardHeader className="flex items-center justify-between pt-4 px-4 pb-0">
            <p className="font-medium text-sm">
              Selected Referrers ({selectedReferrerObjects.length})
            </p>
            {/* <Button
              size="sm"
              variant="ghost"
              className="min-w-fit border-small"
              onPress={() => setShowRoutePreview(!showRoutePreview)}
              isDisabled={selectedReferrerObjects.length < 2}
              startContent={<FaRegMap />}
            >
              {showRoutePreview ? "Hide Route Preview" : "Show Route Preview"}
            </Button> */}
          </CardHeader>
          <CardBody className="pt-3 pb-4 px-4 space-y-3">
            {selectedReferrerObjects.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {selectedReferrerObjects.map((r, index) => (
                  <div
                    key={r._id}
                    className="bg-background border border-primary/15 rounded-md p-2 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="min-h-[18px] min-w-[18px] size-[18px] rounded-full bg-primary text-white inline-flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <div className="text-xs">
                        <p>{r.name}</p>
                        <p className="text-gray-600">
                          {r.address.addressLine1}, {r.address.city}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      radius="sm"
                      isIconOnly
                      className="size-5 min-w-auto border-none"
                      onPress={() => handleReferrerToggle(r._id)}
                    >
                      <IoClose />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* <div className="flex justify-around items-center bg-background border border-primary/15 rounded-md p-3">
              <div className="text-center">
                <p className="text-sm font-semibold text-primary">
                  {selectedReferrerObjects.length}
                </p>
                <p className="text-xs text-gray-600">Referrers</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-primary">
                  {estTotalTime}
                </p>
                <p className="text-xs text-gray-600">Est. Time</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-primary">
                  {estDistance}
                </p>
                <p className="text-xs text-gray-600">Est. Miles</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-primary">
                  {mileageCost}
                </p>
                <p className="text-xs text-gray-600">Mileage Cost</p>
              </div>
            </div> */}
          </CardBody>
        </Card>
      )}

      {/* {showRoutePreview && selectedReferrerObjects.length >= 2 && (
        <Card className="shadow-none border border-primary/15 mt-4">
          <CardBody className="p-4 space-y-3">
            <p className="font-medium text-sm">Optimized Route Preview</p>
            <div className="">
              {routePreviewData.map((stop, index) => (
                <div key={stop.id} className="flex items-start space-x-3">
                  <div className="flex flex-col items-center">
                    <div className="size-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    {index < routePreviewData.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{stop.name}</p>
                    <p className="text-xs text-gray-500">{stop.address}</p>
                    <div className="flex space-x-3 text-[11px] text-gray-600 mt-1">
                      <span>Arrive: {stop.arrive}</span>
                      <span>Depart: {stop.depart}</span>
                      {stop.miles > 0 && (
                        <>
                          <span>• {stop.driveMin.toFixed(1)}min drive</span>
                          <span>• {stop.miles.toFixed(1)}mi</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )} */}

      <div className="space-y-3 max-h-80 overflow-y-auto p-1 pr-2">
        {filteredReferrers.map((r) => (
          <Card
            key={r._id}
            className={`border border-primary/15 shadow-none cursor-pointer w-full ${
              selectedReferrersState.includes(r._id)
                ? "outline-2 outline-primary bg-primary/5"
                : "outline-none hover:bg-gray-50"
            }`}
            isPressable
            onPress={() => handleReferrerToggle(r._id)}
            disableRipple
          >
            <CardBody className="p-3 flex justify-between items-center flex-row">
              <div className="flex items-center space-x-3">
                <Checkbox
                  isSelected={selectedReferrersState.includes(r._id)}
                  onValueChange={() => handleReferrerToggle(r._id)}
                  size="sm"
                  className="pointer-events-none"
                />
                <div>
                  <p className="text-sm">{r.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {r.address.addressLine1}, {r.address.city}
                  </p>
                  <div className="flex items-center sapce-x-2 mt-0.5">
                    <p className="text-xs text-gray-500">{r.phone}</p>
                    {r.totalReferrals > 0 && (
                      <p className="text-xs text-gray-500">
                        {r.totalReferrals} Referrals
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <LevelChip level={r.level.toLowerCase()} />
            </CardBody>
          </Card>
        ))}
        {filteredReferrers.length === 0 && (
          <p className="text-center text-gray-500 pt-5">
            No referrers match the current filters.
          </p>
        )}
      </div>
    </div>
  );
};
