"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";
import { fetchTruckRoutes, TruckPath } from "../api/trucktoutes";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface Warehouse {
  WarehouseID: number;
  X: number;
  Y: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [truckPaths, setTruckPaths] = useState<TruckPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState<number | null>(null);

  // Fetch warehouses data
  const fetchWarehouses = async () => {
    try {
      const { data, error } = await supabase.from("warehouses").select("*");
      if (error) {
        console.error("Error fetching warehouses:", error.message);
        return;
      }
      setWarehouses(data || []);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchWarehouses();
      const paths = await fetchTruckRoutes();
      setTruckPaths(paths);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mt-4 mb-4 text-center">
        Vehicle Routing Problem Visualization
      </h1>
      {loading ? (
        <p className="text-lg">Loading data...</p>
      ) : (
        <div className="flex w-full h-full">
          {/* Sidebar */}
          <div className="w-1/4 bg-white shadow-lg p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Truck Routes</h2>
            <button
              className={`w-full bg-blue-500 text-white py-2 rounded mb-2 ${
                selectedTruck === null ? "opacity-80" : ""
              }`}
              onClick={() => setSelectedTruck(null)}
            >
              Show All Routes
            </button>
            {truckPaths.map((truck) => (
              <button
                key={truck.truck_id}
                className={`w-full flex items-center justify-between py-2 px-4 rounded mb-2 transition-colors duration-200 ${
                  selectedTruck === truck.truck_id
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedTruck(truck.truck_id)}
              >
                <span>Truck {truck.truck_id}</span>
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: generateColor(truck.truck_id) }}
                ></span>
              </button>
            ))}
          </div>

          {/* Map Container */}
          <div className="w-3/4 h-[80vh]">
            <MapComponent
              warehouses={warehouses}
              truckPaths={truckPaths}
              selectedTruck={selectedTruck}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Generate consistent colors based on truck_id
const generateColor = (id: number): string => {
  const colors = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#f032e6",
    "#bcf60c",
    "#fabebe",
    "#008080",
    "#e6beff",
    "#9a6324",
    "#fffac8",
    "#800000",
    "#aaffc3",
    "#808000",
    "#ffd8b1",
    "#000075",
    "#808080",
  ];
  return colors[id % colors.length];
};
