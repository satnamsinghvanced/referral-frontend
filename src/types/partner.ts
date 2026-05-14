export interface CreatedBy {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface PracticeType {
  _id: string;
  title: string;
}

export interface PracticeAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string | number;
  coordinates: {
    lat: number;
    long: number;
  };
}

export interface Practice {
  _id: string;
  name: string;
  address: PracticeAddress;
  website: string;
  level: string;
  practiceType: PracticeType;
  coordinates: {
    lat: number;
    long: number;
  };
}

export interface StaffMember {
  _id: string;
  name: string;
  role: string[];
  email: string;
  phone: string;
  isDentist: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityReferrerInfo {
  orgName: string;
  orgAddress: string;
  orgUrl: string;
}

export interface GoogleReferrerInfo {
  glSource: string;
  glPlatform: string;
  glUrl: string;
}

export interface SocialMediaReferrerInfo {
  smPlatform: string;
  smSource: string;
}

export interface EventReferrerInfo {
  evName: string;
  evLocation: string;
  evType: string;
  evUrl: string;
}

export interface CreateReferrerPayload {
  name: string;
  phone: string;
  email: string;
  communityreferrer?: CommunityReferrerInfo;
  googlereferrer?: GoogleReferrerInfo;
  socialmediareferrer?: SocialMediaReferrerInfo;
  eventreferrer?: EventReferrerInfo;
  practiceName?: string;
  partnershipLevel?: string;
  practiceAddress?: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string | number;
  };
  practiceType?: string;
  website?: string;
  additionalNotes?: string;
  staff?: {
    name: string;
    role: string[];
    email: string;
    phone: string;
    isDentist: boolean;
  }[];
}

export interface Referrer {
  _id: string;
  createdBy: CreatedBy;
  type: string; 
  name: string;
  phone: string;
  email: string;
  practice: Practice;
  notes: string;
  staffMembers: StaffMember[];
  isActive: boolean;
  referrals: any[]; 
  createdAt: string;
  updatedAt: string;
  nfcUrl: string;
  qrCode: string;
  qrUrl: string;
  uniqueTagUrl: string;
  thisMonthReferralCount: number;
}

export interface ReferrersResponse {
  data: Referrer[];
  limit: number;
  page: number;
  totalPages: number;
  totalReferrals: number;
}

export interface FetchReferrersParams {
  filter?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface Partner {
  _id: string;
  name: string;
  address: PracticeAddress;
  phone: string;
  email: string;
  website: string;
  level: string;
  status: string;
  totalReferrals: number;
  monthlyReferrals: number;
  notesCount: number;
  tasksCount: number;
  lastContact: string | null;
}

export interface PartnerPractice {
  _id: string;
  practiceName: string;
  practiceAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string | number;
  };
  practicePhone: string;
  email: string;
  website: string;
  partnershipLevel: string;
  status: string;
  totalReferrals: number;
  monthlyReferrals: number;
  noteCount: number;
  taskCount: number;
  lastContact: string | null;
  staff: any[];
  additionalNotes: any;
  pendingTaskCount?: number;
}

export interface StoppedReferringPartner {
  name: string;
  lastReferralDate: string;
  totalDays: number;
}

export interface FetchPartnersResponse {
  data: Partner[];
  stoppedReferring: StoppedReferringPartner[];
  totalPractices: number;
  filteredPractices: number;
  activePractices: number;
  totalReferrals: number;
  monthlyReferrals: number;
  totalALevelPractices: number;
  aLevelPercentage: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchPartnersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  filter?: string;
}

export interface NoteApiData {
  _id: string;
  description: string;
  practice: {
    _id: string;
    name: string;
  };
  category: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
}

export interface TaskComment {
  _id?: string;
  content: string;
  createdBy?: any;
  createdAt?: string;
}

export interface TaskApiData {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | string;
  category: "follow-up" | "meeting" | "other" | string;
  practiceId?: any;
  status: "pending" | "completed" | string;
  createdAt?: string;
  updatedAt?: string;
  isOverDue?: boolean;
  schedule?: string;
  assignTo?: any;
  notes?: string;
  comments?: TaskComment[];
}

export interface AllNotesTasksResponse {
  totalNotes: number;
  totalTasks: number;
  notes: NoteApiData[];
  tasks: TaskApiData[];
}

export interface CreateNotePayload {
  description: string;
  category: string;
  practiceId: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  dueDate: string;
  practiceId: string;
  priority: string;
  category: string;
  assignTo: string[];
  notes?: string;
}

export interface UpdateTaskPayload {
  taskId: string;
  data: any;
}

export interface Note {
  _id: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  type: "follow-up" | "meeting" | "other";
  dueDate: string;
  user: string;
  status: string;
}

export interface ScheduleEventPayload {
  taskId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  eventType: string;
  location: string;
  notes: string;
}

export interface EventDetails {
  _id?: string;
  taskId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  eventType: string;
  location: string;
  notes: string;
}

export interface RouteDetailStop {
  id: string;
  name: string;
  address: PracticeAddress;
  isFirstStop: boolean;
  arrivalTime: string;
  departureTime: string;
  travelTime: string;
  travelDistance: string;
}

export interface VisitPurpose {
  title: string;
  duration: string;
}

export interface RouteDataPayload {
  date: string;
  startTime: string;
  durationPerVisit: string;
  routeDetails: RouteDetailStop[];
  totalStops: number;
  estimatedTotalTime: string;
  estimatedDistance: string;
  mileageCost: string;
  visitDays: string;
}

export interface PlanDetails {
  planName: string;
  defaultPriority: string;
  durationPerVisit: string;
  defaultVisitPurpose: VisitPurpose;
  description: string;
}

export interface PlanDetailsPayload {
  name: string;
  priority: string;
  visitPurpose: VisitPurpose;
  description: string;
}

export interface SaveSchedulePlanPayload {
  practices: string[];
  route: RouteDataPayload;
  planDetails: PlanDetailsPayload;
}

export interface ScheduledVisitBase {
  scheduleVisitDate: string;
  startTime: string;
  visitPurpose: string;
  priority: string;
  notes: string;
}

export interface SchedulePlanRequest {
  practices: string[];
  planDetails: PlanDetails;
  scheduleVisits: ScheduledVisitBase[];
  review: {
    visitDays: string[];
    totalTime: string;
    distance: string;
  };
}

export interface SchedulePlanPutRequest {
  id: string;
  data: any;
}

export interface PlanDetailsGet extends PlanDetails {
  month: string;
}

export interface ReviewSummaryGet {
  visitDays: string[];
  totalTime: string;
  distance: string;
  totalReferrers: number;
}

export interface ScheduledVisitGet extends ScheduledVisitBase {
  _id: string;
}

export interface SchedulePlanGetResponse {
  planDetails: PlanDetailsGet;
  review: ReviewSummaryGet;
  _id: string;
  createdBy: string;
  practices: string[];
  scheduleVisits: ScheduledVisitGet[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryOption {
  _id: string;
  shortTitle: string;
}

export interface OptimizedRouteStop {
  id: string;
  name: string;
  address: string;
  arrive: string;
  depart: string;
  driveMin: number;
  miles: number;
}

export interface MockInitialData {
  planName: string;
  description: string;
  month: string;
  defaultVisitPurpose: string;
  customVisitPurpose: string;
  defaultPriority: string;
  durationPerVisit: string;
  enableAutoRoute: boolean;
  selectedReferrers: string[];
  estimatedTotalTime: string;
  estimatedDistance: string;
  mileageCost: string;
  visitSchedule: {
    [date: string]: { visits: number; optimized: boolean };
  };
  optimizedRoute: OptimizedRouteStop[];
}

export interface FilterState {
  search: string;
  category: string;
}

export interface RouteMetrics {
  routeDetails: RouteDetailStop[];
  totalStops: number;
  estimatedTotalTime: string;
  estimatedDistance: string;
  mileageCost: string;
  visitDays: string;
  travelDistance: string;
  travelTime: string;
}

export interface RouteOptimizationResults {
  original: RouteMetrics;
  optimized: RouteMetrics;
}

export interface GetSchedulePlansQuery {
  page: number;
  limit: number;
  search?: string;
  status?: "draft" | "active" | "completed" | "pending" | "cancel" | string;
  order?: "asc" | "desc" | string;
  sortBy?: "name" | "createdAt" | string;
}

interface PlanSummary {
  totalPractices: number;
  visitDays: number;
  estimatedTime: string;
  estimatedDistance: string;
}

export interface SchedulePlan {
  planDetails: any;
  _id: string;
  createdBy: string;
  practices: Practice[];
  route: RouteDataPayload;
  label: "active" | "draft";
  status: "pending" | "completed" | "cancel" | string;
  createdAt: string;
  updatedAt: string;
  summary: PlanSummary;
  visitNotes?: string;
  visitOutcome?: string;
  followUp?: boolean;
}

export interface SchedulePlanDashboardStats {
  totalPlans: number;
  draftCount: number;
  activeCount: number;
  completedCount: number;
  totalPractices: number;
  totalVisits: number;
  totalHours: string;
  totalMiles: string;
}

export interface SchedulePlansResponse {
  success: boolean;
  message: string;
  data: SchedulePlan[];
  dashboardStats: SchedulePlanDashboardStats;
  visitHistoryCount: number;
  pagination: {
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalData: number;
  };
}

interface VisitHistoryItem {
  route: RouteMetrics;
  planDetails: PlanDetails;
  _id: string;
  createdBy: string;
  practices: Practice[];
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface MonthlyVisitGroup {
  month: string;
  totalPlansThisMonth: number;
  visits: VisitHistoryItem[];
}

interface Stats {
  totalVisits: number;
  completedVisits: number;
  totalTime: string;
  officeVisits: number;
}

interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface VisitHistoryResponse {
  data: MonthlyVisitGroup[];
  stats: Stats;
  pagination: Pagination;
}

export interface VisitHistoryQueryParams {
  filter: "all" | "draft" | "completed" | "pending" | "cancel";
  search: string;
}

export interface VisitStatusUpdateFormValues {
  status: string;
  visitNotes: string | null;
  visitOutcome: string | null;
  followUp: boolean;
}
