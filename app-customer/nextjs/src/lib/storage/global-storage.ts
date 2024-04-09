import { signal } from "@preact/signals-react";

export const filtersStore = {
  city: signal("bengaluru"),
  area: signal<string | undefined>(undefined),
  serviceType: signal<string | undefined>(undefined),
  search: signal<string | undefined>(undefined),
  rating: signal<number | undefined>(undefined),
};
