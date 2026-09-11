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
import { FiDollarSign, FiPackage, FiPlus } from "react-icons/fi";
import { addToast } from "@heroui/react";
import { WorkspaceLoader } from "../../../components/common/LoadingState";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import AddonsTab from "./AddonsTab";
import PlansHeader from "./plans/PlansHeader";
import PlanCard from "./plans/PlanCard";
import PlanModal from "./plans/PlanModal";
import PlanCycleToggle from "./plans/PlanCycleToggle";

interface PlansFeaturesTabProps {
  isLight: boolean;
}

const PlansFeaturesTab: React.FC<PlansFeaturesTabProps> = ({ isLight }) => {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanData | null>(null);
  const [savingPlan, setSavingPlan] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<"plans" | "addons">("plans");
  const [activePlanCycle, setActivePlanCycle] = useState<"monthly" | "yearly">("monthly");

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: "plan" | "feature";
    planId: string;
    featureId?: string;
    title: string;
    cycle?: "monthly" | "yearly";
  } | null>(null);

  useEffect(() => {
    loadData(true);
  }, []);

  const loadData = async (showLoader: boolean = false) => {
    try {
      if (showLoader) setLoading(true);
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
      if (showLoader) setLoading(false);
    }
  };

  const handleOpenPlanModal = (plan?: PlanData) => {
    setEditingPlan(plan || null);
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async (payload: Partial<PlanData>) => {
    try {
      setSavingPlan(true);
      if (editingPlan && editingPlan._id) {
        await updatePricingPlan(editingPlan._id, payload);
        addToast({ title: "Plan Saved", description: `Successfully updated '${payload.name}'`, color: "success" });
      } else {
        await createPricingPlan(payload);
        addToast({ title: "Plan Created", description: `Successfully created plan '${payload.name}'`, color: "success" });
      }
      setIsPlanModalOpen(false);
      await loadData(false);
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
        await loadData(false);
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
        await loadData(false);
      }
      setDeleteConfirmTarget(null);
    } catch (err: any) {
      console.error(err);
      addToast({ title: "Error", description: "Failed to perform deletion", color: "danger" });
    }
  };

  const handleAddFeatureInline = async (plan: PlanData, cycle: "monthly" | "yearly", text: string) => {
    if (!plan._id) return;
    try {
      await addPlanFeatureItem(plan._id, { name: text, isEnabled: true, cycle });
      addToast({ title: "Feature Added", description: `Added '${text}' to ${plan.name} (${cycle})`, color: "success" });
      await loadData(false);
    } catch (err: any) {
      console.error(err);
      addToast({ title: "Error", description: "Failed to add feature to plan", color: "danger" });
    }
  };

  const handleSaveEditedFeature = async (
    plan: PlanData,
    featureId: string,
    name: string,
    cycle: "monthly" | "yearly"
  ) => {
    if (!plan._id) return;

    setPlans((prev) =>
      prev.map((p) => {
        if (p._id === plan._id) {
          const list = cycle === "yearly" ? p.yearlyFeatures || [] : p.monthlyFeatures || p.features || [];
          const updatedList = list.map((f: any) =>
            (f._id === featureId || f._id === `feat_${featureId}`) ? { ...f, name } : f
          );
          return cycle === "yearly"
            ? { ...p, yearlyFeatures: updatedList }
            : { ...p, monthlyFeatures: updatedList, features: updatedList };
        }
        return p;
      })
    );

    try {
      await updatePlanFeatureItem(plan._id, featureId, { name, cycle });
      addToast({ title: "Feature Updated", description: `Updated feature to '${name}'`, color: "success" });
      await loadData(false);
    } catch (err: any) {
      console.error(err);
      await loadData(false);
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
      await loadData(false);
    } catch (err: any) {
      console.error(err);
      await loadData(false);
      addToast({ title: "Error", description: "Failed to update feature status", color: "danger" });
    }
  };

  if (loading) {
    return <WorkspaceLoader message="LOADING..." minHeight="min-h-[400px]" />;
  }

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
          <PlansHeader isLight={isLight} onOpenModal={() => handleOpenPlanModal()} />

          <PlanCycleToggle
            activeCycle={activePlanCycle}
            onCycleChange={setActivePlanCycle}
            isLight={isLight}
          />

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
              {plans.map((plan) => (
                <PlanCard
                  key={plan._id || plan.planId}
                  plan={plan}
                  isLight={isLight}
                  activeCycle={activePlanCycle}
                  onEditPlan={handleOpenPlanModal}
                  onDeletePlan={(planId, title) =>
                    setDeleteConfirmTarget({ type: "plan", planId, title })
                  }
                  onAddFeatureInline={handleAddFeatureInline}
                  onSaveEditedFeature={handleSaveEditedFeature}
                  onToggleFeature={handleTogglePlanFeature}
                  onDeleteFeature={(planId, featureId, title, cycle) =>
                    setDeleteConfirmTarget({ type: "feature", planId, featureId, title, cycle })
                  }
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <AddonsTab isLight={isLight} />
      )}

      <PlanModal
        isOpen={isPlanModalOpen}
        isLight={isLight}
        editingPlan={editingPlan}
        onClose={() => setIsPlanModalOpen(false)}
        onSavePlan={handleSavePlan}
        savingPlan={savingPlan}
      />

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