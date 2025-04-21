/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useWarehouses.ts
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export interface Warehouse {
  WarehouseID: number;
  X: number; // Longitude
  Y: number; // Latitude
  [key: string]: any; // Other fields if any
}

export const useWarehouses = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWarehouses = async () => {
      const { data, error } = await supabase.from("warehouses").select("*");

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setWarehouses(data || []);
      setLoading(false);
    };

    fetchWarehouses();
  }, []);

  return { warehouses, loading, error };
};
