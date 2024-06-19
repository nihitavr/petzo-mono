import { track } from "@vercel/analytics/server";

import CenterSearchList from "./_components/center-search-list";

export default async function Page() {
  await track("search-page");

  return (
    <div className="container-2 animate-slide-up">
      <CenterSearchList />
    </div>
  );
}
