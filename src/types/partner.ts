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
  level: string; // e.g., "B-Level"
  practiceType: PracticeType;
  coordinates: {
    lat: number;
    long: number;
  };
}

export interface StaffMember {
  _id: string;
  name: string;
  role: string[]; // e.g., ["Dental Assistant"]
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
  type: string; // e.g., "doctor"
  name: string;
  phone: string;
  email: string;
  practice: Practice;
  notes: string;
  staffMembers: StaffMember[];
  isActive: boolean;
  referrals: any[]; // Assuming an array of referral IDs or objects (can be refined if data is available)
  createdAt: string;
  updatedAt: string;
  nfcUrl: string;
  qrCode: string;
  qrUrl: string;
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
}

export interface Partner {
  _id: string;
  name: string;
  address: PracticeAddress;
  phone: string;
  email: string;
  website: string;
  level: string;
  status: boolean;
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
  };
  phone: string;
  email: string;
  website: string;
  partnershipLevel: string;
  status: boolean;
  totalReferrals: number;
  monthlyReferrals: number;
  noteCount: number;
  taskCount: number;
  lastContact: string | null;
  staff: any[];
  additionalNotes: any;
  pendingTaskCount?: number;
}

export interface FetchPartnersResponse {
  data: Partner[];
  page: number;
  limit: number;
  totalPages: number;
  totalPractices: number;
  activePractices: number;
  totalReferrals: number;
  monthlyReferrals: number;
  totalALevelPractices: number;
  aLevelPercentage: number;
}

export interface FetchPartnersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  filter?: string;
}

export interface NoteApiData {
  _id: string;
  description: string;
  practice: string; // partnerId
  category: string;
  createdBy: string; // userId
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface FetchTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
}

export interface TaskApiData {
  _id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  priority: "low" | "medium" | "high" | string;
  category: "follow-up" | "meeting" | "other" | string;
  practiceId?: any;
  status: "pending" | "completed" | string;
  createdAt?: string;
  updatedAt?: string;
  isOverDue?: boolean;
  schedule?: string;
  assignTo?: any;
}

export interface AllNotesTasksResponse {
  totalNotes: number;
  totalTasks: number;
  notes: NoteApiData[];
  tasks: TaskApiData[];
}

// --- Payloads for Creation/Update ---

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
}

export interface UpdateTaskStatusPayload {
  status: "not-started" | "in-progress" | "completed" | "no-longer-needed";
}

export interface UpdateTaskPayload {
  taskId: string;
  data: any;
}

export interface Note {
  _id: string;
  description: string;
  category: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  type: "follow-up" | "meeting" | "other";
  dueDate: string; // ISO date string
  user: string;
  status: string;
}

export interface ScheduleEventPayload {
  taskId: string;
  title: string;
  description: string;
  date: string; // ISO date string (e.g., "2025-10-25T00:00:00.000Z")
  time: string; // Time string (e.g., "14:00")
  duration: string; // Duration string (e.g., "60" or "1hr")
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
  id: string; // Practice ID
  name: string;
  address: PracticeAddress;
  isFirstStop: boolean;
  arrivalTime: string; // e.g., "12:50 PM"
  departureTime: string; // e.g., "01:20 PM"
  travelTime: string; // e.g., "0m" or "21h 3m"
  travelDistance: string; // e.g., "0.0mi" or "1370.9mi"
}

// --- Shared Interfaces (Reused from POST) ---
export interface VisitPurpose {
  title: string;
  duration: string;
}

export interface RouteDataPayload {
  date: string; // e.g., "2025-11-06"
  startTime: string; // e.g., "12:50"
  durationPerVisit: string; // e.g., "30 minutes"
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
  durationPerVisit: string; // NOTE: This is likely redundant now that it's in RouteDataPayload
  defaultVisitPurpose: VisitPurpose;
  description: string;
}

export interface PlanDetailsPayload {
  name: string; // e.g., "November Monthly Visit"
  priority: string; // e.g., "High Priority"
  visitPurpose: VisitPurpose;
  description: string;
}

export interface SaveSchedulePlanPayload {
  practices: string[];
  route: RouteDataPayload;
  planDetails: PlanDetailsPayload;
}

// --- 1. Shared Base Interfaces ---

export interface ScheduledVisitBase {
  scheduleVisitDate: string; // e.g., "2025-10-29T09:00:00Z"
  startTime: string; // e.g., "9:00 AM"
  visitPurpose: string;
  priority: string;
  notes: string;
}

// --- 2. Request Interfaces (POST & PUT) ---

/**
 * Interface for the COMPLETE POST Request Payload (POST /schedule-visit)
 */
export interface SchedulePlanRequest {
  practices: string[]; // Array of practice/referrer IDs
  planDetails: PlanDetails;
  scheduleVisits: ScheduledVisitBase[];
  review: {
    visitDays: string[];
    totalTime: string;
    distance: string;
  };
}

/**
 * Interface for the COMPLETE PUT Request Payload (PUT /schedule-visit)
 */
export interface SchedulePlanPutRequest {
  id: string; // Plan ID for update
  data: any;
}

// --- 3. GET Response Interfaces ---

export interface PlanDetailsGet extends PlanDetails {
  month: string; // Added field for GET response
}

export interface ReviewSummaryGet {
  visitDays: string[];
  totalTime: string;
  distance: string;
  totalReferrers: number; // Added field for GET response
}

export interface ScheduledVisitGet extends ScheduledVisitBase {
  _id: string; // ID returned from the database
}

/**
 * Interface for the COMPLETE GET Response Payload (/schedule-visit/{id})
 */
export interface SchedulePlanGetResponse {
  planDetails: PlanDetailsGet;
  review: ReviewSummaryGet;
  _id: string; // Plan ID
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

// HEHEHHEHEHE
// --- 1. Query Parameters Type ---
export interface GetSchedulePlansQuery {
  page: number;
  limit: number;
  status?: "draft" | "active" | "completed" | "pending" | "cancel" | string;
  order?: "asc" | "desc" | string;
  sortBy?: "name" | "createdAt" | string;
}

// --- 2. Plan Sub-Types ---

interface PlanSummary {
  totalPractices: number;
  visitDays: number;
  estimatedTime: string;
  estimatedDistance: string;
}

// --- 3. Full Schedule Plan Data Type ---
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

// --- 5. Full API Response Type ---
export interface SchedulePlansResponse {
  success: boolean;
  message: string;
  data: SchedulePlan[];
  dashboardStats: SchedulePlanDashboardStats;
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
  status: "pending" | "completed" | "cancelled"; // Assuming statuses based on context
  createdAt: string;
  updatedAt: string;
}

// --- 5. Monthly Grouping Type ---
interface MonthlyVisitGroup {
  month: string; // e.g., "November 2025"
  totalPlansThisMonth: number;
  visits: VisitHistoryItem[];
}

// --- 6. Response Metadata Types ---
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

// --- 7. Final API Response Type ---
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
