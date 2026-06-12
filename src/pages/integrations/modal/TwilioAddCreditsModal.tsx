import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  addToast,
  Switch,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { BsLightningCharge } from "react-icons/bs";
import { FiCreditCard, FiPhone, FiMessageSquare, FiMic, FiDisc, FiInfo } from "react-icons/fi";

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
  const formatCount = (num: number) => {
    if (!isFinite(num) || isNaN(num) || num <= 0) return "0";
    if (num < 100000) {
      return num.toLocaleString("en-US");
    }
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatCurrency = (amount: number) => {
    if (!isFinite(amount) || isNaN(amount) || amount <= 0) return "$0.00";
    if (amount > 1000000) {
      return (
        "$" +
        new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 2,
        }).format(amount)
      );
    }
    return (
      "$" +
      amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const tiers = [15, 50, 75];
  interface TierMeta {
    label: string;
    desc: string;
    popular?: boolean;
  }
  const tierMetadata: Record<number, TierMeta> = {
    15: { label: "Starter Wallet", desc: "Best for Individuals" },
    50: { label: "Growth Wallet", desc: "Most Popular", popular: true },
    75: { label: "Scale Wallet", desc: "Growth Scale" },
  };

  const [selectedPreset, setSelectedPreset] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState<string>("50");
  const [autoTopUp, setAutoTopUp] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedPreset(50);
      setCustomAmount("50");
      setAutoTopUp(true);
      setIsConnecting(false);
    }
  }, [isOpen]);

  const handlePresetClick = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
    const parsed = parseFloat(val);
    if (tiers.includes(parsed)) {
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
        description: "Please enter a monthly subscription amount of at least $10.",
        color: "danger",
      });
      return;
    }
    const totalAmount = credits;
    const url = `${window.location.origin}/checkout?type=twilio_credits&amount=${totalAmount}&walletAmount=${credits}&package=none&auto_topup=${autoTopUp}`;
    window.open(url, "_blank");
    onClose();
  };

  const walletAmount = parseFloat(customAmount) || 0;
  const totalToday = walletAmount
  const outboundMins = Math.floor(walletAmount / 0.02);
  const smsCount = Math.floor(walletAmount / 0.01);
  const inboundMins = Math.floor(walletAmount / 0.01);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="3xl"
      classNames={{
        base: "max-sm:!m-3 !m-0 bg-background border border-foreground/10 text-foreground rounded-2xl max-h-[90vh] overflow-y-auto",
        closeButton: "cursor-pointer text-foreground/50 hover:text-foreground",
      }}
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 p-5 pb-2">
          <h2 className="text-xl font-bold text-foreground">Manage Phone Wallet Subscription</h2>
          <p className="text-xs text-foreground-500 font-normal">
            All plans fund your single USD Wallet Balance. Services are deducted in real-time based on usage.
          </p>
        </ModalHeader>

        <ModalBody className="p-5 pt-2 flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] uppercase font-semibold text-foreground-500 tracking-wider">
                Current Wallet Balance
              </p>
              <p className="text-3xl font-extrabold text-primary mt-1">
                {formatCurrency(currentBalance)}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-foreground">Select Monthly Wallet Funding</label>
              <div className="grid grid-cols-3 gap-2.5">
                {tiers.map((amount) => {
                  const isSelected = selectedPreset === amount;
                  const meta = tierMetadata[amount] || { label: "", desc: "", popular: false };
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handlePresetClick(amount)}
                      className={`relative flex flex-col items-center justify-between p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${isSelected
                        ? "border-primary bg-primary-500/10 text-foreground ring-2 ring-primary/45 shadow-md shadow-primary-500/5 font-semibold"
                        : "border-foreground/10 bg-default-50/50 hover:bg-default-100/50 text-foreground"
                        }`}
                    >
                      {meta.popular && (
                        <span className="absolute -top-2 px-2 py-0.5 bg-primary text-white text-[8px] font-extrabold rounded-full tracking-wider uppercase">
                          POPULAR
                        </span>
                      )}
                      <span className="text-[9px] font-semibold text-foreground-500 mt-1">{meta.label}</span>
                      <span className="text-lg font-extrabold text-foreground mt-1">${amount}</span>
                      <span className="text-[8px] text-foreground-400 mt-1 leading-tight">{meta.desc}</span>
                      <span className="text-[8px] text-primary font-bold mt-1.5">/ month</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Input
              type="number"
              label="Or Enter Custom Monthly Amount"
              labelPlacement="outside"
              placeholder="Enter custom amount"
              value={customAmount}
              onValueChange={handleCustomAmountChange}
              min={10}
              startContent={<span className="text-xs text-foreground-500">$</span>}
              endContent={<span className="w-14 text-xs text-foreground-400">/ month</span>}
              classNames={{
                label: "text-xs font-semibold text-foreground mb-1",
                inputWrapper: "border border-foreground/10 rounded-lg bg-transparent h-10",
                input: "text-sm",
              }}
            />

            <div className="border border-foreground/10 dark:bg-foreground/5 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">Auto-Top Up</span>
                  <span className="text-[10px] text-foreground-500 mt-1 leading-normal max-w-[220px]">
                    If wallet balance drops below $10, automatically reload $25 to prevent service interruption.
                  </span>
                </div>
                <Switch
                  isSelected={autoTopUp}
                  onValueChange={setAutoTopUp}
                  color="primary"
                  size="sm"
                  aria-label="Auto-Top Up"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-default-50 dark:bg-default-100/20 border border-foreground/5 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Estimated Monthly Power</span>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Based on {formatCurrency(walletAmount)}/mo
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "Outbound Calls", value: `${formatCount(outboundMins)} mins`, formula: "at $0.02/min", icon: <FiPhone className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> },
                  { label: "SMS Messages", value: `${formatCount(smsCount)} SMS`, formula: "at $0.01/msg", icon: <FiMessageSquare className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> },
                  { label: "Inbound Calls", value: `${formatCount(inboundMins)} mins`, formula: "at $0.01/min", icon: <FiPhone className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" /> },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-background border border-foreground/5 p-2.5 rounded-lg min-w-0 gap-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {item.icon}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-foreground leading-normal truncate" title={item.value}>
                          {item.value}
                        </span>
                        <span className="text-[10px] text-foreground-500 truncate">{item.label}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-medium text-foreground-400 bg-foreground/5 px-2 py-0.5 rounded flex-shrink-0">
                      {item.formula}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-foreground/10 rounded-xl p-3 flex flex-col gap-2.5 bg-default-50/50">
              <div className="flex items-center gap-1.5 text-foreground font-bold text-[10px] uppercase tracking-wider text-foreground-500">
                <BsLightningCharge className="w-3.5 h-3.5 text-primary" />
                <span>Real-Time Rates (Pay-As-You-Go)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Outbound Calls", rate: "$0.02 / min", icon: <FiPhone className="w-3.5 h-3.5 text-foreground-500" /> },
                  { label: "Inbound Calls", rate: "$0.01 / min", icon: <FiPhone className="w-3.5 h-3.5 text-foreground-500 rotate-90" /> },
                  { label: "SMS Messages", rate: "$0.01 / msg", icon: <FiMessageSquare className="w-3.5 h-3.5 text-foreground-500" /> },
                  { label: "MMS Messages", rate: "$0.02 / msg", icon: <FiMessageSquare className="w-3.5 h-3.5 text-foreground-500" /> },
                  { label: "Call Transcriptions", rate: "$0.05 / min", icon: <FiMic className="w-3.5 h-3.5 text-foreground-500" /> },
                  { label: "Call Recordings", rate: "$0.0025 / min", icon: <FiDisc className="w-3.5 h-3.5 text-foreground-500" /> },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-1.5 bg-background/50 border border-foreground/5 rounded-lg text-xs"
                  >
                    {item.icon}
                    <div className="flex flex-col">
                      <span className="text-[9px] text-foreground-500 leading-none">{item.label}</span>
                      <span className="text-xs font-bold text-foreground mt-0.5">{item.rate}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* <div className="flex items-center justify-between bg-primary-500/10 border border-primary/25 rounded-lg p-2 mt-0.5">
                <div className="flex items-center gap-1.5">
                  <FiInfo className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-bold text-foreground">Active Phone Number</span>
                </div>
                <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                  $5.00 / month
                </span>
              </div> */}
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex flex-col gap-3 p-5 pt-2 border-t border-foreground/5">
          <div className="flex justify-between items-center w-full">
            <span className="text-sm font-semibold text-foreground">Total to Pay:</span>
            <span className="text-base font-bold text-primary">
              ${totalToday.toFixed(2)}/month
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
              isLoading={isConnecting}
              startContent={<FiCreditCard className="w-4 h-4" />}
              className="bg-primary text-white rounded-lg text-sm font-semibold h-10 px-4"
            >
              Confirm Subscription
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
