import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";

export function useTwilioStripeListener() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const successParam = searchParams.get("success");
  const typeParam = searchParams.get("type");
  useEffect(() => {
    if (window.opener && typeParam === "twilio_credits") {
      if (successParam === "true") {
        window.opener.postMessage({ type: "STRIPE_SUCCESS" }, "*");
      } else if (successParam === "false") {
        window.opener.postMessage({ type: "STRIPE_CANCEL" }, "*");
      }
      window.close();
      return;
    }
    if (successParam === "true" && typeParam === "twilio_credits") {
      addToast({
        title: "Credits Added",
        description: "Payment successful!",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["twilio"] });
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("success");
      newParams.delete("session_id");
      newParams.delete("type");
      setSearchParams(newParams);
    } else if (successParam === "false" && typeParam === "twilio_credits") {
      addToast({
        title: "Checkout Canceled",
        description: "Your credits purchase was canceled.",
        color: "warning",
      });
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("success");
      newParams.delete("type");
      setSearchParams(newParams);
    }
  }, [successParam, typeParam, queryClient, searchParams, setSearchParams]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "STRIPE_SUCCESS") {
        addToast({
          title: "Credits Added",
          description: "Payment successful! Your credits and minutes have been updated.",
          color: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["twilio"] });
      } else if (event.data?.type === "STRIPE_CANCEL") {
        addToast({
          title: "Checkout Canceled",
          description: "Your credits purchase was canceled.",
          color: "warning",
        });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [queryClient]);
}
