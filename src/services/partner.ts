import {
  AllNotesTasksResponse,
  CreateNotePayload,
  CreateTaskPayload,
  EventDetails,
  FetchPartnersParams,
  FetchPartnersResponse,
  GetSchedulePlansQuery,
  NoteApiData,
  PartnerPractice,
  PlanDetailsPayload,
  SaveSchedulePlanPayload,
  ScheduleEventPayload,
  SchedulePlanGetResponse,
  SchedulePlanPutRequest,
  SchedulePlanRequest,
  SchedulePlansResponse,
  TaskApiData,
  UpdateTaskStatusPayload,
} from "../types/partner";
import axios from "./axios";

export const fetchPartners = async (
  params: FetchPartnersParams = {}
): Promise<FetchPartnersResponse> => {
  const response = await axios.get<FetchPartnersResponse>("/partner-network", {
    params: {
      page: params.page,
      limit: params.limit,
      sortBy: params.sortBy,
      order: params.order,
      filter: params.filter,
    },
  });
  return response.data;
};

export const fetchPartnerDetail = async (
  id: string
): Promise<PartnerPractice> => {
  const response = await axios.get<PartnerPractice>(`/partner-network/${id}`);
  return response.data;
};

// --- Queries ---

export const getAllNotesAndTasks = async (
  partnerId: string
): Promise<AllNotesTasksResponse> => {
  const response = await axios.get<AllNotesTasksResponse>(
    `/partner-network/all/${partnerId}`
  );
  return response.data;
};

// --- Note Mutations ---

export const createNote = async (
  payload: CreateNotePayload
): Promise<NoteApiData> => {
  const response = await axios.post<NoteApiData>("/notes", payload);
  return response.data;
};

export const deleteNote = async (noteId: string): Promise<void> => {
  await axios.delete(`/notes/${noteId}`);
};

// --- Task Mutations ---

export const createTask = async (
  payload: CreateTaskPayload
): Promise<TaskApiData> => {
  const response = await axios.post<TaskApiData>("/tasks", payload);
  return response.data;
};

export const updateTaskStatus = async (
  taskId: string,
  payload: UpdateTaskStatusPayload
): Promise<TaskApiData> => {
  const response = await axios.patch<TaskApiData>(`/tasks/${taskId}`, payload);
  return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await axios.delete(`/tasks/${taskId}`);
};

export const scheduleTaskEvent = async (
  payload: ScheduleEventPayload
): Promise<EventDetails> => {
  const response = await axios.post("/tasks/schedule", payload);
  return response.data;
};

export const getSchedulePlans = async (
  query: GetSchedulePlansQuery
): Promise<SchedulePlansResponse> => {
  const params = new URLSearchParams(
    query as Record<string, string>
  ).toString();

  const url = `/schedule-visit${params ? `?${params}` : ""}`;

  const response = await axios.get<SchedulePlansResponse>(url);
  return response.data;
};

export const createSchedulePlan = async ({
  id,
  data,
}: {
  id: string;
  data: SaveSchedulePlanPayload;
}) => {
  const response = await axios.post(`/schedule-visit/${id}`, data);
  return response.data;
};

export const updateSchedulePlan = async (
  data: SchedulePlanPutRequest
): Promise<void> => {
  // The PUT request uses the base URL and passes the plan ID within the body
  await axios.put("/schedule-visit", data);
};

export const copySchedulePlan = async (id: string): Promise<void> => {
  await axios.post(`/schedule-visit/copy/${id}`);
};


export const deleteSchedulePlan = async (id: string): Promise<void> => {
  await axios.delete(`/schedule-visit/${id}`);
};
