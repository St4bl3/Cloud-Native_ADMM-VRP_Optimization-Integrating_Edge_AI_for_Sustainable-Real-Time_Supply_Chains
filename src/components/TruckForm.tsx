"use client";

import React, { useState, useTransition } from "react";
import { supabase } from "@/lib/supabaseClient";
import { mutate } from "swr";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

type TruckInput = {
  Capacity: number;
  AC: boolean;
  CurrentWarehouseID: number;
  Status: "Available" | "In Transit" | "Maintenance";
  CurrentLoad: number;
};

export default function TruckForm() {
  const [formData, setFormData] = useState<TruckInput>({
    Capacity: 0,
    AC: false,
    CurrentWarehouseID: 0,
    Status: "Available",
    CurrentLoad: 0,
  });

  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "Capacity" ||
            name === "CurrentWarehouseID" ||
            name === "CurrentLoad"
          ? Number(value)
          : value,
    }));
  };
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      AC: checked, // Update AC state with the switch value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { Capacity, AC, CurrentWarehouseID, Status, CurrentLoad } = formData;

    const { error } = await supabase
      .from("trucks")
      .insert([{ Capacity, AC, CurrentWarehouseID, Status, CurrentLoad }]);

    if (error) {
      console.error("Error inserting truck:", error);
      // Optionally, display error to the user
    } else {
      setFormData({
        Capacity: 0,
        AC: false,
        CurrentWarehouseID: 0,
        Status: "Available",
        CurrentLoad: 0,
      });
      startTransition(() => {
        mutate("trucks"); // Revalidate the trucks data
      });
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black">
      <h2 className="font-bold text-xl text-neutral-200 text-center">
        Verde-Corsa{" "}
      </h2>

      <form onSubmit={handleSubmit} className="my-8">
        <LabelInputContainer className="mb-4">
          <Label htmlFor="Capacity">Capacity (kg)</Label>
          <Input
            id="Capacity"
            name="Capacity"
            type="number"
            value={formData.Capacity}
            onChange={handleChange}
            required
            min={1}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="AC">AC</Label>
          <Switch
            id="AC"
            name="AC"
            checked={formData.AC}
            onCheckedChange={handleSwitchChange}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="CurrentWarehouseID">Current Warehouse ID</Label>
          <Input
            id="CurrentWarehouseID"
            name="CurrentWarehouseID"
            type="number"
            value={formData.CurrentWarehouseID}
            onChange={handleChange}
            required
            min={1}
          />
        </LabelInputContainer>

        <div className="hidden">
          <Input
            id="Status"
            name="Status"
            value="Available"
            onChange={handleChange}
            disabled
          />
        </div>

        <div className="hidden">
          <Input
            id="CurrentLoad"
            name="CurrentLoad"
            value={0}
            onChange={handleChange}
            disabled
          />
        </div>
        <button
          className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit Truck"}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
