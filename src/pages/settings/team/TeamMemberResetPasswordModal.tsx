import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaKey, FaPaperPlane } from "react-icons/fa";
import { useForgotPassword, useUpdateTeamMemberPassword } from "../../../hooks/useAuth";
import { TeamMember } from "../../../services/settings/team";

interface TeamMemberResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
}

export default function TeamMemberResetPasswordModal({
  isOpen,
  onClose,
  member,
}: TeamMemberResetPasswordModalProps) {
  const [mode, setMode] = useState<"send_email" | "set_direct">("send_email");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const forgotPasswordMutation = useForgotPassword();
  const updatePasswordMutation = useUpdateTeamMemberPassword();

  if (!member) return null;

  const handleSendResetEmail = () => {
    forgotPasswordMutation.mutate(member.email, {
      onSuccess: () => {
        addToast({
          title: "Reset Email Sent",
          description: `Password reset link sent to ${member.email}`,
          color: "success",
        });
        onClose();
      },
      onError: (err: any) => {
        addToast({
          title: "Error",
          description:
            err.response?.data?.message || "Failed to send reset email.",
          color: "danger",
        });
      },
    });
  };

  const handleSetDirectPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      addToast({
        title: "Validation Error",
        description: "Password must be at least 6 characters.",
        color: "danger",
      });
      return;
    }
    updatePasswordMutation.mutate(
      { userId: member._id, password: newPassword },
      {
        onSuccess: () => {
          setNewPassword("");
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <FaKey className="text-primary size-4" />
          <span>Reset Password - {member.firstName} {member.lastName}</span>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="text-xs text-foreground/70 leading-relaxed bg-foreground/5 p-3 rounded-lg">
            <p className="font-semibold text-foreground">Member: {member.email}</p>
            <p className="mt-0.5">
              Choose whether to send reset instructions to the team member's email or update their password directly.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("send_email")}
              className={`flex-1 p-3 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                mode === "send_email"
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-foreground/10 text-foreground/70 hover:bg-foreground/5"
              }`}
            >
              <FaPaperPlane className="size-4" />
              <span>Send Reset Link</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("set_direct")}
              className={`flex-1 p-3 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                mode === "set_direct"
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-foreground/10 text-foreground/70 hover:bg-foreground/5"
              }`}
            >
              <FaKey className="size-4" />
              <span>Set Password Now</span>
            </button>
          </div>

          {mode === "send_email" && (
            <div className="space-y-2 text-xs text-foreground/80 py-1">
              <p>
                An email containing a direct password reset link will be sent to <strong>{member.email}</strong>.
              </p>
              <p className="text-[11px] text-foreground/50">
                The team member can click the link in their email to open the password reset page and set their new password.
              </p>
            </div>
          )}

          {mode === "set_direct" && (
            <form onSubmit={handleSetDirectPassword} className="space-y-3 pt-1">
              <Input
                label="New Password"
                placeholder="Enter new password for team member"
                type={showPassword ? "text" : "password"}
                radius="sm"
                variant="flat"
                value={newPassword}
                onValueChange={setNewPassword}
                isRequired
                endContent={
                  <button
                    className="focus:outline-none cursor-pointer"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-sm text-default-400" />
                    ) : (
                      <FaEye className="text-sm text-default-400" />
                    )}
                  </button>
                }
              />
            </form>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" size="sm" onClick={onClose}>
            Cancel
          </Button>
          {mode === "send_email" ? (
            <Button
              color="primary"
              size="sm"
              isLoading={forgotPasswordMutation.isPending}
              spinner={<Spinner color="white" size="sm" />}
              onClick={handleSendResetEmail}
            >
              Send Email
            </Button>
          ) : (
            <Button
              color="primary"
              size="sm"
              isLoading={updatePasswordMutation.isPending}
              spinner={<Spinner color="white" size="sm" />}
              onClick={handleSetDirectPassword}
            >
              Update Password
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
