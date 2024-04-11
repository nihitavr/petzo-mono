import GlobalSearchInput from "../_components/global-search-input";
import CenterSearchList from "./_components/center-search-list";

export default function Page() {
  return (
    <div>
      <div className="mt-3 md:mt-4 md:hidden">
        <GlobalSearchInput focusOnLoad={true} />
      </div>
      <CenterSearchList />
    </div>
  );
}
