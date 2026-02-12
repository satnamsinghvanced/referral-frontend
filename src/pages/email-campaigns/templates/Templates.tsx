import { Button, Input, Select, SelectItem } from "@heroui/react";
import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegStar } from "react-icons/fa";
import { FiEye, FiHeart, FiSearch } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import { PiFunnelX } from "react-icons/pi";
import CampaignCategoryChip from "../../../components/chips/CampaignCategoryChip";
import EmptyState from "../../../components/common/EmptyState";
import { LoadingState } from "../../../components/common/LoadingState";
import Pagination from "../../../components/common/Pagination";
import { CAMPAIGN_CATEGORIES } from "../../../consts/campaign";
import {
  useCampaignTemplates,
  useCreateCampaignTemplate,
  useToggleFavoriteTemplate,
} from "../../../hooks/useCampaign";
import { useDebouncedValue } from "../../../hooks/common/useDebouncedValue";
import { CampaignFilters, CampaignTemplate } from "../../../types/campaign";
import CreateTemplateModal, {
  TemplateFormValues,
} from "./modal/CreateTemplateModal";
import ViewTemplateModal from "./modal/ViewTemplateModal";

import { usePaginationAdjustment } from "../../../hooks/common/usePaginationAdjustment";

const INITIAL_FILTERS: CampaignFilters = {
  page: 1,
  limit: 6,
  category: "",
  filter: "all",
  search: "",
};

interface TemplatesProps {
  onUseTemplate?: (template: CampaignTemplate) => void;
}

const Templates: React.FC<TemplatesProps> = ({ onUseTemplate }) => {
  const [currentFilters, setCurrentFilters] =
    useState<CampaignFilters>(INITIAL_FILTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<CampaignTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search
  const debouncedSearch = useDebouncedValue(searchQuery, 500);

  // Queries
  const { data, isLoading } = useCampaignTemplates({
    ...currentFilters,
    search: debouncedSearch,
  });

  usePaginationAdjustment({
    totalPages: data?.pagination?.totalPages || 0,
    currentPage: currentFilters.page || 1,
    onPageChange: (page) => handleFilterChange("page", page),
    isLoading,
  });

  const createMutation = useCreateCampaignTemplate();
  const toggleFavoriteMutation = useToggleFavoriteTemplate();

  const handleFilterChange = (key: keyof CampaignFilters, value: any) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value,
      page: key === "page" ? value : 1,
    }));
  };

  const handleViewTemplate = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  const handleUseTemplate = (template: CampaignTemplate) => {
    if (onUseTemplate) {
      onUseTemplate(template);
    }
  };

  const handleCreateTemplate = async (values: TemplateFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);

    // Backend expects the Label, not the camelCase value
    const categoryLabel =
      CAMPAIGN_CATEGORIES.find((c) => c.value === values.category)?.label ||
      values.category;
    formData.append("category", categoryLabel);

    formData.append("subjectLine", values.subjectLine);
    formData.append("bodyContent", values.body);
    formData.append("mainImage", values.coverImage);

    // Handle Tags
    const tagsArray = values.tags
      ? values.tags.split(",").map((tag: string) => tag.trim())
      : [];
    tagsArray.forEach((tag: string) => formData.append("tags[]", tag));

    // Handle Design Options
    // Backend expects an object, so we append fields individually for FormData
    formData.append("designOptions[headerColor]", values.headerColor);
    formData.append("designOptions[accentColor]", values.accentColor);
    formData.append("designOptions[organizationName]", values.organizationName);
    formData.append("designOptions[buttonText]", values.primaryButtonText);
    formData.append(
      "designOptions[secondaryButtonText]",
      values.secondaryButtonText,
    );

    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  const templates = data?.templates || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-foreground/10 bg-background">
        <div data-slot="card-content" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="relative">
              <Input
                placeholder="Search automation flow..."
                size="sm"
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={
                  <FiSearch className="text-gray-600 dark:text-foreground/60" />
                }
              />
            </div>
            <div className="relative">
              <Select
                aria-label="Type"
                placeholder="All Templates"
                size="sm"
                selectedKeys={
                  currentFilters.filter ? [currentFilters.filter] : ["all"]
                }
                disabledKeys={
                  currentFilters.filter ? [currentFilters.filter] : ["all"]
                }
                onSelectionChange={(keys) =>
                  handleFilterChange("filter", Array.from(keys)[0])
                }
              >
                <SelectItem key="all">All Templates</SelectItem>
                <SelectItem key="popular">Popular</SelectItem>
                <SelectItem key="favorites">Favorites</SelectItem>
              </Select>
            </div>
            <div className="relative">
              <Select
                aria-label="Categories"
                placeholder="All Categories"
                size="sm"
                selectedKeys={
                  currentFilters.category ? [currentFilters.category] : ["all"]
                }
                disabledKeys={
                  currentFilters.category ? [currentFilters.category] : ["all"]
                }
                onSelectionChange={(keys) =>
                  handleFilterChange("category", Array.from(keys)[0])
                }
              >
                <>
                  <SelectItem key="all">All Categories</SelectItem>
                  {CAMPAIGN_CATEGORIES.map((category) => (
                    <SelectItem key={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </>
              </Select>
            </div>
            {/* Sort is not in CampaignFilters yet, keeping UI but disabled or local logic if needed */}
            {/* <div className="relative">
              <Select aria-label="Sort" placeholder="Sort" size="sm" isDisabled>
                <SelectItem key="mostPopular">Most Popular</SelectItem>
                <SelectItem key="highestRated">Highest Rated</SelectItem>
                <SelectItem key="newest">Newest</SelectItem>
                <SelectItem key="name">Name A-Z</SelectItem>
              </Select>
            </div> */}
            <div className="flex items-center gap-3">
              <Button
                onPress={() => {
                  setCurrentFilters(INITIAL_FILTERS);
                  setSearchQuery("");
                }}
                size="sm"
                variant="bordered"
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
                className="flex-1"
                startContent={<AiOutlinePlus className="size-[15px]" />}
                onPress={() => setIsModalOpen(true)}
              >
                Create Template
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CreateTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTemplate}
      />

      <ViewTemplateModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        template={selectedTemplate}
        onUseTemplate={(template) => {
          handleUseTemplate(template);
          setIsViewModalOpen(false);
        }}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingState />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <EmptyState
                  title="No templates found"
                  message="No templates found matching your criteria."
                />
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template._id}
                  className="bg-background border border-foreground/10 rounded-xl overflow-hidden"
                >
                  <div className="relative h-48 bg-gray-200 dark:bg-content1 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-foreground/50 font-medium">
                      {template.mainImage ? (
                        <img
                          src={template.mainImage}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-4xl">📧</span>
                        </div>
                      )}
                    </div>
                    {template.isPopular && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white text-[11px] font-medium px-3 py-1 rounded-full flex items-center space-x-1">
                        <FaRegStar className="size-3" />
                        <span>Popular</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium line-clamp-1">
                        {template.name}
                      </h4>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-foreground/50 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="flex items-center justify-between gap-1.5 mt-3">
                      <CampaignCategoryChip category={template.category} />
                      <span className="text-xs text-gray-500 dark:text-foreground/50">
                        {template.usageCount || 0} uses
                      </span>
                    </div>

                    {template.tags && template.tags.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1.5 mt-3 overflow-hidden">
                        {template.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="border border-foreground/10 text-[11px] rounded-md px-1.5 py-0.5"
                          >
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center gap-2 mt-4">
                      <Button
                        size="sm"
                        radius="sm"
                        variant="solid"
                        color="primary"
                        className="flex-1"
                        startContent={<LuCopy className="size-3.5" />}
                        onPress={() => handleUseTemplate(template)}
                      >
                        Use Template
                      </Button>
                      <Button
                        size="sm"
                        radius="sm"
                        variant="ghost"
                        color="default"
                        className="border-small"
                        startContent={<FiEye className="size-3.5" />}
                        isIconOnly
                        onPress={() => handleViewTemplate(template)}
                      />
                      <Button
                        size="sm"
                        radius="sm"
                        variant={template.isFavorite ? "solid" : "ghost"}
                        color={template.isFavorite ? "danger" : "default"}
                        className={`border-small ${template.isFavorite ? "border-danger bg-danger-400/10 text-danger-500" : ""}`}
                        startContent={
                          <FiHeart
                            className={`size-3.5 ${template.isFavorite ? "fill-current" : ""}`}
                          />
                        }
                        isIconOnly
                        onPress={() =>
                          toggleFavoriteMutation.mutate(template._id)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              identifier="templates"
              limit={currentFilters.limit as number}
              totalItems={pagination.totalTemplates}
              currentPage={currentFilters.page as number}
              totalPages={pagination.totalPages}
              handlePageChange={(page: number) => {
                handleFilterChange("page", page);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Templates;
