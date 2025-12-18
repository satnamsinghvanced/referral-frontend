import { Button, Chip, Spinner } from "@heroui/react";
import { FiEdit } from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";
import { WebhookSubscription } from "../../../types/webhook"; // Confirmed type import

interface WebhooksListProps {
  webhooks: WebhookSubscription[];
  isLoading?: boolean;
  onEdit: (webhook: WebhookSubscription) => void;
  onDelete: (webhookId: string) => void;
}

export default function WebhooksList({
  webhooks,
  isLoading,
  onEdit,
  onDelete,
}: WebhooksListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="sm" />
      </div>
    );
  }

  if (webhooks.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
        <p className="text-sm">No webhooks configured yet</p>
        <p className="text-xs text-gray-500 mt-1">
          Click "Add Webhook" to create your first webhook
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {webhooks.map((webhook) => (
        <div
          key={webhook.id}
          className="p-3.5 border border-gray-200 rounded-lg hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between mb-2.5">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-xs">{webhook.type}</span>
                <Chip
                  size="sm"
                  color={webhook.status === "active" ? "primary" : "default"}
                  className={`text-[11px] h-5 capitalize ${
                    webhook.status === "active"
                      ? ""
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {webhook.status}
                </Chip>
              </div>
              {/* URL is now guaranteed to be present from the API model */}
              <p className="text-xs text-gray-600 font-mono break-all">
                {webhook.url}
              </p>
            </div>
            <div className="flex gap-1 ml-2">
              <Button
                size="sm"
                variant="light"
                isIconOnly
                className="min-w-0"
                onPress={() => onEdit(webhook)}
              >
                <FiEdit className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="light"
                isIconOnly
                className="min-w-0 text-danger"
                onPress={() => onDelete(webhook.id)}
              >
                <LuTrash2 className="size-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {webhook.action.map((action) => (
              <Chip
                key={action}
                size="sm"
                variant="bordered"
                className="border-small text-[11px]"
              >
                {webhook.type}.{action}
              </Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
