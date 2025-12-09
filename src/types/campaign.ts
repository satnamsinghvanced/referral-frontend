export interface Template {
  id: number;
  title: string;
  description: string;
  category: string;
  rating: number;
  usages: number;
  tags: string[];
  image: string;
  isPopular: boolean;
}

export interface Segment {
  id: number;
  name: string;
  description: string;
  type: string;
  status: "active" | "inactive";
  contacts: number;
  campaigns: number;
  updatedAt: string;
  tags: string[];
  avgOpenRate: string;
  avgClickRate: string;
  size: number;
}

export interface CampaignMetric {
  id: number;
  rank: number;
  name: string;
  openRate: string;
  clickRate: string;
  conversions: number;
}