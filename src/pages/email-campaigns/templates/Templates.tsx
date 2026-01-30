import { Button, Input, Select, SelectItem } from "@heroui/react";
import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegStar } from "react-icons/fa";
import { FiEye, FiHeart, FiSearch, FiStar } from "react-icons/fi";
import { LuCopy } from "react-icons/lu";
import { PiFunnelX } from "react-icons/pi";
import CampaignCategoryChip from "../../../components/chips/CampaignCategoryChip";
import { CAMPAIGN_CATEGORIES } from "../../../consts/campaign";
import { Template } from "../../../types/campaign";
import CreateTemplateModal from "./modal/CreateTemplateModal";

const TEMPLATES: Template[] = [
  {
    id: 1,
    title: "Patient Welcome Series",
    description: "Warm, friendly welcome sequence for new patients",
    category: "patientFollowUp",
    rating: 4.9,
    usages: 587,
    tags: ["welcome", "patient-care", "sequence"],
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56",
    isPopular: true,
  },
  {
    id: 2,
    title: "New Partner Onboarding",
    description: "Complete onboarding sequence for new referral partners",
    category: "onboarding",
    rating: 4.8,
    usages: 345,
    tags: ["onboarding", "partner", "sequence"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    isPopular: true,
  },
  {
    id: 3,
    title: "Professional Partnership Invitation",
    description:
      "Clean, professional template for reaching out to new dental practices",
    category: "referralOutreach",
    rating: 4.8,
    usages: 234,
    tags: ["referral outreach", "professional", "partnership", "introduction"],
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07",
    isPopular: true,
  },
  {
    id: 4,
    title: "Practice Announcement",
    description: "Share important practice news and updates",
    category: "announcements",
    rating: 4.5,
    usages: 156,
    tags: ["announcement", "news", "updates"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    isPopular: false,
  },
  {
    id: 5,
    title: "Monthly Practice Newsletter",
    description: "Modern newsletter design with multiple content sections",
    category: "newsletters",
    rating: 4.6,
    usages: 123,
    tags: ["newsletter", "updates", "modern"],
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    isPopular: false,
  },
  {
    id: 6,
    title: "Referral Thank You",
    description: "Express gratitude for successful referrals",
    category: "referralOutreach",
    rating: 4.7,
    usages: 89,
    tags: ["thank-you", "gratitude", "follow-up"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    isPopular: false,
  },
];

const INITIAL_FILTERS = {
  page: 1,
  limit: 10,
  search: "",
  type: "all",
  category: "all",
  sort: "mostPopular",
};

const Templates: React.FC = () => {
  const [currentFilters, setCurrentFilters] = useState(INITIAL_FILTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-foreground/10 bg-background">
        <div data-slot="card-content" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <div className="relative">
              <Input
                placeholder="Search automation flow..."
                size="sm"
                value={currentFilters.search}
                onValueChange={(value) =>
                  setCurrentFilters((prev) => ({ ...prev, search: value }))
                }
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
                selectedKeys={[currentFilters.type]}
                disabledKeys={[currentFilters.type]}
                onSelectionChange={(keys) =>
                  handleFilterChange("type", Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="all">All Templates</SelectItem>
                <SelectItem key="popular">Popular</SelectItem>
                <SelectItem key="favourites">Favourites</SelectItem>
              </Select>
            </div>
            <div className="relative">
              <Select
                aria-label="Categories"
                placeholder="All Categories"
                size="sm"
                selectedKeys={[currentFilters.category]}
                disabledKeys={[currentFilters.category]}
                onSelectionChange={(keys) =>
                  handleFilterChange("category", Array.from(keys)[0] as string)
                }
              >
                <>
                  <SelectItem key="all">All Status</SelectItem>
                  {CAMPAIGN_CATEGORIES.map((category) => (
                    <SelectItem key={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </>
              </Select>
            </div>
            <div className="relative">
              <Select
                aria-label="Sort"
                placeholder="Sort"
                size="sm"
                selectedKeys={[currentFilters.sort]}
                disabledKeys={[currentFilters.sort]}
                onSelectionChange={(keys) =>
                  handleFilterChange("sort", Array.from(keys)[0] as string)
                }
              >
                <SelectItem key="mostPopular">Most Popular</SelectItem>
                <SelectItem key="highestRated">Highest Rated</SelectItem>
                <SelectItem key="newest">Newest</SelectItem>
                <SelectItem key="name">Name A-Z</SelectItem>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onPress={() => setCurrentFilters(INITIAL_FILTERS)}
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
        onSubmit={(values) => {
          console.log("Template values:", values);
          // Here you would typically call a mutation to save the template
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="bg-background border border-foreground/10 rounded-xl overflow-hidden"
          >
            <div className="relative h-48 bg-gray-200 dark:bg-content1 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-foreground/50 font-medium">
                <img src={template.image} />
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
                <h4 className="text-sm font-medium">{template.title}</h4>
                <div className="flex items-center text-yellow-500 text-sm font-medium ml-4 shrink-0">
                  <FiStar className="w-3 h-3 mr-1" fill="currentColor" />
                  <span>{template.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-foreground/50">
                {template.description}
              </p>

              <div className="flex items-center justify-between gap-1.5 mt-3">
                <CampaignCategoryChip category={template.category} />
                <span className="text-xs text-gray-500 dark:text-foreground/50">
                  {template.usages} uses
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-1.5 mt-3">
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="border border-foreground/10 text-[11px] rounded-md px-1.5 py-0.5"
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center gap-2 mt-3">
                <Button
                  size="sm"
                  radius="sm"
                  variant="solid"
                  color="primary"
                  className="flex-1"
                  startContent={<LuCopy className="size-3.5" />}
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
                ></Button>
                <Button
                  size="sm"
                  radius="sm"
                  variant="ghost"
                  color="default"
                  className="border-small"
                  startContent={<FiHeart className="size-3.5" />}
                  isIconOnly
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
