// client
"use client";

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
import { Button } from "../Button";
import { Alert, AlertBody, AlertTitle } from "../Alert";
import { For } from "../For";
import { useState } from "react";
import { colors, tones } from "./_shared/utils/colors";

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
                fieldOnChange(
                  mask
                    ? formatWithMask(value, mask)
                    : type === "number"
                      ? Number(value)
                      : value
                );
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange: fieldOnChange, value, ...field } }) => (
        <>
          <div className="flex size-16 items-center justify-center rounded-full border border-slate-200">
            <div
              className={clsx("size-14 rounded-full border", `bg-${value}`)}
              onClick={() => setIsOpen(true)}
            />
          </div>
          <Alert open={isOpen} onClose={setIsOpen}>
            <AlertTitle>Escolha a cor primária</AlertTitle>
            <AlertBody>
              <div className="flex flex-col items-center">
                <For each={colors} identifier="colors">
                  {(color) => (
                    <div className="flex flex-grow">
                      <For each={tones} identifier="tones">
                        {(tone) => {
                          if (color === "white" || color === "dark")
                            return <></>;
                          return (
                            <div
                              className={clsx(
                                "h-5 w-5",
                                `bg-${color}-${tone}`,
                                "hover:scale-150",
                                "duration-300"
                              )}
                              onClick={() =>
                                form.setValue(name, `${color}-${tone}`)
                              }
                            ></div>
                          );
                        }}
                      </For>
                    </div>
                  )}
                </For>
                <div className="flex">
                  {" "}
                  <div
                    onClick={() => form.setValue(name, `white`)}
                    className={clsx(
                      "h-5 w-5",
                      `bg-black`,
                      "hover:scale-150",
                      "duration-300"
                    )}
                  >
                    {" "}
                  </div>
                  <div
                    onClick={() => form.setValue(name, `black`)}
                    className={clsx(
                      "h-5 w-5",
                      `border border-slate-200 bg-white`,
                      "hover:scale-150",
                      "duration-300"
                    )}
                  >
                    {" "}
                  </div>
                </div>
              </div>
            </AlertBody>
          </Alert>
        </>
      )}
    />
  );
}
