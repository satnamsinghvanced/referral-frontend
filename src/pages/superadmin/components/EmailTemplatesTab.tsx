import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FiMail,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiEye,
  FiStar,
  FiFolder,
  FiTrendingUp,
  FiUpload,
  FiImage,
  FiCheck,
  FiTag,
  FiCheckCircle,
} from "react-icons/fi";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  addToast,
} from "@heroui/react";
import { CampaignTemplate } from "../../../types/campaign";
import { CAMPAIGN_CATEGORIES } from "../../../consts/campaign";
import {
  fetchAdminEmailTemplates,
  createAdminEmailTemplate,
  updateAdminEmailTemplate,
  deleteAdminEmailTemplate,
  AdminEmailTemplatesStats,
} from "../../../services/adminEmailTemplate";
import { WorkspaceLoader } from "../../../components/common/LoadingState";
import CampaignCategoryChip from "../../../components/chips/CampaignCategoryChip";
import QuillEditor, { QuillEditorRef } from "../../../components/editor/QuillEditor";

interface EmailTemplatesTabProps {
  isLight: boolean;
}

interface FormErrors {
  name?: string;
  category?: string;
  subjectLine?: string;
  bodyContent?: string;
  organizationName?: string;
}

const EmailTemplatesTab: React.FC<EmailTemplatesTabProps> = ({ isLight }) => {
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [stats, setStats] = useState<AdminEmailTemplatesStats>({
    totalTemplates: 0,
    popularCount: 0,
    categoriesCount: 0,
    totalUsage: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingTemplate, setViewingTemplate] = useState<CampaignTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<CampaignTemplate | null>(null);
  const [deleteModalTarget, setDeleteModalTarget] = useState<CampaignTemplate | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("referralOutreach");
  const [customCategories, setCustomCategories] = useState<{ value: string; label: string }[]>([]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [subjectLine, setSubjectLine] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [tags, setTags] = useState("");
  const [headerColor, setHeaderColor] = useState("#0ea5e9");
  const [accentColor, setAccentColor] = useState("#f97316");
  const [organizationName, setOrganizationName] = useState("Practice ROI");
  const [primaryButtonText, setPrimaryButtonText] = useState("Schedule Consultation");
  const [secondaryButtonText, setSecondaryButtonText] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<QuillEditorRef>(null);

  const availableCategories = useMemo(() => {
    const map = new Map<string, string>();
    CAMPAIGN_CATEGORIES.forEach((c) => map.set(c.value, c.label));
    customCategories.forEach((c) => map.set(c.value, c.label));
    templates.forEach((t) => {
      if (t.category && !map.has(t.category)) {
        const formatted = t.category.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
        map.set(t.category, formatted);
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [templates, customCategories]);

  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) return;
    const trimmed = newCategoryName.trim();
    const value = trimmed
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, "");
    const finalValue = value || trimmed.toLowerCase().replace(/\s+/g, "_");

    setCustomCategories((prev) => {
      if (prev.some((c) => c.value === finalValue)) return prev;
      return [...prev, { value: finalValue, label: trimmed }];
    });
    setCategory(finalValue);
    clearFieldError("category");
    setNewCategoryName("");
    setIsAddingNewCategory(false);
    addToast({
      title: "Category Added",
      description: `Category "${trimmed}" added and selected.`,
      color: "success",
    });
  };

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminEmailTemplates();
      setTemplates(data.templates || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error("Failed to load admin email templates:", err);
      addToast({
        title: "Error",
        description: "Failed to load email templates",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchSearch =
        !searchQuery.trim() ||
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subjectLine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        categoryFilter === "all" ||
        t.category?.toLowerCase() === categoryFilter.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [templates, searchQuery, categoryFilter]);

  const clearFieldError = (field: keyof FormErrors) => {
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const handleOpenCreateModal = () => {
    setEditingTemplate(null);
    setName("");
    setDescription("");
    setCategory("referralOutreach");
    setSubjectLine("");
    setBodyContent(`
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
        <p>Dear <strong>[Recipient Name]</strong>,</p>
        <p>We are excited to introduce our specialized services and explore opportunities to collaborate with your team.</p>
        <p>Our commitment is to deliver seamless care and exceptional results for your referred patients.</p>
        <p>Best regards,<br><strong>[Your Name]</strong><br>[Practice Name]</p>
      </div>
    `);
    setTags("");
    setHeaderColor("#0ea5e9");
    setAccentColor("#f97316");
    setOrganizationName("Practice ROI");
    setPrimaryButtonText("Schedule Consultation");
    setSecondaryButtonText("View Details");
    setCoverImageFile(null);
    setCoverImagePreview("");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (template: CampaignTemplate) => {
    setEditingTemplate(template);
    setName(template.name || "");
    setDescription(template.description || "");
    setCategory(template.category || "referralOutreach");
    setSubjectLine(template.subjectLine || "");
    setBodyContent(template.bodyContent || "");
    setTags(template.tags?.join(", ") || "");
    setHeaderColor(template.designOptions?.headerColor || "#0ea5e9");
    setAccentColor(template.designOptions?.accentColor || "#f97316");
    setOrganizationName(template.designOptions?.organizationName || "Practice ROI");
    setPrimaryButtonText(template.designOptions?.buttonText || "Learn More");
    setSecondaryButtonText(template.designOptions?.secondaryButtonText || "");
    setCoverImageFile(null);
    setCoverImagePreview(template.mainImage || "");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (template: CampaignTemplate) => {
    setViewingTemplate(template);
    setIsViewModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        addToast({
          title: "Invalid File",
          description: "Please select an image file (PNG, JPG, SVG, WebP)",
          color: "danger",
        });
        return;
      }
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!name.trim()) errors.name = "Template name is required";
    if (!category.trim()) errors.category = "Category is required";
    if (!subjectLine.trim()) errors.subjectLine = "Subject line is required";
    if (!bodyContent.trim()) errors.bodyContent = "Email body content is required";
    if (!organizationName.trim()) errors.organizationName = "Organization name is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("subjectLine", subjectLine.trim());
      formData.append("bodyContent", bodyContent);
      formData.append("tags", tags);

      const designOptionsObj = {
        headerColor,
        accentColor,
        organizationName: organizationName.trim(),
        buttonText: primaryButtonText.trim(),
        secondaryButtonText: secondaryButtonText.trim(),
      };
      formData.append("designOptions", JSON.stringify(designOptionsObj));

      if (coverImageFile) {
        formData.append("mainImage", coverImageFile);
      } else if (coverImagePreview && !coverImagePreview.startsWith("blob:")) {
        formData.append("mainImage", coverImagePreview);
      }

      if (editingTemplate) {
        await updateAdminEmailTemplate(editingTemplate._id, formData);
        addToast({
          title: "Success",
          description: "Email template updated successfully",
          color: "success",
        });
      } else {
        await createAdminEmailTemplate(formData);
        addToast({
          title: "Success",
          description: "Email template created successfully and made available to all users",
          color: "success",
        });
      }

      setIsModalOpen(false);
      loadTemplates();
    } catch (err: any) {
      console.error("Error saving template:", err);
      addToast({
        title: "Error",
        description: err.response?.data?.message || err.message || "Failed to save email template",
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalTarget) return;
    setDeleting(true);
    try {
      await deleteAdminEmailTemplate(deleteModalTarget._id);
      addToast({
        title: "Deleted",
        description: `Template "${deleteModalTarget.name}" deleted successfully`,
        color: "success",
      });
      setDeleteModalTarget(null);
      loadTemplates();
    } catch (err: any) {
      console.error("Error deleting template:", err);
      addToast({
        title: "Error",
        description: err.response?.data?.message || err.message || "Failed to delete email template",
        color: "danger",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${
              isLight
                ? "bg-blue-50 text-blue-600 border border-blue-100"
                : "bg-blue-950/40 text-blue-400 border border-blue-800/50"
            }`}
          >
            <FiMail className="w-6 h-6" />
          </div>
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Email Templates
            </h1>
            <p
              className={`text-xs sm:text-sm mt-0.5 ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Create and manage system email templates available to all client accounts.
            </p>
          </div>
        </div>

        <Button
          size="md"
          radius="md"
          color="primary"
          className="font-bold shadow-sm shadow-[#20a9f8]/20 self-start sm:self-auto"
          startContent={<FiPlus className="text-base" />}
          onPress={handleOpenCreateModal}
        >
          Create Email Template
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isLight
              ? "bg-white border-slate-200 shadow-sm hover:border-slate-300"
              : "bg-[#0F172A]/70 border-[#1E293B] hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Total Templates
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isLight ? "bg-blue-50 text-blue-600" : "bg-blue-950/50 text-blue-400"
              }`}
            >
              <FiMail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl font-black ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {stats.totalTemplates}
            </span>
            <span className="text-[11px] font-medium text-slate-400">System templates</span>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isLight
              ? "bg-white border-slate-200 shadow-sm hover:border-slate-300"
              : "bg-[#0F172A]/70 border-[#1E293B] hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Popular Templates
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isLight ? "bg-amber-50 text-amber-600" : "bg-amber-950/50 text-amber-400"
              }`}
            >
              <FiStar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl font-black ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {stats.popularCount}
            </span>
            <span className="text-[11px] font-medium text-slate-400">High engagement</span>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isLight
              ? "bg-white border-slate-200 shadow-sm hover:border-slate-300"
              : "bg-[#0F172A]/70 border-[#1E293B] hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Categories
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isLight ? "bg-purple-50 text-purple-600" : "bg-purple-950/50 text-purple-400"
              }`}
            >
              <FiFolder className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl font-black ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {stats.categoriesCount || CAMPAIGN_CATEGORIES.length}
            </span>
            <span className="text-[11px] font-medium text-slate-400">Template categories</span>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border transition-all ${
            isLight
              ? "bg-white border-slate-200 shadow-sm hover:border-slate-300"
              : "bg-[#0F172A]/70 border-[#1E293B] hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Total Client Uses
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isLight ? "bg-emerald-50 text-emerald-600" : "bg-emerald-950/50 text-emerald-400"
              }`}
            >
              <FiTrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl font-black ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {stats.totalUsage}
            </span>
            <span className="text-[11px] font-medium text-slate-400">Total campaign uses</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl border ${
          isLight
            ? "bg-white border-slate-200 shadow-sm"
            : "bg-[#0F172A]/60 border-[#1E293B]"
        }`}
      >
        <div className="relative flex-1 w-full">
          <Input
            size="sm"
            radius="md"
            placeholder="Search by title, subject, tags, or description..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            isClearable
            onClear={() => setSearchQuery("")}
            startContent={<FiSearch className="text-slate-400 text-sm shrink-0" />}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="w-48">
            <Select
              size="sm"
              radius="md"
              aria-label="Category Filter"
              placeholder="All Categories"
              selectedKeys={[categoryFilter]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setCategoryFilter(selected || "all");
              }}
              disableAnimation
              popoverProps={{ disableAnimation: true, shouldCloseOnScroll: false }}
            >
              {[
                <SelectItem key="all" textValue="All Categories">All Categories</SelectItem>,
                ...availableCategories.map((cat) => (
                  <SelectItem key={cat.value} textValue={cat.label}>
                    {cat.label}
                  </SelectItem>
                ))
              ]}
            </Select>
          </div>

          {(searchQuery || categoryFilter !== "all") && (
            <Button
              size="sm"
              radius="md"
              variant="bordered"
              onPress={() => {
                setSearchQuery("");
                setCategoryFilter("all");
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Templates Content */}
      {loading ? (
        <div className="flex justify-center py-24">
          <WorkspaceLoader />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div
          className={`text-center py-16 px-4 rounded-2xl border ${
            isLight ? "bg-white border-slate-200" : "bg-[#0F172A]/40 border-[#1E293B]"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              isLight ? "bg-blue-50 text-blue-500" : "bg-blue-950/40 text-blue-400"
            }`}
          >
            <FiMail className="w-8 h-8" />
          </div>
          <h3
            className={`text-base font-bold mb-1 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            No email templates found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            {searchQuery || categoryFilter !== "all"
              ? "No templates match your search or filter criteria. Try clearing filters."
              : "Get started by creating your first system email template for your users."}
          </p>
          <Button
            size="sm"
            radius="md"
            color="primary"
            className="font-bold"
            startContent={<FiPlus className="text-sm" />}
            onPress={handleOpenCreateModal}
          >
            Create New Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((template) => {
            const hasCover = Boolean(template.mainImage);
            return (
              <div
                key={template._id}
                className={`flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 group hover:shadow-lg ${
                  isLight
                    ? "bg-white border-slate-200 hover:border-blue-300 shadow-sm"
                    : "bg-[#0F172A]/70 border-[#1E293B] hover:border-blue-800/80"
                }`}
              >
                {/* Image Banner */}
                <div
                  className={`relative h-44 overflow-hidden flex items-center justify-center ${
                    isLight ? "bg-slate-100" : "bg-[#111A2E]"
                  }`}
                >
                  {hasCover ? (
                    <img
                      src={template.mainImage}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{
                          backgroundColor: `${template.designOptions?.headerColor || "#20a9f8"}20`,
                          color: template.designOptions?.headerColor || "#20a9f8",
                        }}
                      >
                        <FiMail className="w-7 h-7" />
                      </div>
                      <span className="text-[11px] font-medium tracking-wide">
                        {template.designOptions?.organizationName || "System Template"}
                      </span>
                    </div>
                  )}

                  {/* Header overlay badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {template.isDefault ? (
                      <span className="bg-slate-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wider uppercase">
                        Default
                      </span>
                    ) : (
                      <span className="bg-[#20a9f8] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wider uppercase">
                        Admin
                      </span>
                    )}
                  </div>

                  {template.usageCount > 0 && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <FiStar className="w-3 h-3" />
                      <span>{template.usageCount} uses</span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-sm font-bold line-clamp-1 group-hover:text-[#20a9f8] transition-colors ${
                          isLight ? "text-slate-900" : "text-white"
                        }`}
                      >
                        {template.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <CampaignCategoryChip category={template.category} />
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                          isLight
                            ? "bg-slate-50 text-slate-600 border-slate-200"
                            : "bg-[#111A2E] text-slate-300 border-[#1E2B45]"
                        }`}
                      >
                        Subject: {template.subjectLine}
                      </span>
                    </div>

                    <p
                      className={`text-xs line-clamp-2 mt-1 leading-relaxed ${
                        isLight ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {template.description || "No description provided."}
                    </p>

                    {template.tags && template.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {template.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isLight
                                ? "bg-slate-100 text-slate-600"
                                : "bg-[#1E293B] text-slate-300"
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div
                    className={`pt-3 border-t flex items-center justify-between gap-2 ${
                      isLight ? "border-slate-100" : "border-[#1E293B]"
                    }`}
                  >
                    <Button
                      size="sm"
                      radius="md"
                      variant="flat"
                      className="flex-1 font-bold"
                      startContent={<FiEye className="w-3.5 h-3.5" />}
                      onPress={() => handleOpenViewModal(template)}
                    >
                      Preview
                    </Button>

                    <Button
                      size="sm"
                      radius="md"
                      isIconOnly
                      variant="bordered"
                      className="border-small"
                      onPress={() => handleOpenEditModal(template)}
                      title="Edit template"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      radius="md"
                      isIconOnly
                      variant="bordered"
                      color="danger"
                      className="border-small"
                      onPress={() => setDeleteModalTarget(template)}
                      title="Delete template"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HeroUI Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          if (!open && !saving) setIsModalOpen(false);
        }}
        size="4xl"
        placement="center"
        scrollBehavior="inside"
        classNames={{
          closeButton: "cursor-pointer",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 p-5">
            <h3 className="text-base font-bold leading-none">
              {editingTemplate ? "Edit System Email Template" : "Create System Email Template"}
            </h3>
            <p className="text-xs text-default-500 font-normal">
              This template will be available to all client accounts across the platform.
            </p>
          </ModalHeader>

          <ModalBody className="p-5 py-2">
            <form id="templateForm" onSubmit={handleSaveTemplate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  size="sm"
                  radius="sm"
                  label="Template Name"
                  placeholder="e.g., Professional Partnership Invitation"
                  labelPlacement="outside"
                  isRequired
                  value={name}
                  onValueChange={(val) => {
                    setName(val);
                    clearFieldError("name");
                  }}
                  isInvalid={!!formErrors.name}
                  errorMessage={formErrors.name}
                />

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-foreground">
                      Category <span className="text-danger">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCategory((prev) => !prev)}
                      className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      {isAddingNewCategory ? "Choose Existing" : "+ New Category"}
                    </button>
                  </div>

                  {isAddingNewCategory ? (
                    <div className="flex items-center gap-1.5">
                      <Input
                        size="sm"
                        radius="sm"
                        placeholder="Enter new category name..."
                        value={newCategoryName}
                        onValueChange={setNewCategoryName}
                        className="flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddNewCategory();
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        radius="sm"
                        color="primary"
                        className="font-bold shrink-0"
                        onPress={handleAddNewCategory}
                      >
                        Add
                      </Button>
                      <Button
                        size="sm"
                        radius="sm"
                        variant="bordered"
                        className="shrink-0"
                        onPress={() => {
                          setIsAddingNewCategory(false);
                          setNewCategoryName("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Select
                      size="sm"
                      radius="sm"
                      placeholder="Select a category"
                      aria-label="Category"
                      isRequired
                      selectedKeys={[category]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        if (selected) {
                          setCategory(selected);
                          clearFieldError("category");
                        }
                      }}
                      disableAnimation
                      popoverProps={{ disableAnimation: true, shouldCloseOnScroll: false }}
                    >
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat.value} textValue={cat.label}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                  {formErrors.category && (
                    <p className="text-[11px] text-danger">{formErrors.category}</p>
                  )}
                </div>
              </div>

              <Input
                size="sm"
                radius="sm"
                label="Email Subject Line"
                placeholder="e.g., Welcome to our Practice - Let's Build a Partnership!"
                labelPlacement="outside"
                isRequired
                value={subjectLine}
                onValueChange={(val) => {
                  setSubjectLine(val);
                  clearFieldError("subjectLine");
                }}
                isInvalid={!!formErrors.subjectLine}
                errorMessage={formErrors.subjectLine}
              />

              <Textarea
                size="sm"
                radius="sm"
                label="Description"
                placeholder="Brief summary of what this template is intended for..."
                labelPlacement="outside"
                value={description}
                onValueChange={setDescription}
              />

              {/* Branding & Design Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-dashed border-default-200 dark:border-default-100 bg-default-50/50 dark:bg-default-100/10">
                <Input
                  size="sm"
                  radius="sm"
                  label="Organization Name"
                  placeholder="e.g., Practice ROI"
                  labelPlacement="outside"
                  value={organizationName}
                  onValueChange={(val) => {
                    setOrganizationName(val);
                    clearFieldError("organizationName");
                  }}
                  isInvalid={!!formErrors.organizationName}
                  errorMessage={formErrors.organizationName}
                />

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-foreground">
                    Header Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={headerColor}
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="w-9 h-8 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <Input
                      size="sm"
                      radius="sm"
                      value={headerColor}
                      onValueChange={setHeaderColor}
                      className="uppercase font-mono flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-foreground">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-9 h-8 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <Input
                      size="sm"
                      radius="sm"
                      value={accentColor}
                      onValueChange={setAccentColor}
                      className="uppercase font-mono flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  size="sm"
                  radius="sm"
                  label="Primary CTA Button"
                  placeholder="e.g., Schedule Consultation"
                  labelPlacement="outside"
                  value={primaryButtonText}
                  onValueChange={setPrimaryButtonText}
                />

                <Input
                  size="sm"
                  radius="sm"
                  label="Secondary CTA Button (Optional)"
                  placeholder="e.g., View Details"
                  labelPlacement="outside"
                  value={secondaryButtonText}
                  onValueChange={setSecondaryButtonText}
                />

                <Input
                  size="sm"
                  radius="sm"
                  label="Tags (Comma-separated)"
                  placeholder="e.g., referral, welcome, news"
                  labelPlacement="outside"
                  value={tags}
                  onValueChange={setTags}
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-medium mb-1.5 text-foreground">
                  Cover Image (Optional)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <div
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer ${
                    coverImagePreview
                      ? "border-primary-400 bg-primary-50/20 dark:bg-primary-500/10"
                      : "border-default-200 hover:border-default-400"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {coverImagePreview ? (
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-20 h-14 rounded-lg overflow-hidden border border-default-300 shrink-0">
                        <img
                          src={coverImagePreview}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                          <FiCheckCircle className="w-4 h-4" />
                          <span>Image selected</span>
                        </div>
                        <p className="text-[11px] text-default-500 mt-0.5">
                          Click here if you want to change the image.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-2">
                      <div className="flex gap-2 text-default-400">
                        <FiUpload className="w-5 h-5" />
                        <FiImage className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium">Click to upload cover image</p>
                      <p className="text-[10px] text-default-400">
                        Recommended: 1200x630px (JPG, PNG, WebP)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Body Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-foreground">
                    Email Body Content <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px] text-default-500">
                    <span>Variables:</span>
                    {["[Recipient Name]", "[Your Name]", "[Practice Name]", "[City]"].map((p) => (
                      <Button
                        key={p}
                        size="sm"
                        radius="sm"
                        variant="flat"
                        className="h-6 px-1.5 text-[10px] font-mono"
                        onPress={() => {
                          if (editorRef.current) {
                            editorRef.current.insertText(p);
                          } else {
                            setBodyContent((prev) => prev + " " + p);
                          }
                        }}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>

                <div
                  className={`rounded-xl overflow-hidden border ${
                    formErrors.bodyContent ? "border-red-500" : "border-default-200 dark:border-default-100"
                  }`}
                >
                  <QuillEditor
                    ref={editorRef}
                    value={bodyContent}
                    onChange={(val) => {
                      setBodyContent(val);
                      clearFieldError("bodyContent");
                    }}
                    placeholder="Write your email body content here..."
                  />
                </div>
                {formErrors.bodyContent && (
                  <p className="text-[11px] text-red-500">{formErrors.bodyContent}</p>
                )}
              </div>
            </form>
          </ModalBody>

          <ModalFooter className="p-5 pt-3">
            <Button
              size="sm"
              radius="md"
              variant="bordered"
              onPress={() => setIsModalOpen(false)}
              isDisabled={saving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              radius="md"
              color="primary"
              type="submit"
              form="templateForm"
              isLoading={saving}
              className="font-bold"
              startContent={!saving && <FiCheck className="w-4 h-4" />}
            >
              {editingTemplate ? "Update Template" : "Create Template"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* HeroUI View / Preview Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        size="2xl"
        placement="center"
        scrollBehavior="inside"
        classNames={{
          closeButton: "cursor-pointer",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2.5">
              {viewingTemplate && <CampaignCategoryChip category={viewingTemplate.category} />}
              <h3 className="text-sm font-bold line-clamp-1">{viewingTemplate?.name}</h3>
            </div>
          </ModalHeader>

          <ModalBody className="p-6 bg-default-50/70 dark:bg-default-100/20">
            {viewingTemplate && (
              <div className="max-w-xl mx-auto bg-background rounded-2xl shadow-md border border-default-200 overflow-hidden">
                {/* Header Color Banner */}
                <div
                  className="p-6 text-white text-center"
                  style={{
                    backgroundColor: viewingTemplate.designOptions?.headerColor || "#0ea5e9",
                  }}
                >
                  <h2 className="text-xl font-black tracking-tight">
                    {viewingTemplate.designOptions?.organizationName || "Practice ROI"}
                  </h2>
                  <p className="text-xs opacity-90 mt-1">{viewingTemplate.subjectLine}</p>
                </div>

                {/* Main Image if any */}
                {viewingTemplate.mainImage && (
                  <div className="h-48 w-full overflow-hidden bg-default-100">
                    <img
                      src={viewingTemplate.mainImage}
                      alt={viewingTemplate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Email HTML Body */}
                <div
                  className="p-6 text-sm text-foreground prose dark:prose-invert max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: viewingTemplate.bodyContent }}
                />

                {/* CTA Buttons */}
                <div className="p-6 pt-0 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {viewingTemplate.designOptions?.buttonText && (
                    <Button
                      size="sm"
                      radius="md"
                      className="font-bold text-white shadow-sm"
                      style={{
                        backgroundColor: viewingTemplate.designOptions?.accentColor || "#f97316",
                      }}
                    >
                      {viewingTemplate.designOptions.buttonText}
                    </Button>
                  )}
                  {viewingTemplate.designOptions?.secondaryButtonText && (
                    <Button size="sm" radius="md" variant="bordered">
                      {viewingTemplate.designOptions.secondaryButtonText}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter className="p-4 flex items-center justify-between">
            <div className="text-xs text-default-400">
              {viewingTemplate && `Created: ${new Date(viewingTemplate.createdAt).toLocaleDateString()}`}
            </div>
            <Button
              size="sm"
              radius="md"
              color="primary"
              className="font-bold"
              onPress={() => {
                if (viewingTemplate) {
                  setIsViewModalOpen(false);
                  handleOpenEditModal(viewingTemplate);
                }
              }}
            >
              Edit Template
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* HeroUI Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteModalTarget)}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteModalTarget(null);
        }}
        size="md"
        placement="center"
        classNames={{
          closeButton: "cursor-pointer",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 p-5">
            <div className="w-10 h-10 rounded-xl bg-danger-50 text-danger flex items-center justify-center mb-1">
              <FiTrash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">Delete System Email Template?</h3>
          </ModalHeader>

          <ModalBody className="p-5 py-2">
            <p className="text-xs text-default-500 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">"{deleteModalTarget?.name}"</strong>? This will remove
              the template from all client dashboards. This action cannot be undone.
            </p>
          </ModalBody>

          <ModalFooter className="p-5 pt-3">
            <Button
              size="sm"
              radius="md"
              variant="bordered"
              onPress={() => setDeleteModalTarget(null)}
              isDisabled={deleting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              radius="md"
              color="danger"
              isLoading={deleting}
              className="font-bold"
              onPress={handleDeleteConfirm}
            >
              Delete Template
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EmailTemplatesTab;
