import { ButtonProps } from "@heroui/react";
import { ReactNode } from "react";

// button types
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonVariant =
  | "solid"
  | "bordered"
  | "light"
  | "flat"
  | "faded"
  | "shadow"
  | "ghost";

export type ButtonColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

export type ButtonRadius = "none" | "sm" | "md" | "lg" | "full";

export type SpinnerPlacement = "start" | "end";

export type ButtonType =
  | "custom"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type LabelPlacement = "inside" | "outside" | "outside-left";

export type SafeButtonProps = Partial<ButtonProps> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
};

export type ButtonConfig = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
  size?: ButtonSize;
  color?: ButtonColor;
  variant?: ButtonVariant;
  radius?: ButtonRadius;
};

export type Referrer = {
  type: string;
  qrCode: any;
  referrals: any;
  practiceName: ReactNode;
  name: ReactNode;
  _id: string;
  fullName: string;
  practice: {
    name: string;
    address?: {
      coordinates?: {
        lat?: number;
        long?: number;
      };
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };

  referredBy: string;
  totalReferrals: number;
  thisMonthReferralCount: number;
};

export const REFERRAL_MOCK_FILTER_STATS = {
  totalReferrals: 0,
  totalValue: "",
  activeCount: 0,
  highPriorityCount: 0,
};

export const REFERRAL_MOCK_CURRENT_FILTERS = {
  page: 1,
  limit: 20,
  search: "",
  filter: "",
  source: "",
};

export const mockTotalReferrals = 8;
