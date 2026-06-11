import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { SidebarProvider } from "@/components/layout/SidebarContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden relative">
        <AdminSidebar />
        <main className="md:ml-64 flex-1 flex flex-col min-h-screen max-w-full">
          <AdminTopbar />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
