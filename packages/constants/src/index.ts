export const WHATSAPP_URL = "https://wa.me";

export const INDIA_COUNTRY_CODE = "+91";

export const DISTANCE_MULTIPLIER = 1.6;

export type DAYS_TYPE = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export const DAYS_CONFIG = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

// Pet Gender
export const PET_GENDER = ["male", "female"] as const;
export const PET_GENDER_CONFIG = {
  male: "Male",
  female: "Female",
};

export type CENTER_CTA_BUTTONS_TYPE = "call" | "whatsapp";
export const CENTER_CTA_BUTTONS = ["call", "whatsapp"] as const;
export const CENTER_CTA_BUTTONS_CONFIG = {
  call: { name: "Call Button" },
  whatsapp: { name: "Whatsapp Button" },
};

export type CENTER_FEATURES_TYPE =
  | "store"
  | "pharmacy"
  | "cafe"
  | "petCafe"
  | "playArea"
  | "availablePets";
export const CENTER_FEATURES = [
  "store",
  "pharmacy",
  "cafe",
  "petCafe",
  "playArea",
  "availablePets",
] as const;
export const CENTER_FEATURES_CONFIG = {
  store: { name: "Pet Store", icon: "/icons/pet-store-icon.svg" },
  pharmacy: { name: "Pharmacy", icon: "/icons/pet-pharmacy-icon.svg" },
  cafe: { name: "Cafe", icon: "/icons/cafe-icon.svg" },
  petCafe: { name: "Pet Cafe", icon: "/icons/pet-cafe-icon.svg" },
  playArea: { name: "Play Area", icon: "/icons/pet-play-area-icon.svg" },
  availablePets: {
    name: "Available Pets",
    icon: "/icons/pet-available-icon.svg",
  },
};

export const CENTER_STATUS = [
  "created",
  "verification_started",
  "verified",
  "verification_rejected",
] as const;

export const CENTER_STATUS_CONFIG = {
  created: {
    name: "Not Verified",
    bgColor: "#CA8A04",
    textColor: "#ffffff",
    id: "created",
  },
  verification_started: {
    name: "Verification Started",
    bgColor: "#2563EB",
    textColor: "#ffffff",
    id: "verification_started",
  },
  verified: {
    name: "Verified",
    bgColor: "#00A34A",
    textColor: "#ffffff",
    id: "verified",
  },
  verification_rejected: {
    name: "Verification Rejected",
    bgColor: "#EF4444",
    textColor: "#ffffff",
    id: "verification_rejected",
  },
};

// Booking Status
export const BOOKING_STATUS = [
  "booked",
  "confirmed",
  "ongoing",
  "completed",
  "customer_cancelled",
  "center_cancelled",
] as const;
export const BOOKING_STATUS_CONFIG = {
  booked: { name: "Booked", textColor: "#CA8A04", id: "booked" },
  confirmed: { name: "Confirmed", textColor: "#2563EB", id: "confirmed" },
  ongoing: { name: "Active", textColor: "#ac25eb", id: "ongoing" },
  completed: { name: "Completed", textColor: "#00A34A", id: "completed" },
  customer_cancelled: {
    name: "Cancelled",
    textColor: "#EF4444",
    id: "customer_cancelled",
  },
  center_cancelled: {
    name: "Cancelled",
    textColor: "#EF4444",
    id: "center_cancelled",
  },
};

// Pet Type
export type PET_TYPE = "cat" | "small_dog" | "big_dog";
export const PET_TYPE_VALUES = ["cat", "small_dog", "big_dog"] as const;
export const PET_TYPE_CONFIG = {
  cat: { name: "Cat", type: "cat", category: "Cat" },
  small_dog: { name: "Small Dog", type: "dog", category: "Dog" },
  big_dog: { name: "Big Dog", type: "dog", category: "Dog" },
};

export const SLOT_DURATION_IN_MINS = 30;

export const SERVICE_TYPE_VALUES = [
  "veterinary",
  "grooming",
  "boarding",
  "home_grooming",
  "mobile_grooming",
] as const;

export type SERVICE_TYPE =
  | "mobile_grooming"
  | "home_grooming"
  | "grooming"
  | "veterinary"
  | "boarding";

export const SERVICES_CONFIG: Record<
  string,
  { name: string; publicId: string; icon?: string; travelTimeInMins?: number }
> = {
  mobile_grooming: {
    name: "Mobile Grooming",
    publicId: "mobile_grooming",
    icon: "/icons/mobile-grooming-icon.svg",
    travelTimeInMins: 30,
  },
  home_grooming: {
    name: "Home Grooming",
    publicId: "home_grooming",
    icon: "/icons/home-grooming-icon.svg",
    travelTimeInMins: 30,
  },
  grooming: {
    name: "In-store Grooming",
    publicId: "grooming",
    icon: "/icons/pet-grooming-icon.svg",
  },
  veterinary: {
    name: "Vet Consultation",
    publicId: "veterinary",
    icon: "/icons/vet-consultation-icon.svg",
  },
  boarding: {
    name: "Pet Boarding",
    publicId: "boarding",
    icon: "/icons/pet-boarding-icon.svg",
  },
};

export const REGEX = {
  username: /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
  slug: /^[A-Za-z0-9-_]+$/,
  hexCode: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
  youtubeURL: /^https:\/\/www.youtube.com\/|^https:\/\/youtube.com\/|^$/,
  twitterURL: /^https:\/\/www.twitter.com\/|^https:\/\/twitter.com\/|^$/,
  instagramURL: /^https:\/\/www.instagram.com\/|^https:\/\/instagram.com\/|^$/,
  instagramUsername: /^[A-Za-z0-9._]{1,30}$/,
  facebookURL: /^https:\/\/www.facebook.com\/|^https:\/\/facebook.com\/|^$/,
  githubURL: /^https:\/\/www.github.com\/|^https:\/\/github.com\/|^$/,
  emptyString: /^$/,

  // Time: HH:MM in 24-hour format
  time24Hour: /^([01][0-9]|2[0-3]):[0-5][0-9]:00$/,
  mobileNumber: /^[56789]\d{9}$/,
};

export const PET_BEHAVIOUR_TAGS: Record<
  string,
  { label: string; badgeClassname: string; value: string }
> = {
  vaccinated: {
    value: "vaccinated",
    label: "Vaccinated",
    badgeClassname: "bg-green-100 text-green-800",
  },
  neat: {
    value: "neat",
    label: "Neat",
    badgeClassname: "bg-green-100 text-green-800",
  },
  friendly: {
    value: "friendly",
    label: "Friendly",
    badgeClassname: "bg-blue-100 text-blue-800",
  },
  cute: {
    value: "cute",
    label: "Cute",
    badgeClassname: "bg-yellow-100 text-yellow-800",
  },
  calm: {
    value: "calm",
    label: "Calm",
    badgeClassname: "bg-purple-100 text-purple-800",
  },
  playful: {
    value: "playful",
    label: "Playful",
    badgeClassname: "bg-pink-100 text-pink-800",
  },
  active: {
    value: "active",
    label: "Active",
    badgeClassname: "bg-red-100 text-red-800",
  },
  loyal: {
    value: "loyal",
    label: "Loyal",
    badgeClassname: "bg-gray-100 text-gray-800",
  },
  protective: {
    value: "protective",
    label: "Protective",
    badgeClassname: "bg-black text-white",
  },
  smart: {
    value: "smart",
    label: "Smart",
    badgeClassname: "bg-blue-100 text-blue-800",
  },
  independent: {
    value: "independent",
    label: "Independent",
    badgeClassname: "bg-green-100 text-green-800",
  },
  quiet: {
    value: "quiet",
    label: "Quiet",
    badgeClassname: "bg-gray-100 text-gray-800",
  },
  loud: {
    value: "loud",
    label: "Loud",
    badgeClassname: "bg-yellow-100 text-yellow-800",
  },
  energetic: {
    value: "energetic",
    label: "Energetic",
    badgeClassname: "bg-red-100 text-red-800",
  },
  lazy: {
    value: "lazy",
    label: "Lazy",
    badgeClassname: "bg-purple-100 text-purple-800",
  },
  aggressive: {
    value: "aggressive",
    label: "Aggressive",
    badgeClassname: "bg-black text-white",
  },
  shy: {
    value: "shy",
    label: "Shy",
    badgeClassname: "bg-blue-100 text-blue-800",
  },
  fearful: {
    value: "fearful",
    label: "Fearful",
    badgeClassname: "bg-yellow-100 text-yellow-800",
  },
  anxious: {
    value: "anxious",
    label: "Anxious",
    badgeClassname: "bg-red-100 text-red-800",
  },
  affectionate: {
    value: "affectionate",
    label: "Affectionate",
    badgeClassname: "bg-pink-100 text-pink-800",
  },
  curious: {
    value: "curious",
    label: "Curious",
    badgeClassname: "bg-green-100 text-green-800",
  },
  stubborn: {
    value: "stubborn",
    label: "Stubborn",
    badgeClassname: "bg-gray-100 text-gray-800",
  },
  obedient: {
    value: "obedient",
    label: "Obedient",
    badgeClassname: "bg-blue-100 text-blue-800",
  },
  mischievous: {
    value: "mischievous",
    label: "Mischievous",
    badgeClassname: "bg-yellow-100 text-yellow-800",
  },
  destructive: {
    value: "destructive",
    label: "Destructive",
    badgeClassname: "bg-red-100 text-red-800",
  },
  intelligent: {
    value: "intelligent",
    label: "Intelligent",
    badgeClassname: "bg-purple-100 text-purple-800",
  },
  loving: {
    value: "loving",
    label: "Loving",
    badgeClassname: "bg-pink-100 text-pink-800",
  },
  cuddly: {
    value: "cuddly",
    label: "Cuddly",
    badgeClassname: "bg-green-100 text-green-800",
  },
  adventurous: {
    value: "adventurous",
    label: "Adventurous",
    badgeClassname: "bg-yellow-100 text-yellow-800",
  },
  bold: {
    value: "bold",
    label: "Bold",
    badgeClassname: "bg-black text-white",
  },
  sensitive: {
    value: "sensitive",
    label: "Sensitive",
    badgeClassname: "bg-red-100 text-red-800",
  },
  clever: {
    value: "clever",
    label: "Clever",
    badgeClassname: "bg-purple-100 text-purple-800",
  },
  brave: {
    value: "brave",
    label: "Brave",
    badgeClassname: "bg-red-100 text-red-800",
  },
  good_with_kids: {
    value: "good_with_kids",
    label: "Good with kids",
    badgeClassname: "bg-blue-100 text-blue-800",
  },
  bad_with_other_pets: {
    value: "bad_with_other_pets",
    label: "Bad with other pets",
    badgeClassname: "bg-red-100 text-red-800",
  },
  bad_with_kids: {
    value: "bad_with_kids",
    label: "Bad with kids",
    badgeClassname: "bg-red-100 text-red-800",
  },
  good_with_other_pets: {
    value: "good_with_other_pets",
    label: "Good with other pets",
    badgeClassname: "bg-blue-100 text-blue-800",
  },
  good_with_other_dogs: {
    value: "good_with_other_dogs",
    label: "Good with other dogs",
    badgeClassname: "bg-blue-100 text-blue-800",
  },
  bad_with_other_dogs: {
    value: "bad_with_other_dogs",
    label: "Bad with other dogs",
    badgeClassname: "bg-red-100 text-red-800",
  },
};
