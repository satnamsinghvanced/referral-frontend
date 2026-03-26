import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateTask } from "../../../hooks/usePartner";
import { TaskApiData, TaskComment } from "../../../types/partner";
import { LuMessageSquare, LuSend } from "react-icons/lu";
import { formatDateToReadable } from "../../../utils/formatDateToReadable";

interface EditTaskNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskApiData;
  refetch?: any;
}

const validationSchema = Yup.object({
  comment: Yup.string().required("Comment content is required"),
});

const EditTaskNotesModal = ({
  isOpen,
  onClose,
  task,
  refetch,
}: EditTaskNotesModalProps) => {
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const newComment: TaskComment = {
        _id: Date.now().toString(), // Temporary ID if backend doesn't provide
        content: values.comment,
        createdAt: new Date().toISOString(),
        createdBy: "Current User", // In a real app, this would be the current user's object
      };

      const updatedComments = [...(task.comments || []), newComment];

      updateTask(
        {
          taskId: task._id,
          data: {
            ...task,
            comments: updatedComments.map((c: any) => ({ content: c.content })),
            practiceId: task.practiceId?._id,
          },
        },
        {
          onSuccess: () => {
            if (refetch) refetch();
            formik.resetForm();
            setTimeout(() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
              }
            }, 100);
          },
        },
      );
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      formik.handleSubmit();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, 100);
    } else {
      formik.resetForm();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      placement="center"
      size="md"
      classNames={{
        base: "max-sm:!m-3 !m-0",
        closeButton: "cursor-pointer",
      }}
    >
      <ModalContent className="p-4 flex flex-col gap-0 !my-2 max-h-[90vh]">
        <ModalHeader className="flex flex-col gap-1 p-0 pb-3 border-b border-foreground/5">
          <div className="flex items-center gap-2">
            <LuMessageSquare className="size-5 text-sky-500" />
            <h4 className="text-base font-semibold">Task Notes & Comments</h4>
          </div>
          <div className="text-xs text-gray-500 dark:text-foreground/60 font-normal">
            Add notes and comments to track progress and updates for:
            <p className="font-semibold text-gray-700 dark:text-foreground/80 mt-0.5">
              {task?.title}
            </p>
          </div>
        </ModalHeader>

        <ModalBody className="p-0 flex flex-col pt-3">
          {/* Comments List */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto min-h-[250px] max-h-[400px] space-y-4 pr-1 mb-4 scrollbar-hide"
          >
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment: TaskComment, index: number) => (
                <div key={comment._id || index} className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-default-100/30 rounded-xl border border-foreground/5">
                  <div className="flex items-center gap-2">
                    <Avatar
                      size="sm"
                      name={typeof comment.createdBy === 'string' ? comment.createdBy : "User"}
                      className="size-7 text-[10px] bg-sky-100 text-sky-600"
                    />
                    <div className="flex flex-col -space-y-0.5">
                      <p className="text-xs font-semibold text-gray-900 dark:text-foreground">
                        {typeof comment.createdBy === 'string' ? comment.createdBy : "Current User"}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-foreground/40">
                        {comment.createdAt ? formatDateToReadable(comment.createdAt, true) : "Just now"}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-foreground/80 pl-9 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-foreground/30 py-10 opacity-60">
                <LuMessageSquare className="size-10 mb-2" />
                <p className="text-xs">No comments yet. Start the conversation!</p>
              </div>
            )}
          </div>

          {/* Add a Comment Section */}
          <div className="pt-4 border-t border-foreground/5 space-y-3">
            <h5 className="text-xs font-semibold text-gray-900 dark:text-foreground">Add a Comment</h5>
            <form onSubmit={formik.handleSubmit} className="space-y-3">
              <Textarea
                size="sm"
                radius="sm"
                name="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your note or comment here..."
                classNames={{
                  inputWrapper: "bg-gray-50/50 dark:bg-default-100/20 py-2 min-h-[80px]",
                  input: "text-xs placeholder:text-gray-400"
                }}
              />
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-500 dark:text-foreground/40 italic">
                  Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-default-100 rounded border border-gray-200 dark:border-foreground/10 text-[9px]">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-default-100 rounded border border-gray-200 dark:border-foreground/10 text-[9px]">Enter</kbd> to submit
                </p>
                <Button
                  size="sm"
                  radius="sm"
                  variant="solid"
                  color="primary"
                  type="submit"
                  isDisabled={isUpdating || !formik.values.comment.trim()}
                  isLoading={isUpdating}
                  endContent={<LuSend className="size-3.5" />}
                  className="bg-sky-400 hover:bg-sky-500 text-white shadow-sm font-medium px-4"
                >
                  Add Comment
                </Button>
              </div>
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskNotesModal;
