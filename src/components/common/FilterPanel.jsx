import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { LuArrowDown, LuArrowUp, LuFilter, LuSearch } from "react-icons/lu";
import { GoSortAsc, GoSortDesc } from "react-icons/go";

const FilterPanel = ({ onFilterChange }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [urgency, setUrgency] = useState("all");
  const [location, setLocation] = useState("all");

  const statusOptions = useMemo(
    () => [
      { key: "all", label: "All Status" },
      { key: "new", label: "New" },
      { key: "contacted", label: "Contacted" },
      { key: "scheduled", label: "Scheduled" },
      { key: "completed", label: "Completed" },
      { key: "cancelled", label: "Cancelled" },
    ],
    []
  );

  const urgencyOptions = useMemo(
    () => [
      { key: "all", label: "All Urgencies" },
      { key: "high", label: "High" },
      { key: "medium", label: "Medium" },
      { key: "low", label: "Low" },
    ],
    []
  );

  const locationOptions = useMemo(
    () => [
      { key: "all", label: "All Locations" },
      { key: "downtown", label: "Downtown Orthodontics" },
      { key: "westside", label: "Westside Dental Specialists" },
      { key: "brooklyn", label: "Brooklyn Heights Orthodontics" },
    ],
    []
  );

  const getSelectedFilters = useCallback(() => {
    return {
      search: debouncedKeyword || "",
      status: status === "all" ? "" : status,
      urgency: urgency === "all" ? "" : urgency,
      location: location === "all" ? "" : location,
    };
  }, [debouncedKeyword, status, urgency, location]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchKeyword]);

  useEffect(() => {
    const filters = getSelectedFilters();
    onFilterChange?.(filters);
  }, [
    debouncedKeyword,
    status,
    urgency,
    location,
    getSelectedFilters,
    onFilterChange,
  ]);
  
  const handleStatusChange = (keys) => {
  const value = Array.from(keys)[0] || "all"; 
  setStatus(value);
};

const handleUrgencyChange = (keys) => {
  const value = Array.from(keys)[0] || "all";
  setUrgency(value);
};

const handleLocationChange = (keys) => {
  const value = Array.from(keys)[0] || "all";
  setLocation(value);
};

  const resetFilters = () => {
    setSearchKeyword("");
    setDebouncedKeyword("");
    setStatus("all");
    setUrgency("all");
    setLocation("all");

   
    onFilterChange?.({
      search: "",
      status: "",
      urgency: "",
      location: "",
    });
  }; 

  const getLabel = useCallback((options, key) => {
    const option = options.find((opt) => opt.key === key);
    return option ? option.label : "";
  }, []);

  return (
    <div className="pt-2 px-2 border-text/10 dark:border-text/30 border rounded-lg bg-background">
      <h5>Filters</h5>
      <div className="flex flex-wrap items-center gap-2 w-full rounded-md py-4">
        <Input
          size="sm"
          variant="flat"
          placeholder="Search..."
          value={searchKeyword}
          onChange={handleSearchChange}
          className="text-xs flex-1 min-w-fit"
        />

        <Select
          size="sm"
          variant="flat"
          selectedKey={status}
          onSelectionChange={handleStatusChange}
          className="text-xs flex-1 min-w-fit"
          placeholder={getLabel(statusOptions, status)} 
        >
          {statusOptions.map(({ key, label }) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>

        <Select
          size="sm"
          variant="flat"
          selectedKey={urgency}
          onSelectionChange={handleUrgencyChange}
          className="text-xs flex-1 min-w-fit"
          placeholder={getLabel(urgencyOptions, urgency)}
        >
          {urgencyOptions.map(({ key, label }) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>

        <Select
          size="sm"
          variant="flat"
          selectedKey={location}
          onSelectionChange={handleLocationChange}
          className="text-xs flex-1 min-w-fit"
          placeholder={getLabel(locationOptions, location)}
        >
          {locationOptions.map(({ key, label }) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>

        <Button
          size="sm"
          variant="bordered"
          className="text-xs ml-auto min-w-[100px]"
          onPress={resetFilters}
        >
          <LuFilter />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;