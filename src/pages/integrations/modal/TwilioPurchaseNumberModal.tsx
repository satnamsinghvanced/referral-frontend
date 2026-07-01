import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  addToast,
  Spinner,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import axios from "../../../services/axios";

interface TwilioPurchaseNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: (phoneNumber: string, label: string) => void;
  balance: number;
  phoneNumbersCount: number;
  minutesLimit?: number;
}

interface AvailableNumber {
  phoneNumber: string;
  locality?: string;
  region?: string;
  setupFee: number;
  monthlyFee: number;
  capabilities: { voice: boolean; sms: boolean; mms: boolean };
}

export default function TwilioPurchaseNumberModal({
  isOpen,
  onClose,
  onPurchaseSuccess,
  balance,
  minutesLimit = 0,
}: TwilioPurchaseNumberModalProps) {
  const [areaCode, setAreaCode] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<AvailableNumber[]>([]);
  const [searched, setSearched] = useState<boolean>(false);
  const [buyingNumber, setBuyingNumber] = useState<string | null>(null);

  // Cost rules matching the user's interface setup
  const setupFee = 15;
  const monthlyCost = 5;
  const totalCost = setupFee + monthlyCost;
  const isBalanceLow = balance < totalCost;

  useEffect(() => {
    if (isOpen) {
      setAreaCode("");
      setSearching(false);
      setSearchResults([]);
      setSearched(false);
      setBuyingNumber(null);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!areaCode || areaCode.trim().length < 3) {
      addToast({
        title: "Invalid Area Code",
        description: "Please enter a valid 3-digit area code.",
        color: "warning",
      });
      return;
    }
    setSearching(true);
    setSearched(false);
    setSearchResults([]);
    try {
      const response = (await axios.get("/twilio-checkout/search-numbers", {
        params: { areaCode: areaCode.trim() },
      })) as any;
      if (response?.success) {
        setSearchResults(response.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (err: any) {
      console.error(err);
      addToast({
        title: "Search Failed",
        description: err.response?.data?.message || err.message || "Failed to search numbers.",
        color: "danger",
      });
    } finally {
      setSearching(false);
      setSearched(true);
    }
  };

  const handleBuy = async (num: AvailableNumber) => {
    const labelText = "Marketing Line";
    setBuyingNumber(num.phoneNumber);
    try {
      const response = (await axios.post("/twilio-checkout/buy-number", {
        phoneNumber: num.phoneNumber,
        label: labelText,
      })) as any;

      if (response?.success) {
        onPurchaseSuccess(num.phoneNumber, labelText);
        addToast({
          title: "Number Purchased",
          description: `Successfully purchased ${num.phoneNumber} for your account.`,
          color: "success",
        });
        onClose();
      } else {
        throw new Error(response?.message || "Failed to purchase number.");
      }
    } catch (err: any) {
      console.error(err);
      addToast({
        title: "Purchase Failed",
        description: err.response?.data?.message || err.message || "Failed to purchase number.",
        color: "danger",
      });
    } finally {
      setBuyingNumber(null);
    }
  };

  // Resolve plan label from minutesLimit
  const planName =
    minutesLimit >= 2500
      ? "Scale"
      : minutesLimit >= 1000
        ? "Growth"
        : minutesLimit >= 500
          ? "Starter"
          : "None";

  // Format Twilio raw phone numbers to +1 (XXX) XXX-XXXX for readability
  const formatPhoneNumber = (numStr: string) => {
    const cleaned = numStr.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return numStr;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="md"
      classNames={{
        base: "max-sm:!m-3 !m-0 bg-background border border-foreground/10 text-foreground rounded-2xl max-h-[90vh] overflow-y-auto",
        closeButton: "cursor-pointer text-foreground/50 hover:text-foreground",
      }}
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 p-5 pb-2">
          <h2 className="text-lg font-bold text-foreground">Purchase Phone Number</h2>
          <p className="text-xs text-foreground-500 font-normal leading-relaxed">
            Search for available phone numbers by area code • ${setupFee} setup + ${monthlyCost}/month
          </p>
        </ModalHeader>
        <ModalBody className="p-5 pt-2 flex flex-col gap-5">
          {/* Low Balance Alert */}
          {isBalanceLow && (
            <div className="bg-red-50 dark:bg-red-955/15 border border-red-200 dark:border-red-900/30 rounded-xl p-3.5 flex flex-col gap-1 text-xs text-red-800 dark:text-red-400">
              <span className="font-bold flex items-center gap-1">⚠️ Low Balance Alert</span>
              <p className="leading-relaxed font-normal">
                Your balance of <strong>${balance.toFixed(2)}</strong> is insufficient. Purchasing a number requires at least <strong>${totalCost.toFixed(2)}</strong> to cover the setup fee (${setupFee.toFixed(2)}) and the first month monthly fee (${monthlyCost.toFixed(2)}). Please upgrade your plan.
              </p>
            </div>
          )}

          {/* Area Code search block */}
          <div className="flex gap-2.5 items-end">
            <Input
              type="text"
              label="Area Code"
              labelPlacement="outside"
              placeholder="e.g., 818, 415, 212"
              value={areaCode}
              onValueChange={setAreaCode}
              maxLength={3}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              classNames={{
                label: "text-xs font-semibold text-foreground mb-1",
                inputWrapper: "border border-foreground/10 rounded-lg bg-transparent h-10",
                input: "text-sm",
              }}
              className="flex-1"
            />
            <Button
              color="primary"
              onPress={handleSearch}
              isLoading={searching}
              startContent={!searching && <FiSearch className="w-4 h-4" />}
              className="bg-primary text-white rounded-lg text-sm font-semibold h-10 px-5"
            >
              Search
            </Button>
          </div>

          {/* Searching loader */}
          {searching && (
            <div className="flex flex-col items-center justify-center py-8 gap-2.5">
              <Spinner size="md" color="primary" />
              <p className="text-xs text-foreground-500">Searching available numbers...</p>
            </div>
          )}

          {/* Results list */}
          {!searching && searched && searchResults.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-bold text-foreground">
                <span>Available Numbers</span>
                <span className="text-foreground-500 font-normal">
                  Plan: <span className="text-primary font-bold">{planName}</span>
                </span>
              </div>
              <div className="flex flex-col border border-foreground/5 rounded-xl max-h-[300px] overflow-y-auto divide-y divide-foreground/5">
                {searchResults.map((num) => {
                  const locationText =
                    num.locality && num.region
                      ? `${num.locality}, ${num.region}`
                      : "US/Canada local number";
                  return (
                    <div
                      key={num.phoneNumber}
                      className="p-3.5 flex items-center justify-between gap-4 bg-default-50/10 hover:bg-default-50/30 transition-colors"
                    >
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="font-bold text-sm text-foreground leading-none">
                          {formatPhoneNumber(num.phoneNumber)}
                        </span>
                        <span className="text-[10px] text-foreground-500 font-normal leading-none">
                          {locationText}
                        </span>
                        <div className="flex gap-1.5 mt-0.5">
                          {num.capabilities.voice && (
                            <span className="text-[9px] border border-foreground/10 text-foreground-500 px-1.5 py-0.5 rounded font-medium leading-none">
                              Voice
                            </span>
                          )}
                          {num.capabilities.sms && (
                            <span className="text-[9px] border border-foreground/10 text-foreground-500 px-1.5 py-0.5 rounded font-medium leading-none">
                              SMS
                            </span>
                          )}
                          {num.capabilities.mms && (
                            <span className="text-[9px] border border-foreground/10 text-foreground-500 px-1.5 py-0.5 rounded font-medium leading-none">
                              MMS
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-[10px] text-foreground-500 font-medium">
                          ${setupFee} setup + ${monthlyCost}/mo
                        </span>
                        <Button
                          size="sm"
                          color={isBalanceLow ? "default" : "primary"}
                          onPress={() => handleBuy(num)}
                          isLoading={buyingNumber === num.phoneNumber}
                          isDisabled={buyingNumber !== null || isBalanceLow}
                          startContent={buyingNumber !== num.phoneNumber && <FiPlus className="w-3.5 h-3.5" />}
                          className={`${isBalanceLow
                              ? "bg-foreground/15 text-foreground-400 cursor-not-allowed"
                              : "bg-primary text-white"
                            } rounded-lg text-xs font-semibold h-8 px-3.5`}
                        >
                          Purchase
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {!searching && searched && searchResults.length === 0 && (
            <p className="text-xs text-danger text-center py-8 font-medium">

              No numbers found for area code "{areaCode}" at the moment. Please try after some time.
            </p>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-end p-5 pt-0">
          <Button
            variant="light"
            onPress={onClose}
            className="rounded-lg text-xs font-semibold h-9 px-4 text-foreground-500 hover:bg-foreground/5"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
