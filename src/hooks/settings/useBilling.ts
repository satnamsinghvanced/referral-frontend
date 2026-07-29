import { useMutation, useQuery } from "@tanstack/react-query";
import { getBilling, validateDiscount } from "../../services/settings/billing";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export const useBilling = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.userId || (user as any)?._id || (user as any)?.id || user?.email || "";

  return useQuery({
    queryKey: ["billing", userId],
    queryFn: async () => {
      const data = await getBilling();
      if (data && userId) {
        try {
          localStorage.setItem(`cached_billing_data_${userId}`, JSON.stringify(data));
        } catch (e) { }
      }
      return data;
    },
    initialData: () => {
      if (!userId) return undefined;
      try {
        const cached = localStorage.getItem(`cached_billing_data_${userId}`);
        if (cached) return JSON.parse(cached);
      } catch (e) { }
      return undefined;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 15,
  });
};

export const useValidateDiscount = () => {
  return useMutation({
    mutationFn: (code: string) => validateDiscount(code),
  });
};
