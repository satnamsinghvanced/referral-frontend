import { ButtonProps } from "@heroui/react";

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
  qrCode: any;
  referrals: any;
  practiceName: ReactNode;
  name: ReactNode;
  _id: string;
  fullName: string;
  practice: string;
  referredBy: string;
  totalReferrals: number;
  referralsThisMonth: number;
}