import { FiCheckCircle, FiInfo, FiClock } from "react-icons/fi";
import { A2PRegistrationData, StageStatus } from "./types";

export const getA2PBadgeDetails = (registration: A2PRegistrationData | null) => {
  if (!registration) return null;
  const rawStatus = (registration?.status === "failed" || registration?.status === "approved")
    ? registration.status
    : (registration?.campaignStatus || registration?.status || "pending");
  const statusUpper = rawStatus.toUpperCase();
  if (statusUpper === "VERIFIED" || statusUpper === "APPROVED") {
    return {
      label: "Verified",
      colorClass: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30",
      icon: <FiCheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
    };
  }
  if (statusUpper === "FAILED" || statusUpper === "REJECTED") {
    return {
      label: "Rejected",
      colorClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 dark:border-red-500/10",
      icon: <FiInfo className="w-3 h-3 text-red-500" />
    };
  }
  const displayLabel = statusUpper === "IN_PROGRESS" ? "In Progress" : "Pending Review";
  return {
    label: displayLabel,
    colorClass: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
    icon: <FiClock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
  };
};

export const getStageStatus = (registration: A2PRegistrationData | null, stage: 'profile' | 'brand' | 'campaign'): StageStatus => {
  if (!registration) {
    return { status: 'NOT_REGISTERED', label: 'Not registered', type: 'neutral' };
  }
  if (stage === 'profile') {
    const st = registration.customerProfileStatus || (registration.customerProfileBundleSid ? (registration.status === 'failed' && !registration.brandSid ? 'FAILED' : 'APPROVED') : 'NOT_REGISTERED');
    if (st === 'APPROVED' || registration.status === 'approved' || (registration.customerProfileBundleSid && registration.status !== 'failed')) return { status: 'APPROVED', label: 'Approved', type: 'success' };
    if (st === 'PENDING' || (registration.customerProfileBundleSid && registration.status === 'pending')) return { status: 'PENDING', label: 'Pending Review', type: 'warning' };
    if (st === 'FAILED') return { status: 'FAILED', label: 'Rejected', type: 'danger' };
    return { status: 'NOT_REGISTERED', label: 'Not registered', type: 'neutral' };
  }
  if (stage === 'brand') {
    const rawBrandStatus = (registration.brandStatus || "").toUpperCase();
    if (rawBrandStatus === 'APPROVED' || rawBrandStatus === 'VERIFIED') {
      return { status: 'APPROVED', label: 'Approved', type: 'success' };
    }
    if (rawBrandStatus === 'FAILED' || rawBrandStatus === 'REJECTED') {
      return { status: 'FAILED', label: 'Rejected', type: 'danger' };
    }
    if (rawBrandStatus === 'PENDING' || registration.brandSid || registration.customerProfileStatus === 'APPROVED' || registration.status === 'pending') {
      return { status: 'PENDING', label: 'Pending Review', type: 'warning' };
    }
    return { status: 'NOT_REGISTERED', label: 'Not registered', type: 'neutral' };
  }
  if (stage === 'campaign') {
    const rawCampStatus = (registration.campaignStatus || "").toUpperCase();
    if (rawCampStatus === 'APPROVED' || rawCampStatus === 'VERIFIED' || registration.status === 'approved') {
      return { status: 'APPROVED', label: 'Approved', type: 'success' };
    }
    if (rawCampStatus === 'FAILED' || rawCampStatus === 'REJECTED' || (registration.status === 'failed' && registration.campaignSid)) {
      return { status: 'FAILED', label: 'Rejected', type: 'danger' };
    }
    if (rawCampStatus === 'PENDING' || registration.campaignSid || registration.status === 'pending') {
      return { status: 'PENDING', label: 'Pending Review', type: 'warning' };
    }
    return { status: 'NOT_REGISTERED', label: 'Not registered', type: 'neutral' };
  }
  return { status: 'NOT_REGISTERED', label: 'Not registered', type: 'neutral' };
};
