import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  addToast,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { BsLightningCharge } from "react-icons/bs";
import { FiCreditCard } from "react-icons/fi";

interface TwilioAddCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  currentMinutes: number;
  onAddCredits: (amount: number, minutes: number) => void;
}

export default function TwilioAddCreditsModal({
  isOpen,
  onClose,
  currentBalance,
  currentMinutes,
  onAddCredits,
}: TwilioAddCreditsModalProps) {
  const presets = [25, 50, 100, 200, 500, 1000];
  const [selectedPreset, setSelectedPreset] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState<string>("50");
  const [selectedPackage, setSelectedPackage] = useState<string>("500");

  useEffect(() => {
    if (isOpen) {
      setSelectedPreset(50);
      setCustomAmount("50");
      setSelectedPackage("500");
    }
  }, [isOpen]);

  const handlePresetClick = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
    const parsed = parseFloat(val);
    if (presets.includes(parsed)) {
      setSelectedPreset(parsed);
    } else {
      setSelectedPreset(null);
    }
  };

  const handleAdd = () => {
    const credits = parseFloat(customAmount);
    if (isNaN(credits) || credits < 10) {
      addToast({
        title: "Invalid Amount",
        description: "Please enter a credit amount of at least $10.",
        color: "danger",
      });
      return;
    }

    let addedMinutes = 0;
    if (selectedPackage === "500") addedMinutes = 500;
    else if (selectedPackage === "1000") addedMinutes = 1000;
    else if (selectedPackage === "2500") addedMinutes = 2500;

    onAddCredits(credits, addedMinutes);
    addToast({
      title: "Credits Added",
      description: `Successfully added $${credits.toFixed(2)} and ${addedMinutes} minutes.`,
      color: "success",
    });
    onClose();
  };

  const packageCost =
    selectedPackage === "500"
      ? 15
      : selectedPackage === "1000"
      ? 25
      : selectedPackage === "2500"
      ? 50
      : 0;

  const totalCost = (parseFloat(customAmount) || 0) + packageCost;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      classNames={{
        base: "max-sm:!m-3 !m-0 bg-background border border-foreground/10 text-foreground rounded-2xl",
        closeButton: "cursor-pointer text-foreground/50 hover:text-foreground",
      }}
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 p-5 pb-2">
          <h2 className="text-xl font-bold text-foreground">Add Credits & Minutes</h2>
          <p className="text-xs text-foreground-500 font-normal">
            Add credits to your Practice ROI account for phone services
          </p>
        </ModalHeader>

        <ModalBody className="p-5 pt-2 flex flex-col gap-4">
          {/* Balance / Minutes overview */}
          <div className="grid grid-cols-2 gap-4 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 rounded-xl p-4">
            <div>
              <p className="text-[10px] uppercase font-semibold text-foreground-500 tracking-wider">
                Current Balance
              </p>
              <p className="text-2xl font-bold text-primary">
                ${currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-foreground-500 tracking-wider">
                Available Minutes
              </p>
              <p className="text-2xl font-bold text-primary">
                {currentMinutes.toLocaleString("en-US")}
              </p>
            </div>
          </div>

          {/* Preset options */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-foreground">Select Credit Amount</label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((amount) => {
                const isSelected = selectedPreset === amount;
                return (
                  <Button
                    key={amount}
                    variant={isSelected ? "solid" : "bordered"}
                    color={isSelected ? "primary" : "default"}
                    onPress={() => handlePresetClick(amount)}
                    className={`h-11 font-bold rounded-lg border-small ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "border-foreground/10 bg-transparent text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    ${amount}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Custom amount */}
          <Input
            type="number"
            label="Custom Amount (Min: $10)"
            labelPlacement="outside"
            placeholder="Enter custom amount"
            value={customAmount}
            onValueChange={handleCustomAmountChange}
            min={10}
            startContent={<span className="text-xs text-foreground-500">$</span>}
            classNames={{
              label: "text-xs font-semibold text-foreground mb-1",
              inputWrapper: "border border-foreground/10 rounded-lg bg-transparent h-10",
              input: "text-sm",
            }}
          />

          {/* Optional minute package */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Add Minute Package (Optional)
            </label>
            <Select
              selectedKeys={[selectedPackage]}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string;
                setSelectedPackage(val);
              }}
              variant="bordered"
              aria-label="Select Minute Package"
              classNames={{
                trigger: "border border-foreground/10 rounded-lg bg-transparent h-10 min-h-10",
                value: "text-sm text-foreground",
              }}
            >
              <SelectItem key="none" textValue="None">
                None
              </SelectItem>
              <SelectItem key="500" textValue="500 minutes - $15/month">
                500 minutes - $15/month
              </SelectItem>
              <SelectItem key="1000" textValue="1000 minutes - $25/month">
                1000 minutes - $25/month
              </SelectItem>
              <SelectItem key="2500" textValue="2500 minutes - $50/month">
                2500 minutes - $50/month
              </SelectItem>
            </Select>
          </div>

          {/* Pricing Information box */}
          <div className="border border-warning-200 dark:border-warning-900/30 bg-warning-50/30 dark:bg-warning-950/10 rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-warning-600 dark:text-warning-500 font-semibold text-sm">
              <BsLightningCharge className="w-4 h-4" />
              <span>Pricing Information</span>
            </div>
            <ul className="text-xs text-foreground-600 dark:text-foreground-400 space-y-1.5 list-disc pl-4">
              <li>Phone Number Setup: $15 one-time</li>
              <li>Phone Number Monthly: $5/month per number</li>
              <li>Outbound Calls: $0.02/minute</li>
              <li>Inbound Calls: $0.01/minute</li>
              <li>SMS Messages: $0.01/message</li>
              <li>MMS Messages: $0.02/message</li>
            </ul>
          </div>
        </ModalBody>

        <ModalFooter className="flex flex-col gap-3 p-5 pt-2 border-t border-foreground/5">
          <div className="flex justify-between items-center w-full">
            <span className="text-sm font-semibold text-foreground">Total to Add:</span>
            <span className="text-base font-bold text-primary">
              ${totalCost.toFixed(2)}
              {selectedPackage !== "none" && ` + ${selectedPackage} minutes`}
            </span>
          </div>

          <div className="flex gap-3 justify-end w-full">
            <Button
              variant="bordered"
              onPress={onClose}
              className="border border-foreground/10 rounded-lg text-sm font-medium h-10 px-4"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleAdd}
              startContent={<FiCreditCard className="w-4 h-4" />}
              className="bg-primary text-white rounded-lg text-sm font-semibold h-10 px-4"
            >
              Add Credits
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
