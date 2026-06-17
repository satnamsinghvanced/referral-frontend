import { Button } from "@heroui/react";
import { FiCopy, FiCheck, FiDownload, FiMail, FiCode, FiFileText } from "react-icons/fi";
import { FaWordpress, FaShopify, FaWix } from "react-icons/fa";
import { LuGlobe } from "react-icons/lu";

const PLATFORMS = [
  { id: "WordPress", name: "WordPress", icon: FaWordpress, color: "text-[#21759b]" },
  { id: "Shopify", name: "Shopify", icon: FaShopify, color: "text-[#96bf48]" },
  { id: "Wix", name: "Wix", icon: FaWix, color: "text-foreground" },
  { id: "Webflow", name: "Webflow", icon: LuGlobe, color: "text-[#4353ff]" },
  { id: "Squarespace", name: "Squarespace", icon: FiFileText, color: "text-foreground" },
  { id: "Custom HTML", name: "Custom HTML", icon: FiCode, color: "text-primary" }
];

interface DeployStepProps {
  selectedPlatform: string;
  setSelectedPlatform: (val: string) => void;
  embedCodeSnippet: string;
  copiedCode: boolean;
  copyToClipboard: () => void;
}

export default function DeployStep({
  selectedPlatform,
  setSelectedPlatform,
  embedCodeSnippet,
  copiedCode,
  copyToClipboard
}: DeployStepProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="border-b border-foreground/5 pb-2">
        <h3 className="text-base font-bold text-foreground font-sans">Deploy Your Chat Widget</h3>
        <p className="text-xs text-default-500 mt-1 font-sans">Copy the embed code and add it to any website.</p>
      </div>

      <div className="border border-success/20 bg-success-50/10 dark:bg-success-950/10 text-success rounded-lg p-3 text-xs flex items-center gap-2 font-sans font-medium">
        <FiCheck className="w-4 h-4 flex-shrink-0" />
        <span>Your widget is ready to deploy! Copy the code below and paste it before the closing &lt;/body&gt; tag on your website.</span>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-foreground/10 bg-[#0f172a] text-[#f8fafc] p-4 text-xs font-mono h-[500px] overflow-y-auto">
        <pre className="whitespace-pre-wrap">{embedCodeSnippet}</pre>
        <Button
          size="sm"
          onClick={copyToClipboard}
          className="absolute top-2.5 right-2.5 bg-background/25 hover:bg-background/45 text-white border border-white/20 h-8 min-w-[70px] rounded"
          startContent={copiedCode ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
        >
          {copiedCode ? "Copied" : "Copy"}
        </Button>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-default-600 block font-sans">Integration Platforms</label>
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatform === platform.id;
            return (
              <div
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`border rounded-lg h-32 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-center active:scale-95
                  ${isSelected
                    ? "border-primary bg-primary-50/5 dark:bg-primary-950/5 font-bold shadow-sm"
                    : "border-foreground/10 text-default-500 hover:bg-foreground/5"}`}
              >
                <Icon className={`w-10 h-10 ${platform.color}`} />
                <span className="text-[10px] truncate max-w-full font-semibold font-sans">{platform.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-foreground/5 bg-foreground/3 dark:bg-default-100/10 rounded-xl p-4">
        <h4 className="text-xs font-bold text-foreground mb-3 font-sans">Installation Instructions</h4>
        <div className="space-y-3">
          <div className="flex gap-2.5">
            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0 font-sans">1</div>
            <span className="text-xs text-default-700 font-sans font-medium">Copy the embed code snippet above (click the "Copy" button).</span>
          </div>
          <div className="flex gap-2.5">
            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0 font-sans">2</div>
            <span className="text-xs text-default-700 font-sans font-medium">Open your website's HTML editor or CMS administration dashboard.</span>
          </div>
          <div className="flex gap-2.5">
            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0 font-sans">3</div>
            <span className="text-xs text-default-700 font-sans font-medium">Paste the code directly before the closing &lt;/body&gt; tag on your target page or template.</span>
          </div>
          <div className="flex gap-2.5">
            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0 font-sans">4</div>
            <span className="text-xs text-default-700 font-sans font-medium">Save and publish changes. The chat widget will instantly go live on your pages.</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
        <Button
          variant="bordered"
          className="border-foreground/10 font-semibold flex-1 rounded-lg font-sans"
          startContent={<FiDownload className="w-4 h-4" />}
        >
          Download Documentation
        </Button>
        <Button
          variant="bordered"
          className="border-foreground/10 font-semibold flex-1 rounded-lg font-sans"
          startContent={<FiMail className="w-4 h-4" />}
        >
          Email Instructions
        </Button>
      </div>
    </div>
  );
}
