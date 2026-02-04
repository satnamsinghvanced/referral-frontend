import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { FiSearch, FiZap } from "react-icons/fi";
import { PiFunnelX } from "react-icons/pi";
import { FLOW_STATUSES } from "../../../consts/campaign";
import FlowCard from "./FlowCard";

import Pagination from "../../../components/common/Pagination";
import EmptyState from "../../../components/common/EmptyState";
import { LoadingState } from "../../../components/common/LoadingState";
import { useAutomations } from "../../../hooks/useCampaign";
import { useDebouncedValue } from "../../../hooks/common/useDebouncedValue";

const INITIAL_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  status: "",
  category: "",
};

interface ActiveFlowsProps {
  onEdit: (id: string) => void;
  onCreateNew: () => void;
}

const ActiveFlows = ({ onEdit, onCreateNew }: ActiveFlowsProps) => {
  const [currentFilters, setCurrentFilters] = useState(INITIAL_FILTERS);
  const debouncedSearch = useDebouncedValue(currentFilters.search, 500);

  const { data, isLoading } = useAutomations(
    currentFilters.page,
    currentFilters.limit,
    debouncedSearch,
    currentFilters.status,
  );

  const handleFilterChange = (key: string, value: any) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const automations = data?.automations || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-foreground/10 bg-background">
        <div data-slot="card-content" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Input
                placeholder="Search automation flow..."
                size="sm"
                value={currentFilters.search}
                onValueChange={(value) => handleFilterChange("search", value)}
                startContent={
                  <FiSearch className="text-gray-600 dark:text-foreground/60" />
                }
              />
            </div>
            <div className="relative">
              <Select
                aria-label="Statuses"
                placeholder="All Status"
                size="sm"
                selectedKeys={[currentFilters.status]}
                disabledKeys={[currentFilters.status]}
                onSelectionChange={(keys) =>
                  handleFilterChange("status", Array.from(keys)[0] as string)
                }
              >
                <>
                  <SelectItem key="">All Status</SelectItem>
                  {FLOW_STATUSES.map((status) => (
                    <SelectItem key={status.value}>{status.label}</SelectItem>
                  ))}
                </>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onPress={() => setCurrentFilters(INITIAL_FILTERS)}
                size="sm"
                variant="ghost"
                className="border-small flex-1"
                startContent={<PiFunnelX className="h-4 w-4" />}
              >
                Clear Filters
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                color="primary"
                onPress={onCreateNew}
                startContent={<FiZap className="h-4 w-4" />}
                className="flex-1"
              >
                New Flow
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <LoadingState />
          </div>
        ) : (
          <>
            {automations.map((flow) => (
              <FlowCard key={flow._id} flow={flow} onEdit={onEdit} />
            ))}

            {automations.length === 0 && (
              <EmptyState
                title="No Flows Found"
                message="No active flows found matching your criteria."
              />
            )}

            {pagination && pagination.totalPages > 1 && (
              <Pagination
                identifier="flows"
                limit={currentFilters.limit}
                totalItems={pagination.total}
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                handlePageChange={(page: number) =>
                  setCurrentFilters((prev) => ({ ...prev, page }))
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActiveFlows;
