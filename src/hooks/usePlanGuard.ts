import { useBilling } from "./settings/useBilling";
import { PlanAccess, PlanLimits } from "../types/billing";

export const usePlanGuard = () => {
  const { data: billingData, isLoading } = useBilling();

  const hasAccess = (accessKey: keyof PlanAccess): boolean => {
    if (!billingData || !billingData.access) return true;
    return billingData.access[accessKey] !== false;
  };

  const getLimit = (limitKey: keyof PlanLimits): number => {
    if (!billingData || !billingData.limits) return -1;
    const limit = billingData.limits[limitKey];
    return limit !== undefined ? limit : -1;
  };

  const isLimitReached = (
    limitKey: keyof PlanLimits,
    currentCount: number
  ): boolean => {
    const maxLimit = getLimit(limitKey);
    if (maxLimit === -1) return false;
    return currentCount >= maxLimit;
  };

  const openPricingPage = () => {
    const wordpressUrl =
      import.meta.env.WORDPRESS_BASE_URL || "https://practiceroi.com";
    const cleanUrl = wordpressUrl.replace(/\/$/, "");
    window.open(`${cleanUrl}/pricing`, "_blank");
  };

  return {
    billingData,
    isLoading,
    planName: billingData?.name || "Current Plan",
    hasAccess,
    getLimit,
    isLimitReached,
    openPricingPage,
  };
};
