import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex flex-col h-screen bg-surface-1 overflow-hidden">
      {/* Full-width header (announcement bar + main header) */}
      <AdminHeader user={session.user as any} />
      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar user={session.user as any} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
