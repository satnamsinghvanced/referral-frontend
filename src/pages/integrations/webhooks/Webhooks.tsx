import { Button, Card, CardBody, CardHeader, Chip, Input } from "@heroui/react";
import { useState } from "react";
import { LuCopy, LuKey, LuRefreshCw, LuInfo } from "react-icons/lu";
import {
  useWebhookConfig,
  useGenerateWebhookSecret,
} from "../../../hooks/useWebhook";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

function Webhooks() {
  const [isCopied, setIsCopied] = useState<"url" | "secret" | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: webhookConfig, isLoading } = useWebhookConfig();
  const { mutate: generateSecret, isPending } = useGenerateWebhookSecret();

  const handleCopy = (text: string, type: "url" | "secret") => {
    navigator.clipboard.writeText(text);
    setIsCopied(type);
    setTimeout(() => setIsCopied(null), 2000);
  };

  const handleGenerateSecret = () => {
    generateSecret();
  };

  const webhookUrl =
    webhookConfig?.webhookUrl ||
    `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "")}/webhook/referral/${user?.userId}`;
  const isConnected = webhookConfig?.status === "Connected";

  return (
    <div className="space-y-6">
      <Card className="shadow-none border border-foreground/10 rounded-xl">
        <CardHeader className="flex-col gap-1.5 items-start p-5 pb-3">
          <div className="flex items-center justify-between w-full">
            <div>
              <h4 className="font-medium text-sm">
                Referral Webhook Integration
              </h4>
              <p className="text-xs text-gray-600 dark:text-foreground/60 mt-1">
                Embed this webhook on your website to receive referrals directly
              </p>
            </div>
            <Chip
              size="sm"
              color={isConnected ? "success" : "default"}
              variant="flat"
              className="capitalize"
            >
              {isConnected ? "Connected" : "Disconnected"}
            </Chip>
          </div>
        </CardHeader>
        <CardBody className="space-y-5 p-5 pt-3">
          {/* Webhook URL */}
          <div className="space-y-2">
            <label className="text-xs font-medium block dark:text-foreground/60">
              Webhook URL
            </label>
            <div className="flex gap-2">
              <Input
                size="sm"
                radius="sm"
                value={webhookUrl}
                readOnly
                classNames={{
                  input: "text-xs font-mono",
                }}
              />
              <Button
                size="sm"
                radius="sm"
                className={`min-w-fit px-4 border font-medium ${
                  isCopied === "url"
                    ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                    : "bg-white dark:bg-content2 border-foreground/10 hover:bg-gray-50 dark:hover:bg-content3 text-gray-700 dark:text-foreground"
                }`}
                onPress={() => handleCopy(webhookUrl, "url")}
                startContent={<LuCopy className="size-3.5" />}
              >
                {isCopied === "url" ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-foreground/50">
              This is your unique webhook endpoint. Use this URL to submit
              referrals from your website.
            </p>
          </div>

          {/* Secret Key */}
          <div className="space-y-2">
            <label className="text-xs font-medium block dark:text-foreground/60">
              Webhook Secret Key
            </label>
            <div className="flex gap-2">
              <Input
                size="sm"
                radius="sm"
                type="password"
                value={webhookConfig?.secretKey || "••••••••••••••••••••"}
                readOnly
                classNames={{
                  input: "text-xs font-mono",
                }}
                startContent={<LuKey className="size-3.5 text-gray-400" />}
              />
              {webhookConfig?.secretKey && (
                <Button
                  size="sm"
                  radius="sm"
                  className={`min-w-fit px-4 border font-medium ${
                    isCopied === "secret"
                      ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                      : "bg-white dark:bg-content2 border-foreground/10 hover:bg-gray-50 dark:hover:bg-content3 text-gray-700 dark:text-foreground"
                  }`}
                  onPress={() => handleCopy(webhookConfig.secretKey!, "secret")}
                  startContent={<LuCopy className="size-3.5" />}
                >
                  {isCopied === "secret" ? "Copied" : "Copy"}
                </Button>
              )}
            </div>
            <div className="flex items-start gap-2 mt-2">
              <Button
                size="sm"
                radius="sm"
                color="primary"
                variant="flat"
                onPress={handleGenerateSecret}
                isLoading={isPending}
                isDisabled={isPending}
                startContent={
                  !isPending && <LuRefreshCw className="size-3.5" />
                }
              >
                {isConnected ? "Regenerate Secret" : "Generate Secret"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-foreground/50">
              Include this secret in the{" "}
              <code className="px-1 py-0.5 bg-gray-100 dark:bg-content2 rounded text-[11px]">
                x-referral-signature
              </code>{" "}
              header when making requests to authenticate.
            </p>
          </div>

          {/* Integration Instructions */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <LuInfo className="size-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  How to Embed This Form
                </h5>
                <div className="text-xs text-blue-800 dark:text-blue-200 space-y-2">
                  <p>
                    <strong>1. Copy the Embed Code:</strong> Use the iframe code
                    below to embed the referral form on your website.
                  </p>
                  <p>
                    <strong>2. Paste on Your Website:</strong> Add the iframe
                    code to any page where you want the referral form to appear.
                  </p>
                  <p>
                    <strong>3. Automatic Integration:</strong> The form
                    automatically uses your webhook URL and secret key - no
                    additional configuration needed!
                  </p>
                  <p>
                    <strong>4. Test the Form:</strong> Visit the{" "}
                    <a
                      href={`${import.meta.env.VITE_URL_PREFIX}/webhook/referral/${user?.userId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      live referral form
                    </a>{" "}
                    to see how it works.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Embed Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium block dark:text-foreground/60">
                Embed Code (Copy & Paste on Your Website)
              </label>
              <Button
                size="sm"
                radius="sm"
                variant="flat"
                className="h-7"
                onPress={() =>
                  handleCopy(
                    `<iframe src="${import.meta.env.VITE_URL_PREFIX}/webhook/referral/${user?.userId}" width="100%" height="900" frameborder="0" style="border: none; border-radius: 8px;"></iframe>`,
                    "url",
                  )
                }
                startContent={<LuCopy className="size-3" />}
              >
                {isCopied === "url" ? "Copied!" : "Copy Code"}
              </Button>
            </div>
            <div className="p-3 bg-gray-900 dark:bg-black rounded-lg overflow-x-auto">
              <pre className="text-xs text-gray-100 font-mono">
                <code>{`<iframe 
  src="${import.meta.env.VITE_URL_PREFIX}/webhook/referral/${user?.userId}" 
  width="100%" 
  height="900" 
  frameborder="0" 
  style="border: none; border-radius: 8px;">
</iframe>`}</code>
              </pre>
            </div>
            <p className="text-xs text-gray-500 dark:text-foreground/50">
              This iframe will display a fully functional referral form that
              submits directly to your webhook.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Webhooks;
