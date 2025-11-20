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
import { CATEGORY_OPTIONS } from "../../../../consts/filters";
import { FilterState, Partner } from "../../../../types/partner";

export interface SelectReferrersTabProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedReferrersState: string[];
  handleReferrerToggle: (id: string) => void;
  handleSelectAll: () => void;
  handleClearAll: () => void;
  practices: Partner[];
}

export const SelectReferrersTab: React.FC<SelectReferrersTabProps> = ({
  filters,
  setFilters,
  selectedReferrersState,
  handleReferrerToggle,
  handleSelectAll,
  handleClearAll,
  practices,
}) => {
  const filteredReferrers = practices.filter(
    (r: Partner) =>
      r.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.category === "" || r.level === filters.category)
  );

  const selectedReferrerObjects: Partner[] = practices.filter((r: Partner) =>
    selectedReferrersState?.includes(r._id)
  );

  return (
    <div className="space-y-3 h-full">
      <div className="flex justify-between items-center text-sm gap-2.5 px-1">
        {/* ... (Search Input and Select component remains unchanged) ... */}
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
          disabledKeys={[filters.category]}
          onSelectionChange={(keys: any) => {
            const category = Array.from(keys).join("") as string;
            setFilters({ ...filters, category });
          }}
          className="w-[220px]"
          // classNames={{ value: "text-xs" }}
          startContent={<LuFilter className="text-gray-400 text-base" />}
        >
          <>
            <SelectItem key="">All Categories</SelectItem>
            {CATEGORY_OPTIONS.map((opt: any) => (
              <SelectItem key={opt._id}>{opt.shortTitle}</SelectItem>
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
        <p>
          <span>{selectedReferrersState?.length}</span> of {practices.length}{" "}
          referrers selected
        </p>
      </div>

      {selectedReferrerObjects.length > 0 && (
        <Card className="shadow-none border border-primary/15 bg-blue-50/50">
          <CardHeader className="flex items-center justify-between pt-4 px-4 pb-0">
            <p className="font-medium text-sm">
              Selected Referrers ({selectedReferrerObjects.length})
            </p>
            {/* Removed commented-out Button */}
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
                      <div className="text-xs space-y-0.5">
                        <p className="font-medium">{r.name}</p>
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
                      className="min-w-5 min-h-5 size-5 border-none"
                      onPress={() => handleReferrerToggle(r._id)}
                    >
                      <IoClose />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Removed commented-out Route Preview Card */}

      <div className="space-y-3 max-h-80 overflow-y-auto p-1 pr-2">
        {filteredReferrers.map((r) => {
          return (
            <Card
              key={r._id}
              className={`border border-primary/15 shadow-none cursor-pointer w-full ${
                selectedReferrersState?.includes(r._id)
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
                    isSelected={selectedReferrersState?.includes(r._id)}
                    onValueChange={() => handleReferrerToggle(r._id)}
                    size="sm"
                    className="pointer-events-none"
                  />
                  <div>
                    <p className="text-sm">{r.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {r.address.addressLine1}, {r.address.city}
                    </p>
                    <div className="flex items-center sapce-x-2 mt-0.5">
                      <p className="text-xs text-gray-600">{r.phone}</p>
                      {r.totalReferrals > 0 && (
                        <p className="text-xs text-gray-600 ml-2">
                          • {r.totalReferrals} Referrals
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <LevelChip level={r.level} />
              </CardBody>
            </Card>
          );
        })}
        {filteredReferrers.length === 0 && (
          <p className="text-center text-gray-600 text-sm py-5">
            No referrers match the current filters.
          </p>
        )}
      </div>
    </div>
  );
};
