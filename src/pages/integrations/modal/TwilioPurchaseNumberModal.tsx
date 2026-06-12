import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, addToast, Spinner } from "@heroui/react";
import { useState, useEffect } from "react";
import { FiSearch, FiPhone } from "react-icons/fi";
import axios from "../../../services/axios";

interface TwilioPurchaseNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: (phoneNumber: string, label: string) => void;
}

interface MockNumber {
  phoneNumber: string;
  setupFee: number;
  monthlyFee: number;
  capabilities: { voice: boolean; sms: boolean; mms: boolean };
}

export default function TwilioPurchaseNumberModal({ isOpen, onClose, onPurchaseSuccess }: TwilioPurchaseNumberModalProps) {
  const [areaCode, setAreaCode] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<MockNumber[]>([]);
  const [searched, setSearched] = useState<boolean>(false);
  const [customLabel, setCustomLabel] = useState<{ [key: string]: string }>({});
  const [buyingNumber, setBuyingNumber] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAreaCode("");
      setSearching(false);
      setSearchResults([]);
      setSearched(false);
      setCustomLabel({});
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

  const handleBuy = async (num: MockNumber) => {
    const labelText = customLabel[num.phoneNumber]?.trim() || "Marketing Line";
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
          <h2 className="text-xl font-bold text-foreground">Purchase Phone Number</h2>
          <p className="text-xs text-foreground-500 font-normal">
            Search for available phone numbers by area code • $5 setup fee
          </p>
        </ModalHeader>
        <ModalBody className="p-5 pt-2 flex flex-col gap-4">
          <div className="flex gap-2 items-end">
            <Input
              type="text"
              label="Area Code"
              labelPlacement="outside"
              placeholder="e.g., 415, 212, 310"
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
          {searching && (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Spinner size="md" color="primary" />
              <p className="text-xs text-foreground-500">Searching available numbers...</p>
            </div>
          )}
          {!searching && searched && searchResults.length > 0 && (
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-foreground">Available Numbers</label>
              <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-1">
                {searchResults.map((num) => (
                  <div
                    key={num.phoneNumber}
                    className="border border-foreground/10 rounded-xl p-3 flex flex-col gap-2 bg-foreground/5 hover:bg-foreground/10 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FiPhone className="w-4 h-4 text-primary" />
                        <span className="font-bold text-sm text-foreground">
                          {num.phoneNumber}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => handleBuy(num)}
                        isLoading={buyingNumber === num.phoneNumber}
                        isDisabled={buyingNumber !== null}
                        className="bg-primary text-white rounded-lg text-xs font-semibold h-8 px-4"
                      >
                        Buy
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-foreground/10 px-2 py-0.5 rounded-full text-foreground/75">
                        Voice
                      </span>
                      {num.capabilities.sms && (
                        <span className="text-[10px] bg-foreground/10 px-2 py-0.5 rounded-full text-foreground/75">
                          SMS
                        </span>
                      )}
                      {num.capabilities.mms && (
                        <span className="text-[10px] bg-foreground/10 px-2 py-0.5 rounded-full text-foreground/75">
                          MMS
                        </span>
                      )}
                    </div>
                    <Input
                      type="text"
                      placeholder="Label (e.g. Marketing Line, Main Office)"
                      size="sm"
                      value={customLabel[num.phoneNumber] || ""}
                      onValueChange={(val) =>
                        setCustomLabel((prev) => ({ ...prev, [num.phoneNumber]: val }))
                      }
                      classNames={{
                        inputWrapper: "border border-foreground/10 rounded-lg bg-background h-8 min-h-8 px-2",
                        input: "text-xs",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {!searching && searched && searchResults.length === 0 && (
            <p className="text-xs text-danger text-center py-6">
              No numbers found for area code "{areaCode}". Try another area code.
            </p>
          )}
        </ModalBody>
        <ModalFooter className="flex justify-end p-5 pt-2 border-t border-foreground/5">
          <Button
            variant="bordered"
            onPress={onClose}
            className="border border-foreground/10 rounded-lg text-sm font-medium h-10 px-5"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
