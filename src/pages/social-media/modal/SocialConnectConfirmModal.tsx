import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import type { SocialPlatformType } from "./SocialSubAccountSelectorModal";

export type PendingSocialConnect = {
  platformId: string;
  platformKey: string;
  name: string;
  selectorPlatform: SocialPlatformType;
};

const CONNECT_MESSAGES: Record<
  SocialPlatformType,
  { title: string; body: string[] }
> = {
  linkedin: {
    title: "Connect LinkedIn",
    body: [
      "To get proper details, followers, and engagement data, connect with a LinkedIn account that has access to your company page (if you use one).",
      "If you only use a personal profile, some analytics may not load correctly from LinkedIn.",
      "After connecting, open Configure to choose your personal profile or company page.",
    ],
  },
  meta: {
    title: "Connect Meta",
    body: [
      "Connect the Facebook account that manages your business page and linked Instagram account.",
      "After connecting, open Configure to select which Facebook page to sync.",
    ],
  },
  youtube: {
    title: "Connect YouTube",
    body: [
      "Sign in with the Google account that owns your YouTube channel.",
      "After connecting, open Configure to select which channel to use.",
    ],
  },
  tiktok: {
    title: "Connect TikTok",
    body: [
      "Connect your TikTok account to sync profile stats and publish videos.",
      "After connecting, open Configure to confirm your TikTok account.",
    ],
  },
};

export default function SocialConnectConfirmModal({
  pending,
  isOpen,
  onClose,
  onConfirm,
  isConnecting,
}: {
  pending: PendingSocialConnect | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isConnecting?: boolean;
}) {
  if (!pending) return null;

  const config = CONNECT_MESSAGES[pending.selectorPlatform];
  const title = config?.title ?? `Connect ${pending.name}`;

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">{title}</h2>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-3 text-sm text-default-600">
            {(config?.body ?? [
              `You will be redirected to sign in and authorize ${pending.name}.`,
            ]).map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </ModalBody>
        <ModalFooter className="gap-2">
          <Button variant="light" onPress={onClose} isDisabled={isConnecting}>
            Cancel
          </Button>
          <Button color="primary" onPress={onConfirm} isLoading={isConnecting ?? false}>
            Connect
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
