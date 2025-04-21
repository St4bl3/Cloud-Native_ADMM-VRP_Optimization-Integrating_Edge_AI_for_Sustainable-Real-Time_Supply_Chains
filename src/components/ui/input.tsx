"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

// Use React.InputHTMLAttributes directly if no additional properties are added
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const radius = 100; // change this to increase the radius of the hover effect
    const [visible, setVisible] = React.useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Type the event parameter explicitly to avoid 'any'
    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
      const { left, top } = event.currentTarget.getBoundingClientRect();

      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${
                visible ? radius + "px" : "0px"
              } circle at ${mouseX}px ${mouseY}px,
              var(--blue-500),
              transparent 80%
            )
          `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="p-[2px] rounded-lg transition duration-300 group/input"
      >
        <input
          type={type}
          className={cn(
            `flex h-10 w-full border-none bg-zinc-800 text-white rounded-md shadow-input px-3 py-2 text-sm file:border-0 file:bg-transparent 
              file:text-sm file:font-medium placeholder-text-neutral-600 
              focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-600
              disabled:cursor-not-allowed disabled:opacity-50
              shadow-[0px_0px_1px_1px_var(--neutral-700)]
              group-hover/input:shadow-none transition duration-400`,
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }
);

Input.displayName = "Input";

export { Input };
