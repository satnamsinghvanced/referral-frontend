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
  platformId?: string;
  platformKey?: string;
  key?: string;
  name: string;
  selectorPlatform?: SocialPlatformType | string;
  onConfirm?: () => void;
};

const CONNECT_MESSAGES: Record<
  string,
  { title: string; body: string[] }
> = {
  google_business: {
    title: "Connect Google Business Profile",
    body: [
      "Sign in with the Google account that manages your business listing and practice location.",
      "After connecting, open Configure to select which business location to sync and manage reviews.",
    ],
  },
  google_calendar: {
    title: "Connect Google Calendar",
    body: [
      "Sign in with the Google account where you want to sync marketing events and referral appointments.",
      "After connecting, open Configure to select which calendar to sync.",
    ],
  },
  google_ads: {
    title: "Connect Google Ads",
    body: [
      "Sign in with the Google account that manages your Google Ads campaigns.",
      "After connecting, open Configure to select which ad account to sync for campaign tracking.",
    ],
  },
  meta_ads: {
    title: "Connect Meta Ads",
    body: [
      "Connect the Facebook account that manages your Meta Ad accounts and campaigns.",
      "After connecting, open Configure to select which ad account to sync.",
    ],
  },
  google_analytics: {
    title: "Connect Google Analytics",
    body: [
      "Sign in with the Google account that has access to your GA4 properties.",
      "After connecting, open Configure to select which GA4 property to sync for reporting.",
    ],
  },
  email_marketing: {
    title: "Connect Email Marketing Platform",
    body: [
      "Sign in with the Google / Gmail account you want to use for sending automated referral emails.",
      "After connecting, your email account will be ready to send referral notifications.",
    ],
  },
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
  youTube: {
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

  const key = pending.key || pending.selectorPlatform || pending.platformId || "";
  const config = CONNECT_MESSAGES[key];
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
              "After connecting, open Configure to select your account or location to sync.",
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
