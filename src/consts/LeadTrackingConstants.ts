export const LEAD_SOURCE = {
    website: "Website",
    googleAds: "Google Ads",
    facebookAds: "Facebook Ads",
    instagram: "Instagram",
    referral: "Referral",
    walkIn: "Walk-in",
    directMail: "Direct Mail"
};

export const LEAD_PRIORITY = {
    high: "High",
    medium: "Medium",
    low: "Low"
};

export const LEAD_TREATMENTS = {
    invisalign: "Invisalign",
    invisalignTeen: "Invisalign Teen",
    traditionalBraces: "Traditional Braces",
    clearBraces: "Clear Braces",
    lingualBraces: "Lingual Braces",
    surgicalOrthodontics: "Surgical Orthodontics",
    tmjTreatment: "TMJ Treatment",
    jawSurgeryConsultation: "Jaw Surgery Consultation",
    teethWhitening: "Teeth Whitening",
    veneers: "Veneers",
    earlyIntervention: "Early Intervention",
    retainers: "Retainers",
    emergencyOrthodontics: "Emergency Orthodontics"
};

export const LEAD_STATUS = {
    newLead: { id: 'new', name: 'New Lead' },
    contacted: { id: 'contacted', name: 'Contacted' },
    appointmentScheduled: { id: 'scheduled', name: 'Appointment Scheduled' },
    noShow: { id: 'no-show', name: 'No Show' },
    patientWon: { id: 'won', name: 'Patient Won' },
    lost: { id: 'lost', name: 'Patient Lost' },
};

export const STAGE_STYLES: Record<string, any> = {
    new: {
        bg: "bg-sky-50",
        headerText: "text-sky-700",
        iconColor: "text-sky-500",
        bubbleBg: "bg-sky-100/50",
        border: "border-sky-100/50"
    },
    contacted: {
        bg: "bg-blue-50",
        headerText: "text-blue-700",
        iconColor: "text-blue-500",
        bubbleBg: "bg-blue-100/50",
        border: "border-blue-100/50"
    },
    scheduled: {
        bg: "bg-purple-50",
        headerText: "text-purple-700",
        iconColor: "text-purple-500",
        bubbleBg: "bg-purple-100/50",
        border: "border-purple-100/50"
    },
    "no-show": {
        bg: "bg-orange-50",
        headerText: "text-orange-700",
        iconColor: "text-orange-500",
        bubbleBg: "bg-orange-100/50",
        border: "border-orange-100/50"
    },
    won: {
        bg: "bg-green-50",
        headerText: "text-green-700",
        iconColor: "text-green-500",
        bubbleBg: "bg-green-100/50",
        border: "border-green-100/50"
    },
    lost: {
        bg: "bg-slate-50",
        headerText: "text-slate-700",
        iconColor: "text-slate-500",
        bubbleBg: "bg-slate-100/50",
        border: "border-slate-100/50"
    }
};

export const STATUS_COLORS: Record<string, string> = {
    new: "text-sky-600 bg-sky-50 border-sky-100",
    contacted: "text-blue-600 bg-blue-50 border-blue-100",
    scheduled: "text-purple-600 bg-purple-50 border-purple-100",
    "no show": "text-orange-600 bg-orange-50 border-orange-100",
    won: "text-green-600 bg-green-50 border-green-100",
    lost: "text-gray-600 bg-gray-50 border-gray-100"
};
