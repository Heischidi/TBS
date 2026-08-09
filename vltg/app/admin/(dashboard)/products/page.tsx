import { AdminProductsClient } from "@/components/admin/AdminProductsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products | TBS Admin" };

export default function AdminProductsPage() {
  return <AdminProductsClient />;
}
