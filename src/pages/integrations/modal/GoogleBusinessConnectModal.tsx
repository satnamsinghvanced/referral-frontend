import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  addToast,
  useDisclosure,
} from "@heroui/react";
import { FiExternalLink, FiHelpCircle } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { useSaveWindsorBusiness } from "../../../hooks/integrations/useGoogleBusiness";

const WINDSOR_ONBOARD_URL = "https://onboard.windsor.ai/";

interface GoogleBusinessConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleBusinessConnectModal({
  isOpen,
  onClose,
}: GoogleBusinessConnectModalProps) {
  const [windsorApiKey, setWindsorApiKey] = useState("");
  const [windsorLocationId, setWindsorLocationId] = useState("");
  const saveWindsor = useSaveWindsorBusiness();

  // Instructions wale popup ko handle karne ke liye HeroUI hook
  const {
    isOpen: isGuideOpen,
    onOpen: onGuideOpen,
    onClose: onGuideClose
  } = useDisclosure();

  const handleClose = () => {
    setWindsorApiKey("");
    setWindsorLocationId("");
    onClose();
  };

  const handleSave = () => {
    if (!windsorApiKey.trim() || !windsorLocationId.trim()) {
      addToast({
        title: "Missing fields",
        description: "Enter both your Windsor API Key and Location ID.",
        color: "warning",
      });
      return;
    }

    saveWindsor.mutate(
      {
        windsorApiKey: windsorApiKey.trim(),
        windsorLocationId: windsorLocationId.trim(),
      },
      {
        onSuccess: (response: any) => {
          const warning =
            response?.warningMessage ||
            response?.data?.warningMessage;
          if (warning) {
            addToast({
              title: "Saved with notice",
              description: warning,
              color: "warning",
            });
          } else {
            addToast({
              title: "Connected",
              description: "Google Business Profile linked successfully.",
              color: "success",
            });
          }
          handleClose();
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message ||
            error.message ||
            "Check your Windsor API Key and Location ID, then try again.";
          addToast({
            title: "Could not save",
            description: message,
            color: "danger",
          });
        },
      }
    );
  };

  return (
    <>
      {/* MAIN CONNECT MODAL (Ab yeh ek dum chota aur clean dikhega) */}
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
        size="md"
        placement="center"
        classNames={{
          base: "bg-background border border-foreground/10 shadow-2xl rounded-2xl max-sm:m-3",
          closeButton: "hover:bg-foreground/10 active:bg-foreground/20 cursor-pointer",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg">
                <FaGoogle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-foreground">
                Connect Google My Business
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-foreground/50 font-normal">
              Enter your Windsor API Key and Location ID below to establish sync.
            </p>
          </ModalHeader>

          <ModalBody className="py-4 flex flex-col gap-4">
            {/* INSTRUCTIONS BUTTON (Sleek help button inside main view) */}
            <div className="flex justify-between items-center bg-default-100/70 dark:bg-default-100/10 p-3 rounded-xl border border-default-200">
              <div className="flex items-center gap-2">
                <FiHelpCircle className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Integration & Setup Guide?</span>
              </div>
              <Button
                size="sm"
                color="primary"
                variant="flat"
                className="text-xs font-semibold"
                onPress={onGuideOpen}
              >
                View Setup Guide
              </Button>
            </div>

            <Input
              label="Windsor API Key"
              description="Paste only the clean alphanumeric token from the api_key parameter."
              placeholder="e.g. 18602f78b068..."
              value={windsorApiKey}
              onValueChange={setWindsorApiKey}
              variant="bordered"
              type="password"
              isRequired
            />

            <Input
              label="Windsor Location ID"
              description="Make sure to include the 'locations/' prefix if shown in the table."
              placeholder="e.g. locations/4602596859365688552"
              value={windsorLocationId}
              onValueChange={setWindsorLocationId}
              variant="bordered"
              isRequired
            />
          </ModalBody>

          <ModalFooter className="pt-2 justify-end gap-2">
            <Button size="sm" variant="light" onPress={handleClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="solid"
              color="primary"
              isLoading={saveWindsor.isPending}
              onPress={handleSave}
            >
              Save Connection
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* SEPARATE GUIDE MODAL (Sirf guide dekhne ke liye popup) */}
      <Modal
        isOpen={isGuideOpen}
        onOpenChange={(open) => {
          if (!open) onGuideClose();
        }}
        size="lg"
        scrollBehavior="inside"
        placement="center"
        classNames={{
          base: "bg-background border border-foreground/10 shadow-2xl rounded-2xl max-sm:m-3 max-h-[85vh]",
          closeButton: "hover:bg-foreground/10 active:bg-foreground/20 cursor-pointer",
        }}
      >
        <ModalContent>
          <ModalHeader className="pb-2">
            <h4 className="font-bold text-base text-foreground">
              Windsor.ai Setup Instructions
            </h4>
          </ModalHeader>
          <ModalBody className="pb-6">
            <div className="text-xs text-gray-600 dark:text-foreground/70 flex flex-col gap-4">
              <Button
                as="a"
                href={WINDSOR_ONBOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                color="primary"
                variant="solid"
                className="w-full font-semibold shadow-md"
                startContent={<FiExternalLink className="w-3.5 h-3.5" />}
              >
                Open Windsor.ai Onboarding
              </Button>

              <ol className="list-decimal list-outside ml-4 space-y-3 leading-relaxed">
                <li>
                  <span className="font-semibold text-foreground">Login to Windsor:</span> Click the button above or go to{" "}
                  <a
                    href={WINDSOR_ONBOARD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline"
                  >
                    onboard.windsor.ai
                  </a>{" "}
                  and create/login to your account.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Select Data Source:</span> Inside Windsor under the <strong className="text-foreground">"1. Add Data"</strong> tab, find platform name and click on <strong className="text-primary">"Google My Business"</strong> (or Google Business Profile) from the list.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Grant Google Access:</span> Log in with your official Google Business account, grant the required permissions, and select the specific business profile you want to sync.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Go to Preview:</span> Once connected, click on the <strong className="text-foreground">"2. Preview and Destination"</strong> tab at the very top of the dashboard.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Select Destination:</span> Look at the bottom of the page under the <strong className="text-foreground">"Data Destinations"</strong> section. Find and select <strong className="text-primary">"Dev (1)"</strong> or <strong className="text-primary">"API"</strong> option.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Copy your API Key:</span> Look at the long URL input box at the top of the preview screen. Copy the alphanumeric code right after <code className="text-[11px] bg-default-200/80 dark:bg-default-100/20 px-1 rounded font-mono text-primary">api_key=</code>.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Enable Account ID Column:</span> On the right-side panel under the <strong className="text-foreground">"Fields"</strong> section, scroll down and <strong className="text-primary">check/tick the box next to "Account ID"</strong>.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Copy Location ID:</span> Look back at the main data table. A new column named <strong className="text-foreground">"Account ID"</strong> will appear. Copy the full value from that column (e.g., <code className="text-[11px] bg-default-200/80 dark:bg-default-100/20 px-1 rounded font-mono text-primary">locations/1234567890</code>).
                </li>
                <li>
                  <span className="font-semibold text-foreground">Paste & Save:</span> Close this guide, paste both values in the input fields of the previous modal, and click <strong className="text-foreground">"Save Connection"</strong>.
                </li>
              </ol>
            </div>
          </ModalBody>
          <ModalFooter className="pt-0">
            <Button size="sm" color="default" variant="flat" onPress={onGuideClose}>
              Got it, Close Guide
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}