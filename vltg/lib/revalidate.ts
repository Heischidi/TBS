import { revalidatePath } from "next/cache";

/**
 * Invalidates Next.js cached storefront pages after a catalog mutation
 * (create, update, or delete) so changes appear immediately.
 */
export function revalidateStorefront() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/new-arrivals");
  revalidatePath("/best-sellers");
  revalidatePath("/collections");
}

