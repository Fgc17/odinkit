import {
  Input as HeadlessInput,
  type InputProps as HeadlessInputProps,
} from "@headlessui/react";
import { clsx } from "clsx";
import { useFormContext } from "./Form";
import { MaskType, formatWithMask } from "./_shared/utils/formatWithMask";
import { ButtonSpinner, LoadingSpinner } from "../Spinners";
import { Controller } from "react-hook-form";
import { Span } from "./Span";
import { useField } from "./Field";

const dateTypes = ["date", "datetime-local", "month", "time", "week"];
type DateType = (typeof dateTypes)[number];

const webkitCss = [
  "[&::-webkit-datetime-edit-fields-wrapper]:p-0",
  "[&::-webkit-date-and-time-value]:min-h-[1.5em]",
  "[&::-webkit-datetime-edit]:inline-flex",
  "[&::-webkit-datetime-edit]:p-0",
  "[&::-webkit-datetime-edit-year-field]:p-0",
  "[&::-webkit-datetime-edit-month-field]:p-0",
  "[&::-webkit-datetime-edit-day-field]:p-0",
  "[&::-webkit-datetime-edit-hour-field]:p-0",
  "[&::-webkit-datetime-edit-minute-field]:p-0",
  "[&::-webkit-datetime-edit-second-field]:p-0",
  "[&::-webkit-datetime-edit-millisecond-field]:p-0",
  "[&::-webkit-datetime-edit-meridiem-field]:p-0",
];

export const inputClasses = clsx(
  // Basic layout
  "relative mb-1 mt-[11px] block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[1.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",

  // Typography
  "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 ",

  // Border
  "-[hover]:border-white/20 border border-zinc-950/10  data-[hover]:border-zinc-950/20",

  // Background color
  "bg-transparent ",

  // Hide default focus styles
  "focus:outline-none",

  // Invalid state
  "data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500",

  // Disabled state
  "-[hover]:data-[disabled]:border-white/15 data-[disabled]: data-[disabled]:/[2.5%] data-[disabled]:border-zinc-950/20"
);

export function Input({
  className,
  mask,
  onChange,
  loading,
  type = "text",
  ...props
}: {
  type?:
    | "email"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "url"
    | DateType;
  loading?: boolean;
  mask?: MaskType;
} & HeadlessInputProps) {
  const form = useFormContext();
  const { name, error } = useField();

  return (
    <Span className={clsx(className)}>
      <Controller
        name={name}
        control={form.control}
        render={({ field: { onChange: fieldOnChange, value, ...field } }) => (
          <>
            <HeadlessInput
              onChange={(e) => {
                const value = e.target.value;
                onChange && onChange(e);
                fieldOnChange(mask ? formatWithMask(value, mask) : value);
              }}
              invalid={Boolean(error)}
              value={value || ""}
              className={clsx([
                // Date classes
                type && dateTypes.includes(type) && webkitCss,
                inputClasses,
              ])}
              type={type}
              {...props}
              {...field}
            />

            {loading && (
              <div className="absolute right-2 top-2.5 text-white">
                <ButtonSpinner />
              </div>
            )}
          </>
        )}
      />
    </Span>
  );
}

export function ColorInput({
  className,
  mask,
  onChange,
  loading,
  ...props
}: {
  type?: "color";
  loading?: boolean;
  mask?: MaskType;
} & HeadlessInputProps) {
  const form = useFormContext();
  const { name } = useField();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange: fieldOnChange, value, ...field } }) => (
        <span
          data-keyslot="control"
          className={clsx([
            className,
            // Basic layouts
            "relative block",

            // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
            "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white",

            // Focus ring
            "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg  after:ring-transparent sm:after:focus-within:ring-2 ",

            // Disabled state
            "has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none",

            // Invalid state
            "before:has-[[data-invalid]]:shadow-red-500/10",
          ])}
        >
          <HeadlessInput
            type="color"
            onChange={(e) => {
              onChange && onChange(e);
              fieldOnChange(e.target.value);
            }}
            value={value || ""}
            className={clsx([
              // Date classes
              props.type && dateTypes.includes(props.type) && webkitCss,

              // Basic layout
              "relative mb-1 mt-[11px] block min-h-16 min-w-16 cursor-pointer appearance-none rounded-full px-1 py-1",

              // Typography
              "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 ",

              // Border
              "-[hover]:border-white/20 border border-zinc-950/10  data-[hover]:border-zinc-950/20",

              // Background color
              "bg-transparent ",

              // Hide default focus styles
              "focus:outline-none",

              // Invalid state
              "data-[invalid]: data-[invalid]:data-[hover]: data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500",

              // Disabled state
              "-[hover]:data-[disabled]:border-white/15 data-[disabled]: data-[disabled]:/[2.5%] data-[disabled]:border-zinc-950/20",
            ])}
            {...props}
            {...field}
          />

          {loading && (
            <div className="absolute right-2 top-2.5 text-white">
              <ButtonSpinner />
            </div>
          )}
        </span>
      )}
    />
  );
}
