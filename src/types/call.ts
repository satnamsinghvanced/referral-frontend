export interface Tag {
  label: string;
  type: "status" | "action" | "category";
}

export interface CallRecord {
  id: string;
  callerName: string;
  callerPhone: string;
  timeAgo: string;
  sentiment: "positive" | "negative" | "neutral";
  duration: string;
  isVerified: boolean;
  tags: Tag[];
}

export interface CallFilters {
  search: string;
  type: string;
  status: string;
}
