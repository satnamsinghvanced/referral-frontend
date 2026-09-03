import { ClientAccount } from "./types";

export const formatRelativeTime = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return "2 mins ago";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.max(0, Math.floor(diffInMs / 1000));
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInSecs < 60) return "Just now";
  if (diffInMins < 60) return `${diffInMins} min${diffInMins > 1 ? "s" : ""} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
};

export const getPlanDueNotice = (
  account: ClientAccount
): { text: string; isWarning: boolean } | null => {
  if (account.statusSubtext) {
    return {
      text: account.statusSubtext,
      isWarning: account.status === "Past Due",
    };
  }
  if (account.status === "Trial") {
    if (account.nextBillingDate) {
      const trialDate = new Date(account.nextBillingDate);
      if (!isNaN(trialDate.getTime())) {
        const monthStr = trialDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        return { text: `ends ${monthStr}`, isWarning: false };
      }
    }
    return { text: "ends Jul 10", isWarning: false };
  }
  if (account.status === "Past Due") {
    return { text: "12d overdue", isWarning: true };
  }
  if (account.nextBillingDate) {
    const dueDate = new Date(account.nextBillingDate);
    if (!isNaN(dueDate.getTime())) {
      const now = new Date();
      const diffInDays = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays < 0) {
        return { text: `${Math.abs(diffInDays)}d overdue`, isWarning: true };
      }
      if (diffInDays <= 10) {
        return {
          text: `due in ${diffInDays} day${diffInDays > 1 ? "s" : ""}`,
          isWarning: true,
        };
      }
    }
  }
  return null;
};
