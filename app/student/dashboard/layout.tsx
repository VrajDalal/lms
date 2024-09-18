import Sidebar from "./componets/sidebar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex md:flex-row flex-col min-h-screen bg-zinc-900 p-2 gap-2">
      {/* Sidebar (always visible on large screens) */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8 border border-studentBg rounded-md">
        {children}
      </main>
    </div>
  );
}
