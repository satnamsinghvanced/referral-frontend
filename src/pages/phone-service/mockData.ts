export interface PhoneRoutingSetting {
  id: string;
  phoneNumber: string;
  lineName: string;
  locationName: string;
  status: "Active" | "Inactive";
  recordingOn: boolean;
  forwardingNumber: string;
  separateLines: boolean;
  forwardNewPatients: string;
  forwardExistingPatients: string;
  ivrGreetingOn: boolean;
  greetingMode?: "auto" | "custom";
  ivrGreetingText: string;
  ivrOptions?: Array<{
    digit: number;
    label: string;
    actionType: "play_message" | "forward_to_number";
    forwardTo?: string;
    message?: string;
  }>;
  recordCallsToggle: boolean;
  aiLeadAutoFillToggle: boolean;
  isEditing?: boolean;
}

export interface RecordedCall {
  id: string;
  callerName: string;
  patientType: "New Patient" | "Existing Patient";
  isLeadSaved: boolean;
  leadId?: string;
  timeAgo: string;
  duration: string;
  phoneNumber: string;
  transcript: string;
  reasonForCall: string;
  insurance?: string;
  requestedDate?: string;
  notes?: string;
  needsReview?: boolean;
  callSid?: string;
}

export const MOCK_PHONE_ROUTING_NUMBERS: PhoneRoutingSetting[] = [];

export const MOCK_RECORDED_CALLS: RecordedCall[] = [];
