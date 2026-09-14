import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPlansAndFeatures, PlanData } from "../../services/planFeature";
import { FiCheck, FiX, FiArrowRight } from "react-icons/fi";
import { SignupHeader } from "./signup/SignupHeader";

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

const isEnterprisePlan = (p?: PlanData | null): boolean => {
  if (!p) return false;
  const id = (p.planId || "").toLowerCase();
  const name = (p.name || "").toLowerCase();
  return id.includes("enterprise") || name.includes("enterprise") || (p.monthlyPricing?.price === 0 && p.annualPricing?.price === 0);
};

const SignupPricingView: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("professional");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPricingData();
  }, []);

  const loadPricingData = async () => {
    try {
      setLoading(true);
      const res = await fetchPlansAndFeatures();
      const data = res?.data || res;
      if (data) {
        const fetchedPlans: PlanData[] = Array.isArray(data.plans)
          ? data.plans
          : Array.isArray(data)
          ? data
          : [];
        const activePlans = fetchedPlans.filter((p) => p.isActive !== false);
        setPlans(activePlans);
        if (activePlans.length > 0) {
          const popular = activePlans.find((p: PlanData) => isPlanPopular(p));
          if (popular) setSelectedPlanId(String(popular._id || popular.planId || ""));
          else setSelectedPlanId(String(activePlans[0]?._id || activePlans[0]?.planId || ""));
        }
      }
    } catch (err) {
      console.error("Failed to load signup pricing data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleCardAction = (plan: PlanData) => {
    if (isEnterprisePlan(plan)) {
      window.location.href = "mailto:sales@practiceroi.com?subject=Enterprise%20Plan%20Inquiry";
      return;
    }
    const pid = String(plan._id || plan.planId);
    navigate(`/signup?planId=${pid}&billing=${billingCycle}`);
  };

  const handleContinue = () => {
    const chosen = plans.find((p) => String(p._id || p.planId) === selectedPlanId) || plans[0];
    if (chosen && isEnterprisePlan(chosen)) {
      window.location.href = "mailto:sales@practiceroi.com?subject=Enterprise%20Plan%20Inquiry";
      return;
    }
    const pid = String(chosen?._id || chosen?.planId || selectedPlanId);
    navigate(`/signup?planId=${pid}&billing=${billingCycle}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#070C18] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-400">Loading pricing plans...</span>
      </div>
    );
  }

  // Calculate dynamic popular plan annual discount percentage
  const popularPlan = plans.find((p) => isPlanPopular(p)) || plans[0];
  const popularAnnualDiscount =
    popularPlan?.annualPricing?.discountPercent ??
    popularPlan?.discountPercent ??
    (popularPlan?.monthlyPricing?.price && popularPlan?.annualPricing?.price && popularPlan.annualPricing.price < popularPlan.monthlyPricing.price
      ? Math.round(((popularPlan.monthlyPricing.price - popularPlan.annualPricing.price) / popularPlan.monthlyPricing.price) * 100)
      : 17);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070C18] text-slate-900 dark:text-slate-100 flex flex-col items-center py-10 px-4 sm:px-6">
      <SignupHeader currentStep={1} />

      {/* Billing Cycle Switcher with popular plan discount percentage */}
      <div className="flex items-center justify-center mb-10">
        <div className="bg-slate-200/80 dark:bg-[#111A2E] p-1.5 rounded-full flex items-center gap-1 border border-slate-300/60 dark:border-[#1E2B45] shadow-inner">
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
            <span className="bg-[#FFE8DC] text-[#FF5A1F] dark:bg-orange-950/70 dark:text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              Save {popularAnnualDiscount}%
            </span>
          </button>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-base font-bold text-slate-500">
            No active subscription plans available at the moment.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => {
            const planKey = String(plan._id || plan.planId);
            const isSelected = selectedPlanId === planKey || selectedPlanId === plan.planId || selectedPlanId === String(plan._id);
            const isPopular = isPlanPopular(plan);
            const isEnterprise = isEnterprisePlan(plan);
            const isAnnual = billingCycle === "annual";

            const monthlyPrice = plan.monthlyPricing?.price ?? plan.price ?? 0;
            const rawAnnualPrice = plan.annualPricing?.price ?? plan.annualPrice;
            const discountPercent = plan.annualPricing?.discountPercent ?? plan.discountPercent ?? 0;

            const annualMonthlyPrice =
              rawAnnualPrice !== undefined && rawAnnualPrice !== null && Number(rawAnnualPrice) > 0
                ? Number(rawAnnualPrice)
                : discountPercent > 0
                ? Math.round(monthlyPrice * (1 - discountPercent / 100))
                : monthlyPrice;

            const displayPrice = isAnnual ? annualMonthlyPrice : monthlyPrice;

            const annualTotal =
              plan.annualPricing?.totalValue ||
              (rawAnnualPrice && Number(rawAnnualPrice) > 0
                ? Number(rawAnnualPrice) * 12
                : annualMonthlyPrice * 12);

            const regularYearlyTotal = monthlyPrice * 12;
            const savingsPerYear = Math.max(0, regularYearlyTotal - annualTotal);
            const savingsPercent =
              discountPercent > 0
                ? discountPercent
                : monthlyPrice > 0 && annualMonthlyPrice < monthlyPrice
                ? Math.round(((monthlyPrice - annualMonthlyPrice) / monthlyPrice) * 100)
                : 0;

            const rawFeatures = isAnnual
              ? plan.yearlyFeatures || plan.featuresList || plan.monthlyFeatures || plan.features || []
              : plan.monthlyFeatures || plan.featuresList || plan.yearlyFeatures || plan.features || [];

            const planFeatures =
              Array.isArray(rawFeatures) && rawFeatures.length > 0
                ? rawFeatures.map((f: any) => ({
                    name: typeof f === "string" ? f : f.name,
                    isEnabled: typeof f === "string" ? true : f.isEnabled !== false,
                  }))
                : [];

            return (
              <div
                key={planKey}
                onClick={() => handleSelectPlan(planKey)}
                className={`relative rounded-3xl border p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-white dark:bg-[#0F172A] border-[2px] border-[#009AE5] ring-2 ring-[#009AE5]/20 shadow-xl"
                    : "bg-white dark:bg-[#0F172A] border-slate-200 dark:border-[#1E293B] shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Most Popular top badge for popular card */}
                {isPopular && (
                  <div className="bg-[#009AE5] text-white font-bold text-xs py-2 text-center -mt-8 -mx-8 mb-6 rounded-t-[22px] tracking-wide relative flex items-center justify-center">
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="flex flex-col flex-1">
                  {/* Plan Header */}
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px] font-normal leading-relaxed">
                      {isAnnual && plan.yearlyDescription
                        ? plan.yearlyDescription
                        : plan.description || (isEnterprise ? "For established multi-location practices" : "Designed for practice growth")}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className="mt-4 mb-6">
                    {isEnterprise ? (
                      <div className="min-h-[76px] flex flex-col justify-center">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                          Connect With Us
                        </span>
                      </div>
                    ) : (
                      <div className="min-h-[76px]">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            ${displayPrice}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            /month
                          </span>
                        </div>

                        {isAnnual ? (
                          <div className="mt-1 space-y-0.5">
                            {savingsPercent > 0 && (
                              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                Save {savingsPerYear > 0 ? `$${savingsPerYear}/year ` : ""}({savingsPercent}% off)
                              </p>
                            )}
                            <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                              ${annualTotal} billed annually
                            </p>
                          </div>
                        ) : (
                          <div className="mt-1">
                            <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                              {plan.monthlyPricing?.description || "Billed monthly"}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Button inside card */}
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlan(planKey);
                        handleCardAction(plan);
                      }}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected || isEnterprise
                          ? "bg-[#009AE5] hover:bg-[#0087cb] text-white shadow-md shadow-sky-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <span>{isEnterprise ? "Get In Touch" : isSelected ? "Selected Plan" : "Start Free Trial"}</span>
                    </button>
                  </div>

                  {/* Plan Features List with checkmarks and crossmarks */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex-1">
                    {planFeatures.map((feat, idx) => {
                      const isEnabled = feat.isEnabled !== false;
                      return (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px]">
                          <div className="shrink-0 mt-0.5">
                            {isEnabled ? (
                              <FiCheck className="w-4 h-4 text-emerald-500 stroke-[3]" />
                            ) : (
                              <FiX className="w-4 h-4 text-red-500 stroke-[3]" />
                            )}
                          </div>
                          <span
                            className={`leading-relaxed ${
                              isEnabled
                                ? "text-slate-700 dark:text-slate-300 font-medium"
                                : "text-slate-400 dark:text-slate-500 font-normal line-through opacity-75"
                            }`}
                          >
                            {feat.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Continue Action */}
      <div className="mt-12">
        <button
          type="button"
          onClick={handleContinue}
          className="bg-[#009AE5] hover:bg-[#0087cb] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg hover:shadow-sky-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to Details</span>
          <FiArrowRight className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default SignupPricingView;
