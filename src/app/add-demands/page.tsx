import dynamic from "next/dynamic";

const OrderForm = dynamic(() => import("@/components/OrderForm"), {
  ssr: false,
});
const OrderTable = dynamic(() => import("@/components/OrderTable"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <OrderForm />
      <OrderTable />
    </div>
  );
}
