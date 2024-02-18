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
import { inputClasses } from "../Input";
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

  const { name } = useField();

  const options: SelectOption[] = useMemo(
    () =>
      (data || []).map((i) => ({
        id: i.id as string,
        displayValue: getEntryFromPath(i, displayValueKey).entryValue,
        value: valueKey ? getEntryFromPath(i, valueKey).entryValue : i.id,
      })),
    [data]
  );

  return (
    <Span data-slot="control" variant="default">
      <Controller
        name={name}
        control={form.control}
        render={({ field: { onChange: fieldOnChange, value, ..._field } }) => (
          <HeadlessSelect
            {...props}
            value={value || ""}
            onChange={(event) => {
              onChange && onChange(event);
              fieldOnChange(event.target.value);
            }}
            className={inputClasses}
          >
            <option value={""} disabled className={clsx("py-2 pl-3 pr-9")}>
              {placeholder}
            </option>
            <For each={options}>
              {(item) => {
                return (
                  <option
                    key={item.id}
                    value={item.value}
                    className={clsx("py-2 pl-3 pr-9")}
                  >
                    {item.displayValue}
                  </option>
                );
              }}
            </For>
          </HeadlessSelect>
        )}
      />
    </Span>
  );
}
