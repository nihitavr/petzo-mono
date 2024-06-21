import { RecordEvent } from "~/app/_components/record-event";
import CenterSearchList from "./_components/center-search-list";

export default async function Page() {
  return (
    <>
      <RecordEvent name="search-page" />
      <div className="container-2 animate-slide-up">
        <CenterSearchList />
      </div>
    </>
  );
}
