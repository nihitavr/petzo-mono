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

// Booking Status
export const BOOKING_STATUS = [
  "booked",
  "confirmed",
  "center_cancelled",
  "customer_cancelled",
  "completed",
  "ongoing",
] as const;
export const BOOKING_STATUS_CONFIG = {
  booked: { name: "Booked", textColor: "#CA8A04" },
  ongoing: { name: "Active", textColor: "#ac25eb" },
  confirmed: { name: "Confirmed", textColor: "#2563EB" },
  completed: { name: "Completed", textColor: "#00A34A" },
  cancelled: { name: "Cancelled", textColor: "#EF4444" },
};

// Pet Type
export const PET_TYPE = ["cat", "small_dog", "big_dog"] as const;
export const PET_TYPE_CONFIG = {
  cat: "Cat",
  small_dog: "Small Dog",
  big_dog: "Big Dog",
};

export const SLOT_DURATION_IN_MINS = 30;

export const SERVICES_CONFIG: Record<
  string,
  { name: string; publicId: string; icon?: string; travelTimeInMins?: number }
> = {
  home_grooming: {
    name: "Home Grooming",
    publicId: "home_grooming",
    icon: "/icons/home-grooming-icon.svg",
    travelTimeInMins: 30,
  },
  grooming: {
    name: "Pet Grooming",
    publicId: "grooming",
    icon: "/icons/pet-grooming-icon.svg",
  },
  veterinary: {
    name: "Veterinary",
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
