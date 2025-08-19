import { useCallback, useMemo, useState, useEffect } from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { LuFilter } from "react-icons/lu";

const FilterPanel = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const [status, setStatus] = useState("all");
    const [urgency, setUrgency] = useState("all");
    const [location, setLocation] = useState("all");

    const statusOptions = useMemo(() => [
        { key: "all", label: "All Statuses" },
        { key: "new", label: "New" },
        { key: "contacted", label: "Contacted" },
        { key: "scheduled", label: "Scheduled" },
        { key: "completed", label: "Completed" },
        { key: "cancelled", label: "Cancelled" },
    ], []);

    const urgencyOptions = useMemo(() => [
        { key: "all", label: "All Urgencies" },
        { key: "high", label: "High" },
        { key: "medium", label: "Medium" },
        { key: "low", label: "Low" },
    ], []);

    const locationOptions = useMemo(() => [
        { key: "all", label: "All Locations" },
        { key: "downtown", label: "Downtown Orthodontics" },
        { key: "westside", label: "Westside Dental Specialists" },
        { key: "brooklyn", label: "Brooklyn Heights Orthodontics" },
    ], []);

    const getSelectedFilters = useCallback(() => {
        return {
            keyword: debouncedKeyword || "",
            status: status === "all" ? "" : status.currentKey,
            urgency: urgency === "all" ? "" : urgency.currentKey,
            location: location === "all" ? "" : location.currentKey,
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
        console.log("Selected Filters: ", filters);
    }, [debouncedKeyword, status, urgency, location, getSelectedFilters]);

    const handleStatusChange = (key) => {
        setStatus(key);
    };

    const handleUrgencyChange = (key) => {
        setUrgency(key);
    };

    const handleLocationChange = (key) => {
        setLocation(key);
    };

    const resetFilters = () => {
        setSearchKeyword("");
        setDebouncedKeyword("");
        setStatus("all");
        setUrgency("all");
        setLocation("all");

        console.log("Filters Reset:", {
            keyword: "",
            status: "",
            urgency: "",
            location: "",
        });
    };

    const getLabel = useCallback((options, key) => {
        const option = options.find(opt => opt.key === key);
        return option ? option.label : '';
    }, []);

    return (
        <div className="pt-2 px-2 border-gray-200 border rounded-lg bg-white">
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
                    label={getLabel(statusOptions, status)}
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
                    label={getLabel(urgencyOptions, urgency)}
                // itemHeight={10}
                // maxListboxHeight={50}
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
                    label={getLabel(locationOptions, location)}
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
                    <LuFilter/>Clear Filters
                </Button>
            </div>
        </div>
    );
};

export default FilterPanel;
