import { useState, useEffect } from "react";
import { Card, CardBody, Button, Switch, Input, Textarea, Skeleton, addToast } from "@heroui/react";
import { FiPhone, FiRefreshCw, FiTrash2, FiChevronDown, FiChevronUp, FiAlertTriangle, FiCheck, FiGitCommit, FiMic, FiUser, FiUsers } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { PhoneRoutingSetting } from "../../../phone-service/mockData";
import axios from "../../../../services/axios";

interface PhoneNumbersCallRoutingProps {
  initialNumbers: PhoneRoutingSetting[];
  onRefresh?: () => void;
  onDeleteNumber?: (id: string) => void;
}

const PATIENT_LINE_CONFIGS = [
  {
    key: "forwardNewPatients" as const,
    label: "New Patient Line",
    press: "Press 1",
    Icon: FiUser,
    iconColor: "text-purple-600",
    badgeStyle: "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
    placeholder: "(303) 555-0101",
    description: 'Callers who press 1 ("new patients") route here',
  },
  {
    key: "forwardExistingPatients" as const,
    label: "Existing Patient Line",
    press: "Press 2",
    Icon: FiUsers,
    iconColor: "text-primary",
    badgeStyle: "bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800",
    placeholder: "(303) 555-0102",
    description: 'Callers who press 2 ("existing patients") route here',
  },
];

const TOGGLE_CONFIGS = [
  {
    key: "recordCallsToggle" as const,
    label: "Record calls",
    description: "Recordings are transcribed and used to auto-fill lead forms",
    Icon: FiMic,
    iconColor: "text-pink-500",
    getValue: (state: PhoneRoutingSetting) => state.recordCallsToggle,
    onChange: (val: boolean, state: PhoneRoutingSetting) => ({
      ...state,
      recordCallsToggle: val,
      aiLeadAutoFillToggle: val ? state.aiLeadAutoFillToggle : false,
    }),
  },
  {
    key: "aiLeadAutoFillToggle" as const,
    label: "AI lead auto-fill",
    description: "Extract name, insurance, reason for call from transcript",
    Icon: HiOutlineSparkles,
    iconColor: "text-amber-500",
    getValue: (state: PhoneRoutingSetting) => state.aiLeadAutoFillToggle,
    onChange: (val: boolean, state: PhoneRoutingSetting) => ({
      ...state,
      aiLeadAutoFillToggle: val,
      recordCallsToggle: val ? true : state.recordCallsToggle,
    }),
  },
];

const FORWARDING_TARGET_ROWS = [
  {
    press: "Press 1",
    key: "forwardNewPatients" as const,
    label: "New patients",
    getValue: (data: PhoneRoutingSetting) => data.forwardNewPatients,
  },
  {
    press: "Press 2",
    key: "forwardExistingPatients" as const,
    label: "Existing patients",
    getValue: (data: PhoneRoutingSetting) => data.forwardExistingPatients,
  },
];

export default function PhoneNumbersCallRouting({
  initialNumbers,
  onRefresh,
  onDeleteNumber,
}: PhoneNumbersCallRoutingProps) {
  const [numbers, setNumbers] = useState<PhoneRoutingSetting[]>(initialNumbers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftState, setDraftState] = useState<PhoneRoutingSetting | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNumbers(initialNumbers);
  }, [initialNumbers]);

  const handleRefreshClick = async () => {
    setIsLoading(true);
    try {
      if (onRefresh) {
        await Promise.resolve(onRefresh());
      }
      await new Promise((r) => setTimeout(r, 600));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (num: PhoneRoutingSetting) => {
    setEditingId(num.id);
    setDraftState({ ...num });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraftState(null);
  };

  const handleSaveEdit = async () => {
    if (!draftState) return;
    try {
      const payload = {
        phoneNumber: draftState.phoneNumber,
        separateLines: draftState.separateLines,
        forwardingNumber: draftState.forwardingNumber,
        forwardNewPatients: draftState.forwardNewPatients,
        forwardExistingPatients: draftState.forwardExistingPatients,
        ivrGreetingOn: draftState.ivrGreetingOn,
        greetingMode: draftState.greetingMode || "auto",
        ivrGreetingText: draftState.ivrGreetingText,
        ivrOptions: draftState.ivrOptions || [],
        recordCallsToggle: draftState.recordCallsToggle,
        aiLeadAutoFillToggle: draftState.recordCallsToggle ? draftState.aiLeadAutoFillToggle : false,
      };

      const response = (await axios.put("/twilio-checkout/routing-settings", payload)) as any;
      if (response?.data?.setting) {
        setNumbers((prev) =>
          prev.map((n) => (n.id === draftState.id ? { ...draftState, ...response.data.setting } : n))
        );
      } else {
        setNumbers((prev) =>
          prev.map((n) => (n.id === draftState.id ? { ...draftState } : n))
        );
      }

      addToast({
        title: "Settings Saved",
        description: `Updated routing settings for ${draftState.phoneNumber}`,
        color: "success",
      });
    } catch (err: any) {
      addToast({
        title: "Error Saving Settings",
        description: err?.response?.data?.message || err.message || "Failed to save settings",
        color: "danger",
      });
    } finally {
      setEditingId(null);
      setDraftState(null);
    }
  };

  return (
    <Card className="shadow-none border border-foreground/10 rounded-2xl bg-background p-5">
      <CardBody className="p-0 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Phone Numbers &amp; Call Routing
            </h3>
            <p className="text-xs text-foreground-500 mt-0.5">
              Each Phone Service number forwards calls to your real office lines. Set and verify the forwarding numbers below.
            </p>
          </div>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={handleRefreshClick}
            isLoading={isLoading}
            className="text-foreground-500 hover:text-foreground hover:bg-foreground/5 rounded-xl"
            title="Refresh Numbers"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="border border-foreground/10 rounded-xl p-4 flex flex-col gap-4 bg-background">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                    <Skeleton className="w-32 h-5 rounded-lg" />
                    <Skeleton className="w-24 h-4 rounded-md" />
                    <Skeleton className="w-24 h-5 rounded-full" />
                    <Skeleton className="w-16 h-5 rounded-full" />
                  </div>
                  <Skeleton className="w-24 h-6 rounded-lg shrink-0" />
                </div>
                <Skeleton className="w-full h-16 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {numbers.map((num) => {
              const isEditing = editingId === num.id;
              const currentData = isEditing && draftState ? draftState : num;
              const isSeparate = currentData.separateLines;
              const isRecording = isEditing
                ? currentData.recordCallsToggle
                : currentData.recordingOn && currentData.recordCallsToggle;
              const hasForwarding = isSeparate
                ? Boolean(currentData.forwardNewPatients || currentData.forwardExistingPatients)
                : Boolean(currentData.forwardingNumber);

              const badges = [
                {
                  key: "location",
                  label: num.locationName,
                  className: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
                  dot: true,
                },
                hasForwarding
                  ? {
                    key: "status",
                    label: "Active",
                    className: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
                    icon: <FiCheck className="w-3 h-3" />,
                  }
                  : {
                    key: "status",
                    label: "Message-only mode",
                    className: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800",
                    icon: <FiAlertTriangle className="w-3 h-3 text-amber-600" />,
                  },
                ...(isRecording
                  ? [
                    {
                      key: "recording",
                      label: "Recording On",
                      className: "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800",
                      icon: <FiMic className="w-3 h-3" />,
                    },
                  ]
                  : []),
              ];
              const flowNodes = [
                {
                  id: "service",
                  node: (
                    <div className="bg-primary text-white rounded-xl px-3 py-2.5 flex flex-col items-center justify-center shrink-0 min-w-full md:min-w-[130px]">
                      <FiPhone className="w-4 h-4 mb-1" />
                      <span className="text-[10px]  uppercase font-semibold">Phone Service</span>
                      <span className="text-xs font-bold font-mono">{num.phoneNumber}</span>
                    </div>
                  ),
                },
                {
                  id: "ivr",
                  node: (
                    <div className="bg-purple-100 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-xl px-3 py-2.5 flex flex-col items-center justify-center shrink-0 min-w-full md:min-w-[110px]">
                      <FiGitCommit className="w-4 h-4 mb-1 text-purple-600" />
                      <span className="text-xs font-bold">IVR Menu</span>
                      {isSeparate && (
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                          Press 1 / Press 2
                        </span>
                      )}
                    </div>
                  ),
                },
              ];
              return (
                <div
                  key={num.id}
                  className={`border rounded-xl p-4 transition-all ${isEditing
                    ? "border-primary ring-2 ring-primary/10 bg-background shadow-md"
                    : "border-amber-300 dark:border-amber-900/50 bg-background hover:border-amber-400"
                    }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-primary flex items-center justify-center shrink-0">
                        <FiPhone className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-foreground font-mono">
                        {num.phoneNumber}
                      </span>
                      <span className="text-xs text-foreground-500 font-medium">
                        {num.lineName}
                      </span>
                      {badges.map((b) => (
                        <span
                          key={b.key}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${b.className}`}
                        >
                          {b.dot && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />}
                          {b.icon}
                          {b.label}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => (isEditing ? handleCancelEdit() : handleStartEdit(num))}
                        className="text-xs font-semibold text-foreground-600 hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {isEditing ? (
                          <>
                            <span>Done editing</span>
                            <FiChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Edit settings</span>
                            <FiChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteNumber?.(num.id)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer transition-colors"
                        title="Delete / Release Number"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {!hasForwarding && !isEditing && (
                    <div className="mt-1 mb-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-3.5 py-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                        <FiAlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>No forwarding number set — callers cannot be connected and no menu options are offered. Message-only mode is active.</span>
                      </div>
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => handleStartEdit(num)}
                        className="text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 h-7 px-3 rounded-lg"
                      >
                        Fix now
                      </Button>
                    </div>
                  )}
                  <div className="my-2 p-3 bg-foreground/5 dark:bg-default-50/50 rounded-xl flex flex-col md:flex-row items-stretch md:items-center gap-3">
                    {flowNodes.map((stepNode) => (
                      <div key={stepNode.id} className="contents">
                        {stepNode.node}
                        <div className="flex items-center justify-center text-foreground-400 shrink-0 py-0.5 md:py-0">
                          <span className="block md:hidden text-sm">&darr;</span>
                          <span className="hidden md:block text-sm">&rarr;</span>
                        </div>
                      </div>
                    ))}
                    {!isSeparate ? (
                      <div
                        onClick={() => !isEditing && handleStartEdit(num)}
                        className={`flex-1 rounded-xl p-3 border border-dashed flex items-center justify-between cursor-pointer transition-all ${currentData.forwardingNumber
                          ? "border-emerald-300 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300"
                          : "border-amber-400 bg-amber-50/30 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <FiAlertTriangle className={`w-4 h-4 shrink-0 ${currentData.forwardingNumber ? "text-emerald-600" : "text-amber-600"}`} />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">All calls</span>
                            <span className="text-xs opacity-90 font-mono">
                              {currentData.forwardingNumber || "No number set — click to add"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col gap-2 min-w-full md:min-w-[240px]">
                        {FORWARDING_TARGET_ROWS.map((row) => {
                          const val = row.getValue(currentData);
                          return (
                            <div key={row.key} className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-foreground-500 shrink-0">{row.press} &rarr;</span>
                              <div
                                onClick={() => !isEditing && handleStartEdit(num)}
                                className={`flex-1 rounded-xl p-2.5 border border-dashed flex items-center justify-between cursor-pointer transition-all ${val
                                  ? "border-emerald-300 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300"
                                  : "border-amber-400 bg-amber-50/30 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300"
                                  }`}
                              >
                                <div className="flex items-center gap-2">
                                  <FiAlertTriangle className={`w-3.5 h-3.5 shrink-0 ${val ? "text-emerald-600" : "text-amber-600"}`} />
                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold">{row.label}</span>
                                    <span className="text-[11px] opacity-90 font-mono">
                                      {val || "No number set — click to add"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {isEditing && draftState && (
                    <div className="mt-4 pt-4 border-t border-foreground/10 flex flex-col gap-5 bg-background">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="text-xs font-bold text-foreground block">
                            Separate lines for new vs existing patients
                          </span>
                          <span className="text-[11px] text-foreground-500">
                            Off = all calls forward to one number. On = new patients get routed separately from existing.
                          </span>
                        </div>
                        <Switch
                          size="sm"
                          isSelected={draftState.separateLines}
                          onValueChange={(val) =>
                            setDraftState({ ...draftState, separateLines: val })
                          }
                        />
                      </div>
                      {!draftState.separateLines ? (
                        <div className="flex flex-col gap-1.5 w-full">
                          <Input
                            label="Forward all calls to"
                            labelPlacement="outside"
                            placeholder="(303) 555-0100"
                            size="sm"
                            radius="sm"
                            variant="flat"
                            value={draftState.forwardingNumber}
                            onValueChange={(val) =>
                              setDraftState({ ...draftState, forwardingNumber: val })
                            }
                            className="w-full font-mono"
                          />
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                            Until a forwarding number is saved, callers cannot be connected and no menu options are offered. Their message is still recorded.
                          </span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {PATIENT_LINE_CONFIGS.map((lineConfig) => (
                            <div key={lineConfig.key} className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2 mb-1">
                                <lineConfig.Icon className={`w-3.5 h-3.5 ${lineConfig.iconColor}`} />
                                <span className="text-xs font-bold text-foreground">
                                  {lineConfig.label}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${lineConfig.badgeStyle}`}>
                                  {lineConfig.press}
                                </span>
                              </div>
                              <Input
                                size="sm"
                                radius="sm"
                                variant="flat"
                                placeholder={lineConfig.placeholder}
                                value={draftState[lineConfig.key]}
                                onValueChange={(val) =>
                                  setDraftState({ ...draftState, [lineConfig.key]: val })
                                }
                                className="font-mono"
                              />
                              <span className="text-[11px] text-foreground-400">
                                {lineConfig.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <FiGitCommit className="w-3.5 h-3.5 text-purple-500" />
                              IVR Greeting
                            </span>
                            {!hasForwarding && (
                              <span className="text-[11px] text-amber-600 dark:text-amber-400 block italic">
                                Applies once a forwarding number is set
                              </span>
                            )}
                          </div>
                          <Switch
                            size="sm"
                            isSelected={draftState.ivrGreetingOn}
                            onValueChange={(val) =>
                              setDraftState({ ...draftState, ivrGreetingOn: val })
                            }
                          />
                        </div>
                        {draftState.ivrGreetingOn && (
                          <Textarea
                            size="sm"
                            radius="sm"
                            variant="flat"
                            minRows={3}
                            value={draftState.ivrGreetingText || ""}
                            onValueChange={(val) =>
                              setDraftState({ ...draftState, ivrGreetingText: val })
                            }
                            placeholder="Thank you for calling. For new patients, press 1. For existing patients, press 2. For our address and hours, press 3."
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {TOGGLE_CONFIGS.map((tConfig) => (
                          <div
                            key={tConfig.key}
                            className="flex items-start justify-between gap-3 p-3 rounded-xl border border-foreground/10 bg-foreground/5"
                          >
                            <div>
                              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                <tConfig.Icon className={`w-3.5 h-3.5 ${tConfig.iconColor}`} />
                                {tConfig.label}
                              </span>
                              <span className="text-[11px] text-foreground-500 block mt-0.5">
                                {tConfig.description}
                              </span>
                            </div>
                            <Switch
                              size="sm"
                              isSelected={tConfig.getValue(draftState)}
                              onValueChange={(val) =>
                                setDraftState(tConfig.onChange(val, draftState))
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end items-center gap-2.5 pt-2 border-t border-foreground/10">
                        <Button
                          size="sm"
                          variant="bordered"
                          onPress={handleCancelEdit}
                          className="text-xs font-semibold rounded-xl border-foreground/20 hover:bg-foreground/5"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          color="primary"
                          onPress={handleSaveEdit}
                          startContent={<FiCheck className="w-3.5 h-3.5" />}
                          className="text-xs font-bold rounded-xl bg-primary text-white shadow-sm hover:opacity-90"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}