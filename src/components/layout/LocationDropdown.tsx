import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger, Tooltip } from "@heroui/react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { useLocationContext } from "../../providers/LocationContext";
import { Location } from "../../types/common";

interface LocationDropdownProps {
  isMiniSidebarOpen: boolean;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({ isMiniSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { locations, selectedLocation, setSelectedLocation, isLoading, getLocationColor } =
    useLocationContext();

  if (isLoading) {
    return (
      <div className="px-3 py-2">
        <div className="h-11 bg-foreground/10 rounded-xl animate-pulse w-full" />
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return null;
  }

  const selectedColor = getLocationColor(selectedLocation?._id);

  const formatAddress = (loc: Location) => {
    if (!loc.address) return "";
    const parts = [loc.address.street, loc.address.city, loc.address.state, loc.address.zipcode].filter(
      Boolean
    );
    return parts.join(", ");
  };

  const addressText = selectedLocation ? formatAddress(selectedLocation) : "";

  return (
    <div className="px-3 py-2 border-b border-foreground/10">
      <Popover
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom-start"
        offset={8}
      >
        <PopoverTrigger>
          {isMiniSidebarOpen ? (
            <button
              type="button"
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/60 dark:bg-sky-950/30 hover:bg-sky-100/70 dark:hover:bg-sky-900/40 transition-all cursor-pointer text-left group shadow-xs"
            >
              <div className="flex items-start gap-2.5 min-w-0 pr-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 shadow-xs"
                  style={{ backgroundColor: selectedColor }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-foreground truncate leading-tight">
                    {selectedLocation?.name || "Select Location"}
                  </h4>
                  {addressText && (
                    <p className="text-[10px] text-foreground/60 truncate mt-0.5 leading-tight font-normal">
                      {addressText}
                    </p>
                  )}
                </div>
              </div>
              <FiChevronDown
                className={`size-3.5 text-foreground/50 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : (
            <Tooltip
              content={selectedLocation?.name || "Select Location"}
              placement="right"
              shadow="sm"
              size="sm"
              radius="sm"
            >
              <button
                type="button"
                className="w-full flex items-center justify-center py-2.5 rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/60 dark:bg-sky-950/30 hover:bg-sky-100/70 dark:hover:bg-sky-900/40 transition-all cursor-pointer shadow-xs"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: selectedColor }}
                />
              </button>
            </Tooltip>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-[270px] p-0 shadow-2xl rounded-2xl border border-foreground/10 overflow-hidden bg-background text-foreground">
          <div className="w-full flex flex-col">
            <div className="px-3.5 py-2.5 border-b border-foreground/10 bg-foreground/[0.02]">
              <span className="text-[10px] font-bold text-foreground/50 tracking-wider uppercase">
                SELECT LOCATION
              </span>
            </div>
            <div className="max-h-[280px] overflow-y-auto p-1.5 space-y-1 scrollbar-hide">
              {locations.map((loc: Location, index: number) => {
                const isSelected = selectedLocation?._id === loc._id;
                const locColor = getLocationColor(loc._id, index);
                const locAddr = formatAddress(loc);

                return (
                  <button
                    key={loc._id || index}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start justify-between p-2.5 rounded-xl transition-all cursor-pointer text-left ${
                      isSelected
                        ? "bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-medium"
                        : "hover:bg-foreground/5 text-foreground"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 shadow-xs"
                        style={{ backgroundColor: locColor }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-tight truncate">
                          {loc.name}
                        </p>
                        {locAddr && (
                          <p className="text-[10px] text-foreground/60 leading-tight truncate mt-0.5 font-normal">
                            {locAddr}
                          </p>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <FiCheck className="size-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationDropdown;
