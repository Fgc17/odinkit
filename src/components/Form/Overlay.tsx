// client
"use client";

import clsx from "clsx";
import React from "react";
import { useField } from "./Field";

const classes = {
  default: clsx(
    // Basic layouts
    `relative block w-full`,

    // Focus ring
    `after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent 
        focus-within:after:ring-2`,

    // Disabled state
    `has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none`
  ),
};

export function Overlay({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"span"> & {
  variant?: keyof typeof classes;
}) {
  const { error } = useField();

  return (
    <span
      className={clsx(
        error
          ? "before:has-[[data-invalid]]:shadow-red-500/10 has-[[data-invalid]]:after:ring-red-500"
          : "before:shadow-blue-500/10 after:ring-blue-500",

        classes[variant],

        className
      )}
      {...props}
    />
  );
}
