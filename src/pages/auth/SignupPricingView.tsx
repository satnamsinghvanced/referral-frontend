import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPlansAndFeatures, PlanData, FeatureData } from "../../services/planFeature";
import { FiCheck, FiArrowRight, FiStar } from "react-icons/fi";
import { SignupHeader } from "./signup/SignupHeader";

const SignupPricingView: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [features, setFeatures] = useState<FeatureData[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
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
        if (Array.isArray(data.plans) && data.plans.length > 0) {
          setPlans(data.plans);
          const popular = data.plans.find((p: PlanData) => p.isPopular);
          if (popular) setSelectedPlanId(popular.planId);
          else setSelectedPlanId(data.plans[0].planId);
        }
        if (Array.isArray(data.features)) {
          setFeatures(data.features);
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

  const handleContinue = () => {
    navigate(`/checkout?plan=${selectedPlanId}&billing=${billingCycle}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#070C18] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-400">Loading pricing plans...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070C18] text-slate-900 dark:text-slate-100 flex flex-col items-center py-10 px-4 sm:px-6">
      <SignupHeader currentStep={1} />
      <div className="flex items-center justify-center mb-10">
        <div className="bg-slate-200/80 dark:bg-[#111A2E] p-1 rounded-2xl flex items-center gap-1 border border-slate-300/60 dark:border-[#1E2B45]">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${billingCycle === "monthly"
              ? "bg-sky-500 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${billingCycle === "annual"
              ? "bg-sky-500 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            <span>Annual</span>
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
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.planId;
            const isAnnual = billingCycle === "annual";
            const annualMonthlyPrice =
              plan.annualPrice ||
              (plan.discountPercent && plan.discountPercent > 0
                ? Math.round(plan.price * (1 - plan.discountPercent / 100))
                : plan.price);
            const displayPrice = isAnnual ? annualMonthlyPrice : plan.price;
            const yearlyCostFull = plan.price * 12;
            const yearlyCostDiscounted = annualMonthlyPrice * 12;
            const savingsPerYear = yearlyCostFull - yearlyCostDiscounted;
            const savingsPercent =
              plan.discountPercent && plan.discountPercent > 0
                ? plan.discountPercent
                : plan.price > 0 && annualMonthlyPrice < plan.price
                  ? Math.round(((plan.price - annualMonthlyPrice) / plan.price) * 100)
                  : 0;
            const rawFeatures = isAnnual
              ? plan.yearlyFeatures || plan.featuresList
              : plan.monthlyFeatures || plan.featuresList;
            const planFeatures =
              Array.isArray(rawFeatures) && rawFeatures.length > 0
                ? rawFeatures
                : (plan.features || []).map((f) => ({ name: f, isEnabled: true }));
            return (
              <div
                key={plan.planId}
                onClick={() => handleSelectPlan(plan.planId)}
                className={`relative rounded-3xl border p-8 flex flex-col justify-between transition-all duration-200 cursor-pointer ${isSelected
                  ? "bg-white dark:bg-[#0F172A] border-sky-500 ring-2 ring-sky-500/40 shadow-xl scale-[1.02] z-10"
                  : "bg-white dark:bg-[#0F172A] border-slate-200 dark:border-[#1E293B] shadow-sm hover:border-sky-300"
                  }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-sky-500 text-white font-bold text-xs uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                    <span>Most Popular</span>
                    {isSelected && <FiCheck className="text-sm" />}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px] font-medium">
                    {isAnnual && plan.yearlyDescription ? plan.yearlyDescription : plan.description}
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                      ${displayPrice}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">/month</span>
                  </div>

                  {isAnnual ? (
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

                  <div className="mt-8 space-y-3.5">
                    {planFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs font-medium">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${feat.isEnabled
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                            }`}
                        >
                          <FiCheck className="text-xs" />
                        </div>
                        <span
                          className={`leading-tight ${!feat.isEnabled
                            ? "line-through text-slate-400 dark:text-slate-500 font-normal"
                            : "text-slate-700 dark:text-slate-300 font-semibold"
                            }`}
                        >
                          {feat.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(plan.planId);
                      handleContinue();
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${isSelected
                      ? "bg-sky-500 hover:bg-sky-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200"
                      }`}
                  >
                    <span>Select {plan.name}</span>
                    <FiArrowRight className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12">
        <button
          type="button"
          onClick={handleContinue}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg hover:shadow-sky-500/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Continue to Details</span>
          <FiArrowRight className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default SignupPricingView;
