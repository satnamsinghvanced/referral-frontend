import React, { useState, useEffect } from "react";
import { PlanData, PlanFeatureItem } from "../../../../services/planFeature";
import { FiEdit2, FiTrash2, FiCheck, FiX, FiStar } from "react-icons/fi";

interface PlanCardProps {
  plan: PlanData;
  isLight: boolean;
  activeCycle?: "monthly" | "yearly";
  onEditPlan: (plan: PlanData) => void;
  onDeletePlan: (planId: string, title: string) => void;
  onAddFeatureInline: (plan: PlanData, cycle: "monthly" | "yearly", text: string) => void;
  onSaveEditedFeature: (plan: PlanData, featureId: string, name: string, cycle: "monthly" | "yearly") => void;
  onToggleFeature: (plan: PlanData, feat: PlanFeatureItem, cycle: "monthly" | "yearly") => void;
  onDeleteFeature: (planId: string, featureId: string, title: string, cycle: "monthly" | "yearly") => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isLight,
  activeCycle: parentCycle = "monthly",
  onEditPlan,
  onDeletePlan,
  onAddFeatureInline,
  onSaveEditedFeature,
  onToggleFeature,
  onDeleteFeature,
}) => {
  const [cardCycle, setCardCycle] = useState<"monthly" | "yearly">(parentCycle);
  const [inlineInput, setInlineInput] = useState("");
  const [editingFeatureItem, setEditingFeatureItem] = useState<{
    featureId: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    setCardCycle(parentCycle);
  }, [parentCycle]);

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
  const annualDesc = plan.annualPricing?.description ?? plan.yearlyDescription ?? plan.description ?? "";

  const rawMonthlyFeats = plan.monthlyFeatures || plan.features || plan.featuresList || [];
  const rawYearlyFeats = plan.yearlyFeatures || plan.features || plan.featuresList || rawMonthlyFeats;

  const currentCycleFeatures: PlanFeatureItem[] = (
    cardCycle === "yearly" ? rawYearlyFeats : rawMonthlyFeats
  ).map((f: any, i: number) =>
    typeof f === "string" ? { _id: `feat_${i}`, name: f, isEnabled: true } : f
  );

  const savingsPerYear = Math.max(0, monthlyPrice * 12 - annualTotal);

  const handleAddInline = () => {
    const text = inlineInput.trim();
    if (!text) return;
    onAddFeatureInline(plan, cardCycle, text);
    setInlineInput("");
  };

  return (
    <div
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
              {cardCycle === "yearly" ? annualDesc || plan.description : monthlyDesc || plan.description}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onEditPlan(plan)}
              className="p-2 rounded-xl text-slate-400 hover:text-[#20a9f8] hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer"
              title="Edit Plan"
            >
              <FiEdit2 className="text-sm" />
            </button>
            {plan._id && (
              <button
                type="button"
                onClick={() => onDeletePlan(plan._id!, plan.name)}
                className="p-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                title="Delete Plan"
              >
                <FiTrash2 className="text-sm text-red-500" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {cardCycle === "monthly" ? (
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
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111A2E] border border-slate-200/80 dark:border-[#1E2B45] space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>
                    ${annualPrice}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">/mo</span>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                  Annual {annualDiscount > 0 ? `(${annualDiscount}% off)` : ""}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {savingsPerYear > 0 ? `Save $${savingsPerYear}/year (${annualDiscount || 17}% off)` : `Save ${annualDiscount}% off`}
              </p>
              <p className="text-[11px] font-medium text-slate-400">
                ${annualTotal || annualPrice * 12} billed annually
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              PLAN FEATURES ({currentCycleFeatures.length})
            </span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={inlineInput}
              onChange={(e) => setInlineInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddInline();
                }
              }}
              placeholder={`Add feature to ${cardCycle} plan...`}
              className={`flex-1 text-xs rounded-xl px-3 py-2 border focus:outline-none ${isLight
                ? "bg-white border-slate-300 text-slate-900 focus:border-[#20a9f8]"
                : "bg-[#111A2E] border-[#1E2B45] text-slate-200 focus:border-[#20a9f8]"
                }`}
            />
            <button
              type="button"
              onClick={handleAddInline}
              disabled={!inlineInput.trim()}
              className="bg-[#20a9f8] hover:bg-[#1a96de] text-white font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              + Add
            </button>
          </div>

          <div className="space-y-2.5 h-[340px] overflow-y-auto pr-2 [scrollbar-width:thin] [::-webkit-scrollbar]:w-1.5 [::-webkit-scrollbar-thumb]:bg-slate-300 dark:[::-webkit-scrollbar-thumb]:bg-slate-700 [::-webkit-scrollbar-thumb]:rounded-full [::-webkit-scrollbar-track]:bg-transparent">
            {currentCycleFeatures.length === 0 ? (
              <p className="text-xs italic text-slate-400 py-2">
                No {cardCycle} features added yet.
              </p>
            ) : (
              currentCycleFeatures.map((feat, fIdx) => {
                const featureKey = feat._id || `feat_${fIdx}`;
                const isEditingThis =
                  editingFeatureItem !== null && editingFeatureItem.featureId === featureKey;

                if (isEditingThis && editingFeatureItem) {
                  return (
                    <div
                      key={featureKey}
                      className="flex items-center gap-2 p-2 rounded-xl border border-[#20a9f8] bg-sky-50/20 dark:bg-sky-950/20 text-xs w-full"
                    >
                      <input
                        type="text"
                        value={editingFeatureItem.name}
                        onChange={(e) =>
                          setEditingFeatureItem({
                            ...editingFeatureItem,
                            name: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            onSaveEditedFeature(plan, featureKey, editingFeatureItem.name, cardCycle);
                            setEditingFeatureItem(null);
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
                        onClick={() => {
                          onSaveEditedFeature(plan, featureKey, editingFeatureItem.name, cardCycle);
                          setEditingFeatureItem(null);
                        }}
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
                        onClick={() => onToggleFeature(plan, feat, cardCycle)}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 ${feat.isEnabled
                          ? "bg-emerald-500"
                          : isLight
                            ? "bg-slate-300"
                            : "bg-slate-700"
                          }`}
                        title={feat.isEnabled ? "Disable feature" : "Enable feature"}
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
                        onClick={() => onDeleteFeature(plan._id!, featureKey, feat.name, cardCycle)}
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
};

export default PlanCard;
