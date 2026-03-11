export interface BillingData {
  id: string;
  name: string;
  price: number;
  nextBillingDate: string;
  billingCycle: string;
  paymentMethod: string;
  cardNumber: string;
  expire: string;
  status: string;
}
