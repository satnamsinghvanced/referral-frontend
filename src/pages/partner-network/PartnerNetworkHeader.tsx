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
    <div className="md:p-6 p-4 bg-background border-b-1 border-foreground/10">
      <div className="md:flex md:justify-between md:items-center max-md:space-y-3.5">
        <div className="space-y-1">
          <h3 className="text-base md:text-lg">{heading}</h3>
          {subHeading && (
            <p className="text-xs md:text-sm text-gray-600">{subHeading}</p>
          )}
        </div>

        {buttons && buttons.length > 0 && (
          <div className="space-x-2 md:space-x-3">
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
        <div className="md:flex md:items-center md:gap-3 max-md:space-y-3.5 mt-3.5">
          <div className="md:flex md:items-center md:gap-3 max-md:space-y-3.5">
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
                    className="md:w-[160px]"
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
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  Sort by:
                </span>
                <Select
                  size="sm"
                  radius="sm"
                  aria-label="Sort"
                  selectedKeys={[selectedSortOption as string]}
                  disabledKeys={[selectedSortOption as string]}
                  className="md:w-[140px]"
                  classNames={{ value: "text-xs" }}
                  onChange={(e) => onSortChange?.(e.target.value)}
                >
                  {sortOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      classNames={{ title: "text-xs" }}
                    >
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
              </div>
            )}
          </div>
          {/* Dynamic display of items */}
          <div className="text-xs flex text-gray-500">
            {`Showing ${visibleItems ?? totalItems ?? 0} of ${
              totalItems ?? 0
            } practices`}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerNetworkHeader;
