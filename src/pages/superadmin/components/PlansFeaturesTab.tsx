import React, { useState, useEffect } from "react";
import {
  PlanData,
  PlanFeatureItem,
  fetchPlansAndFeatures,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  addPlanFeatureItem,
  updatePlanFeatureItem,
  togglePlanFeatureItemStatus,
  deletePlanFeatureItem,
} from "../../../services/planFeature";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiStar,
  FiDollarSign,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { addToast } from "@heroui/react";
import { WorkspaceLoader } from "../../../components/common/LoadingState";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";

interface PlansFeaturesTabProps {
  isLight: boolean;
}

const PlansFeaturesTab: React.FC<PlansFeaturesTabProps> = ({ isLight }) => {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCycle, setActiveCycle] = useState<"monthly" | "yearly">("monthly");

  const [inlineFeatureInputs, setInlineFeatureInputs] = useState<Record<string, string>>({});

  const [editingFeatureItem, setEditingFeatureItem] = useState<{
    planId: string;
    featureId: string;
    name: string;
  } | null>(null);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanData | null>(null);
  const [planForm, setPlanForm] = useState<{
    name: string;
    price: string;
    annualPrice: string;
    discountPercent: string;
    description: string;
    yearlyDescription: string;
    isPopular: boolean;
    monthlyFeatures: { name: string; isEnabled: boolean }[];
    yearlyFeatures: { name: string; isEnabled: boolean }[];
  }>({
    name: "",
    price: "",
    annualPrice: "",
    discountPercent: "",
    description: "",
    yearlyDescription: "",
    isPopular: false,
    monthlyFeatures: [],
    yearlyFeatures: [],
  });
  const [modalActiveCycle, setModalActiveCycle] = useState<"monthly" | "yearly">("monthly");
  const [newModalFeatureInput, setNewModalFeatureInput] = useState("");
  const [savingPlan, setSavingPlan] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: "plan" | "feature";
    planId: string;
    featureId?: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchPlansAndFeatures();
      const data = res?.data || res;
      if (data && Array.isArray(data.plans)) {
        setPlans(data.plans);
      }
    } catch (err: any) {
      console.error("Failed to fetch plans:", err);
      addToast({
        title: "Error",
        description: "Failed to load subscription plans",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPlanModal = (plan?: PlanData) => {
    setModalActiveCycle("monthly"); 
    setFormErrors({});
    if (plan) {
      setEditingPlan(plan);
      const computedDiscount =
        plan.discountPercent !== undefined && plan.discountPercent !== null
          ? String(plan.discountPercent)
          : plan.price > 0 && plan.annualPrice
          ? String(Math.round(((plan.price - plan.annualPrice) / plan.price) * 100))
          : "";

      setPlanForm({
        name: plan.name,
        price: String(plan.price),
        annualPrice: plan.annualPrice ? String(plan.annualPrice) : "",
        discountPercent: computedDiscount,
        description: plan.description || "",
        yearlyDescription: plan.yearlyDescription || plan.description || "",
        isPopular: !!plan.isPopular,
        monthlyFeatures: (plan.monthlyFeatures || plan.featuresList || []).map((f) => ({
          name: f.name,
          isEnabled: f.isEnabled,
        })),
        yearlyFeatures: (plan.yearlyFeatures || plan.featuresList || []).map((f) => ({
          name: f.name,
          isEnabled: f.isEnabled,
        })),
      });
    } else {
      setEditingPlan(null);
      setPlanForm({
        name: "",
        price: "",
        annualPrice: "",
        discountPercent: "",
        description: "",
        yearlyDescription: "",
        isPopular: false,
        monthlyFeatures: [],
        yearlyFeatures: [],
      });
    }
    setNewModalFeatureInput("");
    setIsPlanModalOpen(true);
  };

  const handleAddFeatureToModalForm = () => {
    const text = newModalFeatureInput.trim();
    if (!text) {
      setFormErrors((prev) => ({ ...prev, feature: "Feature title cannot be empty" }));
      return;
    }
    if (text.length > 100) {
      setFormErrors((prev) => ({ ...prev, feature: "Feature title cannot exceed 100 characters" }));
      return;
    }

    if (modalActiveCycle === "monthly") {
      const existsMonthly = planForm.monthlyFeatures.some(
        (f) => f.name.toLowerCase() === text.toLowerCase()
      );
      if (existsMonthly) {
        setFormErrors((prev) => ({ ...prev, feature: "Feature already added to Monthly list" }));
        return;
      }
      const existsYearly = planForm.yearlyFeatures.some(
        (f) => f.name.toLowerCase() === text.toLowerCase()
      );
      setPlanForm((prev) => ({
        ...prev,
        monthlyFeatures: [...prev.monthlyFeatures, { name: text, isEnabled: true }],
        yearlyFeatures: existsYearly
          ? prev.yearlyFeatures
          : [...prev.yearlyFeatures, { name: text, isEnabled: true }],
      }));
    } else {
      const existsYearly = planForm.yearlyFeatures.some(
        (f) => f.name.toLowerCase() === text.toLowerCase()
      );
      if (existsYearly) {
        setFormErrors((prev) => ({ ...prev, feature: "Feature already added to Yearly list" }));
        return;
      }
      setPlanForm((prev) => ({
        ...prev,
        yearlyFeatures: [...prev.yearlyFeatures, { name: text, isEnabled: true }],
      }));
    }

    setFormErrors((prev) => ({ ...prev, feature: undefined }));
    setNewModalFeatureInput("");
  };

  const handleRemoveFeatureFromModalForm = (index: number) => {
    const targetKey = modalActiveCycle === "yearly" ? "yearlyFeatures" : "monthlyFeatures";
    setPlanForm((prev) => ({
      ...prev,
      [targetKey]: prev[targetKey].filter((_, i) => i !== index),
    }));
  };

  const handleToggleFeatureInModalForm = (index: number) => {
    const targetKey = modalActiveCycle === "yearly" ? "yearlyFeatures" : "monthlyFeatures";
    setPlanForm((prev) => ({
      ...prev,
      [targetKey]: prev[targetKey].map((f, i) =>
        i === index ? { ...f, isEnabled: !f.isEnabled } : f
      ),
    }));
  };

  const handleSavePlan = async () => {
    const errors: { name?: string; price?: string; annualPrice?: string } = {};

    if (!planForm.name.trim()) {
      errors.name = "Plan name is required";
    } else if (planForm.name.trim().length > 50) {
      errors.name = "Plan name cannot exceed 50 characters";
    }

    if (!planForm.price || isNaN(Number(planForm.price)) || Number(planForm.price) <= 0) {
      errors.price = "Valid price is required (e.g. 199 or 199.99)";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    try {
      setSavingPlan(true);
      if (editingPlan && editingPlan._id) {
        await updatePricingPlan(editingPlan._id, {
          name: planForm.name,
          price: Number(planForm.price),
          annualPrice: planForm.annualPrice ? Number(planForm.annualPrice) : undefined,
          discountPercent: planForm.discountPercent !== "" ? Number(planForm.discountPercent) : 0,
          description: planForm.description,
          yearlyDescription: planForm.yearlyDescription || planForm.description,
          isPopular: planForm.isPopular,
          monthlyFeatures: planForm.monthlyFeatures,
          yearlyFeatures: planForm.yearlyFeatures,
        });
        addToast({ title: "Plan Saved", description: `Successfully updated '${planForm.name}'`, color: "success" });
      } else {
        await createPricingPlan({
          name: planForm.name,
          price: Number(planForm.price),
          annualPrice: planForm.annualPrice ? Number(planForm.annualPrice) : undefined,
          discountPercent: planForm.discountPercent !== "" ? Number(planForm.discountPercent) : 0,
          description: planForm.description,
          yearlyDescription: planForm.yearlyDescription || planForm.description,
          isPopular: planForm.isPopular,
          monthlyFeatures: planForm.monthlyFeatures,
          yearlyFeatures: planForm.yearlyFeatures,
        });
        addToast({ title: "Plan Created", description: `Successfully created plan '${planForm.name}'`, color: "success" });
      }
      setIsPlanModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error(err);
      addToast({ title: "Error", description: err.response?.data?.message || "Failed to save plan", color: "danger" });
    } finally {
      setSavingPlan(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmTarget) return;
    try {
      if (deleteConfirmTarget.type === "plan") {
        await deletePricingPlan(deleteConfirmTarget.planId);
        addToast({
          title: "Plan Deleted",
          description: `Plan '${deleteConfirmTarget.title}' has been deleted`,
          color: "success",
        });
      } else if (deleteConfirmTarget.type === "feature" && deleteConfirmTarget.featureId) {
        await deletePlanFeatureItem(deleteConfirmTarget.planId, deleteConfirmTarget.featureId, activeCycle);
        addToast({
          title: "Feature Removed",
          description: `Removed '${deleteConfirmTarget.title}' from plan`,
          color: "success",
        });
      }
      setDeleteConfirmTarget(null);
      loadData();
    } catch (err: any) {
      console.error(err);
      addToast({ title: "Error", description: "Failed to perform deletion", color: "danger" });
    }
  };

  const handleAddFeatureInline = async (plan: PlanData) => {
    if (!plan._id) return;
    const text = (inlineFeatureInputs[plan._id] || "").trim();
    if (!text) return;

    try {
      await addPlanFeatureItem(plan._id, { name: text, isEnabled: true, cycle: activeCycle });
      addToast({ title: "Feature Added", description: `Added '${text}' (${activeCycle}) to ${plan.name}`, color: "success" });
      setInlineFeatureInputs((prev) => ({ ...prev, [plan._id!]: "" }));
      loadData();
    } catch (err: any) {
      console.error(err);
      addToast({ title: "Error", description: "Failed to add feature to plan", color: "danger" });
    }
  };

  const handleSaveEditedFeature = async (plan: PlanData) => {
    if (!editingFeatureItem || !plan._id) return;
    const newName = editingFeatureItem.name.trim();
    if (!newName) {
      addToast({ title: "Validation Error", description: "Feature name cannot be empty", color: "warning" });
      return;
    }

    try {
      await updatePlanFeatureItem(plan._id, editingFeatureItem.featureId, { name: newName, cycle: activeCycle });
      addToast({ title: "Feature Updated", description: `Updated feature to '${newName}'`, color: "success" });
      setEditingFeatureItem(null);
      loadData();
    } catch (err: any) {
      console.error(err);
      addToast({ title: "Error", description: "Failed to update feature", color: "danger" });
    }
  };

  const handleTogglePlanFeature = async (plan: PlanData, feat: PlanFeatureItem) => {
    if (!plan._id || !feat._id) return;
    const newStatus = !feat.isEnabled;
    const targetKey = activeCycle === "yearly" ? "yearlyFeatures" : "monthlyFeatures";

    // Optimistic UI update
    setPlans((prev) =>
      prev.map((p) => {
        if (p._id === plan._id) {
          const list = p[targetKey] || p.featuresList || [];
          return {
            ...p,
            [targetKey]: list.map((f) => (f._id === feat._id ? { ...f, isEnabled: newStatus } : f)),
          };
        }
        return p;
      })
    );

    try {
      await togglePlanFeatureItemStatus(plan._id, feat._id, newStatus, activeCycle);
      addToast({
        title: newStatus ? "Feature Enabled" : "Feature Disabled",
        description: `'${feat.name}' is now ${newStatus ? "enabled" : "disabled"}`,
        color: newStatus ? "success" : "warning",
      });
    } catch (err: any) {
      console.error(err);
      loadData(); // revert
      addToast({ title: "Error", description: "Failed to update feature status", color: "danger" });
    }
  };

  if (loading) {
    return <WorkspaceLoader message="LOADING..." minHeight="min-h-[400px]" />;
  }

  return (
    <div className="space-y-8">
      {/* Header Banner & Monthly / Yearly Toggle Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className={`text-2xl font-extrabold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
            <FiDollarSign className="text-[#20a9f8]" />
            <span>Subscription Plans & Features</span>
          </h1>
          <p className={`text-xs mt-1 font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            Manage plan prices, descriptions, and feature lists. Switch between Monthly and Yearly cycles.
          </p>
        </div>

        <div className="flex items-center gap-4 self-start md:self-auto shrink-0">
          {/* Monthly / Yearly Cycle Switch */}
          <div className="bg-slate-200/80 dark:bg-[#111A2E] p-1 rounded-2xl flex items-center gap-1 border border-slate-300/60 dark:border-[#1E2B45]">
            <button
              type="button"
              onClick={() => setActiveCycle("monthly")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeCycle === "monthly"
                  ? "bg-[#20a9f8] text-white shadow-md shadow-[#20a9f8]/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setActiveCycle("yearly")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeCycle === "yearly"
                  ? "bg-[#20a9f8] text-white shadow-md shadow-[#20a9f8]/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Yearly</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenPlanModal()}
            className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#20a9f8]/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <FiPlus className="text-base" />
            <span>Add New Plan</span>
          </button>
        </div>
      </div>

      {/* Dynamic Plan Cards Grid or Empty State */}
      {plans.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950/40 text-[#20a9f8] flex items-center justify-center mx-auto text-2xl">
            <FiDollarSign />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
              No Subscription Plans Added
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto font-medium">
              There are currently no subscription plans in the database. Click below to create your first plan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenPlanModal()}
            className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-[#20a9f8]/20 inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <FiPlus className="text-base" />
            <span>Create Your First Plan</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          const rawFeatures =
            activeCycle === "yearly"
              ? plan.yearlyFeatures || plan.featuresList
              : plan.monthlyFeatures || plan.featuresList;

          const featureItems: PlanFeatureItem[] =
            Array.isArray(rawFeatures) && rawFeatures.length > 0
              ? rawFeatures
              : (plan.features || []).map((f, i) => ({ _id: `feat_${i}`, name: f, isEnabled: true }));

          const annualMonthlyPrice =
            plan.annualPrice ||
            (plan.discountPercent && plan.discountPercent > 0
              ? Math.round(plan.price * (1 - plan.discountPercent / 100))
              : plan.price);
          const displayPrice = activeCycle === "yearly" ? annualMonthlyPrice : plan.price;

          // Savings calculation
          const yearlyCostFull = plan.price * 12;
          const yearlyCostDiscounted = annualMonthlyPrice * 12;
          const savingsPerYear = yearlyCostFull - yearlyCostDiscounted;
          const savingsPercent =
            plan.discountPercent && plan.discountPercent > 0
              ? plan.discountPercent
              : plan.price > 0 && annualMonthlyPrice < plan.price
              ? Math.round(((plan.price - annualMonthlyPrice) / plan.price) * 100)
              : 0;

          return (
            <div
              key={plan._id || plan.planId}
              className={`rounded-3xl border p-5 sm:p-6 relative flex flex-col justify-between transition-all h-full ${
                plan.isPopular
                  ? isLight
                    ? "bg-sky-50/40 border-[#20a9f8] ring-2 ring-[#20a9f8]/20 shadow-lg"
                    : "bg-[#111C35] border-[#20a9f8] ring-2 ring-[#20a9f8]/20 shadow-lg"
                  : isLight
                  ? "bg-white border-slate-200/90 shadow-sm"
                  : "bg-[#0F172A] border-[#1E293B]"
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#20a9f8] text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <FiStar className="text-xs fill-white" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                {/* Plan Header & Price + TOP RIGHT ACTION ICONS */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className={`text-xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-xs mt-1 font-medium min-h-[32px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      {activeCycle === "yearly" && plan.yearlyDescription ? plan.yearlyDescription : plan.description}
                    </p>
                  </div>

                  {/* Plan Heading Top-Right Action Icons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenPlanModal(plan)}
                      className="p-2 rounded-xl text-slate-400 hover:text-[#20a9f8] hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer"
                      title="Edit Plan"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    {plan._id && (
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirmTarget({
                            type: "plan",
                            planId: plan._id!,
                            title: plan.name,
                          })
                        }
                        className="p-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete Plan"
                      >
                        <FiTrash2 className="text-sm text-red-500" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`text-3xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>
                    ${displayPrice}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    /month
                  </span>
                </div>

                {activeCycle === "yearly" ? (
                  <div className="mt-1">
                    {savingsPercent > 0 && savingsPerYear > 0 && (
                      <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400">
                        Save ${savingsPerYear}/year ({savingsPercent}% off)
                      </p>
                    )}
                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                      ${yearlyCostDiscounted} billed annually
                    </p>
                  </div>
                ) : (
                  <div className="mt-1">
                    <p className="text-xs font-medium text-slate-400">
                      Billed monthly
                    </p>
                  </div>
                )}

                {/* Features Section inside Plan Card */}
                <div className="mt-6 space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {activeCycle.toUpperCase()} FEATURES ({featureItems.length})
                    </span>
                  </div>

                  {/* ADD FEATURE INPUT SHOWS ON TOP OF FEATURE LIST */}
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={inlineFeatureInputs[plan._id!] || ""}
                      onChange={(e) =>
                        setInlineFeatureInputs({
                          ...inlineFeatureInputs,
                          [plan._id!]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddFeatureInline(plan);
                        }
                      }}
                      placeholder={`Add ${activeCycle} feature...`}
                      className={`flex-1 text-xs rounded-xl px-3 py-2 border focus:outline-none ${
                        isLight
                          ? "bg-white border-slate-300 text-slate-900 focus:border-[#20a9f8]"
                          : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-[#20a9f8]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddFeatureInline(plan)}
                      disabled={!(inlineFeatureInputs[plan._id!] || "").trim()}
                      className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      + Add
                    </button>
                  </div>

                  {/* UNIFORM FEATURE BOX HEIGHT ACROSS ALL PLAN CARDS */}
                  <div className="space-y-2.5 h-[360px] overflow-y-auto pr-1">
                    {featureItems.length === 0 ? (
                      <p className="text-xs italic text-slate-400 py-2">No {activeCycle} features added yet.</p>
                    ) : (
                      featureItems.map((feat, fIdx) => {
                        const featureKey = feat._id || `feat_${fIdx}`;
                        const isEditingThis =
                          editingFeatureItem !== null &&
                          editingFeatureItem.planId === plan._id &&
                          editingFeatureItem.featureId === featureKey;

                        if (isEditingThis && editingFeatureItem) {
                          const currentEditing = editingFeatureItem;
                          return (
                            <div
                              key={featureKey}
                              className="flex items-center gap-2 p-2 rounded-xl border border-[#20a9f8] bg-sky-50/20 dark:bg-sky-950/20 text-xs w-full"
                            >
                              <input
                                type="text"
                                value={currentEditing.name}
                                onChange={(e) =>
                                  setEditingFeatureItem({
                                    planId: currentEditing.planId,
                                    featureId: currentEditing.featureId,
                                    name: e.target.value,
                                  })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSaveEditedFeature(plan);
                                  } else if (e.key === "Escape") {
                                    setEditingFeatureItem(null);
                                  }
                                }}
                                className={`flex-1 text-xs rounded-lg px-2.5 py-1.5 border focus:outline-none font-medium ${
                                  isLight
                                    ? "bg-white border-slate-300 text-slate-900"
                                    : "bg-[#0B101D] border-[#1E2B45] text-slate-100"
                                }`}
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEditedFeature(plan)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                              >
                                <FiCheck className="text-xs" />
                                <span>Save</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingFeatureItem(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer shrink-0"
                              >
                                <FiX className="text-sm" />
                              </button>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={featureKey}
                            className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs transition-colors ${
                              !feat.isEnabled
                                ? isLight ? "bg-slate-50 border-slate-200 opacity-60" : "bg-slate-900/40 border-[#1E293B] opacity-60"
                                : isLight ? "bg-slate-50/70 border-slate-200/80" : "bg-[#111A2E] border-[#1E2B45]"
                            }`}
                          >
                            {/* Toggle Switch + Feature Name */}
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() => handleTogglePlanFeature(plan, feat)}
                                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 ${
                                  feat.isEnabled ? "bg-emerald-500" : isLight ? "bg-slate-300" : "bg-slate-700"
                                }`}
                                title={feat.isEnabled ? "Click to disable feature" : "Click to enable feature"}
                              >
                                <div
                                  className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                                    feat.isEnabled ? "translate-x-4" : "translate-x-0"
                                  }`}
                                />
                              </button>
                              <span
                                className={`truncate font-semibold ${
                                  !feat.isEnabled
                                    ? "line-through text-slate-400"
                                    : isLight ? "text-slate-800" : "text-slate-200"
                                }`}
                              >
                                {feat.name}
                              </span>
                            </div>

                            {/* Actions at the end: EVERY FEATURE SHOWS EDIT & RED DELETE ICON */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingFeatureItem({
                                    planId: plan._id!,
                                    featureId: featureKey,
                                    name: feat.name,
                                  })
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#20a9f8] hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer"
                                title="Edit feature title"
                              >
                                <FiEdit2 className="text-xs" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteConfirmTarget({
                                    type: "feature",
                                    planId: plan._id!,
                                    featureId: featureKey,
                                    title: feat.name,
                                  })
                                }
                                className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                title="Delete feature"
                              >
                                <FiTrash2 className="text-xs text-red-500" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}

      {/* UNIFIED ADD / EDIT PLAN MODAL */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsPlanModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className={`relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 border p-6 space-y-5 animate-in fade-in-50 zoom-in-95 duration-150 ${
              isLight ? "bg-white border-slate-200 text-slate-900" : "bg-[#0F172A] border-[#1E293B] text-slate-100"
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FiDollarSign className="text-[#20a9f8]" />
                <span>{editingPlan ? "Edit Plan & Features" : "Create New Plan & Features"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Top Modal Setup Cycle Toggle */}
            <div className="bg-slate-100 dark:bg-[#111A2E] p-1 rounded-2xl flex items-center gap-1 border border-slate-200 dark:border-[#1E2B45]">
              <button
                type="button"
                onClick={() => setModalActiveCycle("monthly")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                  modalActiveCycle === "monthly"
                    ? "bg-[#20a9f8] text-white shadow-sm shadow-[#20a9f8]/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Monthly Setup
              </button>
              <button
                type="button"
                onClick={() => setModalActiveCycle("yearly")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                  modalActiveCycle === "yearly"
                    ? "bg-[#20a9f8] text-white shadow-sm shadow-[#20a9f8]/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Yearly Setup
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm max-h-[65vh] overflow-y-auto pr-1">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Plan Name *</label>
                  <span className="text-[10px] text-slate-400 font-medium">{planForm.name.length}/50</span>
                </div>
                <input
                  type="text"
                  maxLength={50}
                  value={planForm.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= 50) {
                      setPlanForm({ ...planForm, name: val });
                      if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  placeholder="e.g. Starter, Professional, Enterprise"
                  className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium ${
                    formErrors.name
                      ? "border-red-500 ring-1 ring-red-500"
                      : isLight ? "bg-white border-slate-300" : "bg-[#111A2E] border-[#1E2B45]"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                    <FiAlertCircle /> {formErrors.name}
                  </p>
                )}
              </div>

              {modalActiveCycle === "monthly" ? (
                /* MONTHLY CYCLE INPUTS */
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 text-xs">
                        Monthly Price ($) *
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={planForm.price}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                            const numP = Number(val);
                            const numDisc = Number(planForm.discountPercent);
                            let computedAnnual = planForm.annualPrice;
                            if (numP > 0 && numDisc > 0) {
                              computedAnnual = String(Math.round(numP * (1 - numDisc / 100)));
                            }
                            setPlanForm({ ...planForm, price: val, annualPrice: computedAnnual });
                            if (formErrors.price) setFormErrors((prev) => ({ ...prev, price: undefined }));
                          }
                        }}
                        placeholder="399 or 399.99"
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${
                          formErrors.price
                            ? "border-red-500 ring-1 ring-red-500"
                            : isLight ? "bg-white border-slate-300" : "bg-[#111A2E] border-[#1E2B45]"
                        }`}
                      />
                      {formErrors.price && (
                        <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                          <FiAlertCircle /> {formErrors.price}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 text-xs">
                        Popular Status
                      </label>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="isPopularModal"
                          checked={planForm.isPopular}
                          onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                          className="w-4 h-4 rounded text-[#20a9f8] focus:ring-[#20a9f8] cursor-pointer"
                        />
                        <label htmlFor="isPopularModal" className="text-xs font-bold cursor-pointer select-none">
                          Mark "Most Popular"
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700 dark:text-slate-300">
                        Monthly Description
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">{planForm.description.length}/200</span>
                    </div>
                    <input
                      type="text"
                      maxLength={200}
                      value={planForm.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length <= 200) {
                          setPlanForm((prev) => ({
                            ...prev,
                            description: val,
                            yearlyDescription: prev.yearlyDescription === prev.description ? val : prev.yearlyDescription,
                          }));
                        }
                      }}
                      placeholder="Most popular for growing practices"
                      className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium ${
                        isLight ? "bg-white border-slate-300" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                    />
                  </div>
                </>
              ) : (
                /* YEARLY CYCLE INPUTS */
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 text-xs">
                        Save Discount (% off)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={planForm.discountPercent}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || (/^\d+$/.test(val) && Number(val) <= 100)) {
                            const numDisc = Number(val);
                            const numP = Number(planForm.price);
                            let computedAnnual = planForm.annualPrice;
                            if (numP > 0 && numDisc >= 0) {
                              computedAnnual = String(Math.round(numP * (1 - numDisc / 100)));
                            }
                            setPlanForm({ ...planForm, discountPercent: val, annualPrice: computedAnnual });
                          }
                        }}
                        placeholder="17"
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${
                          isLight ? "bg-white border-slate-300" : "bg-[#111A2E] border-[#1E2B45]"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 text-xs">
                        Annual Price ($/mo)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={planForm.annualPrice}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                            const numAnn = Number(val);
                            const numP = Number(planForm.price);
                            let computedDisc = planForm.discountPercent;
                            if (numP > 0 && numAnn > 0 && numAnn <= numP) {
                              computedDisc = String(Math.round(((numP - numAnn) / numP) * 100));
                            }
                            setPlanForm({ ...planForm, annualPrice: val, discountPercent: computedDisc });
                          }
                        }}
                        placeholder="330"
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${
                          isLight ? "bg-white border-slate-300" : "bg-[#111A2E] border-[#1E2B45]"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700 dark:text-slate-300">
                        Yearly Description
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">{planForm.yearlyDescription.length}/200</span>
                    </div>
                    <input
                      type="text"
                      maxLength={200}
                      value={planForm.yearlyDescription}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length <= 200) {
                          setPlanForm({ ...planForm, yearlyDescription: val });
                        }
                      }}
                      placeholder="Save up to 17% on annual billing for growing practices"
                      className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium ${
                        isLight ? "bg-white border-slate-300" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                    />
                  </div>

                  {/* Live Yearly Savings Calculation Preview */}
                  <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs space-y-1">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block text-xs">
                      Save ${Math.max(0, (Number(planForm.price) || 0) * 12 - (Number(planForm.annualPrice) || 0) * 12)}/year ({planForm.discountPercent || 0}% off)
                    </span>
                    <span className="font-medium text-slate-500 dark:text-slate-400 block text-[11px]">
                      ${(Number(planForm.annualPrice) || 0) * 12} billed annually (${planForm.annualPrice || 0}/month)
                    </span>
                  </div>
                </>
              )}

              {/* FEATURES SECTION IN MODAL WITH MONTHLY / YEARLY TABS */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                {/* Modal Features Header */}
                <div className="flex items-center justify-between gap-2 border-b pb-2.5 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {modalActiveCycle.toUpperCase()} FEATURES ({planForm[modalActiveCycle === "yearly" ? "yearlyFeatures" : "monthlyFeatures"].length})
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        maxLength={100}
                        value={newModalFeatureInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.length <= 100) {
                            setNewModalFeatureInput(val);
                            if (formErrors.feature) setFormErrors((prev) => ({ ...prev, feature: undefined }));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFeatureToModalForm();
                          }
                        }}
                        placeholder={`Enter ${modalActiveCycle} feature title...`}
                        className={`w-full text-xs rounded-xl px-3.5 py-2.5 border focus:outline-none ${
                          formErrors.feature
                            ? "border-red-500 ring-1 ring-red-500"
                            : isLight ? "bg-white border-slate-300" : "bg-[#111A2E] border-[#1E2B45]"
                        }`}
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-medium pointer-events-none">
                        {newModalFeatureInput.length}/100
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFeatureToModalForm}
                      disabled={!newModalFeatureInput.trim()}
                      className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      + Add Feature
                    </button>
                  </div>
                  {formErrors.feature && (
                    <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                      <FiAlertCircle /> {formErrors.feature}
                    </p>
                  )}
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {planForm[modalActiveCycle === "yearly" ? "yearlyFeatures" : "monthlyFeatures"].length === 0 ? (
                    <p className="text-xs italic text-slate-400">No {modalActiveCycle} features added to this plan draft yet.</p>
                  ) : (
                    planForm[modalActiveCycle === "yearly" ? "yearlyFeatures" : "monthlyFeatures"].map((f, fIdx) => (
                      <div
                        key={fIdx}
                        className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs ${
                          !f.isEnabled
                            ? isLight ? "bg-slate-100 opacity-60" : "bg-slate-900/60 opacity-60"
                            : isLight ? "bg-slate-50" : "bg-[#111A2E]"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatureInModalForm(fIdx)}
                            className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                              f.isEnabled ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          >
                            <div
                              className={`bg-white w-3 h-3 rounded-full transform transition-transform ${
                                f.isEnabled ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span className={`truncate font-semibold ${!f.isEnabled ? "line-through text-slate-400" : ""}`}>
                            {f.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeatureFromModalForm(fIdx)}
                          className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <FiX className="text-sm text-red-500" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlan}
                disabled={savingPlan}
                className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-[#20a9f8]/20 disabled:opacity-50"
              >
                {savingPlan ? "Saving..." : editingPlan ? "Save Plan & Features" : "Create Plan & Features"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DELETE MODAL MATCHING DASHBOARD DESIGN (SCREENSHOT 2) */}
      <DeleteConfirmationModal
        isOpen={!!deleteConfirmTarget}
        onClose={() => setDeleteConfirmTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteConfirmTarget?.type === "plan" ? "Plan" : "Feature"}`}
        description={
          deleteConfirmTarget?.type === "plan"
            ? `Are you sure you want to delete plan ${deleteConfirmTarget?.title} ? This action cannot be undone.`
            : `Are you sure you want to delete feature ${deleteConfirmTarget?.title} ? This action cannot be undone.`
        }
      />
    </div>
  );
};

export default PlansFeaturesTab;
