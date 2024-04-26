export const SERVICES_OFFERED: Record<
  string,
  { name: string; publicId: string }
> = {
  veterinary: {
    name: "Veterinary",
    publicId: "veterinary",
  },
  grooming: {
    name: "Pet Grooming",
    publicId: "grooming",
  },
  home_grooming: {
    name: "Home Grooming",
    publicId: "home_grooming",
  },
  boarding: {
    name: "Pet Boarding",
    publicId: "boarding",
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
};
