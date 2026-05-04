export default function DashboardLoading() {
  return (
    <div className="flex w-full animate-pulse flex-col gap-8">
      <div className="h-10 w-2/3 max-w-md rounded-lg bg-slate-200" />
      <div className="h-4 w-full max-w-xl rounded bg-slate-200" />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-48 rounded-2xl bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
        <div className="h-96 rounded-2xl bg-slate-200" />
      </div>
    </div>
  );
}
