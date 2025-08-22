import React, { useCallback, useState, useEffect } from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { LuArrowDown, LuArrowUp, LuFilter, LuSearch } from "react-icons/lu";
import { GoSortAsc, GoSortDesc } from "react-icons/go";

const FilterPanel = ({ filters = [], isFilterable = false, filterFor = '' }) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const [filterValues, setFilterValues] = useState({});
    const [isAscending, setIsAscending] = useState(true);

    useEffect(() => {
        const initialValues = {};
        filters.forEach(filterGroup => {
            Object.keys(filterGroup).forEach(filterKey => {
                initialValues[filterKey] = "all";
            });
        });
        setFilterValues(initialValues);
    }, [filters]);

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(searchKeyword);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchKeyword]);

    const handleFilterChange = (filterKey, value) => {
        setFilterValues(prev => ({
            ...prev,
            [filterKey]: value
        }));
    };

    const getSelectedFilters = useCallback(() => {
        const result = { keyword: debouncedKeyword || "" };
        Object.keys(filterValues).forEach(filterKey => {
            const value = filterValues[filterKey];
            result[filterKey] = value === "all" ? "" : value;
        });

        return result;
    }, [debouncedKeyword, filterValues]);

    useEffect(() => {
        const selectedFilters = getSelectedFilters();
        console.log("Selected Filters: ", selectedFilters);
    }, [getSelectedFilters]);

    const resetFilters = () => {
        setSearchKeyword("");
        setDebouncedKeyword("");

        const resetValues = {};
        Object.keys(filterValues).forEach(key => {
            resetValues[key] = "all";
        });

        setFilterValues(resetValues);

        console.log("Filters Reset:", {
            keyword: "",
            ...resetValues
        });
    };

    const getLabel = useCallback((options, key) => {
        const option = options.find(opt => opt.key === key);
        return option ? option.label : options[0].label;
    }, []);

    const sorting = () => {
        setIsAscending(!isAscending);
        console.log(isAscending ? "Ascending" : "Descending");
        console.log('filter for ', filterFor);
    };
    return (
        <div className="border border-text/10 dark:border-text/30 rounded-lg bg-background">
            <div className="flex flex-wrap items-center gap-3 w-full p-4">


                {/* <div className="flex gap-3 items-center"> */}

                <Input
                    size="lg"
                    variant="flat"
                    placeholder="Search..."
                    value={searchKeyword}
                    type="search"
                    onChange={handleSearchChange}
                    className="text-sm  min-w-[160px] max-w-[280px]"
                    startContent={
                        <LuSearch size={16} />
                    }
                />
                {filters.map((filterGroup, groupIndex) => (
                    Object.entries(filterGroup).map(([filterKey, options]) => (
                        <Select
                            key={filterKey}
                            size="sm"
                            variant="flat"
                            selectedKey={filterValues[filterKey] || "all"}
                            onSelectionChange={(key) => handleFilterChange(filterKey, key)}
                            className="text-sm min-w-[160px] max-w-[280px]"
                            label={getLabel(options, filterValues[filterKey] || "all")}
                            aria-label={filterKey}
                        >
                            {options.map(({ key, label }) => (
                                <SelectItem key={key}>{label}</SelectItem>
                            ))}
                        </Select>
                    ))
                ))}

                {isFilterable &&


                    <Button
                        size="lg"
                        className="text-sm ml-auto min-w-[160px] max-w-[280px] border border-text/10 dark:border-text/20 bg-transparent"
                        onPress={sorting}
                        startContent={
                            isAscending ? <GoSortAsc size={16} /> : <GoSortDesc size={16} />
                        }
                    >
                        {isAscending ? 'Ascending' : 'Descending'}
                    </Button>

                }
                {/* </div> */}
                <Button
                    size="lg"
                    className="text-sm ml-auto min-w-[160px] max-w-[280px] border border-text/10 dark:border-text/20 bg-transparent"
                    onPress={resetFilters}
                    startContent={<LuFilter size={16} />}
                >
                    Clear Filters
                </Button>
            </div>
        </div>
    );
};

export default FilterPanel;