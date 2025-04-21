// pages/api/optimizeRoutes.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getWarehouses } from '@/lib/data-access';

// Define the types for the response data from the API and warehouse data
interface Warehouse {
  WarehouseID: number;
  X: number;
  Y: number;
}

interface Demand {
  SourceID: number;
  DestinationID: number;
}

interface TruckRoute {
  truck_id: number;
  assigned_demands: Demand[];
}

interface Route {
  truckId: number;
  path: Array<{
    source: {
      x: number;
      y: number;
    };
    destination: {
      x: number;
      y: number;
    };
  }>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const response = await axios.post('http://0.0.0.0:8000/solve');
      const data: { routes: TruckRoute[] } = response.data;

      // Fetch warehouse data to map coordinates to SourceID and DestinationID
      const warehouses: Warehouse[] = await getWarehouses();

      // Prepare the routes by combining the API response with warehouse coordinates
      const routes: Route[] = data.routes.map((truck) => ({
        truckId: truck.truck_id,
        path: truck.assigned_demands.map((demand) => {
          const sourceWarehouse = warehouses.find(
            (w) => w.WarehouseID === demand.SourceID
          );
          const destinationWarehouse = warehouses.find(
            (w) => w.WarehouseID === demand.DestinationID
          );

          return {
            source: {
              x: sourceWarehouse?.X ?? 0,
              y: sourceWarehouse?.Y ?? 0,
            },
            destination: {
              x: destinationWarehouse?.X ?? 0,
              y: destinationWarehouse?.Y ?? 0,
            },
          };
        }),
      }));

      res.status(200).json(routes);
    } catch {
      res.status(500).json({ error: 'Failed to fetch routes' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
