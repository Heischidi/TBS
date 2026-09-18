import dynamic from "next/dynamic";

// react-paystack accesses `window` at module evaluation time,
// so we must never let it run on the server.
const CheckoutClient = dynamic(() => import("./CheckoutClient"), {
  ssr: false,
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
