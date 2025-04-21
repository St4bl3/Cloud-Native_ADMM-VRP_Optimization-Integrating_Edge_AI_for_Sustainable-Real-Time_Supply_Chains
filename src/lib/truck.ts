import { supabase } from "@/lib/supabaseClient";

type Truck = {
  TruckID: number;
  Capacity: number;
  AC: boolean;
  CurrentWarehouseID: number;
  Status: "Available" | "In Transit" | "Maintenance";
  CurrentLoad: number;
  created_at: string;
};

export const fetchTrucks = async (): Promise<Truck[]> => {
  try {
    const { data, error } = await supabase
      .from<"trucks", Truck>("trucks")
      .select("*")
      .order("TruckID", { ascending: false });

    if (error) {
      throw new Error(`Error fetching trucks: ${error.message}`);
    }

    return data as Truck[] || [];
  } catch (err) {
    throw new Error(`Unexpected error: ${(err as Error).message}`);
  }
};