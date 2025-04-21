// src/api/truckRoutes.ts
import axios from "axios";

export interface TruckPath {
  truck_id: number;
  path: [number, number][]; // [longitude, latitude]
}

export const fetchTruckRoutes = async (): Promise<TruckPath[]> => {
  try {
    // Solve the VRP problem
    await axios.post("https://verde-corsa-f441de12f401.herokuapp.com/solve");

    // Fetch the routing information
    const response = await axios.get("https://verde-corsa-f441de12f401.herokuapp.com/routing");
    return response.data.truck_paths || [];
  } catch (error) {
    console.error("Error fetching truck routes:", error);
    return [];
  }
};