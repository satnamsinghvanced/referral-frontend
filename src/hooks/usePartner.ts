import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { queryClient } from "../providers/QueryProvider";
import {
  copySchedulePlan,
  createNote,
  createSchedulePlan,
  createTask,
  deleteNote,
  deleteSchedulePlan,
  deleteTask,
  fetchAllTasks,
  fetchPartnerDetail,
  fetchPartners,
  fetchVisitHistory,
  getAllNotesAndTasks,
  getSchedulePlans,
  getScheduleTaskEvent,
  scheduleTaskEvent,
  updateSchedulePlan,
  updateTask,
  updateTaskStatus,
} from "../services/partner";
import {
  AllNotesTasksResponse,
  CreateNotePayload,
  CreateTaskPayload,
  FetchPartnersParams,
  FetchPartnersResponse,
  FetchTasksParams,
  GetSchedulePlansQuery,
  NoteApiData,
  PartnerPractice,
  SchedulePlanPutRequest,
  SchedulePlansResponse,
  TaskApiData,
  UpdateTaskPayload,
  VisitHistoryResponse,
} from "../types/partner";

export const useFetchPartners = (params: FetchPartnersParams = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "name",
    order = "asc",
    filter = "allPractices",
  } = params;

  return useQuery<FetchPartnersResponse, Error>({
    queryKey: ["partnerStats", page, limit, sortBy, order, filter],
    queryFn: () => fetchPartners({ page, limit, sortBy, order, filter }),
  });
};

export const useFetchPartnerDetail = (id: string) =>
  useQuery<PartnerPractice, Error>({
    queryKey: ["partnerStats", id],
    queryFn: () => fetchPartnerDetail(id),
    enabled: !!id,
  });

export const notesTasksKeys = {
  all: ["notes-tasks"] as const,
  detail: (partnerId: string) =>
    [...notesTasksKeys.all, "detail", partnerId] as const,
};

export const useGetAllNotesAndTasks = (partnerId: string) => {
  return useQuery<AllNotesTasksResponse, Error>({
    queryKey: notesTasksKeys.detail(partnerId),
    queryFn: () => getAllNotesAndTasks(partnerId),
    enabled: !!partnerId,
  });
};

export const useCreateNote = () => {
  return useMutation<NoteApiData, any, CreateNotePayload>({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      addToast({
        title: "Success",
        description: "Note created successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["partnerStats"] });
      queryClient.invalidateQueries({
        queryKey: notesTasksKeys.detail(newNote.practice),
      });
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to create note";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
};

export const useDeleteNote = () => {
  return useMutation<void, any, { noteId: string; partnerId: string }>({
    mutationFn: ({ noteId }) => deleteNote(noteId),
    onSuccess: (_, variables) => {
      addToast({
        title: "Success",
        description: "Note deleted successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["partnerStats"] });
      queryClient.invalidateQueries({
        queryKey: notesTasksKeys.detail(variables.partnerId),
      });
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to delete note";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
};

export const useFetchAllTasks = (params: FetchTasksParams = {}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    priority = "all",
  } = params;

  return useQuery<any, Error>({
    queryKey: ["tasks", page, limit, search, status, priority],
    queryFn: () => fetchAllTasks({ page, limit, search, status, priority }),
  });
};

export const useCreateTask = () => {
  return useMutation<TaskApiData, any, CreateTaskPayload>({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      addToast({
        title: "Success",
        description: "Task created successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["partnerStats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({
        queryKey: notesTasksKeys.detail(newTask.practiceId),
      });
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to create task";
      addToast({
        title: "Create Failed",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useUpdateTaskStatus = () => {
  return useMutation<
    TaskApiData,
    Error,
    {
      taskId: string;
      partnerId: string;
      status: "not-started" | "in-progress" | "completed" | "no-longer-needed";
    }
  >({
    mutationFn: ({ taskId, status }) => updateTaskStatus(taskId, { status }),
    onSuccess: (updatedTask) => {
      addToast({
        title: "Success",
        description: "Task status updated successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: notesTasksKeys.detail(updatedTask.practiceId),
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onMutate: async ({ partnerId, taskId, status }) => {
      await queryClient.cancelQueries({
        queryKey: notesTasksKeys.detail(partnerId),
      });
      const previousData = queryClient.getQueryData<AllNotesTasksResponse>(
        notesTasksKeys.detail(partnerId)
      );
      if (previousData) {
        queryClient.setQueryData(notesTasksKeys.detail(partnerId), {
          ...previousData,
          tasks: previousData.tasks.map((task) =>
            task._id === taskId ? { ...task, status } : task
          ),
        });
      }
      return { previousData };
    },
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: (variables: UpdateTaskPayload) => updateTask(variables),
    onSuccess: (_, variables) => {
      addToast({
        title: "Success",
        description: "Task updated successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: notesTasksKeys.detail(variables.data.practiceId),
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to update task";
      addToast({
        title: "Update Failed",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export const useDeleteTask = () => {
  return useMutation<void, any, { taskId: string; partnerId: string }>({
    mutationFn: ({ taskId }) => deleteTask(taskId),
    onSuccess: (_, variables) => {
      addToast({
        title: "Success",
        description: "Task deleted successfully.",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["partnerStats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({
        queryKey: notesTasksKeys.detail(variables.partnerId),
      });
    },
    onError: (error) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to delete task";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
};

export const useScheduleTaskEvent = () => {
  return useMutation({
    mutationFn: scheduleTaskEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notesAndTasks"] });
      addToast({
        title: "Success",
        description: "Task event scheduled successfully.",
        color: "success",
      });
    },
    onError: (error: AxiosError, variables) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to schedule task event";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
};

export const useGetScheduleTaskEvent = (taskId: string) =>
  useQuery({
    queryKey: ["partnerStats", taskId],
    queryFn: () => getScheduleTaskEvent(taskId),
    enabled: !!taskId,
  });

const SCHEDULE_PLAN_KEY = "schedulePlans";

export function useGetSchedulePlans(query: GetSchedulePlansQuery) {
  return useQuery<SchedulePlansResponse, Error>({
    queryKey: [SCHEDULE_PLAN_KEY, query],
    queryFn: () => getSchedulePlans(query),
  });
}

export function useCreateSchedulePlan() {
  return useMutation({
    mutationFn: createSchedulePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULE_PLAN_KEY] });
      addToast({
        title: "Success",
        description: "Plan created successfully.",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to create schedule plan";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
}

export const useUpdateSchedulePlan = () => {
  return useMutation({
    mutationFn: (variables: SchedulePlanPutRequest) =>
      updateSchedulePlan(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULE_PLAN_KEY] });
      queryClient.invalidateQueries({ queryKey: ["visitHistory"] });
      addToast({
        title: "Success",
        description: "Plan updated successfully.",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage = error.message || "Failed to update schedule plan";
      addToast({
        title: "Update Failed",
        description: errorMessage,
        color: "danger",
      });
    },
  });
};

export function useCopySchedulePlan() {
  return useMutation({
    mutationFn: copySchedulePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULE_PLAN_KEY] });
      addToast({
        title: "Success",
        description: "Plan duplicated successfully.",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to duplicate plan";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
}

export function useDeleteSchedulePlan() {
  return useMutation({
    mutationFn: deleteSchedulePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULE_PLAN_KEY] });
      addToast({
        title: "Success",
        description: "Plan deleted successfully.",
        color: "success",
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to delete plan";
      addToast({ title: "Error", description: errorMessage, color: "danger" });
    },
  });
}

interface UseVisitHistoryParams {
  filter: "all" | "draft" | "completed" | "pending" | "cancel";
  search: string;
}

export const VISIT_HISTORY_QUERY_KEY = "visitHistory";

export const useVisitHistory = (params: UseVisitHistoryParams) => {
  return useQuery<VisitHistoryResponse, Error>({
    queryKey: [VISIT_HISTORY_QUERY_KEY, params],
    queryFn: () => fetchVisitHistory(params),
  });
};
