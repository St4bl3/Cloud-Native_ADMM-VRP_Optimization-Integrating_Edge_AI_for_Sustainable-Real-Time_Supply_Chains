"use client";

import React, { useState, useTransition } from "react";
import { supabase } from "@/lib/supabaseClient";
import { mutate } from "swr";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { cn } from "@/lib/utils";

type OrderInput = {
  SourceID: number;
  DestinationID: number;
  Quantity: number;
  Priority: "Low" | "Medium" | "High";
  ACRequired: boolean;
};
export default function OrderForm() {
  const [formData, setFormData] = useState<OrderInput>({
    SourceID: 0,
    DestinationID: 0,
    Quantity: 1,
    Priority: "Low",
    ACRequired: false,
  });

  const [isPending, startTransition] = useTransition();

  // Handle form input changes (both Select and Input fields)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    isSelect?: boolean
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    if (isSelect) {
      // Handle select field change (Special for Select)
      setFormData((prev) => ({
        ...prev,
        [name]: value as "Low" | "Medium" | "High", // Explicitly cast to "Low" | "Medium" | "High"
      }));
    } else {
      // For checkbox input
      if (type === "checkbox") {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      }
      // For number or text input
      else {
        setFormData((prev) => ({
          ...prev,
          [name]: type === "number" ? Number(value) : value,
        }));
      }
    }
  };

  // Handle ACRequired switch state change
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      ACRequired: checked,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { SourceID, DestinationID, Quantity, Priority, ACRequired } =
      formData;

    // Log form data before submitting to debug any issues
    console.log("Submitting data:", formData);

    try {
      // Insert data into Supabase
      const { data, error } = await supabase
        .from("demands")
        .insert([{ SourceID, DestinationID, Quantity, Priority, ACRequired }]);

      // Check if error occurred
      if (error) {
        console.error("Error inserting order:", error.message);
        // Optionally display the error message to the user
      } else {
        console.log("Order inserted successfully:", data);
        // Reset form data on successful submission
        setFormData({
          SourceID: 0,
          DestinationID: 0,
          Quantity: 1,
          Priority: "Low",
          ACRequired: false,
        });

        startTransition(() => {
          mutate("orders"); // Revalidate the orders data
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-16 md:p-8 shadow-input bg-black">
      <h2 className="font-bold text-xl text-neutral-200 text-center">
        Order Form
      </h2>

      <form onSubmit={handleSubmit} className="my-8">
        <LabelInputContainer className="mb-4">
          <Label htmlFor="SourceID">Source ID</Label>
          <Input
            id="SourceID"
            name="SourceID"
            type="number"
            value={formData.SourceID}
            onChange={(e) => handleChange(e, false)} // specify false to use as number input
            required
            min={1}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="DestinationID">Destination ID</Label>
          <Input
            id="DestinationID"
            name="DestinationID"
            type="number"
            value={formData.DestinationID}
            onChange={(e) => handleChange(e, false)} // specify false to use as number input
            required
            min={1}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="Quantity">Quantity</Label>
          <Input
            id="Quantity"
            name="Quantity"
            type="number"
            value={formData.Quantity}
            onChange={(e) => handleChange(e, false)} // specify false to use as number input
            required
            min={1}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="Priority">Priority</Label>
          <Select
            name="Priority"
            value={formData.Priority}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                Priority: value as "Low" | "Medium" | "High",
              }));
            }}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </LabelInputContainer>

        {/* Add Switch for ACRequired */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="ACRequired">AC Required</Label>
          <Switch
            id="ACRequired"
            name="ACRequired"
            checked={formData.ACRequired}
            onCheckedChange={handleSwitchChange}
          />
        </LabelInputContainer>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 mt-4 text-white bg-blue-600 rounded-lg"
        >
          {isPending ? "Submitting..." : "Submit Order"}
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
