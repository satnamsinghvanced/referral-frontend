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
  ivrGreetingText: string;
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
}

export const MOCK_PHONE_ROUTING_NUMBERS: PhoneRoutingSetting[] = [
  {
    id: "num-1",
    phoneNumber: "+1 (415) 555-1234",
    lineName: "Main Office Line",
    locationName: "Main Street Office",
    status: "Active",
    recordingOn: true,
    forwardingNumber: "(303) 555-0100",
    separateLines: false,
    forwardNewPatients: "(303) 555-0100",
    forwardExistingPatients: "(303) 555-0100",
    ivrGreetingOn: true,
    ivrGreetingText: "",
    recordCallsToggle: true,
    aiLeadAutoFillToggle: true,
    isEditing: false,
  },
  {
    id: "num-2",
    phoneNumber: "+1 (720) 555-9012",
    lineName: "North Campus Line",
    locationName: "North Campus Clinic",
    status: "Active",
    recordingOn: true,
    forwardingNumber: "",
    separateLines: false,
    forwardNewPatients: "",
    forwardExistingPatients: "",
    ivrGreetingOn: true,
    ivrGreetingText: "",
    recordCallsToggle: true,
    aiLeadAutoFillToggle: true,
    isEditing: false,
  },
  {
    id: "num-3",
    phoneNumber: "+1 (303) 555-3456",
    lineName: "Westside Office Line",
    locationName: "Westside Branch",
    status: "Active",
    recordingOn: true,
    forwardingNumber: "",
    separateLines: false,
    forwardNewPatients: "",
    forwardExistingPatients: "",
    ivrGreetingOn: true,
    ivrGreetingText: "",
    recordCallsToggle: true,
    aiLeadAutoFillToggle: true,
    isEditing: false,
  },
  {
    id: "num-4",
    phoneNumber: "+1 (720) 555-7890",
    lineName: "East Side Line",
    locationName: "East Side Center",
    status: "Active",
    recordingOn: true,
    forwardingNumber: "",
    separateLines: false,
    forwardNewPatients: "",
    forwardExistingPatients: "",
    ivrGreetingOn: true,
    ivrGreetingText: "",
    recordCallsToggle: true,
    aiLeadAutoFillToggle: true,
    isEditing: false,
  },
];

export const MOCK_RECORDED_CALLS: RecordedCall[] = [
  {
    id: "call-1",
    callerName: "Jennifer Walsh",
    patientType: "New Patient",
    isLeadSaved: true,
    leadId: "lead-101",
    timeAgo: "6d ago",
    duration: "3:07",
    phoneNumber: "+1 (415) 555-1234",
    transcript:
      ' "Hi, my name is Jennifer Walsh. I\'d like to schedule an appointment for a new patient exam. I have Delta Dental PPO insurance. I\'m hoping to come in sometime next week if possible." ',
    reasonForCall: "New patient exam",
    insurance: "Delta Dental PPO",
    requestedDate: "Next week",
    notes: "New patient exam request. Prefers morning appointments.",
  },
  {
    id: "call-2",
    callerName: "Marcus",
    patientType: "Existing Patient",
    isLeadSaved: false,
    timeAgo: "6d ago",
    duration: "1:35",
    phoneNumber: "+1 (720) 555-9012",
    transcript:
      ' "This is Marcus calling. I\'m an existing patient — I had a filling done about a month ago and I\'m having some sensitivity. I\'d like to come in and get it checked out." ',
    reasonForCall: "Post-treatment sensitivity",
    insurance: "Unknown",
    requestedDate: "Flexible",
    notes: "Filling sensitivity follow-up — 1 month post-op",
  },
  {
    id: "call-3",
    callerName: "Parent calling for daughter (age 9)",
    patientType: "New Patient",
    isLeadSaved: true,
    leadId: "lead-103",
    timeAgo: "7d ago",
    duration: "3:54",
    phoneNumber: "+1 (415) 555-1234",
    transcript:
      ' "I\'m calling for my daughter — she\'s 9 years old and hasn\'t been to the dentist in about two years. We have Cigna. Is Dr. Thompson taking new pediatric patients?" ',
    reasonForCall: "Pediatric new patient",
    insurance: "Cigna",
    requestedDate: "Flexible",
    notes: "Pediatric checkup and cleaning inquiry.",
  },
];
