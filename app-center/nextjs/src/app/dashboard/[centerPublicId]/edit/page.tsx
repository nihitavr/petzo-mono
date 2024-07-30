export default async function Page() {
  // You can await this here if you don't want to show Suspense fallback below

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Manage Center</h1>
      </div>
    </div>
  );
}
