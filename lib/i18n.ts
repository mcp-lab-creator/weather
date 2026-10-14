// Pure translation data – safe to import from client and server components.

export type Lang = "hi" | "en";
export const LANG_COOKIE = "lang";

export const CATEGORIES = [
  "water",
  "roads",
  "drainage",
  "street_lights",
  "electricity",
  "sanitation",
  "ration",
  "pension",
  "other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const STATUSES = ["submitted", "in_progress", "resolved"] as const;
export type Status = (typeof STATUSES)[number];

export const CATEGORY_ICONS: Record<Category, string> = {
  water: "💧",
  roads: "🛣️",
  drainage: "🚰",
  street_lights: "💡",
  electricity: "⚡",
  sanitation: "🧹",
  ration: "🌾",
  pension: "👵",
  other: "📋",
};

export const STATUS_ICONS: Record<Status, string> = {
  submitted: "📨",
  in_progress: "🔧",
  resolved: "✅",
};

const hi = {
  appName: "स्मार्ट पचेरी",
  gp: "ग्राम पंचायत पचेरी, झुंझुनूं, राजस्थान",
  switchLang: "English",
  home: "होम",
  intro:
    "अपनी शिकायत मोबाइल से दर्ज करें, उसकी स्थिति देखें, और सरकारी योजनाओं व पंचायत की सूचनाओं की जानकारी पाएं।",
  trial: "यह एक ट्रायल (परीक्षण) है – आपकी राय हमारे लिए जरूरी है।",
  btnComplaint: "शिकायत दर्ज करें",
  btnStatus: "स्थिति देखें",
  btnSchemes: "सरकारी योजनाएं",
  btnNotices: "सूचनाएं",

  // complaint form
  complaintTitle: "शिकायत दर्ज करें",
  name: "आपका नाम",
  namePh: "अपना नाम लिखें",
  mobile: "मोबाइल नंबर",
  mobilePh: "10 अंकों का नंबर",
  ward: "वार्ड नंबर",
  wardN: "वार्ड",
  category: "शिकायत किस बारे में है?",
  description: "शिकायत बताएं",
  descriptionPh: "क्या समस्या है और कहां है, थोड़ा लिखें",
  photo: "फोटो (जरूरी नहीं)",
  photoBtn: "फोटो खींचें / चुनें",
  photoChosen: "फोटो चुनी गई",
  submit: "शिकायत भेजें",
  sending: "भेज रहे हैं…",
  errMobile: "10 अंकों का सही मोबाइल नंबर डालें",
  errPhoto: "फोटो बहुत बड़ी है, कृपया छोटी फोटो चुनें",
  errGeneric: "कुछ गड़बड़ हुई, कृपया दोबारा कोशिश करें",
  done: "आपकी शिकायत दर्ज हो गई",
  yourId: "आपकी ट्रैकिंग आईडी",
  saveId: "इसे लिख लें या स्क्रीनशॉट ले लें। इसी से आप शिकायत की स्थिति देख सकेंगे।",
  copy: "कॉपी करें",
  copied: "कॉपी हो गया ✓",
  checkThis: "इस शिकायत की स्थिति देखें",
  another: "नई शिकायत दर्ज करें",

  // status
  statusTitle: "शिकायत की स्थिति",
  statusHelp: "ट्रैकिंग आईडी (जैसे PCH-0001) या मोबाइल नंबर डालें",
  statusPh: "PCH-0001 या मोबाइल नंबर",
  search: "खोजें",
  notFound: "कोई शिकायत नहीं मिली। नंबर / आईडी दोबारा जांचें।",
  invalidQuery: "सही ट्रैकिंग आईडी (जैसे PCH-0001) या 10 अंकों का मोबाइल नंबर डालें",
  remarks: "पंचायत की टिप्पणी",
  noRemarks: "अभी कोई टिप्पणी नहीं",
  submittedOn: "दर्ज की गई",
  statusLabels: {
    submitted: "दर्ज की गई",
    in_progress: "प्रक्रिया में",
    resolved: "हल हो गई",
  } as Record<Status, string>,

  // schemes
  schemesTitle: "सरकारी योजनाएं",
  benefit: "लाभ",
  eligibility: "पात्रता (कौन ले सकता है)",
  documents: "जरूरी दस्तावेज",
  noSchemes: "अभी कोई योजना नहीं जोड़ी गई है।",
  schemeNote: "आवेदन के लिए ग्राम पंचायत / ई-मित्र केंद्र पर संपर्क करें।",

  // notices
  noticesTitle: "पंचायत सूचनाएं",
  noNotices: "अभी कोई सूचना नहीं है।",
  typeLabels: {
    notice: "सूचना",
    gram_sabha: "ग्राम सभा बैठक",
  } as Record<"notice" | "gram_sabha", string>,

  categoryLabels: {
    water: "पानी",
    roads: "सड़क",
    drainage: "नाली / सीवर",
    street_lights: "स्ट्रीट लाइट",
    electricity: "बिजली",
    sanitation: "सफाई",
    ration: "राशन",
    pension: "पेंशन",
    other: "अन्य",
  } as Record<Category, string>,

  whatsapp: "व्हाट्सऐप पर पूछें",
  whatsappText: "नमस्ते, मुझे स्मार्ट पचेरी के बारे में पूछना है।",
  errorTitle: "कुछ गड़बड़ हुई",
  errorBody: "कृपया थोड़ी देर बाद दोबारा कोशिश करें।",
  retry: "दोबारा कोशिश करें",
};

type Dict = typeof hi;

const en: Dict = {
  appName: "Smart Pacheri",
  gp: "Pacheri Gram Panchayat, Jhunjhunu, Rajasthan",
  switchLang: "हिन्दी",
  home: "Home",
  intro:
    "Raise your complaint from your phone, track its status, and see government schemes and Panchayat notices.",
  trial: "This is a trial – your feedback matters to us.",
  btnComplaint: "Raise Complaint",
  btnStatus: "Check Status",
  btnSchemes: "Government Schemes",
  btnNotices: "Notices",

  complaintTitle: "Raise a Complaint",
  name: "Your name",
  namePh: "Write your name",
  mobile: "Mobile number",
  mobilePh: "10-digit number",
  ward: "Ward number",
  wardN: "Ward",
  category: "What is the complaint about?",
  description: "Describe the problem",
  descriptionPh: "What is the problem and where? Write a little",
  photo: "Photo (optional)",
  photoBtn: "Take / choose photo",
  photoChosen: "Photo selected",
  submit: "Submit Complaint",
  sending: "Sending…",
  errMobile: "Enter a valid 10-digit mobile number",
  errPhoto: "Photo is too large, please choose a smaller one",
  errGeneric: "Something went wrong, please try again",
  done: "Your complaint has been registered",
  yourId: "Your tracking ID",
  saveId: "Write it down or take a screenshot. You will need it to check the status.",
  copy: "Copy",
  copied: "Copied ✓",
  checkThis: "Check status of this complaint",
  another: "Raise another complaint",

  statusTitle: "Complaint Status",
  statusHelp: "Enter tracking ID (e.g. PCH-0001) or mobile number",
  statusPh: "PCH-0001 or mobile number",
  search: "Search",
  notFound: "No complaint found. Please check the ID / number.",
  invalidQuery: "Enter a valid tracking ID (e.g. PCH-0001) or a 10-digit mobile number",
  remarks: "Panchayat remarks",
  noRemarks: "No remarks yet",
  submittedOn: "Submitted",
  statusLabels: {
    submitted: "Submitted",
    in_progress: "In Progress",
    resolved: "Resolved",
  },

  schemesTitle: "Government Schemes",
  benefit: "Benefit",
  eligibility: "Who is eligible",
  documents: "Documents needed",
  noSchemes: "No schemes added yet.",
  schemeNote: "To apply, contact the Gram Panchayat / e-Mitra centre.",

  noticesTitle: "Panchayat Notices",
  noNotices: "No notices yet.",
  typeLabels: {
    notice: "Notice",
    gram_sabha: "Gram Sabha Meeting",
  },

  categoryLabels: {
    water: "Water",
    roads: "Roads",
    drainage: "Drainage",
    street_lights: "Street Lights",
    electricity: "Electricity",
    sanitation: "Sanitation",
    ration: "Ration",
    pension: "Pension",
    other: "Other",
  },

  whatsapp: "Ask on WhatsApp",
  whatsappText: "Hello, I have a question about Smart Pacheri.",
  errorTitle: "Something went wrong",
  errorBody: "Please try again in a little while.",
  retry: "Try again",
};

export const dict: Record<Lang, Dict> = { hi, en };
export type Dictionary = Dict;

/** Pick the English text if the language is English and it exists, else Hindi. */
export function pick(lang: Lang, hiText: string, enText?: string | null): string {
  return lang === "en" && enText && enText.trim() ? enText : hiText;
}

/** "3 Oct 2026" / "3 अक्टू 2026" style date. */
export function formatDate(lang: Lang, iso: string): string {
  return new Date(iso).toLocaleDateString(lang === "en" ? "en-IN" : "hi-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}
