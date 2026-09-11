import React, { useState, useEffect } from "react";
import {
  PlanData, PlanFeatureItem, fetchPlansAndFeatures, createPricingPlan, updatePricingPlan, deletePricingPlan, addPlanFeatureItem,
  updatePlanFeatureItem, togglePlanFeatureItemStatus, deletePlanFeatureItem
} from "../../../services/planFeature";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiStar, FiDollarSign, FiX, FiAlertCircle, FiPackage } from "react-icons/fi";
import { addToast } from "@heroui/react";
import { WorkspaceLoader } from "../../../components/common/LoadingState";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";

import AddonsTab from "./AddonsTab";

interface PlansFeaturesTabProps {
  isLight: boolean;
}

const PlansFeaturesTab: React.FC<PlansFeaturesTabProps> = ({ isLight }) => {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardCycleTab, setCardCycleTab] = useState<Record<string, "monthly" | "yearly">>({});
  const [inlineFeatureInputs, setInlineFeatureInputs] = useState<Record<string, string>>({});
  const [editingFeatureItem, setEditingFeatureItem] = useState<{
    planId: string; featureId: string; name: string; cycle: "monthly" | "yearly";
  } | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanData | null>(null);
  const [modalCycleTab, setModalCycleTab] = useState<"monthly" | "yearly">("monthly");
  const [hasCopiedToYearlyInModal, setHasCopiedToYearlyInModal] = useState(false);
  const [planForm, setPlanForm] = useState<{
    name: string;
    description: string;
    isPopular: boolean;
    monthlyPrice: string;
    monthlyDiscountPercent: string;
    monthlyTotalValue: string;
    monthlyDescription: string;
    annualPrice: string;
    annualDiscountPercent: string;
    annualTotalValue: string;
    yearlyDescription: string;
    monthlyFeatures: { _id?: string; name: string; isEnabled: boolean }[];
    yearlyFeatures: { _id?: string; name: string; isEnabled: boolean }[];
  }>({
    name: "",
    description: "",
    isPopular: false,
    monthlyPrice: "",
    monthlyDiscountPercent: "",
    monthlyTotalValue: "",
    monthlyDescription: "",
    annualPrice: "",
    annualDiscountPercent: "",
    annualTotalValue: "",
    yearlyDescription: "",
    monthlyFeatures: [],
    yearlyFeatures: [],
  });

  const [newModalFeatureInput, setNewModalFeatureInput] = useState("");
  const [savingPlan, setSavingPlan] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
  const [activeMainTab, setActiveMainTab] = useState<"plans" | "addons">("plans");

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: "plan" | "feature";
    planId: string;
    featureId?: string;
    title: string;
    cycle?: "monthly" | "yearly";
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
    setFormErrors({});
    setModalCycleTab("monthly");
    if (plan) {
      setEditingPlan(plan);
      const tagDesc = plan.description || "";
      const mPrice = plan.monthlyPricing?.price ?? plan.price ?? "";
      const mDisc = plan.monthlyPricing?.discountPercent ?? 0;
      const mTot =
        plan.monthlyPricing?.totalValue &&
          plan.monthlyPricing?.totalValue !== 0 &&
          (mDisc > 0 || plan.monthlyPricing?.totalValue !== Number(mPrice))
          ? String(plan.monthlyPricing.totalValue)
          : "";
      const mDesc = plan.monthlyPricing?.description ?? "";
      const aPrice = plan.annualPricing?.price ?? plan.annualPrice ?? "";
      const aDisc = plan.annualPricing?.discountPercent ?? plan.discountPercent ?? 0;
      const aTot =
        plan.annualPricing?.totalValue ?? (Number(aPrice) > 0 ? Number(aPrice) * 12 : "");
      const aDesc = plan.annualPricing?.description ?? plan.yearlyDescription ?? "";
      const rawMonthlyFeats = plan.monthlyFeatures || plan.features || plan.featuresList || [];
      const rawYearlyFeats = plan.yearlyFeatures || plan.features || plan.featuresList || rawMonthlyFeats || [];
      const parsedMonthlyFeats = rawMonthlyFeats.map((f: any) => ({
        _id: typeof f === "string" ? undefined : f._id,
        name: typeof f === "string" ? f : f.name,
        isEnabled: typeof f === "string" ? true : !!f.isEnabled,
      }));
      const parsedYearlyFeats = rawYearlyFeats.map((f: any) => ({
        _id: typeof f === "string" ? undefined : f._id,
        name: typeof f === "string" ? f : f.name,
        isEnabled: typeof f === "string" ? true : !!f.isEnabled,
      }));
      setPlanForm({
        name: plan.name,
        description: tagDesc,
        isPopular: !!plan.isPopular,
        monthlyPrice: mPrice !== "" ? String(mPrice) : "",
        monthlyDiscountPercent: mDisc ? String(mDisc) : "",
        monthlyTotalValue: mTot !== "" ? String(mTot) : "",
        monthlyDescription: mDesc,
        annualPrice: aPrice !== "" ? String(aPrice) : "",
        annualDiscountPercent: aDisc ? String(aDisc) : "",
        annualTotalValue: aTot !== "" ? String(aTot) : "",
        yearlyDescription: aDesc,
        monthlyFeatures: parsedMonthlyFeats,
        yearlyFeatures: parsedYearlyFeats.length > 0 ? parsedYearlyFeats : parsedMonthlyFeats,
      });
      setHasCopiedToYearlyInModal(true);
    } else {
      setEditingPlan(null);
      setPlanForm({
        name: "",
        description: "",
        isPopular: false,
        monthlyPrice: "",
        monthlyDiscountPercent: "",
        monthlyTotalValue: "",
        monthlyDescription: "",
        annualPrice: "",
        annualDiscountPercent: "",
        annualTotalValue: "",
        yearlyDescription: "",
        monthlyFeatures: [],
        yearlyFeatures: [],
      });
      setHasCopiedToYearlyInModal(false);
    }
    setNewModalFeatureInput("");
    setIsPlanModalOpen(true);
  };

  const handleSwitchModalTab = (tab: "monthly" | "yearly") => {
    setModalCycleTab(tab);
    if (
      tab === "yearly" &&
      !hasCopiedToYearlyInModal &&
      planForm.yearlyFeatures.length === 0 &&
      planForm.monthlyFeatures.length > 0
    ) {
      setPlanForm((prev) => ({
        ...prev,
        yearlyFeatures: prev.monthlyFeatures.map((f) => ({ ...f })),
      }));
      setHasCopiedToYearlyInModal(true);
    }
  };

  const handleMonthlyPriceChange = (val: string) => {
    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
      const numP = Number(val);
      const numDisc = Number(planForm.monthlyDiscountPercent);
      const computedTotal =
        numP > 0 && numDisc > 0
          ? String(Math.round(numP * (1 - numDisc / 100)))
          : planForm.monthlyTotalValue;
      setPlanForm((prev) => ({
        ...prev,
        monthlyPrice: val,
        monthlyTotalValue: computedTotal,
      }));
      if (formErrors.price) setFormErrors((prev) => ({ ...prev, price: undefined }));
    }
  };

  const handleMonthlyDiscountChange = (val: string) => {
    if (val === "" || (/^\d+$/.test(val) && Number(val) <= 100)) {
      const numDisc = Number(val);
      const numP = Number(planForm.monthlyPrice);
      const computedTotal =
        numP > 0 && numDisc > 0
          ? String(Math.round(numP * (1 - numDisc / 100)))
          : "";
      setPlanForm((prev) => ({
        ...prev,
        monthlyDiscountPercent: val,
        monthlyTotalValue: computedTotal,
      }));
    }
  };

  const handleMonthlyTotalValueChange = (val: string) => {
    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
      const numTot = Number(val);
      const numP = Number(planForm.monthlyPrice);
      let computedDisc = planForm.monthlyDiscountPercent;
      if (numP > 0 && numTot > 0 && numTot <= numP) {
        computedDisc = String(Math.round(((numP - numTot) / numP) * 100));
      }
      setPlanForm((prev) => ({
        ...prev,
        monthlyTotalValue: val,
        monthlyDiscountPercent: computedDisc,
      }));
    }
  };

  const handleAnnualPriceChange = (val: string) => {
    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
      const numAP = Number(val);
      const numMP = Number(planForm.monthlyPrice);
      let computedDisc = planForm.annualDiscountPercent;
      if (numMP > 0 && numAP > 0 && numAP <= numMP) {
        computedDisc = String(Math.round(((numMP - numAP) / numMP) * 100));
      }
      const computedTotal = numAP > 0 ? String(numAP * 12) : "";
      setPlanForm((prev) => ({
        ...prev,
        annualPrice: val,
        annualDiscountPercent: computedDisc,
        annualTotalValue: computedTotal,
      }));
      if (formErrors.price) setFormErrors((prev) => ({ ...prev, price: undefined }));
    }
  };

  const handleAnnualDiscountChange = (val: string) => {
    if (val === "" || (/^\d+$/.test(val) && Number(val) <= 100)) {
      const numDisc = Number(val);
      const numMP = Number(planForm.monthlyPrice);
      let computedAP = planForm.annualPrice;
      let computedTotal = planForm.annualTotalValue;
      if (numMP > 0 && numDisc >= 0) {
        computedAP = String(Math.round(numMP * (1 - numDisc / 100)));
        computedTotal = String(Number(computedAP) * 12);
      }
      setPlanForm((prev) => ({
        ...prev,
        annualDiscountPercent: val,
        annualPrice: computedAP,
        annualTotalValue: computedTotal,
      }));
    }
  };

  const handleAnnualTotalValueChange = (val: string) => {
    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
      const numTot = Number(val);
      const numMP = Number(planForm.monthlyPrice);
      let computedAP = planForm.annualPrice;
      let computedDisc = planForm.annualDiscountPercent;
      if (numTot > 0) {
        computedAP = String(Math.round(numTot / 12));
        if (numMP > 0 && Number(computedAP) <= numMP) {
          computedDisc = String(Math.round(((numMP - Number(computedAP)) / numMP) * 100));
        }
      }
      setPlanForm((prev) => ({
        ...prev,
        annualTotalValue: val,
        annualPrice: computedAP,
        annualDiscountPercent: computedDisc,
      }));
    }
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
    const currentList = modalCycleTab === "monthly" ? planForm.monthlyFeatures : planForm.yearlyFeatures;
    const exists = currentList.some((f) => f.name.toLowerCase() === text.toLowerCase());
    if (exists) {
      setFormErrors((prev) => ({ ...prev, feature: "Feature already added to this list" }));
      return;
    }
    if (modalCycleTab === "monthly") {
      setPlanForm((prev) => ({
        ...prev,
        monthlyFeatures: [...prev.monthlyFeatures, { name: text, isEnabled: true }],
      }));
    } else {
      setPlanForm((prev) => ({
        ...prev,
        yearlyFeatures: [...prev.yearlyFeatures, { name: text, isEnabled: true }],
      }));
    }
    setFormErrors((prev) => ({ ...prev, feature: undefined }));
    setNewModalFeatureInput("");
  };

  const handleRemoveFeatureFromModalForm = (index: number) => {
    if (modalCycleTab === "monthly") {
      setPlanForm((prev) => ({
        ...prev,
        monthlyFeatures: prev.monthlyFeatures.filter((_, i) => i !== index),
      }));
    } else {
      setPlanForm((prev) => ({
        ...prev,
        yearlyFeatures: prev.yearlyFeatures.filter((_, i) => i !== index),
      }));
    }
  };

  const handleToggleFeatureInModalForm = (index: number) => {
    if (modalCycleTab === "monthly") {
      setPlanForm((prev) => ({
        ...prev,
        monthlyFeatures: prev.monthlyFeatures.map((f, i) =>
          i === index ? { ...f, isEnabled: !f.isEnabled } : f
        ),
      }));
    } else {
      setPlanForm((prev) => ({
        ...prev,
        yearlyFeatures: prev.yearlyFeatures.map((f, i) =>
          i === index ? { ...f, isEnabled: !f.isEnabled } : f
        ),
      }));
    }
  };

  const handleSavePlan = async () => {
    const errors: { name?: string; price?: string } = {};
    if (!planForm.name.trim()) {
      errors.name = "Plan name is required";
    } else if (planForm.name.trim().length > 50) {
      errors.name = "Plan name cannot exceed 50 characters";
    }

    const hasMonthly =
      planForm.monthlyPrice !== "" &&
      !isNaN(Number(planForm.monthlyPrice)) &&
      Number(planForm.monthlyPrice) > 0;
    const hasYearly =
      planForm.annualPrice !== "" &&
      !isNaN(Number(planForm.annualPrice)) &&
      Number(planForm.annualPrice) > 0;
    if (!hasMonthly && !hasYearly) {
      errors.price = "At least one price (Monthly Price or Annual Price) is required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    try {
      setSavingPlan(true);
      const mPriceVal = hasMonthly ? Number(planForm.monthlyPrice) : 0;
      const mDiscVal = planForm.monthlyDiscountPercent !== "" ? Number(planForm.monthlyDiscountPercent) : 0;
      const mTotVal =
        planForm.monthlyTotalValue !== ""
          ? Number(planForm.monthlyTotalValue)
          : mDiscVal > 0
            ? Math.round(mPriceVal * (1 - mDiscVal / 100))
            : mPriceVal;
      const aPriceVal = hasYearly ? Number(planForm.annualPrice) : 0;
      const aDiscVal = planForm.annualDiscountPercent !== "" ? Number(planForm.annualDiscountPercent) : 0;
      const aTotVal =
        planForm.annualTotalValue !== ""
          ? Number(planForm.annualTotalValue)
          : aPriceVal * 12;
      const payload: Partial<PlanData> = {
        name: planForm.name,
        description: planForm.description,
        isPopular: planForm.isPopular,
        monthlyPricing: {
          price: mPriceVal,
          discountPercent: mDiscVal,
          totalValue: mTotVal,
          description: planForm.monthlyDescription,
        },
        annualPricing: {
          price: aPriceVal,
          discountPercent: aDiscVal,
          totalValue: aTotVal,
          description: planForm.yearlyDescription,
        },
        monthlyFeatures: planForm.monthlyFeatures as any,
        yearlyFeatures: planForm.yearlyFeatures.length > 0 ? (planForm.yearlyFeatures as any) : (planForm.monthlyFeatures as any),
        features: planForm.monthlyFeatures as any,
      };
      if (editingPlan && editingPlan._id) {
        await updatePricingPlan(editingPlan._id, payload);
        addToast({ title: "Plan Saved", description: `Successfully updated '${planForm.name}'`, color: "success" });
      } else {
        await createPricingPlan(payload);
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
      if (deleteConfirmTarget.type === "plan" && deleteConfirmTarget.planId) {
        await deletePricingPlan(deleteConfirmTarget.planId);
        addToast({
          title: "Plan Deleted",
          description: `Plan '${deleteConfirmTarget.title}' has been deleted`,
          color: "success",
        });
        loadData();
      } else if (
        deleteConfirmTarget.type === "feature" &&
        deleteConfirmTarget.planId &&
        deleteConfirmTarget.featureId
      ) {
        const cycle = deleteConfirmTarget.cycle || "monthly";
        await deletePlanFeatureItem(deleteConfirmTarget.planId, deleteConfirmTarget.featureId, cycle);
        addToast({
          title: "Feature Removed",
          description: `Removed '${deleteConfirmTarget.title}' from plan`,
          color: "success",
        });
        loadData();
      }
      setDeleteConfirmTarget(null);
    } catch (err: any) {
      console.error(err);
      addToast({ title: "Error", description: "Failed to perform deletion", color: "danger" });
    }
  };

  const handleAddFeatureInline = async (plan: PlanData, cycle: "monthly" | "yearly") => {
    if (!plan._id) return;
    const text = (inlineFeatureInputs[`${plan._id}_${cycle}`] || "").trim();
    if (!text) return;
    try {
      await addPlanFeatureItem(plan._id, { name: text, isEnabled: true, cycle });
      addToast({ title: "Feature Added", description: `Added '${text}' to ${plan.name} (${cycle})`, color: "success" });
      setInlineFeatureInputs((prev) => ({ ...prev, [`${plan._id}_${cycle}`]: "" }));
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
      await updatePlanFeatureItem(plan._id, editingFeatureItem.featureId, {
        name: newName,
        cycle: editingFeatureItem.cycle,
      });
      addToast({ title: "Feature Updated", description: `Updated feature to '${newName}'`, color: "success" });
      setEditingFeatureItem(null);
      loadData();
    } catch (err: any) {
      console.error(err);
      addToast({ title: "Error", description: "Failed to update feature", color: "danger" });
    }
  };

  const handleTogglePlanFeature = async (plan: PlanData, feat: PlanFeatureItem, cycle: "monthly" | "yearly") => {
    if (!plan._id || !feat._id) return;
    const newStatus = !feat.isEnabled;
    setPlans((prev) =>
      prev.map((p) => {
        if (p._id === plan._id) {
          const list = cycle === "yearly" ? p.yearlyFeatures || [] : p.monthlyFeatures || p.features || [];
          const updatedList = list.map((f) => (f._id === feat._id ? { ...f, isEnabled: newStatus } : f));
          return cycle === "yearly"
            ? { ...p, yearlyFeatures: updatedList }
            : { ...p, monthlyFeatures: updatedList, features: updatedList };
        }
        return p;
      })
    );
    try {
      await togglePlanFeatureItemStatus(plan._id, feat._id, newStatus, cycle);
      addToast({
        title: newStatus ? "Feature Enabled" : "Feature Disabled",
        description: `'${feat.name}' is now ${newStatus ? "enabled" : "disabled"} (${cycle})`,
        color: newStatus ? "success" : "warning",
      });
    } catch (err: any) {
      console.error(err);
      loadData();
      addToast({ title: "Error", description: "Failed to update feature status", color: "danger" });
    }
  };
  if (loading) {
    return <WorkspaceLoader message="LOADING..." minHeight="min-h-[400px]" />;
  }
  const currentModalFeatureList =
    modalCycleTab === "monthly" ? planForm.monthlyFeatures : planForm.yearlyFeatures;
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div
          className={`rounded-full p-1 border flex items-center w-full ${isLight ? "bg-slate-200/80 border-slate-300/70" : "bg-[#111A2E] border-[#1E2B45]"
            }`}
        >
          <button
            type="button"
            onClick={() => setActiveMainTab("plans")}
            className={`flex-1 py-2.5 px-6 rounded-full text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeMainTab === "plans"
              ? "bg-[#20a9f8] text-white shadow-md shadow-[#20a9f8]/25"
              : isLight
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-white"
              }`}
          >
            <FiDollarSign className="text-base" />
            <span>Plans</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab("addons")}
            className={`flex-1 py-2.5 px-6 rounded-full text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${activeMainTab === "addons"
              ? "bg-[#20a9f8] text-white shadow-md shadow-[#20a9f8]/25"
              : isLight
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-white"
              }`}
          >
            <FiPackage className="text-base" />
            <span>Add-ons</span>
          </button>
        </div>
      </div>
      {activeMainTab === "plans" ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <h1
                className={`text-2xl font-extrabold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"
                  }`}
              >
                <FiDollarSign className="text-[#20a9f8]" />
                <span>Subscription Plans & Features</span>
              </h1>
              <p
                className={`text-xs mt-1 font-medium ${isLight ? "text-slate-500" : "text-slate-400"
                  }`}
              >
                Manage monthly and annual plan prices, discounts, and cycle-specific feature lists.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenPlanModal()}
              className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#20a9f8]/20 flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto shrink-0"
            >
              <FiPlus className="text-base" />
              <span>Add New Plan</span>
            </button>
          </div>
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
                const activeCycle = cardCycleTab[plan._id!] || "monthly";
                const monthlyPrice = plan.monthlyPricing?.price ?? plan.price ?? 0;
                const monthlyDiscount = plan.monthlyPricing?.discountPercent ?? 0;
                const monthlyTotal =
                  plan.monthlyPricing?.totalValue ??
                  (monthlyDiscount > 0 ? Math.round(monthlyPrice * (1 - monthlyDiscount / 100)) : monthlyPrice);
                const monthlyDesc = plan.monthlyPricing?.description ?? plan.description ?? "";
                const annualPrice = plan.annualPricing?.price ?? plan.annualPrice ?? 0;
                const annualDiscount = plan.annualPricing?.discountPercent ?? plan.discountPercent ?? 0;
                const annualTotal =
                  plan.annualPricing?.totalValue ?? (annualPrice > 0 ? annualPrice * 12 : 0);
                const rawMonthlyFeats = plan.monthlyFeatures || plan.features || plan.featuresList || [];
                const rawYearlyFeats = plan.yearlyFeatures || plan.features || plan.featuresList || rawMonthlyFeats;
                const currentCycleFeatures: PlanFeatureItem[] = (
                  activeCycle === "yearly" ? rawYearlyFeats : rawMonthlyFeats
                ).map((f: any, i: number) =>
                  typeof f === "string" ? { _id: `feat_${i}`, name: f, isEnabled: true } : f
                );
                const savingsPerYear = Math.max(0, monthlyPrice * 12 - annualTotal);
                return (
                  <div
                    key={plan._id || plan.planId}
                    className={`rounded-3xl border p-5 sm:p-6 relative flex flex-col justify-between transition-all h-full ${plan.isPopular
                      ? isLight
                        ? "bg-sky-50/40 border-[#20a9f8] ring-2 ring-[#20a9f8]/20 shadow-lg"
                        : "bg-[#111C35] border-[#20a9f8] ring-2 ring-[#20a9f8]/20 shadow-lg"
                      : isLight
                        ? "bg-white border-slate-200/90 shadow-sm"
                        : "bg-[#0F172A] border-[#1E293B]"
                      }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#20a9f8] text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <FiStar className="text-xs fill-white" />
                        <span>Most Popular</span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className={`text-xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>
                            {plan.name}
                          </h3>
                          <p className={`text-xs mt-1 font-medium min-h-[28px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                            {plan.description || monthlyDesc || "Subscription Plan"}
                          </p>
                        </div>
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
                      <div className="mt-4 space-y-2.5">
                        {monthlyPrice > 0 && (
                          <div className="flex items-baseline justify-between">
                            <div className="flex items-baseline gap-1">
                              <span className={`text-2xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>
                                ${monthlyTotal || monthlyPrice}
                              </span>
                              <span className="text-xs font-semibold text-slate-400">/month</span>
                              {monthlyDiscount > 0 && (
                                <span className="text-[10px] text-emerald-500 font-bold ml-1">
                                  ({monthlyDiscount}% off)
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-lg border border-sky-200/60 dark:border-sky-800/60">
                              Monthly
                            </span>
                          </div>
                        )}
                        {annualPrice > 0 && (
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#111A2E] border border-slate-200/80 dark:border-[#1E2B45] space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-baseline gap-1">
                                <span className={`text-lg font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>
                                  ${annualPrice}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-400">/mo</span>
                              </div>
                              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                                Annual {annualDiscount > 0 ? `(${annualDiscount}% off)` : ""}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-400">
                              ${annualTotal || annualPrice * 12} billed annually{" "}
                              {savingsPerYear > 0 ? `(Save $${savingsPerYear}/yr)` : ""}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mt-6 space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            PLAN FEATURES ({currentCycleFeatures.length})
                          </span>
                          <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-900 p-0.5 rounded-lg text-[10px] font-bold">
                            <button
                              type="button"
                              onClick={() =>
                                setCardCycleTab((prev) => ({ ...prev, [plan._id!]: "monthly" }))
                              }
                              className={`px-2 py-0.5 rounded-md transition-all ${activeCycle === "monthly"
                                ? "bg-[#20a9f8] text-white shadow-xs"
                                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                }`}
                            >
                              Monthly
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setCardCycleTab((prev) => ({ ...prev, [plan._id!]: "yearly" }))
                              }
                              className={`px-2 py-0.5 rounded-md transition-all ${activeCycle === "yearly"
                                ? "bg-[#20a9f8] text-white shadow-xs"
                                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                }`}
                            >
                              Yearly
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <input
                            type="text"
                            value={inlineFeatureInputs[`${plan._id}_${activeCycle}`] || ""}
                            onChange={(e) =>
                              setInlineFeatureInputs({
                                ...inlineFeatureInputs,
                                [`${plan._id}_${activeCycle}`]: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddFeatureInline(plan, activeCycle);
                              }
                            }}
                            placeholder={`Add feature to ${activeCycle} plan...`}
                            className={`flex-1 text-xs rounded-xl px-3 py-2 border focus:outline-none ${isLight
                              ? "bg-white border-slate-300 text-slate-900 focus:border-[#20a9f8]"
                              : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-[#20a9f8]"
                              }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddFeatureInline(plan, activeCycle)}
                            disabled={!(inlineFeatureInputs[`${plan._id}_${activeCycle}`] || "").trim()}
                            className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
                          >
                            + Add
                          </button>
                        </div>
                        <div className="space-y-2.5 h-[340px] overflow-y-auto pr-2 [scrollbar-width:thin] [::-webkit-scrollbar]:w-1.5 [::-webkit-scrollbar-thumb]:bg-slate-300 dark:[::-webkit-scrollbar-thumb]:bg-slate-700 [::-webkit-scrollbar-thumb]:rounded-full [::-webkit-scrollbar-track]:bg-transparent">
                          {currentCycleFeatures.length === 0 ? (
                            <p className="text-xs italic text-slate-400 py-2">
                              No {activeCycle} features added yet.
                            </p>
                          ) : (
                            currentCycleFeatures.map((feat, fIdx) => {
                              const featureKey = feat._id || `feat_${fIdx}`;
                              const isEditingThis =
                                editingFeatureItem !== null &&
                                editingFeatureItem.planId === plan._id &&
                                editingFeatureItem.featureId === featureKey &&
                                editingFeatureItem.cycle === activeCycle;
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
                                          ...currentEditing,
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
                                      className={`flex-1 text-xs rounded-lg px-2.5 py-1.5 border focus:outline-none font-medium ${isLight
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
                                  className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs transition-colors ${!feat.isEnabled
                                    ? isLight
                                      ? "bg-slate-50 border-slate-200 opacity-60"
                                      : "bg-slate-900/40 border-[#1E293B] opacity-60"
                                    : isLight
                                      ? "bg-slate-50/70 border-slate-200/80"
                                      : "bg-[#111A2E] border-[#1E2B45]"
                                    }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <button
                                      type="button"
                                      onClick={() => handleTogglePlanFeature(plan, feat, activeCycle)}
                                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 ${feat.isEnabled
                                        ? "bg-emerald-500"
                                        : isLight
                                          ? "bg-slate-300"
                                          : "bg-slate-700"
                                        }`}
                                      title={
                                        feat.isEnabled
                                          ? "Click to disable feature"
                                          : "Click to enable feature"
                                      }
                                    >
                                      <div
                                        className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${feat.isEnabled ? "translate-x-4" : "translate-x-0"
                                          }`}
                                      />
                                    </button>
                                    <span
                                      className={`truncate font-semibold ${!feat.isEnabled
                                        ? "line-through text-slate-400"
                                        : isLight
                                          ? "text-slate-800"
                                          : "text-slate-200"
                                        }`}
                                    >
                                      {feat.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingFeatureItem({
                                          planId: plan._id!,
                                          featureId: featureKey,
                                          name: feat.name,
                                          cycle: activeCycle,
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
                                          cycle: activeCycle,
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
        </>
      ) : (
        <AddonsTab isLight={isLight} />
      )}

      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsPlanModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className={`relative w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden z-10 border p-6 space-y-5 animate-in fade-in-50 zoom-in-95 duration-150 ${isLight ? "bg-white border-slate-200 text-slate-900" : "bg-[#0F172A] border-[#1E293B] text-slate-100"
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
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="space-y-4 text-xs sm:text-sm max-h-[70vh] overflow-y-auto pl-0.5 pr-4 [scrollbar-width:thin] [::-webkit-scrollbar]:w-1.5 [::-webkit-scrollbar-thumb]:bg-slate-300 dark:[::-webkit-scrollbar-thumb]:bg-slate-700 [::-webkit-scrollbar-thumb]:rounded-full [::-webkit-scrollbar-track]:bg-transparent">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">Plan Name *</label>
                    <span className="text-[10px] text-slate-400 font-medium">{planForm.name.length}/50</span>
                  </div>
                  <div className="flex items-center gap-3">
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
                      className={`flex-1 rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium ${formErrors.name
                        ? "border-red-500 ring-1 ring-red-500"
                        : isLight
                          ? "bg-white border-slate-300"
                          : "bg-[#111A2E] border-[#1E2B45]"
                        }`}
                    />
                    <div className="flex items-center gap-1.5 shrink-0">
                      <input
                        type="checkbox"
                        id="isPopularModal"
                        checked={planForm.isPopular}
                        onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                        className="w-4 h-4 rounded text-[#20a9f8] focus:ring-[#20a9f8] cursor-pointer"
                      />
                      <label
                        htmlFor="isPopularModal"
                        className="text-xs font-bold cursor-pointer select-none whitespace-nowrap"
                      >
                        "Most Popular"
                      </label>
                    </div>
                  </div>
                  {formErrors.name && (
                    <p className="text-red-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
                      <FiAlertCircle /> {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">
                      Plan Tagline / Subtitle
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {planForm.description.length}/200
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={200}
                    value={planForm.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 200) {
                        setPlanForm((prev) => ({ ...prev, description: val }));
                      }
                    }}
                    placeholder="e.g. Perfect for new practices getting started"
                    className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${isLight ? "bg-white border-slate-300" : "bg-[#111A2E] border-[#1E2B45]"
                      }`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1 font-normal">
                    Appears under the plan title (e.g. "Perfect for new practices getting started")
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3 border-b pb-2 dark:border-slate-800">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Pricing & Feature Cycle Setup
                  </span>
                  <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-[#111A2E] p-1 rounded-xl border border-slate-300/60 dark:border-[#1E2B45]">
                    <button
                      type="button"
                      onClick={() => handleSwitchModalTab("monthly")}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${modalCycleTab === "monthly"
                        ? "bg-[#20a9f8] text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                      <span>Monthly</span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                        {planForm.monthlyFeatures.length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchModalTab("yearly")}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${modalCycleTab === "yearly"
                        ? "bg-[#20a9f8] text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                      <span>Yearly</span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                        {planForm.yearlyFeatures.length}
                      </span>
                    </button>
                  </div>
                </div>
                {modalCycleTab === "monthly" && (
                  <div className="space-y-4 animate-in fade-in-50 duration-150">
                    <div className="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-[#111A2E]/80 border border-sky-100 dark:border-[#1E2B45] space-y-3">
                      <span className="text-xs font-extrabold text-[#20a9f8] uppercase tracking-wider block">
                        Monthly Plan Setup
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 text-xs">
                            Price ($/mo) *
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={planForm.monthlyPrice}
                            onChange={(e) => handleMonthlyPriceChange(e.target.value)}
                            placeholder="e.g. 199"
                            className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${formErrors.price
                              ? "border-red-500 ring-1 ring-red-500"
                              : isLight
                                ? "bg-white border-slate-300"
                                : "bg-[#0B101D] border-[#1E2B45]"
                              }`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 text-xs">
                            Discount (% off)
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={planForm.monthlyDiscountPercent}
                            onChange={(e) => handleMonthlyDiscountChange(e.target.value)}
                            placeholder="e.g. 0"
                            className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${isLight
                              ? "bg-white border-slate-300"
                              : "bg-[#0B101D] border-[#1E2B45]"
                              }`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 text-xs">
                            Total Billed ($)
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={planForm.monthlyTotalValue}
                            onChange={(e) => handleMonthlyTotalValueChange(e.target.value)}
                            placeholder="Auto or custom"
                            className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${isLight
                              ? "bg-white border-slate-300"
                              : "bg-[#0B101D] border-[#1E2B45]"
                              }`}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">
                            Monthly Description / Note
                          </label>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {planForm.monthlyDescription.length}/200
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={200}
                          value={planForm.monthlyDescription}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 200) {
                              setPlanForm((prev) => ({ ...prev, monthlyDescription: val }));
                            }
                          }}
                          placeholder="e.g. Billed Monthly + $500 One-Time Setup fee"
                          className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${isLight ? "bg-white border-slate-300" : "bg-[#0B101D] border-[#1E2B45]"
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {modalCycleTab === "yearly" && (
                  <div className="space-y-4 animate-in fade-in-50 duration-150">
                    <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-[#111A2E]/80 border border-indigo-100 dark:border-[#1E2B45] space-y-3">
                      <span className="text-xs font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">
                        Annual Plan Setup
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 text-xs">
                            Annual Price ($/mo)
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={planForm.annualPrice}
                            onChange={(e) => handleAnnualPriceChange(e.target.value)}
                            placeholder="e.g. 166"
                            className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${formErrors.price
                              ? "border-red-500 ring-1 ring-red-500"
                              : isLight
                                ? "bg-white border-slate-300"
                                : "bg-[#0B101D] border-[#1E2B45]"
                              }`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 text-xs">
                            Save Discount (% off)
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={planForm.annualDiscountPercent}
                            onChange={(e) => handleAnnualDiscountChange(e.target.value)}
                            placeholder="e.g. 17"
                            className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${isLight
                              ? "bg-white border-slate-300"
                              : "bg-[#0B101D] border-[#1E2B45]"
                              }`}
                          />
                        </div>
                        <div>
                          <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 text-xs">
                            Total Billed ($/yr)
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={planForm.annualTotalValue}
                            onChange={(e) => handleAnnualTotalValueChange(e.target.value)}
                            placeholder="Auto or custom"
                            className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${isLight
                              ? "bg-white border-slate-300"
                              : "bg-[#0B101D] border-[#1E2B45]"
                              }`}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">
                            Yearly Description / Note
                          </label>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {planForm.yearlyDescription.length}/200
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={200}
                          value={planForm.yearlyDescription}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 200) {
                              setPlanForm((prev) => ({ ...prev, yearlyDescription: val }));
                            }
                          }}
                          placeholder="e.g. Billed annually ($1992 billed annually)"
                          className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${isLight ? "bg-white border-slate-300" : "bg-[#0B101D] border-[#1E2B45]"
                            }`}
                        />
                      </div>
                      {Number(planForm.monthlyPrice) > 0 && Number(planForm.annualPrice) > 0 && (
                        <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs space-y-0.5">
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block text-xs">
                            Save ${Math.max(0, Number(planForm.monthlyPrice) * 12 - (Number(planForm.annualTotalValue) || Number(planForm.annualPrice) * 12))}/year ({planForm.annualDiscountPercent || 0}% off)
                          </span>
                          <span className="font-medium text-slate-500 dark:text-slate-400 block text-[11px]">
                            ${planForm.annualTotalValue || Number(planForm.annualPrice) * 12} billed annually (${planForm.annualPrice}/month)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {formErrors.price && (
                <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1">
                  <FiAlertCircle /> {formErrors.price}
                </p>
              )}
              <div className="pt-2 space-y-3 border-t dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {modalCycleTab.toUpperCase()} PLAN FEATURES ({currentModalFeatureList.length})
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Changes apply to {modalCycleTab} cycle
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
                            if (formErrors.feature)
                              setFormErrors((prev) => ({ ...prev, feature: undefined }));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFeatureToModalForm();
                          }
                        }}
                        placeholder={`Enter ${modalCycleTab} feature title...`}
                        className={`w-full text-xs rounded-xl px-3.5 py-2.5 border focus:outline-none ${formErrors.feature ? "border-red-500 ring-1 ring-red-500" : isLight ? "bg-white border-slate-300" : "bg-[#111A2E] border-[#1E2B45]"
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
                <div className="space-y-2 max-h-44 overflow-y-auto pr-2.5 [scrollbar-width:thin] [::-webkit-scrollbar]:w-1.5 [::-webkit-scrollbar-thumb]:bg-slate-300 dark:[::-webkit-scrollbar-thumb]:bg-slate-700 [::-webkit-scrollbar-thumb]:rounded-full [::-webkit-scrollbar-track]:bg-transparent">
                  {currentModalFeatureList.length === 0 ? (
                    <p className="text-xs italic text-slate-400">
                      No features added to {modalCycleTab} plan yet.
                    </p>
                  ) : (
                    currentModalFeatureList.map((f, fIdx) => (
                      <div
                        key={fIdx}
                        className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs ${!f.isEnabled
                          ? isLight ? "bg-slate-100 opacity-60" : "bg-slate-900/60 opacity-60"
                          : isLight ? "bg-slate-50" : "bg-[#111A2E]"
                          }`}>
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatureInModalForm(fIdx)}
                            className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${f.isEnabled ? "bg-emerald-500" : "bg-slate-400"}`}>
                            <div className={`bg-white w-3 h-3 rounded-full shadow transform transition-transform ${f.isEnabled ? "translate-x-4" : "translate-x-0"}`} />
                          </button>
                          <span className={`truncate font-medium ${!f.isEnabled ? "line-through text-slate-400" : ""}`}>
                            {f.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeatureFromModalForm(fIdx)}
                          className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <FiTrash2 className="text-xs" />
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
                className={`px-5 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${isLight
                  ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                  : "bg-[#111A2E] border-[#1E2B45] text-slate-300 hover:bg-[#1A2642]"
                  }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlan}
                disabled={savingPlan}
                className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-[#20a9f8]/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {savingPlan ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editingPlan ? "Save Plan Changes" : "Create Plan & Features"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteConfirmTarget && (
        <DeleteConfirmationModal
          isOpen={!!deleteConfirmTarget}
          onClose={() => setDeleteConfirmTarget(null)}
          onConfirm={handleConfirmDelete}
          title={
            deleteConfirmTarget.type === "plan" ? "Delete Subscription Plan?" : "Delete Feature from Plan?"
          }
          description={
            deleteConfirmTarget.type === "plan"
              ? `Are you sure you want to delete '${deleteConfirmTarget.title}'? This action cannot be undone.`
              : `Are you sure you want to remove '${deleteConfirmTarget.title}' from this plan?`
          }
        />
      )}
    </div>
  );
};

export default PlansFeaturesTab;