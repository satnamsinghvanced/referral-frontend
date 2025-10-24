// src/hooks/usePartnerStats.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/QueryProvider";
import {
  createNote,
  createTask,
  deleteNote,
  deleteTask,
  fetchPartnerDetail,
  fetchPartners,
  getAllNotesAndTasks,
  scheduleTaskEvent,
  updateTaskStatus,
} from "../services/partner";
import {
  AllNotesTasksResponse,
  CreateNotePayload,
  CreateTaskPayload,
  FetchPartnersParams,
  FetchPartnersResponse,
  NoteApiData,
  PartnerPractice,
  TaskApiData,
} from "../types/partner";

// ---------------------------
// 🔹 Partner Network Stats
// ---------------------------

export const useFetchPartners = (params: FetchPartnersParams = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "",
    order = "asc",
    filter = "",
  } = params;

  return useQuery<FetchPartnersResponse, Error>({
    queryKey: ["partnerStats", page, limit, sortBy, order, filter],
    queryFn: () => fetchPartners({ page, limit, sortBy, order, filter }),
  });
};

export const useFetchPartnerDetail = (id: string) =>
  useQuery<PartnerPractice, Error>({
    queryKey: ["partnerStat", id],
    queryFn: () => fetchPartnerDetail(id),
    enabled: !!id,
  });

// --- Query Keys ---
export const notesTasksKeys = {
  all: ["notes-tasks"] as const,
  detail: (partnerId: string) =>
    [...notesTasksKeys.all, "detail", partnerId] as const,
};

// --- Query Hook (GET) ---

export const useGetAllNotesAndTasks = (partnerId: string) => {
  return useQuery<AllNotesTasksResponse, Error>({
    queryKey: notesTasksKeys.detail(partnerId),
    queryFn: () => getAllNotesAndTasks(partnerId),
    enabled: !!partnerId,
  });
};

// --- Note Mutations (POST, DELETE) ---

export const useCreateNote = () => {
  return useMutation<NoteApiData, Error, CreateNotePayload>({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      // Invalidate the detail query for the relevant practice to refetch all notes/tasks
      queryClient.invalidateQueries({
        queryKey: ["partnerStats"],
      });
      queryClient.invalidateQueries({
        queryKey: notesTasksKeys.detail(newNote.practice),
      });
    },
  });
};

export const useDeleteNote = () => {
  return useMutation<void, Error, { noteId: string; partnerId: string }>({
    mutationFn: ({ noteId }) => deleteNote(noteId),
    onSuccess: (_, variables) => {
      // Invalidate the detail query for the relevant practice
      queryClient.invalidateQueries({
        queryKey: ["partnerStats"],
      });
      queryClient.invalidateQueries({
        queryKey: notesTasksKeys.detail(variables.partnerId),
      });
    },
  });
};

// --- Task Mutations (POST, PATCH, DELETE) ---

export const useCreateTask = () => {
  return useMutation<TaskApiData, Error, CreateTaskPayload>({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // Invalidate the detail query for the relevant practice
      queryClient.invalidateQueries({
        queryKey: ["partnerStats"],
      });
      queryClient.invalidateQueries({
        queryKey: notesTasksKeys.detail(newTask.practiceId),
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
      // Invalidate the detail query for the relevant practice
      queryClient.invalidateQueries({
        queryKey: notesTasksKeys.detail(updatedTask.practiceId),
      });
    },
    // Optional: Optimistic update for immediate feedback
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
            task._id === taskId ? { ...task, status: status } : task
          ),
        });
      }
      return { previousData };
    },
    // onError: (err, variables, context) => {
    //   if (context?.previousData) {
    //     queryClient.setQueryData(
    //       notesTasksKeys.detail(variables.partnerId),
    //       context.previousData
    //     );
    //   }
    // },
  });
};

export const useDeleteTask = () => {
  return useMutation<void, Error, { taskId: string; partnerId: string }>({
    mutationFn: ({ taskId }) => deleteTask(taskId),
    onSuccess: (_, variables) => {
      // Invalidate the detail query for the relevant practice
      queryClient.invalidateQueries({
        queryKey: ["partnerStats"],
      });
      queryClient.invalidateQueries({
        queryKey: notesTasksKeys.detail(variables.partnerId),
      });
    },
  });
};

export const useScheduleTaskEvent = () => {
  return useMutation({
    mutationFn: scheduleTaskEvent,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notesAndTasks"] });
    },

    onError: (error, variables) => {
      // Optionally, show an error toast/notification
      console.error(
        `Failed to schedule event for task ${variables.taskId}:`,
        error
      );
    },
  });
};
