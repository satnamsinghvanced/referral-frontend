import { Button, Chip } from "@heroui/react";
import { FiEdit, FiEdit2, FiTrash2 } from "react-icons/fi";
import { WebhookConfig } from "./modal/AddWebhookModal";
import { LuTrash2 } from "react-icons/lu";

interface WebhooksListProps {
  webhooks: WebhookConfig[];
  onEdit: (webhook: WebhookConfig) => void;
  onDelete: (webhookId: string) => void;
}

export default function WebhooksList({
  webhooks,
  onEdit,
  onDelete,
}: WebhooksListProps) {
  if (webhooks.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
        <p className="text-sm text-gray-500">No webhooks configured yet</p>
        <p className="text-xs text-gray-400 mt-1">
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
                <span className="font-medium text-xs">{webhook.name}</span>
                <Chip
                  size="sm"
                  color={webhook.isActive ? "primary" : "default"}
                  className={`text-[11px] h-5 capitalize ${
                    webhook.isActive ? "" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {webhook.isActive ? "active" : "inactive"}
                </Chip>
              </div>
              {webhook.url && (
                <p className="text-xs text-gray-600 font-mono break-all">
                  {webhook.url}
                </p>
              )}
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
                onPress={() => onDelete(webhook.id!)}
              >
                <LuTrash2 className="size-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {webhook.events.map((event) => (
              <Chip
                key={event}
                size="sm"
                variant="bordered"
                className="border-small text-[11px]"
              >
                {webhook.source}.{event}
              </Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
