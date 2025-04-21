"use client";
// components/MapComponent.tsx
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { TruckPath } from "@/app/api/trucktoutes";

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      // Importing CSS here
      return mod.MapContainer;
    }),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface Warehouse {
  WarehouseID: number;
  X: number;
  Y: number;
}

interface MapComponentProps {
  warehouses: Warehouse[];
  truckPaths: TruckPath[];
  selectedTruck: number | null;
}

export default function MapComponent({
  warehouses,
  truckPaths,
  selectedTruck,
}: MapComponentProps) {
  const [truckPositions, setTruckPositions] = useState<{
    [key: number]: number; // Index in the path
  }>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [truckIcon, setTruckIcon] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Create custom truck icon on the client-side
  useEffect(() => {
    import("leaflet").then((L) => {
      const newTruckIcon = L.icon({
        iconUrl: "/truck-icon.svg",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      setTruckIcon(newTruckIcon);
    });
  }, []);

  // Initialize truck positions
  useEffect(() => {
    const initialPositions: { [key: number]: number } = {};
    truckPaths.forEach((truck) => {
      initialPositions[truck.truck_id] = 0;
    });
    setTruckPositions(initialPositions);
  }, [truckPaths]);

  // Simulate truck movement
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTruckPositions((prevPositions) => {
        const updatedPositions: { [key: number]: number } = {
          ...prevPositions,
        };
        truckPaths
          .filter(
            (truck) =>
              selectedTruck === null || truck.truck_id === selectedTruck
          )
          .forEach((truck) => {
            const currentIndex = prevPositions[truck.truck_id] || 0;
            if (currentIndex < truck.path.length - 1) {
              updatedPositions[truck.truck_id] = currentIndex + 1;
            }
          });
        return updatedPositions;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [truckPaths, selectedTruck]);

  if (!truckIcon) {
    return null; // Wait for the icon to load
  }

  return (
    <MapContainer
      center={[12.9716, 77.5946]} // Centered at Bangalore
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Plot warehouses */}
      {warehouses.map((warehouse) => (
        <Marker
          key={warehouse.WarehouseID}
          position={[warehouse.Y, warehouse.X]}
        >
          <Popup>
            <div>
              <strong>Warehouse ID:</strong> {warehouse.WarehouseID}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Plot truck routes */}
      {truckPaths
        .filter(
          (truck) => selectedTruck === null || truck.truck_id === selectedTruck
        )
        .map((truck) => (
          <Polyline
            key={truck.truck_id}
            positions={truck.path.map((coord) => [coord[1], coord[0]])}
            pathOptions={{
              color: generateColor(truck.truck_id),
              weight: 4,
              opacity: 0.7,
            }}
          />
        ))}

      {/* Plot moving trucks */}
      {truckPaths
        .filter(
          (truck) => selectedTruck === null || truck.truck_id === selectedTruck
        )
        .map((truck) => {
          const currentIndex = truckPositions[truck.truck_id] || 0;
          const currentPosition = truck.path[currentIndex];
          return (
            <Marker
              key={truck.truck_id}
              position={[currentPosition[1], currentPosition[0]]}
              icon={truckIcon}
            >
              <Popup>
                <div>
                  <strong>Truck ID:</strong> {truck.truck_id}
                  <br />
                  <strong>Position:</strong> [{currentPosition[1].toFixed(4)},{" "}
                  {currentPosition[0].toFixed(4)}]
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}
