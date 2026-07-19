import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders | TBS Admin" };
export default function AdminOrdersPage() { return <AdminOrdersClient />; }
