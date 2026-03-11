import { useQuery } from "@tanstack/react-query";
import { getBilling } from "../../services/settings/billing";

export const useBilling = () => {
  return useQuery({
    queryKey: ["billing"],
    queryFn: () => getBilling(),
  });
};
