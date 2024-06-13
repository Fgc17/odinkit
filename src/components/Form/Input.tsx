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
import { Overlay } from "./Overlay";
import { useField } from "./Field";
import { Button } from "../Button";
import { Button as HeadlessButton } from "@headlessui/react";
import { Alert, AlertActions, AlertBody, AlertTitle } from "../Alert";
import { For } from "../For";
import React, { Dispatch, useEffect, useState } from "react";
import {
  twColor,
  twColorPalette,
  twShade,
} from "../../constants/twColorPalette";
import { EyeIcon, FolderArrowDownIcon } from "@heroicons/react/20/solid";
import { EyeSlashIcon } from "@heroicons/react/24/solid";

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
  "relative mb-1 mt-1 block w-full appearance-none rounded-lg py-[5px]",

  // Typography
  "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 ",

  // Border
  "border border-zinc-950/10",

  // Invalid state
  "data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 ",

  // Disabled state
  "-[hover]:data-[disabled]:border-white/15 data-[disabled]: data-[disabled]:/[2.5%] data-[disabled]:border-zinc-950/20",

  // Background color
  "bg-transparent ",

  // Hide default focus styles
  "focus:outline-none"
);

export const iconInputClasses = clsx(
  // Basic layout
  "relative mb-1 mt-[11px] block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[1.5])-1px)] sm:pr-[calc(theme(spacing[3])-1px)] sm:pl-[calc(theme(spacing[10])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",

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
  icon,
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
  icon?: React.ReactNode;
} & HeadlessInputProps) {
  const form = useFormContext();
  const [showPassword, setShowPassword] = useState(!(type === "password"));
  const { name, error } = useField();

  return (
    <Overlay className={clsx(className)}>
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
              disabled={loading}
              value={value || ""}
              className={clsx([
                // Date classes
                type && dateTypes.includes(type) && webkitCss,
                icon ? iconInputClasses : inputClasses,
              ])}
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              {...props}
              {...field}
            />

            {type === "password" && (
              <HeadlessButton
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-[0.5rem] z-10 cursor-pointer bg-white text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="size-5" />
                ) : (
                  <EyeIcon className="size-5" />
                )}
              </HeadlessButton>
            )}

            {loading && (
              <div className="absolute right-2 top-2.5 text-gray-400">
                <ButtonSpinner />
              </div>
            )}

            {icon && (
              <div className="absolute left-2 top-2 text-gray-400">{icon}</div>
            )}
          </>
        )}
      />
    </Overlay>
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
  const [previewHex, setPreviewHex] = useState("");

  useEffect(() => {
    const colorToParse = form.watch(name).split("_");

    const color = colorToParse[0] as twColor;
    const shade = (colorToParse[1] ? "-" + colorToParse[1] : "") as twShade;

    if (!shade) {
      return setPreviewHex((twColorPalette as any)[color][""]);
    } else {
      return setPreviewHex((twColorPalette as any)[color][shade]);
    }
  }, [form.watch(name)]);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange: fieldOnChange, value, ...field } }) => (
        <>
          <div className="flex size-16 items-center justify-center rounded-full border border-slate-200">
            <div
              style={{ backgroundColor: previewHex }}
              className={clsx("size-14 rounded-full border")}
              onClick={() => setIsOpen(true)}
            />
          </div>
          <Alert size="xs" open={isOpen} onClose={setIsOpen}>
            <AlertTitle>Escolha a cor primária</AlertTitle>
            <AlertBody>
              <div className="flex flex-col items-center">
                <For each={Object.entries(twColorPalette)} identifier="colors">
                  {([color, shades]) => (
                    <div className="flex">
                      <For each={Object.entries(shades)} identifier="tones">
                        {([shade, hex]) => {
                          if (
                            color === "white" ||
                            color === "dark" ||
                            color === "dark/white" ||
                            color === "black" ||
                            color === "dark/zinc"
                          )
                            return <></>;
                          return (
                            <div
                              style={{ backgroundColor: hex }}
                              className={clsx(
                                "h-5 w-5",
                                "hover:scale-150 hover:cursor-pointer",
                                "duration-300"
                              )}
                              onClick={() =>
                                form.setValue(
                                  name,
                                  `${color}_${shade.replace("-", "")}`
                                )
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
                      "h-5 w-5 cursor-pointer",
                      `border border-slate-200 bg-white`,
                      "hover:scale-150",
                      "duration-300"
                    )}
                  >
                    {" "}
                  </div>
                  <div
                    onClick={() => form.setValue(name, "dark_white")}
                    style={{
                      backgroundColor: twColorPalette["dark/white"][""],
                    }}
                    className={clsx(
                      "h-5 w-5 cursor-pointer",
                      "hover:scale-150",
                      "duration-300"
                    )}
                  >
                    {" "}
                  </div>
                  <div
                    onClick={() => form.setValue(name, "dark_zinc")}
                    style={{ backgroundColor: twColorPalette["dark/zinc"][""] }}
                    className={clsx(
                      "h-5 w-5 cursor-pointer",

                      "hover:scale-150",
                      "duration-300"
                    )}
                  >
                    {" "}
                  </div>
                  <div
                    onClick={() => form.setValue(name, "dark")}
                    style={{ backgroundColor: twColorPalette["dark"][""] }}
                    className={clsx(
                      "h-5 w-5 cursor-pointer",
                      "hover:scale-150",
                      "duration-300"
                    )}
                  >
                    {" "}
                  </div>
                  <div
                    onClick={() => form.setValue(name, `black`)}
                    className={clsx(
                      "h-5 w-5 cursor-pointer",
                      `bg-black`,
                      "hover:scale-150",
                      "duration-300"
                    )}
                  >
                    {" "}
                  </div>
                </div>
              </div>
            </AlertBody>
            <AlertActions>
              <Button onClick={() => setIsOpen(false)}>Salvar</Button>
            </AlertActions>
          </Alert>
        </>
      )}
    />
  );
}

export function DebouncedInput({
  value: initialValue,
  onChange,
  setIsLoading,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  setIsLoading: Dispatch<boolean>;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, debounce]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
