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

/**
 * Sanitizes third-party names (Twilio, TCR, carrier, etc.) to enforce strict white-label branding.
 */
export function sanitizeWhiteLabel(text: string): string {
  if (!text) return "";
  return text
    .replace(/twilio/gi, "Platform")
    .replace(/tcr/gi, "Verification Authority")
    .replace(/mobile carriers|carriers|carrier review|carrier/gi, "verification team")
    .replace(/trusthub/gi, "verification system")
    .replace(/secondary customer profile|customer profile bundle/gi, "Business Verification Profile");
}

/**
 * Translates raw technical/carrier rejection reason string or object into 
 * user-friendly, non-technical, white-labeled explanations.
 */
export function parseAndMapRejectionReason(rawReason?: string | null | object): RejectionParseResult {
  if (!rawReason) {
    return { hasSpecificReason: false, reasons: [], rawReason: "" };
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
    return { hasSpecificReason: false, reasons: [], rawReason: "" };
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

    // Ignore non-specific / placeholder technical strings
    if (
      lower === "general error" ||
      lower === "unfulfilled" ||
      lower === "failed" ||
      lower === "rejected" ||
      lower === "registration rejected" ||
      lower === "registration rejected by carrier review." ||
      lower === "campaign rejected by carriers." ||
      lower === "customer profile bundle was rejected during carrier review." ||
      lower === "a2p messaging profile was rejected during review." ||
      lower === "brand registration status: failed." ||
      lower === "brand registration status: rejected."
    ) {
      continue;
    }

    // 1. Business Name & Tax ID (EIN) Mismatch
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
    // 2. Business Website Verification
    else if (
      lower.includes("website") ||
      lower.includes("url") ||
      lower.includes("domain") ||
      lower.includes("privacy policy") ||
      lower.includes("unverifiable website")
    ) {
      mappedItems.push({
        category: "Business Website Verification",
        specificMessage: "We couldn't verify your business website. Make sure it's live and publicly accessible.",
        actionableTip: "Ensure your website URL is active, publicly accessible, and clearly displays your business name and contact info.",
        rawText: sanitizeWhiteLabel(rawPart),
      });
    }
    // 3. Physical Business Address Mismatch
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
    // 4. Authorized Representative Info
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
    // 5. Business Entity Type
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
    // 6. Campaign Samples / Opt-In Workflow
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
    // 7. Specific non-generic error text
    else if (rawPart.length > 8) {
      const sanitized = sanitizeWhiteLabel(rawPart);
      mappedItems.push({
        category: "Verification Requirement",
        specificMessage: sanitized,
        actionableTip: "Please review your business information and resubmit with verified records.",
        rawText: sanitized,
      });
    }
  }

  const uniqueReasons = mappedItems.filter(
    (item, index, self) => index === self.findIndex((t) => t.category === item.category)
  );

  return {
    hasSpecificReason: uniqueReasons.length > 0,
    reasons: uniqueReasons,
    rawReason: sanitizeWhiteLabel(strReason),
  };
}
