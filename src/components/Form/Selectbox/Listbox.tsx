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
import { Overlay } from "../Overlay";
import { useField } from "../Field";
import { SelectOption, SelectProps } from "./types";
import * as classes from "./classes";

export function Listbox<Data extends { id: string | number }>({
  className,
  placeholder,
  autoFocus,
  data,
  valueKey,
  displayValueKey,
  "aria-label": ariaLabel,
  onChange,
  children,
  ...props
}: SelectProps<Data> & { children: (item: Data) => React.ReactNode } & Omit<
    HeadlessListboxProps<typeof Fragment, Data>,
    "multiple" | "children" | "name" | "onChange"
  > & {
    placeholder?: React.ReactNode;
    autoFocus?: boolean;
    "aria-label"?: string;
  }) {
  const form = useFormContext();

  const { name } = useField();

  const options = useMemo(
    () =>
      (data || []).map((item) => ({
        _: item,
        id: String(item.id),
        displayValue: getEntryFromPath(item, displayValueKey).entryValue,
        value: valueKey ? getEntryFromPath(item, valueKey).entryValue : item.id,
      })),
    [data]
  );

  const Options = useMemo(
    () => (
      <For each={options}>
        {(i) => (
          <ListboxOption key={i.id} value={i}>
            {children(i._)}
          </ListboxOption>
        )}
      </For>
    ),
    [data]
  );

  // note: value of headlesslistbox must be the same as the listbox option for it to count as selected option

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange: fieldOnChange, value, ..._field } }) => (
        <Overlay>
          <HeadlessListbox
            as={"div"}
            onChange={(_: any) => {
              const data: SelectOption<Data> = _;
              onChange && onChange(data?._);
              fieldOnChange(data.value);
            }}
            multiple={false}
            value={options.find((i) => i.value === value) || ""}
            {..._field}
            {...props}
          >
            <Overlay>
              <HeadlessListboxButton
                autoFocus={autoFocus}
                data-slot="control"
                aria-label={ariaLabel}
                className={clsx([
                  // Basic layout
                  "relative block w-full appearance-none rounded-lg py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
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
                  ,
                  "w-full",
                ])}
              >
                {value ? (
                  <HeadlessListboxSelectedOption
                    as={Fragment}
                    options={Options}
                    placeholder={
                      placeholder && (
                        <span className="block truncate text-zinc-500">
                          {placeholder}
                        </span>
                      )
                    }
                  />
                ) : (
                  <span className="text-transparent">default</span>
                )}

                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="size-4 text-black text-zinc-500" />
                </span>
              </HeadlessListboxButton>
            </Overlay>
            <HeadlessTransition
              as={Fragment}
              afterLeave={() => {}}
              leave="transition-opacity duration-100 ease-in pointer-events-none"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <HeadlessListboxOptions
                as="div"
                anchor={{
                  to: "selection start",
                  offset: "var(--anchor-offset)",
                  padding: "var(--anchor-padding)",
                }}
                className={classes.options}
              >
                {Options}
              </HeadlessListboxOptions>
            </HeadlessTransition>
          </HeadlessListbox>
        </Overlay>
      )}
    />
  );
}

export function ListboxOption<Data>({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & HeadlessListboxOptionProps<"div", Data>) {
  return (
    <HeadlessListboxOption as={Fragment} {...props}>
      {({ selectedOption, selected }) =>
        selectedOption ? (
          <div className={clsx("flex w-full justify-start")}>{children}</div>
        ) : (
          <div className={classes.option}>
            <div className="flex gap-1.5">
              {selected ? (
                <>
                  <CheckIcon className="relative size-4 self-center stroke-current" />
                  <span className={clsx(className, classes.optionChildren)}>
                    {children}
                  </span>
                </>
              ) : (
                <>
                  {" "}
                  <div className="size-4" />
                  <span className={clsx(className, classes.optionChildren)}>
                    {children}
                  </span>
                </>
              )}
            </div>
          </div>
        )
      }
      {/* {({ selectedOption }) => {
        if (selectedOption) {
          return <div className={clsx(className)}>{children}</div>;
        }

        return (
          <div
            className={clsx(
              // Basic layout
              "group/option grid cursor-default grid-cols-[theme(spacing.4),1fr] items-baseline gap-x-1.5 rounded-lg py-1.5 pl-2 pr-3",

              // Typography
              "text-base/6 text-zinc-950 sm:text-sm/6 forced-colors:text-[CanvasText]",

              // Focus
              "outline-none data-[focus]:bg-blue-500 data-[focus]:text-white",

              // Forced colors mode
              "forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText]",

              // Disabled
              "data-[disabled]:opacity-50"
            )}
          >
            <CheckIcon className="relative hidden size-5 self-center stroke-current group-data-[selected]/option:inline sm:size-4 " />
            <span className={clsx(className, "col-start-2")}>{children}</span>
          </div>
        );
      }} */}
    </HeadlessListboxOption>
  );
}

export function ListboxLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={clsx(
        className,
        "ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0"
      )}
      {...props}
    />
  );
}

export function ListboxDescription({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={clsx(
        className,
        "flex flex-1 overflow-hidden text-zinc-500 before:w-2 before:min-w-0 before:shrink group-data-[focus]/option:text-white"
      )}
      {...props}
    >
      <span className="flex-1 truncate">{children}</span>
    </span>
  );
}
