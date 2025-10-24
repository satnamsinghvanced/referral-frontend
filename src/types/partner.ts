export interface Partner {
  _id: string;
  name: string;
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
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
  practicePhone: string;
  practiceEmail: string;
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
