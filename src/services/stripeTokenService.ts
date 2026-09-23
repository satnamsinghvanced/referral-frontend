import axios from "axios";

export interface CardTokenDetails {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name?: string | null | undefined;
  country?: string | null | undefined;
  postalCode?: string | null | undefined;
}

export interface StripeTokenResult {
  paymentMethodId: string;
  token?: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

let cachedPublicKey: string | null = null;

export const getStripePublishableKey = async (): Promise<string> => {
  if (cachedPublicKey) return cachedPublicKey;

  const envKey = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY;
  if (envKey && typeof envKey === "string" && envKey.startsWith("pk_")) {
    cachedPublicKey = envKey;
    return envKey;
  }

  try {
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:9090/api";
    const res = await axios.get(`${apiBase}/user/stripe-public-key`, { timeout: 4000 });
    const pubKey = res?.data?.data?.publishableKey;
    if (pubKey && typeof pubKey === "string" && pubKey.startsWith("pk_")) {
      cachedPublicKey = pubKey;
      return pubKey;
    }
  } catch (err) {
    console.error("Failed to fetch Stripe public key:", err);
  }

  throw new Error("Stripe publishable key is not configured.");
};

export const createStripePaymentMethod = async (cardDetails: CardTokenDetails): Promise<StripeTokenResult> => {
  const publishableKey = await getStripePublishableKey();
  const cleanNumber = (cardDetails.cardNumber || "").replace(/\s+/g, "");
  const [expMonthStr, expYearStr] = (cardDetails.expiry || "").split("/");
  const expMonth = parseInt(expMonthStr?.trim() || "", 10);
  let expYear = parseInt(expYearStr?.trim() || "", 10);
  if (expYear < 100) expYear += 2000;

  const countryCodeMap: Record<string, string> = {
    "United States": "US",
    "Canada": "CA",
    "Australia": "AU",
    "United Kingdom": "GB",
    "India": "IN",
  };
  const countryCode = cardDetails.country ? (countryCodeMap[cardDetails.country] || cardDetails.country) : undefined;

  const params = new URLSearchParams();
  params.append("type", "card");
  params.append("card[number]", cleanNumber);
  params.append("card[exp_month]", String(expMonth));
  params.append("card[exp_year]", String(expYear));
  params.append("card[cvc]", (cardDetails.cvc || "").trim());

  if (cardDetails.name) {
    params.append("billing_details[name]", cardDetails.name.trim());
  }
  if (countryCode) {
    params.append("billing_details[address][country]", countryCode);
  }
  if (cardDetails.postalCode) {
    params.append("billing_details[address][postal_code]", cardDetails.postalCode.trim());
  }

  const response = await fetch("https://api.stripe.com/v1/payment_methods", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${publishableKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (data.error) {
    const errorMsg =
      data.error.message ||
      "Invalid card details. Please check your card number, expiration date, and CVC.";
    throw new Error(errorMsg);
  }

  if (!data.id || !data.id.startsWith("pm_")) {
    throw new Error("Unable to create secure payment token with Stripe. Please try again.");
  }

  return {
    paymentMethodId: data.id,
    token: data.id,
    brand: data.card?.brand || "card",
    last4: data.card?.last4 || cleanNumber.slice(-4),
    expMonth: data.card?.exp_month || expMonth,
    expYear: data.card?.exp_year || expYear,
  };
};
