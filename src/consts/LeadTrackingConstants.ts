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
        bg: "bg-sky-50 dark:bg-sky-900/20",
        headerText: "text-sky-700 dark:text-sky-400",
        iconColor: "text-sky-500 dark:text-sky-400",
        bubbleBg: "bg-sky-100/50 dark:bg-sky-800/30",
        border: "border-sky-100/50 dark:border-sky-800/20"
    },
    contacted: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        headerText: "text-blue-700 dark:text-blue-400",
        iconColor: "text-blue-500 dark:text-blue-400",
        bubbleBg: "bg-blue-100/50 dark:bg-blue-800/30",
        border: "border-blue-100/50 dark:border-blue-800/20"
    },
    scheduled: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        headerText: "text-purple-700 dark:text-purple-400",
        iconColor: "text-purple-500 dark:text-purple-400",
        bubbleBg: "bg-purple-100/50 dark:bg-purple-800/30",
        border: "border-purple-100/50 dark:border-purple-800/20"
    },
    "no-show": {
        bg: "bg-orange-50 dark:bg-orange-900/20",
        headerText: "text-orange-700 dark:text-orange-400",
        iconColor: "text-orange-500 dark:text-orange-400",
        bubbleBg: "bg-orange-100/50 dark:bg-orange-800/30",
        border: "border-orange-100/50 dark:border-orange-800/20"
    },
    won: {
        bg: "bg-green-50 dark:bg-green-900/20",
        headerText: "text-green-700 dark:text-green-400",
        iconColor: "text-green-500 dark:text-green-400",
        bubbleBg: "bg-green-100/50 dark:bg-green-800/30",
        border: "border-green-100/50 dark:border-green-800/20"
    },
    lost: {
        bg: "bg-slate-50 dark:bg-slate-900/20",
        headerText: "text-slate-700 dark:text-slate-400",
        iconColor: "text-slate-500 dark:text-slate-400",
        bubbleBg: "bg-slate-100/50 dark:bg-slate-800/30",
        border: "border-slate-100/50 dark:border-slate-800/20"
    }
};

export const STATUS_COLORS: Record<string, string> = {
    new: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 border-sky-100 dark:border-sky-800/30",
    contacted: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30",
    scheduled: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30",
    "no show": "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/30",
    won: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30",
    lost: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/20 border-gray-100 dark:border-gray-700/30"
};
