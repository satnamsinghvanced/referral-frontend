import { Button, Spinner, Textarea } from "@heroui/react";
import { Link } from "react-router-dom";
import {
  HiOutlineChat,
  HiOutlineInbox,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineTrash,
} from "react-icons/hi";
import { LuHistory } from "react-icons/lu";
import { timeAgo as formatTimeAgo } from "../../../../utils/timeAgo";

interface LeadDetailsCommunicationTabProps {
  lead: any;
  hasPhoneConnected: boolean | null;
  hasEmailConnected: boolean | null;
  smsBody: string;
  setSmsBody: (val: string) => void;
  sendingSms: boolean;
  onSendSms: () => void;
  onSendEmailClick: () => void;
  communicationHistory: any[];
  loadingHistory: boolean;
  deletingId: string | null;
  onDeleteCommunication: (id: string, type: string) => void;
}

const LeadDetailsCommunicationTab = ({
  lead,
  hasPhoneConnected,
  hasEmailConnected,
  smsBody,
  setSmsBody,
  sendingSms,
  onSendSms,
  onSendEmailClick,
  communicationHistory,
  loadingHistory,
  deletingId,
  onDeleteCommunication,
}: LeadDetailsCommunicationTabProps) => {
  return (
    <div className="space-y-4 pt-1">
      {(hasPhoneConnected === false || hasEmailConnected === false) && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-xs space-y-2">
          {hasPhoneConnected === false && (
            <p className="flex items-center gap-1.5 font-medium">
              <span>⚠️</span>
              <span>
                Phone service is not connected. Please{" "}
                <Link
                  to="/integrations?highlight=twilio"
                  className="underline font-bold hover:text-amber-500 transition-colors"
                >
                  buy a phone number
                </Link>{" "}
                to enable SMS messaging.
              </span>
            </p>
          )}
          {hasEmailConnected === false && (
            <p className="flex items-center gap-1.5 font-medium">
              <span>⚠️</span>
              <span>
                Email integration is not connected. Please{" "}
                <Link
                  to="/integrations?highlight=email_marketing"
                  className="underline font-bold hover:text-amber-500 transition-colors"
                >
                  connect your Gmail/SMTP
                </Link>{" "}
                to enable email sending.
              </span>
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 border-l-4 border-purple-500 rounded-xl bg-gradient-to-br from-purple-500/[0.03] to-indigo-500/[0.03] border border-y-foreground/5 border-r-foreground/5 dark:border-y-white/5 dark:border-r-white/5 space-y-4 flex flex-col justify-between min-h-[190px] shadow-sm hover:shadow-purple-500/5 transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-500">
              <HiOutlineMail className="size-5" />
              <h4 className="font-bold text-sm tracking-wide">
                Email Communications
              </h4>
            </div>
            <p className="text-[11px] text-foreground/50 leading-relaxed">
              Send templates, custom campaigns, and direct updates to the
              lead's email.
            </p>
          </div>
          <Button
            fullWidth
            variant="solid"
            className={`font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/10 rounded-xl transition-all duration-200 transform active:scale-95 py-6 ${
              hasEmailConnected === false
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
            startContent={<HiOutlineInbox className="size-5 text-white" />}
            onPress={onSendEmailClick}
            isDisabled={hasEmailConnected === false}
          >
            <span className="truncate">
              {lead.email ? lead.email : "Send Email"}
            </span>
          </Button>
        </div>

        <div className="p-5 border-l-4 border-green-500 rounded-xl bg-gradient-to-br from-green-500/[0.03] to-emerald-500/[0.03] border border-y-foreground/5 border-r-foreground/5 dark:border-y-white/5 dark:border-r-white/5 space-y-4 flex flex-col justify-between min-h-[190px] shadow-sm hover:shadow-green-500/5 transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-500">
              <HiOutlineChat className="size-5" />
              <h4 className="font-bold text-sm tracking-wide">SMS Texting</h4>
            </div>
            <p className="text-[11px] text-foreground/50 leading-relaxed">
              Send immediate SMS text updates directly to the lead's mobile
              device.
            </p>
          </div>

          <div className="space-y-3 w-full">
            <Textarea
              placeholder="Type your SMS message..."
              minRows={1}
              variant="flat"
              className="text-xs bg-foreground/[0.03] dark:bg-white/[0.03] rounded-lg"
              value={smsBody}
              onChange={(e) => setSmsBody(e.target.value)}
              maxLength={200}
              isDisabled={hasPhoneConnected === false}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSendSms();
                }
              }}
            />
            <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-foreground/40">
              <span>{smsBody.length}/200</span>
              <Button
                size="sm"
                variant="solid"
                className={`font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md shadow-green-500/10 rounded-xl transition-all duration-200 transform active:scale-95 px-4 py-2 ${
                  !smsBody.trim() || sendingSms || hasPhoneConnected === false
                    ? "opacity-50"
                    : ""
                }`}
                startContent={
                  !sendingSms && <HiOutlineChat className="size-4 text-white" />
                }
                onPress={onSendSms}
                isLoading={sendingSms}
                isDisabled={
                  !smsBody.trim() || sendingSms || hasPhoneConnected === false
                }
              >
                Send SMS
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-4 px-2">
          <LuHistory className="size-5 text-gray-400 dark:text-foreground/40" />
          <h3 className="font-bold text-base text-foreground">
            Communication History
          </h3>
        </div>
        <div className="p-4 border border-foreground/10 rounded-xl bg-content1/50 dark:bg-content1/20">
          {loadingHistory ? (
            <div className="p-8 flex flex-col items-center justify-center gap-2 text-xs text-gray-400 dark:text-foreground/45 font-medium">
              <Spinner size="sm" color="primary" />
              <span>Loading communication history...</span>
            </div>
          ) : communicationHistory.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-foreground/10 rounded-xl bg-gray-50/50 dark:bg-white/5">
              <p className="text-xs text-gray-400 dark:text-foreground/40 font-medium">
                No communication history available.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {communicationHistory.map((record: any) => {
                const isEmail = record.type === "email";
                const isSms = record.type === "sms";
                const isIncoming = record.direction === "Incoming";
                const timeAgoStr = record.date ? formatTimeAgo(record.date) : "";
                return (
                  <div
                    key={record._id}
                    className="p-3 border border-foreground/10 rounded-xl bg-gray-50 dark:bg-white/5 flex gap-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative group"
                  >
                    <div
                      className={`p-2 rounded-full h-fit ${
                        isEmail
                          ? "bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400"
                          : isSms
                          ? "bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400"
                          : isIncoming
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400"
                          : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400"
                      }`}
                    >
                      {isEmail ? (
                        <HiOutlineMail className="size-5" />
                      ) : isSms ? (
                        <HiOutlineChat className="size-5" />
                      ) : (
                        <HiOutlinePhone className="size-5" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-sm text-foreground">
                          {isEmail
                            ? "Sent Email"
                            : isSms
                            ? isIncoming
                              ? "Received SMS"
                              : "Sent SMS"
                            : isIncoming
                            ? "Inbound Call"
                            : "Outbound Call"}
                        </h5>
                        <span className="text-[10px] text-gray-400 dark:text-foreground/40 font-medium pr-8">
                          {timeAgoStr}
                        </span>
                      </div>
                      {isEmail ? (
                        <div className="space-y-0.5">
                          <p className="text-xs text-gray-500 dark:text-foreground/60 font-medium">
                            To: <span className="font-semibold">{lead.email}</span>
                          </p>
                          {record.subject && (
                            <p className="text-xs text-gray-500 dark:text-foreground/60 font-medium">
                              Subject:{" "}
                              <span className="font-semibold text-gray-700 dark:text-foreground/85">
                                {record.subject}
                              </span>
                            </p>
                          )}
                        </div>
                      ) : isSms ? (
                        <p className="text-xs text-gray-500 dark:text-foreground/60 font-medium">
                          Recipient:{" "}
                          <span className="font-semibold">
                            {record.recipient || lead.phone}
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 dark:text-foreground/60 font-medium">
                          Status:{" "}
                          <span className="font-semibold capitalize">
                            {record.status}
                          </span>{" "}
                          &bull; Duration: {record.duration}
                        </p>
                      )}
                      {record.body && !isEmail && (
                        <p className="text-xs text-gray-650 dark:text-foreground/80 whitespace-pre-wrap mt-1 bg-white/5 p-1.5 rounded-md leading-relaxed border border-foreground/5 font-normal">
                          {record.body}
                        </p>
                      )}
                      {record.notes && (
                        <p className="text-xs text-gray-650 dark:text-foreground/80 whitespace-pre-wrap mt-1 bg-white/5 p-1.5 rounded-md leading-relaxed border border-foreground/5">
                          {record.notes}
                        </p>
                      )}
                      {!isEmail &&
                        record.transcriptionText &&
                        record.transcriptionText !== "No transcription available" &&
                        record.transcriptionText !== "Processing..." && (
                          <p className="text-[11px] text-gray-400 dark:text-foreground/45 border-l-2 border-foreground/10 pl-2 mt-1.5 italic">
                            "{record.transcriptionText}"
                          </p>
                        )}
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      className={`${
                        deletingId === record._id
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      } transition-opacity absolute right-3 top-3 h-7 w-7 min-w-0`}
                      onPress={() =>
                        onDeleteCommunication(record._id, record.type)
                      }
                      title="Delete Record"
                      isLoading={deletingId === record._id}
                    >
                      <HiOutlineTrash className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsCommunicationTab;
