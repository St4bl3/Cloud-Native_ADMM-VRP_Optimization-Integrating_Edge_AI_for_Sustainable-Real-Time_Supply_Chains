// lib/dataAccess.ts
import { supabase } from './supabaseClient';

export const getWarehouses = async () => {
  const { data, error } = await supabase
    .from('warehouses')
    .select('WarehouseID, X, Y');
  
  if (error) {
    throw new Error('Error fetching warehouses');
  }
  
  return data;
};

export const getTrucks = async () => {
  const { data, error } = await supabase
    .from('trucks')
    .select('TruckID, Capacity, CurrentWarehouseID, CurrentLoad');
  
  if (error) {
    throw new Error('Error fetching trucks');
  }
  
  return data;
};
