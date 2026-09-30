export interface MappedRejectionItem {
  category: string;
  specificMessage: string;
  actionableTip: string;
  rawText?: string;
}

export interface RejectionParseResult {
  hasSpecificReason: boolean;
  reasons: MappedRejectionItem[];
  rawReason: string;
}

export function sanitizeWhiteLabel(text: string): string {
  if (!text) return "";
  return text
    .replace(/twilio/gi, "Platform")
    .replace(/tcr/gi, "Verification Authority")
    .replace(/mobile carriers|carriers|carrier review|carrier/gi, "verification team")
    .replace(/trusthub/gi, "verification system")
    .replace(/secondary customer profile|customer profile bundle/gi, "Business Verification Profile");
}

export function parseAndMapRejectionReason(
  rawReason?: string | null | object,
  registration?: any
): RejectionParseResult {
  const isProfileApproved =
    registration?.customerProfileStatus === "APPROVED" ||
    registration?.customerProfileStatus === "twilio-approved" ||
    registration?.customerProfileStatus === "approved";
  const isBrandApproved =
    registration?.brandStatus === "APPROVED" ||
    registration?.brandStatus === "VERIFIED" ||
    registration?.brandStatus === "approved";

  const defaultFallbackItems: MappedRejectionItem[] = (isProfileApproved && isBrandApproved)
    ? [
      {
        category: "Campaign & Message Flow",
        specificMessage: "Campaign sample messages or opt-in workflow description require adjustment.",
        actionableTip: "Ensure your sample messages include clear opt-in/opt-out instructions (STOP/HELP) and describe how patients opt in.",
      },
      {
        category: "Privacy Policy & Terms Compliance",
        specificMessage: "Carrier campaign review requires active and compliant Privacy Policy & Terms URLs.",
        actionableTip: "Ensure your Privacy Policy and Terms & Conditions URLs are active and include SMS opt-in disclosures.",
      },
      {
        category: "Business Website Verification",
        specificMessage: "Carrier verification could not confirm your practice website URL for campaign approval.",
        actionableTip: "Ensure your website URL is active, publicly accessible, and clearly displays your business name and contact info.",
      },
    ]
    : [
      {
        category: "Legal Business Identity & Tax ID (EIN)",
        specificMessage: "Legal business name or Tax ID (EIN) could not be verified against IRS records.",
        actionableTip: "Ensure your legal business name matches your official IRS W-9 or CP575 notice (including suffixes like LLC or Inc.) and enter your 9-digit EIN without dashes or spaces.",
      },
      {
        category: "Physical Business Address",
        specificMessage: "Physical business address did not match state or federal tax filings.",
        actionableTip: "Provide the exact physical street address registered with official tax records. P.O. Boxes are not permitted.",
      },
      {
        category: "Authorized Representative",
        specificMessage: "Authorized representative contact details require verification.",
        actionableTip: "Provide the legal name, direct corporate email, and telephone number of a designated company officer.",
      },
    ];

  if (!rawReason) {
    return { hasSpecificReason: true, reasons: defaultFallbackItems, rawReason: "" };
  }

  let strReason = "";
  if (typeof rawReason === "object") {
    try {
      strReason = JSON.stringify(rawReason);
    } catch {
      strReason = String(rawReason);
    }
  } else {
    strReason = String(rawReason).trim();
  }

  if (!strReason) {
    return { hasSpecificReason: true, reasons: defaultFallbackItems, rawReason: "" };
  }

  let parsedObj: any = null;
  try {
    if (strReason.startsWith("{") || strReason.startsWith("[")) {
      parsedObj = JSON.parse(strReason);
    }
  } catch { }

  let parts: string[] = [];
  if (Array.isArray(parsedObj)) {
    parts = parsedObj.map((item) =>
      typeof item === "object" ? item.message || item.description || item.failureReason || JSON.stringify(item) : String(item)
    );
  } else if (parsedObj && typeof parsedObj === "object") {
    if (Array.isArray(parsedObj.errors) && parsedObj.errors.length > 0) {
      parts = parsedObj.errors.map((e: any) => e.message || e.description || e.code || JSON.stringify(e));
    } else if (parsedObj.failureReason || parsedObj.message || parsedObj.description || parsedObj.error) {
      parts = [parsedObj.failureReason || parsedObj.message || parsedObj.description || parsedObj.error];
    } else {
      parts = [strReason];
    }
  } else {
    parts = strReason.split(/\s*\|\s*|\n+/).map((p) => p.trim()).filter(Boolean);
  }

  const mappedItems: MappedRejectionItem[] = [];

  for (let rawPart of parts) {
    rawPart = rawPart.replace(/^brand registration status:\s*(failed|rejected)\.?\s*/i, "").trim();
    rawPart = rawPart.replace(/^campaign status:\s*(failed|rejected)\.?\s*/i, "").trim();
    if (!rawPart) continue;
    const lower = rawPart.toLowerCase();
    if (
      lower.includes("ein") ||
      lower.includes("tax id") ||
      lower.includes("tax_id") ||
      lower.includes("legal name") ||
      lower.includes("business name") ||
      lower.includes("irs") ||
      lower.includes("30001") ||
      lower.includes("30002") ||
      lower.includes("30003") ||
      (lower.includes("mismatch") && (lower.includes("name") || lower.includes("tax")))
    ) {
      mappedItems.push({
        category: "Business Name & Tax ID (EIN)",
        specificMessage: "Your business name and Tax ID (EIN) don't match official records. Please double-check both.",
        actionableTip: "Verify your legal business name (including LLC or Inc. suffix) and 9-digit EIN against your official IRS W-9 or CP575 document.",
        rawText: sanitizeWhiteLabel(rawPart),
      });
    }
    else if (
      lower.includes("privacy_policy") ||
      lower.includes("privacy policy") ||
      lower.includes("30908")
    ) {
      mappedItems.push({
        category: "Privacy Policy Compliance",
        specificMessage: "A compliant Privacy Policy could not be verified by carrier review.",
        actionableTip: "Ensure your Privacy Policy URL is active and explicitly includes text stating mobile/SMS opt-in data will NOT be shared with third parties or affiliates for marketing.",
        rawText: sanitizeWhiteLabel(rawPart),
      });
    }
    else if (
      lower.includes("terms_and_conditions") ||
      lower.includes("terms and conditions") ||
      lower.includes("terms_url") ||
      lower.includes("30882") ||
      (lower.includes("terms") && lower.includes("url"))
    ) {
      mappedItems.push({
        category: "Terms & Conditions Compliance",
        specificMessage: "Campaign submission was rejected due to Terms and Conditions issues.",
        actionableTip: "Ensure your Terms & Conditions URL is active, publicly accessible, and clearly includes SMS opt-in disclosures (STOP/HELP commands, message frequency, and message/data rate warnings).",
        rawText: sanitizeWhiteLabel(rawPart),
      });
    }
    else if (
      lower.includes("website") ||
      lower.includes("url") ||
      lower.includes("domain") ||
      lower.includes("unverifiable website")
    ) {
      mappedItems.push({
        category: "Business Website Verification",
        specificMessage: "We couldn't verify your business website. Make sure it's live and publicly accessible.",
        actionableTip: "Ensure your website URL is active, publicly accessible, and clearly displays your business name and contact info.",
        rawText: sanitizeWhiteLabel(rawPart),
      });
    }
    else if (
      lower.includes("address") ||
      lower.includes("po box") ||
      lower.includes("street") ||
      lower.includes("postal") ||
      lower.includes("zip") ||
      lower.includes("30004")
    ) {
      mappedItems.push({
        category: "Physical Business Address",
        specificMessage: "Your business address doesn't match official filing records.",
        actionableTip: "Enter the exact physical street address registered with tax authorities. P.O. Boxes are not permitted.",
        rawText: sanitizeWhiteLabel(rawPart),
      });
    }
    else if (
      lower.includes("representative") ||
      lower.includes("authorized_representative") ||
      lower.includes("rep 1") ||
      lower.includes("rep 2") ||
      lower.includes("contact name")
    ) {
      mappedItems.push({
        category: "Authorized Representative Contact Info",
        specificMessage: "Authorized representative details (name, corporate title, corporate email, or phone) could not be verified.",
        actionableTip: "Provide the full legal name, business email address, and direct telephone number of the company officer.",
        rawText: sanitizeWhiteLabel(rawPart),
      });
    }
    else if (
      lower.includes("business_type") ||
      lower.includes("entity_type") ||
      lower.includes("business type") ||
      lower.includes("entity type") ||
      lower.includes("sole proprietorship") ||
      lower.includes("incorporation")
    ) {
      mappedItems.push({
        category: "Business Entity Type",
        specificMessage: "Your selected business type does not match official state/federal registration documents.",
        actionableTip: "Select the exact business structure (LLC, Corporation, Partnership, Sole Proprietorship) listed on your government registration.",
        rawText: sanitizeWhiteLabel(rawPart),
      });
    }
    else if (
      lower.includes("sample") ||
      lower.includes("opt-in") ||
      lower.includes("opt_in") ||
      lower.includes("message_flow") ||
      lower.includes("call_to_action")
    ) {
      mappedItems.push({
        category: "Campaign & Message Flow",
        specificMessage: "Campaign sample messages or opt-in workflow description require adjustment.",
        actionableTip: "Ensure your sample messages and message flow clearly describe how users opt in and how to opt out.",
        rawText: sanitizeWhiteLabel(rawPart),
      });
    }
    else if (rawPart.length > 0) {
      const sanitized = sanitizeWhiteLabel(rawPart);
      mappedItems.push({
        category: "Carrier Review Feedback",
        specificMessage: sanitized,
        actionableTip: "Please review your campaign submission, sample messages, and business URLs before re-submitting.",
        rawText: sanitized,
      });
    }
  }
  const uniqueReasons = mappedItems.filter(
    (item, index, self) => index === self.findIndex((t) => t.category === item.category)
  );
  if (uniqueReasons.length === 0) {
    return {
      hasSpecificReason: true,
      reasons: defaultFallbackItems,
      rawReason: sanitizeWhiteLabel(strReason),
    };
  }
  return {
    hasSpecificReason: true,
    reasons: uniqueReasons,
    rawReason: sanitizeWhiteLabel(strReason),
  };
}
