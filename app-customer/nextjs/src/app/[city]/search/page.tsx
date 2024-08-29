import { RecordEvent } from "~/web-analytics/react";
import CenterSearchList from "./_components/center-search-list";
export 
export default async function Page() {
  return (
    <>
      <RecordEvent name="screenview_search_page" />
      <div className="container-2 animate-slide-up">
        <CenterSearchList />
      </div>
    </>
  );
}
