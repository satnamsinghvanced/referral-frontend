import React from "react";
// import { Button } from "@heroui/react";
import { ButtonConfig } from "../../types/types";
import { Button, Select, SelectItem } from "@heroui/react";
import { FiFilter } from "react-icons/fi";
import { GrAscend, GrDescend } from "react-icons/gr";

interface PartnerNetworkHeaderProps {
  heading: string;
  subHeading?: string | undefined;
  buttons?: ButtonConfig[] | undefined;
  filters?:
    | {
        label: string;
        options: { label: string; value: string }[];
        selectedValue?: string | undefined;
        onChange?: (value: string) => void;
      }[]
    | undefined;
  sortOptions?: { label: string; value: string }[] | undefined;
  selectedSortOption?: string | undefined;
  onSortChange?: ((value: string) => void) | undefined;
  sortOrder?: "asc" | "desc" | undefined;
  onSortOrderChange?: ((order: "asc" | "desc") => void) | undefined;
  totalItems?: number;
  visibleItems?: number;
}

const PartnerNetworkHeader: React.FC<PartnerNetworkHeaderProps> = ({
  heading,
  subHeading,
  buttons,
  filters,
  sortOptions,
  selectedSortOption,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  totalItems,
  visibleItems,
}) => {
  return (
    <div className="md:px-7 px-4 py-3 md:py-6 bg-background border-b-1 border-foreground/10">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg">{heading}</h3>
          {subHeading && <p className="text-sm text-gray-600">{subHeading}</p>}
        </div>

        {buttons && buttons.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {buttons.map((btn, index) => (
              <Button
                key={index}
                size="sm"
                onPress={btn.onClick}
                startContent={btn.icon ?? null}
                variant={btn.variant ?? "solid"}
                color={btn.color ?? "primary"}
                {...btn}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      {(filters || sortOptions) && (
        <div className="flex flex-wrap items-center gap-3 mt-3.5">
          {filters && filters.length > 0 && (
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500" />
              {filters.map((filter, i) => (
                <Select
                  key={i}
                  size="sm"
                  radius="sm"
                  aria-label={filter.label}
                  selectedKeys={[filter.selectedValue as string]}
                  disabledKeys={[filter.selectedValue as string]}
                  className="min-w-[160px]"
                  classNames={{ value: "text-xs" }}
                  onChange={(e) => filter.onChange?.(e.target.value)}
                >
                  {filter.options.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      classNames={{ title: "text-xs" }}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </Select>
              ))}
            </div>
          )}

          {sortOptions && sortOptions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                Sort by:
              </span>
              <Select
                size="sm"
                radius="sm"
                aria-label="Sort"
                selectedKeys={[selectedSortOption as string]}
                disabledKeys={[selectedSortOption as string]}
                className="min-w-[130px]"
                classNames={{ value: "text-xs" }}
                onChange={(e) => onSortChange?.(e.target.value)}
              >
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} classNames={{ title: "text-xs" }}>
                    {opt.label}
                  </SelectItem>
                ))}
              </Select>
              <Button
                size="sm"
                isIconOnly
                variant="light"
                onPress={() =>
                  onSortOrderChange?.(sortOrder === "asc" ? "desc" : "asc")
                }
                className="text-sm"
              >
                {sortOrder === "asc" ? <GrAscend /> : <GrDescend />}
              </Button>
              {/* Dynamic display of items */}
              <div className="text-xs w-100 flex text-gray-500">
                <div className="w-[80px]">Showing {visibleItems ?? totalItems ?? 0} of</div>
                <div className="w-[80px]"> {totalItems ?? 0} practices </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PartnerNetworkHeader;
