import clsx from "clsx";
import React from "react";
import { useField } from "./Field";

const classes = {
  default: clsx(
    // Basic layouts
    `relative block w-full`,

    // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
    `before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow`,

    // Focus ring
    `after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent 
        focus-within:after:ring-2`,

    // Disabled state
    `has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none`
  ),
};

export function Span({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"span"> & {
  variant?: keyof typeof classes;
}) {
  const { error } = useField();

  return (
    <span
      data-slot="control"
      className={clsx(
        // Invalid State
        error &&
          "before:has-[[data-invalid]]:shadow-red-500/10 has-[[data-invalid]]:after:ring-red-500",

        // Valid State
        !error && "focus-within:after:ring-blue-500",

        classes[variant],

        className
      )}
      {...props}
    />
  );
}
