import { useState } from "react";
import { Card, CardBody, Button, Chip, addToast, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import {
  FiPhone,
  FiDollarSign,
  FiClock,
  FiMessageSquare,
  FiInfo,
  FiPlus,
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
  FiCreditCard,
} from "react-icons/fi";
import { BsLightningCharge } from "react-icons/bs";
import { TbBrandTwilio } from "react-icons/tb";
import TwilioAddCreditsModal from "../modal/TwilioAddCreditsModal";
import TwilioPurchaseNumberModal from "../modal/TwilioPurchaseNumberModal";

interface PhoneNumber {
  id: string;
  phoneNumber: string;
  label: string;
  status: "Active" | "Pending" | string;
  capabilities: { voice: boolean; sms: boolean; mms: boolean };
}

export default function TwilioDashboard() {
  const [balance, setBalance] = useState<number>(234.5);
  const [minutesUsed, setMinutesUsed] = useState<number>(1653);
  const [minutesLimit, setMinutesLimit] = useState<number>(2500);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    {
      id: "1",
      phoneNumber: "+1 (415) 555-1234",
      label: "Main Office Line",
      status: "Active",
      capabilities: { voice: true, sms: true, mms: true },
    },
    {
      id: "2",
      phoneNumber: "+1 (415) 555-5678",
      label: "Marketing Campaign Line",
      status: "Active",
      capabilities: { voice: true, sms: true, mms: false },
    },
  ]);

  const [isAddCreditsOpen, setIsAddCreditsOpen] = useState(false);
  const [isPurchaseNumberOpen, setIsPurchaseNumberOpen] = useState(false);
  const [numberToRelease, setNumberToRelease] = useState<PhoneNumber | null>(null);

  const handleAddCredits = (amount: number, minutes: number) => {
    setBalance((prev) => prev + amount);
    if (minutes > 0) {
      setMinutesLimit((prev) => prev + minutes);
    }
  };

  const handlePurchaseNumber = (number: string, label: string) => {
    const newNum: PhoneNumber = {
      id: Math.random().toString(),
      phoneNumber: number,
      label: label,
      status: "Active",
      capabilities: { voice: true, sms: true, mms: true },
    };
    setPhoneNumbers((prev) => [...prev, newNum]);
    setBalance((prev) => prev - 15);
  };

  const handleConfirmRelease = () => {
    if (numberToRelease) {
      setPhoneNumbers((prev) => prev.filter((n) => n.id !== numberToRelease.id));
      addToast({
        title: "Number Released",
        description: `Successfully released phone number ${numberToRelease.phoneNumber}`,
        color: "success",
      });
      setNumberToRelease(null);
    }
  };

  const handleRefresh = () => {
    addToast({
      title: "Syncing status",
      description: "Twilio numbers and status successfully refreshed.",
      color: "success",
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Card className="shadow-none border border-foreground/10 rounded-2xl bg-background p-5">
        <CardBody className="p-0 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
                <FiPhone className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-foreground">
                    Practice ROI Phone Service
                  </h2>
                  <Chip
                    size="sm"
                    className="bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30 text-[10px] font-bold h-5 px-1.5"
                  >
                    Demo Mode
                  </Chip>
                </div>
                <p className="text-xs text-foreground-500 mt-0.5">
                  Manage phone numbers, call tracking, and SMS communication through Practice ROI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="bordered"
                onPress={() => setIsAddCreditsOpen(true)}
                startContent={<FiCreditCard className="w-4 h-4" />}
                className="border border-foreground/10 rounded-xl text-sm font-semibold h-10 px-4 hover:bg-foreground/5"
              >
                Add Credits
              </Button>
              <Button
                color="primary"
                onPress={() => setIsPurchaseNumberOpen(true)}
                startContent={<FiPlus className="w-4 h-4" />}
                className="bg-primary text-white rounded-xl text-sm font-semibold h-10 px-4"
              >
                Purchase Number
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-none border border-foreground/10 bg-foreground/5 dark:bg-default-50/50 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-foreground-500">Active Numbers</span>
                <FiPhone className="w-4 h-4 text-blue-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-extrabold text-foreground">{phoneNumbers.length}</span>
              </div>
            </Card>

            <Card className="shadow-none border border-foreground/10 bg-foreground/5 dark:bg-default-50/50 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-foreground-500">Account Balance</span>
                <FiDollarSign className="w-4 h-4 text-green-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-extrabold text-foreground">
                  ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </Card>

            <Card className="shadow-none border border-foreground/10 bg-foreground/5 dark:bg-default-50/50 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-foreground-500">Monthly Minutes</span>
                <FiClock className="w-4 h-4 text-purple-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-extrabold text-foreground">
                  {minutesUsed}
                  <span className="text-sm font-normal text-foreground-500">/{minutesLimit}</span>
                </span>
              </div>
            </Card>

            <Card className="shadow-none border border-foreground/10 bg-foreground/5 dark:bg-default-50/50 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-foreground-500">Features</span>
                <FiMessageSquare className="w-4 h-4 text-red-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-sm font-bold text-foreground">Voice • SMS • MMS</span>
              </div>
            </Card>
          </div>
        </CardBody>
      </Card>

      <Card className="shadow-none border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/10 rounded-2xl p-4">
        <CardBody className="p-0 flex flex-row gap-3 items-start">
          <FiInfo className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400">Demo Mode Active</h4>
            <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mt-1 leading-relaxed">
              This is a demonstration of the Practice ROI Phone Service interface. All data shown is for preview purposes only. When activated, clients will purchase phone numbers and credits directly through Practice ROI, with Twilio running in the background.
            </p>
          </div>
        </CardBody>
      </Card>

      <Card className="shadow-none border border-foreground/10 bg-background rounded-2xl p-5">
        <CardBody className="p-0 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className="text-sm font-bold text-foreground">SMS Messaging Registration (A2P)</h3>
            <Button
              color="primary"
              size="sm"
              startContent={<FiCheckCircle className="w-3.5 h-3.5" />}
              className="bg-primary text-white rounded-lg text-xs font-semibold h-8 px-4"
            >
              Register for SMS
            </Button>
          </div>

          <div className="border border-red-200 dark:border-orange-900/10 bg-orange-50/40 dark:bg-orange-950/10 rounded-xl p-4 flex flex-row gap-3 items-start">
            <FiInfo className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex flex-col gap-1.5">
              <h4 className="text-xs font-bold text-red-600 dark:text-red-500">
                SMS Registration Required
              </h4>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 leading-relaxed">
                To send SMS messages with your phone numbers, you need to complete A2P (Application-to-Person) registration. This is required by mobile carriers for compliance and helps prevent spam.
              </p>
              <ul className="text-xs text-red-600/80 dark:text-red-400/80 list-disc pl-4 space-y-1 mt-1 font-medium">
                <li>Registration takes 5-10 minutes</li>
                <li>Approval typically within 1-2 business days</li>
                <li>Required for all business SMS messaging</li>
                <li>One-time registration per brand/campaign</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Connected Phone Numbers */}
      <Card className="shadow-none border border-foreground/10 bg-background rounded-2xl p-5">
        <CardBody className="p-0 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-foreground/5 pb-3">
            <h3 className="text-sm font-bold text-foreground">Connected Phone Numbers</h3>
            <Button
              variant="light"
              isIconOnly
              size="sm"
              onPress={handleRefresh}
              className="text-foreground-500 hover:text-foreground rounded-lg"
            >
              <FiRefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {phoneNumbers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 border border-dashed border-foreground/10 rounded-xl">
              <FiPhone className="w-8 h-8 text-foreground-400" />
              <p className="text-xs text-foreground-500">No phone numbers connected. Purchase a number to get started.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {phoneNumbers.map((num) => (
                <div
                  key={num.id}
                  className="border border-foreground/5 dark:border-foreground/10 hover:border-foreground/10 bg-foreground/5 dark:bg-default-50/50 hover:bg-foreground/10 transition-all rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/35 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FiPhone className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-foreground">
                          {num.phoneNumber}
                        </span>
                        <Chip
                          size="sm"
                          className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-semibold h-4 px-1.5"
                        >
                          {num.status}
                        </Chip>
                        <Chip
                          size="sm"
                          className="bg-default-100 dark:bg-default-900/50 text-foreground-500 text-[10px] font-semibold h-4 px-1.5"
                        >
                          Voice Only
                        </Chip>
                      </div>
                      <span className="text-xs text-foreground-500">
                        {num.label}
                      </span>
                      <div className="flex gap-2.5 mt-1">
                        {num.capabilities.voice && (
                          <span className="text-[10px] border border-foreground/10 text-foreground-500 px-2 py-0.5 rounded-full font-medium">
                            Voice
                          </span>
                        )}
                        {num.capabilities.sms && (
                          <span className="text-[10px] border border-foreground/10 text-foreground-500 px-2 py-0.5 rounded-full font-medium">
                            SMS
                          </span>
                        )}
                        {num.capabilities.mms && (
                          <span className="text-[10px] border border-foreground/10 text-foreground-500 px-2 py-0.5 rounded-full font-medium">
                            MMS
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="bordered"
                    color="danger"
                    size="sm"
                    onPress={() => setNumberToRelease(num)}
                    startContent={<FiTrash2 className="w-3.5 h-3.5" />}
                    className="border border-danger/20 dark:border-danger/10 hover:bg-danger/10 text-danger rounded-lg text-xs font-semibold h-8 px-3.5"
                  >
                    Release
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add Credits Modal */}
      <TwilioAddCreditsModal
        isOpen={isAddCreditsOpen}
        onClose={() => setIsAddCreditsOpen(false)}
        currentBalance={balance}
        currentMinutes={minutesUsed}
        onAddCredits={handleAddCredits}
      />

      {/* Purchase Number Modal */}
      <TwilioPurchaseNumberModal
        isOpen={isPurchaseNumberOpen}
        onClose={() => setIsPurchaseNumberOpen(false)}
        onPurchaseSuccess={handlePurchaseNumber}
      />

      {/* Release Confirmation Modal */}
      <Modal
        isOpen={!!numberToRelease}
        onOpenChange={() => setNumberToRelease(null)}
        size="sm"
        classNames={{
          base: "max-sm:!m-3 !m-0 bg-background border border-foreground/10 text-foreground rounded-2xl",
          closeButton: "cursor-pointer text-foreground/50 hover:text-foreground",
        }}
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 p-5 pb-2">
            <h3 className="text-lg font-bold text-foreground">Release Phone Number</h3>
          </ModalHeader>
          <ModalBody className="p-5 pt-2">
            <p className="text-xs text-foreground-500 leading-relaxed">
              Are you sure you want to release the phone number <span className="font-semibold text-foreground">{numberToRelease?.phoneNumber}</span>? This action cannot be undone and inbound calls or messages to this number will fail immediately.
            </p>
          </ModalBody>
          <ModalFooter className="p-5 pt-2 flex gap-3 justify-end border-t border-foreground/5">
            <Button
              variant="bordered"
              onPress={() => setNumberToRelease(null)}
              className="border border-foreground/10 rounded-lg text-xs font-semibold h-8 px-4"
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleConfirmRelease}
              className="bg-danger text-white rounded-lg text-xs font-semibold h-8 px-4"
            >
              Confirm Release
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
