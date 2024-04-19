import { SERVICES_OFFERED } from "@petzo/constants";

export const DEFAULT_MAX_PET_PROFILE_IMAGES = 1;

export const CENTERS_LIST_PAGE_LIMIT = 20;

export const COLOR_MAP: Record<string, { textColor: string; bgColor: string }> =
  {
    a: { textColor: "text-[#000000]", bgColor: "bg-[#264653]" },
    b: { textColor: "text-[#000000]", bgColor: "bg-[#e9c46a]" },
    c: { textColor: "text-[#ffffff]", bgColor: "bg-[#2a9d8f]" },
    d: { textColor: "text-[#ffffff]", bgColor: "bg-[#f4a261]" },
    e: { textColor: "text-[#000000]", bgColor: "bg-[#e76f51]" },
    f: { textColor: "text-[#ffffff]", bgColor: "bg-[#d62828]" },
    g: { textColor: "text-[#000000]", bgColor: "bg-[#6a040f]" },
    h: { textColor: "text-[#ffffff]", bgColor: "bg-[#370617]" },
    i: { textColor: "text-[#000000]", bgColor: "bg-[#9d0208]" },
    j: { textColor: "text-[#ffffff]", bgColor: "bg-[#dc2f02]" },
    k: { textColor: "text-[#000000]", bgColor: "bg-[#f48c06]" },
    l: { textColor: "text-[#ffffff]", bgColor: "bg-[#faa307]" },
    m: { textColor: "text-[#000000]", bgColor: "bg-[#ffba08]" },
    n: { textColor: "text-[#ffffff]", bgColor: "bg-[#03071e]" },
    o: { textColor: "text-[#000000]", bgColor: "bg-[#f72585]" },
    p: { textColor: "text-[#ffffff]", bgColor: "bg-[#b5179e]" },
    q: { textColor: "text-[#000000]", bgColor: "bg-[#7209b7]" },
    r: { textColor: "text-[#ffffff]", bgColor: "bg-[#560bad]" },
    s: { textColor: "text-[#000000]", bgColor: "bg-[#480ca8]" },
    t: { textColor: "text-[#ffffff]", bgColor: "bg-[#3a0ca3]" },
    u: { textColor: "text-[#000000]", bgColor: "bg-[#3f37c9]" },
    v: { textColor: "text-[#ffffff]", bgColor: "bg-[#4361ee]" },
    w: { textColor: "text-[#000000]", bgColor: "bg-[#4895ef]" },
    x: { textColor: "text-[#ffffff]", bgColor: "bg-[#4cc9f0]" },
    y: { textColor: "text-[#000000]", bgColor: "bg-[#00bcd4]" },
    z: { textColor: "text-[#ffffff]", bgColor: "bg-[#009688]" },
  };

export const DEFAULT_CENTER_FILTERS: {
  publicId: string;
  label: string;
  type: string;
  items: { publicId: string; label: string; selected: boolean }[];
}[] = [
  {
    publicId: "serviceType",
    label: "Service Type",
    type: "multi-select",
    items: Object.values(SERVICES_OFFERED).map((service) => ({
      publicId: service.publicId,
      label: service.name,
      selected: false,
    })),
  },
  {
    publicId: "ratingGte",
    label: "Rating",
    type: "single-select",
    items: [
      {
        publicId: "4",
        label: ">= 4",
        selected: false,
      },
    ],
  },
  {
    publicId: "area",
    label: "Area",
    type: "multi-select",
    shouldFetchData: true,
    items: [],
  },
];
