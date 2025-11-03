export interface Partner {
  _id: string;
  name: string;
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    coordinates: {
      lat: number;
      long: number;
    };
  };
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
  notes: any;
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

export interface TaskApiData {
  _id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  practiceId: string;
  priority: "low" | "medium" | "high" | string;
  category: "follow-up" | "meeting" | "other" | string;
  assigned_to: string; // userId
  status: "pending" | "completed" | string;
  createdAt: string;
  updatedAt: string;
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
  assigned_to?: string;
}

export interface UpdateTaskStatusPayload {
  status: "not-started" | "in-progress" | "completed" | "no-longer-needed";
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

// --- Shared Interfaces (Reused from POST) ---
export interface PlanDetails {
  planName: string;
  defaultPriority: string; // e.g., "Medium Priority"
  durationPerVisit: string; // e.g., "1 hour"
  defaultVisitPurpose: DefaultVisitPurpose;
  description: string;
}

// --- 1. Shared Base Interfaces ---

export interface DefaultVisitPurpose {
  title: string;
  duration: string;
}

export interface ScheduledVisitBase {
  scheduleVisitDate: string; // e.g., "2025-10-29T09:00:00Z"
  startTime: string; // e.g., "9:00 AM"
  visitPurpose: string;
  priority: string;
  notes: string;
}

/**
 * Interface for the core Plan Details section.
 * Used in POST request body.
 */
export interface PlanDetails {
  planName: string;
  defaultPriority: string;
  durationPerVisit: string;
  defaultVisitPurpose: DefaultVisitPurpose;
  description: string;
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
  scheduleReferrerVisitId: string; // Plan ID for update
  practices: string[];
  // PlanDetails without 'month' for PUT request
  planDetails: PlanDetails;
  scheduleVisits: ScheduledVisitBase[];
  review: {
    visitDays: string[];
    totalReferrers: number;
    totalTime: string;
    distance: string;
  };
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

// Define common types based on mock data
export interface Referrer {
  id: string;
  practiceId: string;
  name: string;
  address: string;
  score: string;
  category: string;
  phone: string;
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

export interface PlanDetailsOption {
  title: string;
  duration: string;
}

// Interfaces for component props
export interface SelectReferrersTabProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedReferrersState: string[];
  handleReferrerToggle: (id: string) => void;
  handleSelectAll: () => void;
  handleClearAll: () => void;
  showRoutePreview: boolean;
  setShowRoutePreview: React.Dispatch<React.SetStateAction<boolean>>;
  practices: Partner[];
  categoryOptions: CategoryOption[];
  mockOptimizedRouteData: OptimizedRouteStop[];
  data: MockInitialData;
}

export interface PlanDetailsTabProps {
  formik: any; // Using 'any' for Formik object due to its complexity
  data: MockInitialData;
  selectedReferrerObjects: Partner[];
  purposeOptions: PlanDetailsOption[];
  durationOptions: string[];
}

export interface ScheduleVisitsTabProps {
  formik: any; // Using 'any' for Formik object
  data: MockInitialData;
  selectedReferrerObjects: any;
}

export interface ReviewSaveTabProps {
  formik: any; // Using 'any' for Formik object
  data: MockInitialData;
  selectedReferrerObjects: Partner[];
}


export interface RoutePlanningTabProps {
  formik: any;
  selectedReferrerObjects: Partner[];
  durationOptions: string[];
  onGenerateRoute: () => void;
  routeOptimizationResults: any;
  setRouteOptimizationResults: any;
}

export interface RouteMetrics {
  routeDetails: any[];
  totalStops: number;
  estimatedTotalTime: string;
  estimatedDistance: string;
  mileageCost: string;
  travelTime: string;
  travelDistance: string;
}

export interface RouteOptimizationResults {
  original: RouteMetrics;
  optimized: RouteMetrics;
  bestRoute: RouteMetrics;
}