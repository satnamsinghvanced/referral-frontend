import { useMutation, useQuery } from "@tanstack/react-query";
import { getBilling, validateDiscount } from "../../services/settings/billing";

export const useBilling = () => {
  return useQuery({
    queryKey: ["billing"],
    queryFn: () => getBilling(),
  });
};

export const useValidateDiscount = () => {
  return useMutation({
    mutationFn: (code: string) => validateDiscount(code),
  });
};
