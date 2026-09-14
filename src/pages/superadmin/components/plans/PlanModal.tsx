import React, { useState, useEffect } from "react";
import { PlanData } from "../../../../services/planFeature";
import { FiDollarSign, FiX, FiAlertCircle, FiTrash2 } from "react-icons/fi";

interface PlanModalProps {
  isOpen: boolean;
  isLight: boolean;
  editingPlan: PlanData | null;
  onClose: () => void;
  onSavePlan: (payload: Partial<PlanData>) => Promise<void>;
  savingPlan: boolean;
}

export const PlanModal: React.FC<PlanModalProps> = ({
  isOpen,
  isLight,
  editingPlan,
  onClose,
  onSavePlan,
  savingPlan,
}) => {
  const [modalCycleTab, setModalCycleTab] = useState<"monthly" | "yearly">("monthly");
  const [hasCopiedToYearlyInModal, setHasCopiedToYearlyInModal] = useState(false);
  const [newModalFeatureInput, setNewModalFeatureInput] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});

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
    annualSaveAmount: string;
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
    annualSaveAmount: "",
    annualTotalValue: "",
    yearlyDescription: "",
    monthlyFeatures: [],
    yearlyFeatures: [],
  });

  useEffect(() => {
    if (!isOpen) return;

    setFormErrors({});
    setModalCycleTab("monthly");

    if (editingPlan) {
      const tagDesc = editingPlan.description || "";
      const mPrice = editingPlan.monthlyPricing?.price ?? editingPlan.price ?? "";
      const mDisc = editingPlan.monthlyPricing?.discountPercent ?? 0;
      const mTot =
        editingPlan.monthlyPricing?.totalValue &&
          editingPlan.monthlyPricing?.totalValue !== 0 &&
          (mDisc > 0 || editingPlan.monthlyPricing?.totalValue !== Number(mPrice))
          ? String(editingPlan.monthlyPricing.totalValue)
          : "";
      const mDesc = editingPlan.monthlyPricing?.description ?? "";

      const aPrice = editingPlan.annualPricing?.price ?? editingPlan.annualPrice ?? "";
      const aDisc = editingPlan.annualPricing?.discountPercent ?? editingPlan.discountPercent ?? 0;
      const aTot =
        editingPlan.annualPricing?.totalValue ?? (Number(aPrice) > 0 ? Number(aPrice) * 12 : "");
      const aSave = (editingPlan.annualPricing as any)?.saveAmount
        ? String((editingPlan.annualPricing as any).saveAmount)
        : Number(mPrice) > 0 && Number(aTot) > 0
          ? String(Math.max(0, Number(mPrice) * 12 - Number(aTot)))
          : "";
      const aDesc = editingPlan.annualPricing?.description ?? editingPlan.yearlyDescription ?? "";

      const rawMonthlyFeats = editingPlan.monthlyFeatures || editingPlan.features || editingPlan.featuresList || [];
      const rawYearlyFeats = editingPlan.yearlyFeatures || editingPlan.features || editingPlan.featuresList || rawMonthlyFeats || [];

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
        name: editingPlan.name,
        description: tagDesc,
        isPopular: !!editingPlan.isPopular,
        monthlyPrice: mPrice !== "" ? String(mPrice) : "",
        monthlyDiscountPercent: mDisc ? String(mDisc) : "",
        monthlyTotalValue: mTot !== "" ? String(mTot) : "",
        monthlyDescription: mDesc,
        annualPrice: aPrice !== "" ? String(aPrice) : "",
        annualDiscountPercent: aDisc ? String(aDisc) : "",
        annualSaveAmount: aSave,
        annualTotalValue: aTot !== "" ? String(aTot) : "",
        yearlyDescription: aDesc,
        monthlyFeatures: parsedMonthlyFeats,
        yearlyFeatures: parsedYearlyFeats.length > 0 ? parsedYearlyFeats : parsedMonthlyFeats,
      });
      setHasCopiedToYearlyInModal(true);
    } else {
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
        annualSaveAmount: "",
        annualTotalValue: "",
        yearlyDescription: "",
        monthlyFeatures: [],
        yearlyFeatures: [],
      });
      setHasCopiedToYearlyInModal(false);
    }
    setNewModalFeatureInput("");
  }, [isOpen, editingPlan]);

  if (!isOpen) return null;

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
    if (val.length > 10) return;
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
    if (val.length > 10) return;
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
    if (val.length > 10) return;
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
    if (val.length > 10) return;
    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
      const numAP = Number(val);
      const numDisc = Number(planForm.annualDiscountPercent);

      let computedTotal = "";
      let computedSave = planForm.annualSaveAmount;

      if (numAP > 0) {
        if (numDisc > 0 && numDisc <= 100) {
          const baseAnnual = numAP * 12;
          const saveVal = Math.round(baseAnnual * (numDisc / 100));
          computedSave = String(saveVal);
          computedTotal = String(Math.max(0, baseAnnual - saveVal));
        } else {
          computedTotal = String(numAP * 12);
        }
      } else {
        computedTotal = "";
        computedSave = "";
      }

      setPlanForm((prev) => ({
        ...prev,
        annualPrice: val,
        annualTotalValue: computedTotal,
        annualSaveAmount: computedSave,
      }));
      if (formErrors.price) setFormErrors((prev) => ({ ...prev, price: undefined }));
    }
  };

  const handleAnnualDiscountChange = (val: string) => {
    if (val.length > 10) return;
    if (val === "" || (/^\d+$/.test(val) && Number(val) <= 100)) {
      const numDisc = Number(val);
      const baseMP =
        Number(planForm.annualPrice) > 0
          ? Number(planForm.annualPrice)
          : Number(planForm.monthlyPrice) > 0
            ? Number(planForm.monthlyPrice)
            : Number(planForm.annualTotalValue) > 0
              ? Number(planForm.annualTotalValue) / 12
              : 0;

      let computedTotal = planForm.annualTotalValue;
      let computedSave = planForm.annualSaveAmount;

      if (val === "") {
        computedSave = "";
        if (Number(planForm.annualPrice) > 0) {
          computedTotal = String(Number(planForm.annualPrice) * 12);
        }
      } else if (numDisc >= 0 && baseMP > 0) {
        const baseAnnual = baseMP * 12;
        const autoSave = Math.round(baseAnnual * (numDisc / 100));
        computedSave = String(autoSave);
        computedTotal = String(Math.max(0, baseAnnual - autoSave));
      }

      setPlanForm((prev) => ({
        ...prev,
        annualDiscountPercent: val,
        annualTotalValue: computedTotal,
        annualSaveAmount: computedSave,
      }));
    }
  };

  const handleAnnualSaveAmountChange = (val: string) => {
    if (val.length > 10) return;
    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
      const numSave = Number(val);
      const baseMP =
        Number(planForm.annualPrice) > 0
          ? Number(planForm.annualPrice)
          : Number(planForm.monthlyPrice) > 0
            ? Number(planForm.monthlyPrice)
            : 0;

      let computedTotal = planForm.annualTotalValue;

      if (val !== "" && baseMP > 0) {
        const baseAnnual = baseMP * 12;
        computedTotal = String(Math.max(0, baseAnnual - numSave));
      }

      setPlanForm((prev) => ({
        ...prev,
        annualSaveAmount: val,
        annualTotalValue: computedTotal,
      }));
    }
  };

  const handleAnnualTotalValueChange = (val: string) => {
    if (val.length > 10) return;
    if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
      const numTot = Number(val);
      const baseMP =
        Number(planForm.annualPrice) > 0
          ? Number(planForm.annualPrice)
          : Number(planForm.monthlyPrice) > 0
            ? Number(planForm.monthlyPrice)
            : 0;

      let computedSave = planForm.annualSaveAmount;

      if (numTot > 0 && baseMP > 0) {
        const baseAnnual = baseMP * 12;
        computedSave = String(Math.max(0, baseAnnual - numTot));
      }

      setPlanForm((prev) => ({
        ...prev,
        annualTotalValue: val,
        annualSaveAmount: computedSave,
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

  const handleSave = () => {
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
        saveAmount: planForm.annualSaveAmount !== "" ? Number(planForm.annualSaveAmount) : Math.max(0, mPriceVal * 12 - aTotVal),
        description: planForm.yearlyDescription,
      },
      monthlyFeatures: planForm.monthlyFeatures as any,
      yearlyFeatures: planForm.yearlyFeatures.length > 0 ? (planForm.yearlyFeatures as any) : (planForm.monthlyFeatures as any),
      features: planForm.monthlyFeatures as any,
    };

    onSavePlan(payload);
  };

  const currentModalFeatureList =
    modalCycleTab === "monthly" ? planForm.monthlyFeatures : planForm.yearlyFeatures;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
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
            onClick={onClose}
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
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${modalCycleTab === "monthly"
                    ? "bg-[#20a9f8] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchModalTab("yearly")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${modalCycleTab === "yearly"
                    ? "bg-[#20a9f8] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  Annual
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
                        maxLength={10}
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
                        maxLength={10}
                        value={planForm.monthlyDiscountPercent}
                        onChange={(e) => handleMonthlyDiscountChange(e.target.value)}
                        placeholder="e.g. 0"
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${isLight ? "bg-white border-slate-300" : "bg-[#0B101D] border-[#1E2B45]"
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
                        maxLength={10}
                        value={planForm.monthlyTotalValue}
                        onChange={(e) => handleMonthlyTotalValueChange(e.target.value)}
                        placeholder="Auto or custom"
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${isLight ? "bg-white border-slate-300" : "bg-[#0B101D] border-[#1E2B45]"
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

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 text-xs">
                        Annual Price ($/mo)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
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
                        maxLength={10}
                        value={planForm.annualDiscountPercent}
                        onChange={(e) => handleAnnualDiscountChange(e.target.value)}
                        placeholder="e.g. 17"
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${isLight ? "bg-white border-slate-300" : "bg-[#0B101D] border-[#1E2B45]"
                          }`}
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300 text-xs">
                        Save Amount ($/yr)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        value={planForm.annualSaveAmount}
                        onChange={(e) => handleAnnualSaveAmountChange(e.target.value)}
                        placeholder="e.g. 798"
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${isLight ? "bg-white border-slate-300" : "bg-[#0B101D] border-[#1E2B45]"
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
                        maxLength={10}
                        value={planForm.annualTotalValue}
                        onChange={(e) => handleAnnualTotalValueChange(e.target.value)}
                        placeholder="Auto or custom"
                        className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none font-medium text-xs ${isLight ? "bg-white border-slate-300" : "bg-[#0B101D] border-[#1E2B45]"
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

                  {(Number(planForm.annualPrice) > 0 || Number(planForm.annualTotalValue) > 0) && (
                    <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs space-y-0.5">
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block text-xs">
                        Save ${planForm.annualSaveAmount || (Number(planForm.monthlyPrice) > 0 ? Math.max(0, Number(planForm.monthlyPrice) * 12 - (Number(planForm.annualTotalValue) || Number(planForm.annualPrice) * 12)) : 0)}/year {planForm.annualDiscountPercent ? `(${planForm.annualDiscountPercent}% off)` : ""}
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
                    className={`w-full text-xs rounded-xl px-3.5 py-2.5 border focus:outline-none ${formErrors.feature
                      ? "border-red-500 ring-1 ring-red-500"
                      : isLight
                        ? "bg-white border-slate-300"
                        : "bg-[#111A2E] border-[#1E2B45]"
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
                      ? isLight
                        ? "bg-slate-100 opacity-60"
                        : "bg-slate-900/60 opacity-60"
                      : isLight
                        ? "bg-slate-50"
                        : "bg-[#111A2E]"
                      }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatureInModalForm(fIdx)}
                        className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${f.isEnabled ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                      >
                        <div
                          className={`bg-white w-3 h-3 rounded-full shadow transform transition-transform ${f.isEnabled ? "translate-x-4" : "translate-x-0"
                            }`}
                        />
                      </button>
                      <span
                        className={`truncate font-medium ${!f.isEnabled ? "line-through text-slate-400" : ""}`}
                      >
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
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${isLight
              ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              : "bg-[#111A2E] border-[#1E2B45] text-slate-300 hover:bg-[#1A2642]"
              }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
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
  );
};

export default PlanModal;
