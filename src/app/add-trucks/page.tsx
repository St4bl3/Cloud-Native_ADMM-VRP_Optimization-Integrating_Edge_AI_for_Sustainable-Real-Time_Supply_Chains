import TruckForm from "@/components/TruckForm";
import TrucksTable from "@/components/TruckTable";

export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <TruckForm />
      <TrucksTable />
    </div>
  );
}
