// client
"use client";
import {
  Textarea as HeadlessTextarea,
  type TextareaProps as HeadlessTextareaProps,
} from "@headlessui/react";
import { clsx } from "clsx";
import { Overlay } from "./Overlay";
import { Controller } from "react-hook-form";
import { useFormContext } from "./Form";
import { useField } from "./Field";

export function Textarea(
  {
    className,
    resizable = true,
    ...props
  }: { className?: string; resizable?: boolean } & Omit<
    HeadlessTextareaProps,
    "className"
  >,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  const form = useFormContext();
  const { name } = useField();
  return (
    <Overlay>
      <Controller
        name={name}
        control={form.control}
        render={({ field: { onChange: fieldOnChange, value, ...field } }) => (
          <HeadlessTextarea
            className={clsx([
              // Basic layout
              "relative block h-full w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
              // Typography
              "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white",
              // Border
              "border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20",
              // Background color
              "bg-transparent dark:bg-white/5",
              // Hide default focus styles
              "focus:outline-none",
              // Invalid state
              "data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-600 data-[invalid]:data-[hover]:dark:border-red-600",
              // Disabled state
              "disabled:border-zinc-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:data-[hover]:disabled:border-white/15",
              // Resizable
              resizable ? "resize-y" : "resize-none",
            ])}
            onChange={(e) => {
              props.onChange && props.onChange(e);
              fieldOnChange(e.target.value);
            }}
            {...props}
            {...field}
          />
        )}
      />
    </Overlay>
  );
}
