import React, { useState, useEffect } from "react";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import { Spinner, addToast } from "@heroui/react";
import { fetchPlansAndFeatures, PlanData } from "../../../services/planFeature";
import { StepChoosePlanProps } from "./types";

// Helper to determine if a plan is designated as Popular by the backend
const isPlanPopular = (p?: PlanData | null): boolean => {
  if (!p) return false;
  return Boolean(
    p.isPopular === true ||
    (p as any).isPopular === "true" ||
    (p as any).is_popular === true ||
    (p as any).is_popular === "true" ||
    (p as any).highlight?.toLowerCase() === "popular"
  );
};

export const StepChoosePlan: React.FC<StepChoosePlanProps> = ({
  plans: propPlans,
  selectedPlan,
  onSelectPlan,
  billingCycle,
  setBillingCycle,
  onContinue,
  loading: propLoading = false,
}) => {
  const [plans, setPlans] = useState<PlanData[]>(propPlans || []);
  const [loading, setLoading] = useState<boolean>(propLoading && (!propPlans || propPlans.length === 0));

  // Fetch actual plans from API endpoint /api/plans/ (PlanFeatureController.getPlansAndFeatures)
  useEffect(() => {
    if (propPlans && propPlans.length > 0) {
      setPlans(propPlans);
      setLoading(false);
      if (!selectedPlan) {
        const popular = propPlans.find((p) => isPlanPopular(p)) || propPlans[0];
        if (popular) {
          onSelectPlan(popular);
        }
      }
      return;
    }

    const loadLivePricingPlans = async () => {
      try {
        setLoading(true);
        const res = await fetchPlansAndFeatures();
        const data = res?.data || res;
        const fetchedList: PlanData[] = Array.isArray(data?.plans)
          ? data.plans
          : Array.isArray(data)
          ? data
          : [];

        // Filter active plans
        const activePlans = fetchedList.filter((p) => p.isActive !== false);
        setPlans(activePlans);

        // Auto select popular plan from backend or fallback to first plan
        if (!selectedPlan && activePlans.length > 0) {
          const popular = activePlans.find((p) => isPlanPopular(p)) || activePlans[0];
          if (popular) {
            onSelectPlan(popular);
          }
        }
      } catch (err) {
        console.error("Failed to load live plans from /api/plans:", err);
        addToast({
          title: "Error Loading Plans",
          description: "Could not load subscription plans. Please refresh.",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    };

    loadLivePricingPlans();
  }, [propPlans]);

  const handleCardClick = (plan: PlanData) => {
    onSelectPlan(plan);
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl py-20 flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Loading live pricing plans...
        </p>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="w-full max-w-2xl py-16 text-center space-y-4">
        <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
          No subscription plans found.
        </p>
        <p className="text-xs text-slate-500">
          Please check your connection or contact our team for assistance.
        </p>
      </div>
    );
  }

  // Determine annual discount percent from first plan with discountPercent or default to 17%
  const annualDiscountBadge =
    plans.find((p) => p.discountPercent && p.discountPercent > 0)?.discountPercent || 17;

  return (
    <div className="w-full max-w-6xl flex flex-col items-center">
      {/* Billing Cycle Switcher */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 inline-flex items-center gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-[#009AE5] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`px-6 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === "annual"
                ? "bg-[#009AE5] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>Annual</span>
            <span className="bg-[#FFE8DC] text-[#FF5A1F] dark:bg-orange-950/70 dark:text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Save {annualDiscountBadge}%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-2">
        {plans.map((plan) => {
          const planId = (plan.planId || plan.name || "").toLowerCase();
          const isSelected =
            selectedPlan &&
            ((selectedPlan.planId && selectedPlan.planId.toLowerCase() === planId) ||
              selectedPlan._id === plan._id ||
              (selectedPlan.name && selectedPlan.name.toLowerCase() === (plan.name || "").toLowerCase()));
          const isAnnual = billingCycle === "annual";
          const basePrice = plan.monthlyPricing?.price ?? plan.price ?? 0;
          const aPrice = plan.annualPricing?.price ?? plan.annualPrice;
          const disc = plan.annualPricing?.discountPercent ?? plan.discountPercent ?? 0;

          const displayPrice = isAnnual
            ? aPrice !== undefined && aPrice !== null && aPrice > 0
              ? aPrice
              : disc > 0 && basePrice > 0
              ? Math.round(basePrice * (1 - disc / 100))
              : basePrice
            : basePrice;

          const rawFeatures = isAnnual
            ? plan.yearlyFeatures || plan.featuresList || plan.monthlyFeatures
            : plan.monthlyFeatures || plan.featuresList || plan.yearlyFeatures;

          const features =
            Array.isArray(rawFeatures) && rawFeatures.length > 0
              ? rawFeatures.map((f: any) => ({
                  name: typeof f === "string" ? f : f.name,
                  isEnabled: typeof f === "string" ? true : f.isEnabled !== false,
                }))
              : (plan.features || []).map((f) => ({ name: f, isEnabled: true }));

          const isPopular = isPlanPopular(plan);
          const visibleFeatures = features.filter((f) => f.isEnabled !== false);

          return (
            <div
              key={plan.planId || plan._id || plan.name}
              onClick={() => handleCardClick(plan)}
              className={`group relative bg-white dark:bg-[#0c1322] rounded-[24px] p-7 flex flex-col justify-between transition-all duration-300 ease-out cursor-pointer select-none ${
                isSelected
                  ? "border-[2px] border-[#009AE5] shadow-xl z-10"
                  : "border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
              }`}
            >
              {/* Top 'Most Popular' banner for popular plan */}
              {isPopular && (
                <div className="bg-[#009AE5] text-white font-bold text-xs sm:text-sm py-2.5 text-center -mt-7 -mx-7 mb-6 rounded-t-[21px] tracking-wide relative flex items-center justify-center">
                  <span>Most Popular</span>
                  {isSelected && (
                    <div className="absolute right-4 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0087cb] border-2 border-white text-white flex items-center justify-center shadow-sm">
                      <FiCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[3]" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col flex-1">
                {/* Plan Title & Subtitle + Blue Tick Icon (for non-popular plans) */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px] font-normal leading-relaxed">
                      {isAnnual && plan.yearlyDescription
                        ? plan.yearlyDescription
                        : plan.description || "Designed for practice growth"}
                    </p>
                  </div>

                  {/* Circular Blue Tick Badge when selected (on cards without banner) */}
                  {isSelected && !isPopular && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#009AE5] text-white flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 animate-in zoom-in-75">
                      <FiCheck className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Price block */}
                <div className="mt-4 mb-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    ${displayPrice}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-400">
                    /month
                  </span>
                </div>

                {/* Features List with green checkmarks */}
                <div className="space-y-3 pt-2 flex-1">
                  {visibleFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px]">
                      <FiCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {feat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Continue Action */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => {
            const chosen = selectedPlan || plans.find((p) => isPlanPopular(p)) || plans[0];
            if (chosen) {
              onSelectPlan(chosen);
              onContinue(chosen);
            }
          }}
          className="bg-[#009AE5] hover:bg-[#0087cb] text-white font-bold text-sm sm:text-base px-10 py-3.5 rounded-xl shadow-lg hover:shadow-sky-500/25 transition-all flex items-center gap-2.5 cursor-pointer group"
        >
          <span>Continue with {selectedPlan?.name || "Selected Plan"}</span>
          <FiArrowRight className="text-base group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-xs text-slate-400 font-medium text-center">
          14-day free trial • Cancel anytime • 100% money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default StepChoosePlan;
