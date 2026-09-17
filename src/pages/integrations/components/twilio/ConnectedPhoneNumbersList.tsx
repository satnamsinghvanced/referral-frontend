import React from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { FiPhone, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { PhoneNumber } from "../a2p/types";

interface ConnectedPhoneNumbersListProps {
  phoneNumbers: PhoneNumber[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onSelectReleaseNumber: (num: PhoneNumber) => void;
}

export default function ConnectedPhoneNumbersList({
  phoneNumbers,
  isRefreshing,
  onRefresh,
  onSelectReleaseNumber,
}: ConnectedPhoneNumbersListProps) {
  return (
    <Card className="shadow-none border border-foreground/10 bg-background rounded-2xl p-5">
      <CardBody className="p-0 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-foreground/5 pb-3">
          <h3 className="text-sm font-bold text-foreground">Connected Phone Numbers</h3>
          <Button
            variant="light"
            isIconOnly
            size="sm"
            isDisabled={isRefreshing}
            onPress={onRefresh}
            className="text-foreground-500 hover:text-foreground rounded-lg transition-all"
          >
            <FiRefreshCw
              className={`w-4 h-4 transition-transform duration-500 ${isRefreshing ? "animate-spin text-blue-500" : ""
                }`}
            />
          </Button>
        </div>
        {phoneNumbers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 border border-dashed border-foreground/10 rounded-xl">
            <FiPhone className="w-8 h-8 text-foreground-400" />
            <p className="text-xs text-foreground-500">
              No phone numbers connected. Purchase a number to get started.
            </p>
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
                    </div>
                    <span className="text-xs text-foreground-500">{num.label}</span>
                    <div className="flex gap-2.5 mt-1">
                      {num.capabilities.voice && (
                        <span className="text-[10px] border border-foreground/10 text-foreground-500 px-2 py-0.5 rounded-full font-medium">
                          Voice
                        </span>
                      )}
                      {num.capabilities.SMS && (
                        <span className="text-[10px] border border-foreground/10 text-foreground-500 px-2 py-0.5 rounded-full font-medium">
                          SMS
                        </span>
                      )}
                      {num.capabilities.MMS && (
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
                  onPress={() => onSelectReleaseNumber(num)}
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
  );
}