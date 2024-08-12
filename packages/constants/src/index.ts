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
export const PET_TYPE = ["cat", "small_dog", "big_dog"] as const;
export const PET_TYPE_CONFIG = {
  cat: "Cat",
  small_dog: "Small Dog",
  big_dog: "Big Dog",
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
  { name: string; publicId: string; icon?: string; travelTimeInMins?: number;  }
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
  // boarding: {
  //   name: "Pet Boarding",
  //   publicId: "boarding",
  //   icon: "/icons/pet-boarding-icon.svg",
  // },
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
