import { signal } from "@preact/signals-react";

import type { Center } from "@petzo/db";

export const selectedCenterPublicId = signal<string | undefined>(undefined);
export const userCenters = signal<Center[] | undefined>([]);
