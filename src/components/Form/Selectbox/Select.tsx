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
  ComboboxOption as HeadlessComboboxOption,
  Combobox as HeadlessCombobox,
  type SelectProps as HeadlessSelectProps,
  type ComboboxProps as HeadlessComboboxProps,
  Select as HeadlessSelect,
} from "@headlessui/react";
import { useParentForm } from "../Form";
import clsx from "clsx";
import { useMemo } from "react";
import { Path, Controller } from "react-hook-form";
import { For } from "../../For";
import { getEntryFromPath } from "../_shared/utils/getEntryFromPath";
import { Overlay } from "../Overlay";
import { useField } from "../Field";
import { SelectOption, SelectProps } from "./shared/types";
import {
  fieldBackgroundColorClasses,
  fieldBasicLayoutClasses,
  fieldBorderClasses,
  fieldFocusClasses,
  fieldTipographyClasses,
} from "../_shared/styles/field-classes";

const selectClasses = (multiple: boolean) =>
  clsx([
    // Basic layout
    fieldBasicLayoutClasses,

    // Typography
    fieldTipographyClasses,

    // Background color
    fieldBackgroundColorClasses,

    // Border
    fieldBorderClasses,

    // Hide default focus styles
    fieldFocusClasses,

    // Horizontal padding
    multiple
      ? "px-[calc(theme(spacing[3.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)]"
      : "pl-[calc(theme(spacing[3.5])-1px)] pr-[calc(theme(spacing.10)-1px)] sm:pl-[calc(theme(spacing.3)-1px)] sm:pr-[calc(theme(spacing.9)-1px)]",

    // Options (multi-select)
    "[&_optgroup]:font-semibold",

    // Invalid state
    "data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-600 data-[invalid]:data-[hover]:dark:border-red-600",

    // Disabled state
    "data-[disabled]:border-zinc-950/20 data-[disabled]:opacity-100 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]",
  ]);

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
  const form = useParentForm();

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
    <Overlay data-slot="control" variant="default">
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
                className={clsx(selectClasses(Boolean(multiple)), className)}
              >
                <option value={""} disabled={isRequired}>
                  {placeholder}
                </option>
                <For each={options}>
                  {(item) => {
                    return (
                      <option
                        key={item.id}
                        disabled={item.disabled}
                        value={item.value || ""}
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
    </Overlay>
  );
}
