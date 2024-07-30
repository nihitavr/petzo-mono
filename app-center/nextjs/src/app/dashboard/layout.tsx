import DashboardSidebar from "../_components/dashboard-sidebar";

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <div className="grid-cols-12 gap-3 md:grid">
      <div className="sticky top-[4.5rem] col-span-3 hidden h-[80vh] rounded-lg border px-3 py-2 md:inline">
        <DashboardSidebar />
      </div>
      <div className="col-span-9 rounded-lg md:border md:px-5 md:py-2">
        {props.children}
      </div>
    </div>
  );
}
