"use client";

import React, { useState, useEffect } from "react";
import { fetchTrucks } from "@/lib/truck"; // Import the fetchTrucks function
import { Table } from "./ui/table";

type Truck = {
  TruckID: number;
  Capacity: number;
  AC: boolean;
  CurrentWarehouseID: number;
  Status: "Available" | "In Transit" | "Maintenance";
  CurrentLoad: number;
  created_at: string;
};

// Main component for displaying truck data
export default function TrucksTable() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrucks = async () => {
      try {
        const data = await fetchTrucks(); // Call the DAL function
        setTrucks(data);
      } catch {
        setError("Error loading trucks.");
      } finally {
        setLoading(false);
      }
    };

    loadTrucks();
  }, []); // Empty dependency array means this runs once when the component mounts

  if (loading) {
    return <div className="text-white">Loading Trucks...</div>;
  }

  if (error) {
    return <div className="text-white">{error}</div>;
  }

  // Render the trucks table
  return (
    <div className="flex justify-center items-center h-full p-16">
      <div className="w-full max-w-8xl overflow-x-auto bg-neutral-950 p-6 rounded-lg shadow-lg">
        <Table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="px-4 py-4 text-left">Truck ID</th>
              <th className="px-4 py-4 text-left">Capacity (kg)</th>
              <th className="px-4 py-4 text-left">AC</th>
              <th className="px-4 py-4 text-left">Current Warehouse ID</th>
              <th className="px-4 py-4 text-left">Status</th>
              {/* <th className="px-4 py-4 text-left">Current Load (kg)</th> */}
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck) => (
              <tr key={truck.TruckID} className="border-t border-neutral-700">
                <td className="px-4 py-2">{truck.TruckID}</td>
                <td className="px-4 py-2">{truck.Capacity}</td>
                <td className="px-4 py-2">{truck.AC ? "Yes" : "No"}</td>
                <td className="px-4 py-2">{truck.CurrentWarehouseID}</td>
                <td className="px-4 py-2">{truck.Status}</td>
                {/* <td className="px-4 py-2">{truck.CurrentLoad}</td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
