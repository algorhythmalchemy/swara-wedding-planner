import { Sidebar } from "@/components/sidebar";
import { HydrationProvider } from "@/components/hydration-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HydrationProvider>
      <div className="min-h-screen">
        <Sidebar />
        <main className="lg:pl-64 pt-14 lg:pt-0">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </HydrationProvider>
  );
}
