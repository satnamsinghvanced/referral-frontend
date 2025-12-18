import { addToast, Button, Spinner } from "@heroui/react";
import { useState } from "react";
import { FiCheck, FiCopy, FiEye, FiEyeOff } from "react-icons/fi";
import { IntegrationKey } from "../../../types/webhook"; // Confirmed type import

interface APIKeysCardProps {
  integrationKey?: IntegrationKey;
  isLoading?: boolean;
  onGenerateNew: () => void;
  isGenerating?: boolean;
}

export default function APIKeysCard({
  integrationKey,
  isLoading,
  onGenerateNew,
  isGenerating,
}: APIKeysCardProps) {
  const [isSecretRevealed, setIsSecretRevealed] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
  };

  const handleCopy = async (key: string, keyType: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(keyType);
      addToast({
        title: "Copied!",
        description: `${keyType} copied to clipboard`,
        color: "success",
      });
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to copy to clipboard",
        color: "danger",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="sm" />
      </div>
    );
  }

  if (!integrationKey) {
    return (
      <div className="space-y-3">
        <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
          <p className="text-sm">No API keys generated yet</p>
          <p className="text-xs text-gray-500 mt-1">
            Click "Generate New Keys" to create your first API key
          </p>
        </div>
        <Button
          size="sm"
          radius="sm"
          variant="ghost"
          fullWidth
          className="border-small"
          onPress={onGenerateNew}
          isLoading={isGenerating || false}
        >
          Generate New Keys
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Public API Key */}
      <div className="p-4 bg-gray-50 rounded-lg flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span className="font-medium text-xs">Public API Key</span>
          <code className="text-xs text-gray-600 font-mono truncate">
            {maskKey(integrationKey.publicKey)}
          </code>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="bg-background border-small h-7 px-2 flex-shrink-0"
          onPress={() => handleCopy(integrationKey.publicKey, "Public Key")}
          startContent={
            copiedKey === "Public Key" ? (
              <FiCheck className="w-3 h-3" />
            ) : (
              <FiCopy className="w-3 h-3" />
            )
          }
        >
          {copiedKey === "Public Key" ? "Copied" : "Copy"}
        </Button>
      </div>

      {/* Secret Key */}
      <div className="p-4 bg-gray-50 rounded-lg flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span className="font-medium text-xs">Secret Key</span>
          <code className="text-xs text-gray-600 font-mono truncate">
            {isSecretRevealed
              ? integrationKey.secretKey
              : "••••••••••••••••••••••••"}
          </code>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="ghost"
            className="bg-background border-small h-7 px-2"
            onPress={() => setIsSecretRevealed(!isSecretRevealed)}
            startContent={
              isSecretRevealed ? (
                <FiEyeOff className="w-3 h-3" />
              ) : (
                <FiEye className="w-3 h-3" />
              )
            }
          >
            {isSecretRevealed ? "Hide" : "Reveal"}
          </Button>
          {isSecretRevealed && (
            <Button
              size="sm"
              variant="ghost"
              className="bg-background border-small h-7 px-2"
              onPress={() => handleCopy(integrationKey.secretKey, "Secret Key")}
              startContent={
                copiedKey === "Secret Key" ? (
                  <FiCheck className="w-3 h-3" />
                ) : (
                  <FiCopy className="w-3 h-3" />
                )
              }
            >
              {copiedKey === "Secret Key" ? "Copied" : "Copy"}
            </Button>
          )}
        </div>
      </div>

      {/* Generate New Keys Button */}
      <Button
        size="sm"
        radius="sm"
        variant="ghost"
        fullWidth
        className="border-small"
        onPress={onGenerateNew}
        isLoading={isGenerating || false}
      >
        Generate New Keys
      </Button>
    </div>
  );
}
