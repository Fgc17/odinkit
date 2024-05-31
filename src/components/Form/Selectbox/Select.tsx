// client
"use client";

import {
  Listbox as HeadlessListbox,
  ListboxButton as HeadlessListboxButton,
  ListboxOption as HeadlessListboxOption,
  ListboxOptions as HeadlessListboxOptions,
  ListboxSelectedOption as HeadlessListboxSelectedOption,
  Transition as HeadlessTransition,
  type ListboxOptionProps as HeadlessListboxOptionProps,
  type ListboxProps as HeadlessListboxProps,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption as HeadlessComboboxOption,
  Combobox as HeadlessCombobox,
  type SelectProps as HeadlessSelectProps,
  type ComboboxProps as HeadlessComboboxProps,
  Select as HeadlessSelect,
  ComboboxOptionProps,
} from "@headlessui/react";
import { useFormContext } from "../Form";
import {
  CheckIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import {
  useState,
  useMemo,
  useRef,
  useEffect,
  Fragment,
  useCallback,
} from "react";
import { Path, Controller } from "react-hook-form";
import { For } from "../../For";
import { inputClasses, inputSpanClasses } from "../Input";
import { getEntryFromPath } from "../_shared/utils/getEntryFromPath";
import { Span } from "../Span";
import { useField } from "../Field";
import { SelectOption, SelectProps } from "./types";
export function Select<
  Data extends { id: string | number; [key: string]: any },
>({
  className,
  multiple,
  data,
  onChange,
  displayValueKey,
  valueKey,
  placeholder = "Selecionar",
  ...props
}: HeadlessSelectProps &
  SelectProps<Data> & {
    placeholder?: string;
  }) {
  const form = useFormContext();

  const { name, error, isRequired } = useField();

  const options: SelectOption[] = useMemo(
    () =>
      (data || []).map((i) => ({
        id: i.id as string,
        displayValue: getEntryFromPath(i, displayValueKey).entryValue,
        value: valueKey ? getEntryFromPath(i, valueKey).entryValue : i.id,
        disabled: i.disabled,
      })),
    [data]
  );

  return (
    <Span
      data-slot="control"
      variant="default"
      className={clsx(inputSpanClasses)}
    >
      <Controller
        name={name}
        control={form.control}
        render={({ field: { onChange: fieldOnChange, value, ..._field } }) => {
          {
            return (
              <HeadlessSelect
                {...props}
                value={value || ""}
                onChange={(event) => {
                  onChange && onChange(event);
                  fieldOnChange(event.target.value);
                }}
                invalid={Boolean(error)}
                className={
                  clsx([
                    // Basic layout
                    "relative block w-full appearance-none rounded-lg py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
                    // Horizontal padding
                    multiple
                      ? "px-[calc(theme(spacing[3.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)]"
                      : "pl-[calc(theme(spacing[3.5])-1px)] pr-[calc(theme(spacing.10)-1px)] sm:pl-[calc(theme(spacing.3)-1px)] sm:pr-[calc(theme(spacing.9)-1px)]",
                    // Options (multi-select)
                    "[&_optgroup]:font-semibold",
                    // Typography
                    "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white dark:*:text-white",
                    // Border
                    "border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20",
                    // Background color
                    "bg-transparent dark:bg-white/5 dark:*:bg-zinc-800",
                    // Hide default focus styles
                    "focus:outline-none",
                    // Invalid state
                    "data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-600 data-[invalid]:data-[hover]:dark:border-red-600",
                    // Disabled state
                    "data-[disabled]:border-zinc-950/20 data-[disabled]:opacity-100 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]",
                  ]) +
                  " " +
                  className
                }
              >
                <option
                  value={""}
                  disabled={isRequired}
                  className={clsx("py-2 pl-3 pr-9")}
                >
                  {placeholder}
                </option>
                <For each={options}>
                  {(item) => {
                    return (
                      <option
                        key={item.id}
                        disabled={item.disabled}
                        value={item.value || ""}
                        className={clsx("py-2 pl-3 pr-9")}
                      >
                        {item.displayValue}
                      </option>
                    );
                  }}
                </For>
              </HeadlessSelect>
            );
          }
        }}
      />
    </Span>
  );
}
