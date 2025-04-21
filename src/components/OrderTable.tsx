// app/demands/components/DemandsTable.tsx
"use client";

import React, { Suspense } from "react";
import useSWR from "swr";
import { supabase } from "@/lib/supabaseClient";
import { Table } from "./ui/table";
// Replace with actual component imports if different

type Demand = {
  DemandID: number;
  SourceID: number;
  DestinationID: number;
  Quantity: number;
  Priority: "High" | "Medium" | "Low";
  ACRequired: boolean;
  created_at: string;
};

const fetcher = async (): Promise<Demand[]> => {
  const { data, error } = await supabase
    .from("demands")
    .select("*")
    .order("DemandID", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const DemandsTableContent: React.FC = () => {
  const { data: demands } = useSWR<Demand[]>("demands", fetcher, {
    suspense: true,
  });

  return (
    <div className="flex justify-center items-center h-full p-16">
      <Table className="min-w-full bg-neutral-950">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-white">Demand ID</th>
            <th className="px-4 py-2 text-left text-white">Source ID</th>
            <th className="px-4 py-2 text-left text-white">Destination ID</th>
            <th className="px-4 py-2 text-left text-white">Quantity</th>
            <th className="px-4 py-2 text-left text-white">Priority</th>
            <th className="px-4 py-2 text-left text-white">AC Required</th>
          </tr>
        </thead>
        <tbody>
          {demands &&
            demands.map((demand) => (
              <tr key={demand.DemandID} className="border-t border-neutral-700">
                <td className="px-4 py-2 text-white">{demand.DemandID}</td>
                <td className="px-4 py-2 text-white">{demand.SourceID}</td>
                <td className="px-4 py-2 text-white">{demand.DestinationID}</td>
                <td className="px-4 py-2 text-white">{demand.Quantity}</td>
                <td className="px-4 py-2 text-white">{demand.Priority}</td>
                <td className="px-4 py-2 text-white">
                  {demand.ACRequired ? "Yes" : "No"}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

const DemandsTable: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-white">Loading Demands...</div>}>
      <DemandsTableContent />
    </Suspense>
  );
};

export default DemandsTable;
