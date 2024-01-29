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
import { useFormContext } from "./Form";
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
import { For } from "../For";
import { inputClasses } from "./Input";
import { getEntryFromPath } from "./_shared/utils/getEntryFromPath";
import { Span } from "./Span";
import { useField } from "./Field";
import { If } from "../If";

const selectDropdownHeights = {
  1: "max-h-12",
  2: "max-h-20",
  3: "max-h-28",
  4: "max-h-36",
  5: "max-h-44",
  6: "max-h-52",
  7: "max-h-60",
  8: "max-h-68",
  9: "max-h-76",
};

const selectboxClasses = clsx(
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
  "data-[disabled]:border-zinc-950/20 data-[disabled]:opacity-100 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]"
);

const selectBox = clsx(
  // Basic layout
  "group relative block w-full",

  // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
  "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow",

  // Hide default focus styles
  "focus:outline-none",

  // Focus ring
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:after:data-[focus]:ring-2 sm:after:data-[focus]:ring-blue-500",

  // Disabled state
  "data-[disabled]:opacity-50 before:data-[disabled]:bg-zinc-950/5 before:data-[disabled]:shadow-none"
);

const listInputSelectedOptionClasses = clsx(
  // Basic layout
  "relative block w-full appearance-none rounded-lg py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",

  // Set minimum height for when no value is selected
  "min-h-9",

  // Horizontal padding
  "pl-[calc(theme(spacing[3.5])-1px)] pr-[calc(theme(spacing.7)-1px)] sm:pl-[calc(theme(spacing.3)-1px)]",

  // Typography
  "text-left text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 forced-colors:text-[CanvasText]",

  // Border
  "border border-zinc-950/10 group-data-[active]:border-zinc-950/20 group-data-[hover]:border-zinc-950/20 ",

  // Background color
  "bg-transparent",

  // Invalid state
  "group-data-[invalid]:border-red-500 group-data-[invalid]:group-data-[hover]:border-red-500 ",

  // Disabled state
  "group-data-[disabled]:border-zinc-950/20 group-data-[disabled]:opacity-100"
);

const listInputOptionsClasses = clsx(
  // Anchor positioning
  "[--anchor-offset:-1.625rem] [--anchor-padding:theme(spacing.4)] sm:[--anchor-offset:-1.375rem]",

  // Base styles
  "isolate w-max min-w-[calc(var(--button-width)+1.75rem)] select-none scroll-py-1 rounded-xl p-1",

  // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
  "outline outline-1 outline-transparent focus:outline-none",

  // Handle scrolling when menu won't fit in viewport
  "overflow-y-scroll overscroll-contain",

  // Popover background
  "bg-white/75 backdrop-blur-xl",

  // Shadows
  "shadow-lg ring-1 ring-zinc-950/10"
);

const selectboxOptionClasses = clsx(
  // Base
  "flex min-w-0 items-center",

  // Icons
  "[&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-zinc-500 [&>[data-slot=icon]]:group-data-[focus]/option:text-white sm:[&>[data-slot=icon]]:size-4 forced-colors:[&>[data-slot=icon]]:text-[CanvasText] forced-colors:[&>[data-slot=icon]]:group-data-[focus]/option:text-[Canvas]",

  // Avatars
  "[&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:size-5"
);

interface SelectOption<T = any> {
  id: string;
  displayValue: string;
  value: string;
  _?: T;
}

interface SelectProps<Data> {
  data: Data[] | [];
  className?: string;
  displayValueKey: Path<Data>;
  valueKey?: Path<Data>;
  onChange?: (value: Data) => void;
  maxVisibleOptions?: keyof typeof selectDropdownHeights;
}

export function Combobox<Data extends { id: string | number }>({
  className,
  data,
  setData,
  debounce = 500,
  displayValueKey,
  valueKey,
  maxVisibleOptions = 7,
  onChange,
  children,
  inputMode,
  ...props
}: {
  children: (item: SelectOption<Data>) => React.ReactNode;
  debounce?: number;
  setData?: (query: string | undefined) => void;
  className?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
} & Omit<HeadlessComboboxProps<Data, any, any, any>, "children"> &
  SelectProps<Data>) {
  const form = useFormContext();

  const { name, error } = useField();

  const [query, setQuery] = useState("");

  const options = useMemo(() => {
    const parsedData = (data || []).map((item) => ({
      _: item,
      id: String(item.id),
      displayValue: getEntryFromPath(item, displayValueKey).entryValue,
      value: valueKey ? getEntryFromPath(item, valueKey).entryValue : item.id,
    }));

    const options =
      setData || !query
        ? parsedData
        : parsedData.filter(({ displayValue }) =>
            String(displayValue)
              .toLowerCase()
              .includes(String(query).toLowerCase())
          );

    return options;
  }, [data, setData ? undefined : query]);

  const timeout = useRef(setTimeout(() => {}, 0));

  useEffect(() => {
    if (query && !options.length) {
      form.setValue(name, "invalid");
      form.trigger(name);
    } else {
      form.clearErrors(name);
    }
  }, [options]);

  const { __demoMode, value, ...rest } = props;

  const comboboxRef = useRef<HTMLElement | null>(null);

  return (
    <Span>
      <Controller
        name={name}
        control={form.control}
        render={({ field: { onChange: fieldOnChange, value, ..._field } }) => (
          <HeadlessCombobox
            {..._field}
            {...rest}
            as={"div"}
            value={options.find((i) => i.value === value) || ""}
            onChange={(data: any) => {
              onChange && onChange(data._);
              setQuery("");
              fieldOnChange(data.value);
            }}
            ref={(el) => {
              comboboxRef.current = el;
            }}
          >
            <Span>
              <ComboboxInput
                autoComplete="off"
                data-invalid={error ? "" : undefined}
                className={clsx(inputClasses)}
                inputMode={inputMode}
                onKeyDown={(e) => {
                  const ignore = ["Control", "Shift", "Alt"];
                  console.log(e.key);
                  if (ignore.includes(e.key)) {
                    e.preventDefault();
                  }

                  if (e.key === "Enter" || e.key === "Return") {
                    const data = options[0];
                    if (data) {
                      onChange && onChange(data._ as any);
                      setQuery("");
                      fieldOnChange(data.value);
                    }
                  }
                }}
                onBlur={(e) => {
                  const allow = [
                    "unknown",
                    "headlessui-control",
                    "headlessui-dialog",
                  ];

                  const blurSource = e.relatedTarget?.id || "unknown";

                  console.log(blurSource);

                  if (!allow.find((i) => blurSource?.includes(i))) return;

                  if (query && options.length) {
                    const data = options[0];
                    if (data) {
                      onChange && onChange(data as any);
                      setQuery("");
                      fieldOnChange(data.value);
                    }
                  }
                }}
                onChange={async (event) => {
                  clearTimeout(timeout.current);

                  timeout.current = setTimeout(
                    () => {
                      setQuery(event.target.value);
                      setData && setData(event.target.value);
                    },
                    setData ? debounce : 200
                  );
                }}
                displayValue={(item: SelectOption) =>
                  item.displayValue || query
                }
              />
            </Span>

            <ComboboxButton
              className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
              onClick={() => {
                if (setData) {
                  setData("");
                } else {
                  setQuery("");
                }
              }}
            >
              <MagnifyingGlassIcon className="size-5 text-zinc-500" />
            </ComboboxButton>
            <HeadlessTransition
              as={Fragment}
              beforeLeave={() => {}}
              leave="transition-opacity duration-100 ease-in pointer-events-none"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ComboboxOptions
                as="div"
                anchor={{
                  to: "bottom start",
                  offset: "var(--anchor-offset)",
                  padding: "var(--anchor-padding)",
                }}
                style={{
                  width: "194px",
                }}
                className={clsx(
                  !options.length && "hidden",

                  // Listbox z index
                  "z-[50]",

                  // Base styles
                  "isolate w-max min-w-[calc(var(--button-width)+1.75rem)] select-none scroll-py-1 rounded-md pt-1",

                  // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
                  "outline outline-1 outline-transparent focus:outline-none",

                  // Handle scrolling when menu won't fit in viewport
                  "overflow-y-scroll overscroll-contain",

                  // Popover background
                  "bg-white/75 backdrop-blur-xl",

                  // Shadows
                  "shadow-lg ring-1 ring-zinc-950/10"
                )}
              >
                <For each={options}>
                  {(i) => (
                    <ComboboxOption
                      key={i.id}
                      value={i}
                      style={{
                        width: comboboxRef.current?.offsetWidth,
                      }}
                    >
                      {children(i)}
                    </ComboboxOption>
                  )}
                </For>
              </ComboboxOptions>
            </HeadlessTransition>
          </HeadlessCombobox>
        )}
      />
    </Span>
  );
}

export function ComboboxOption<Data>({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & ComboboxOptionProps<"div", Data>) {
  return (
    <HeadlessComboboxOption as={Fragment} {...props}>
      {({ selected }) => {
        if (selected) {
          return (
            <div
              className={clsx(
                // Basic layout
                "group/option grid cursor-default grid-cols-[theme(spacing.4),1fr] items-baseline gap-x-1.5 py-1.5 ",

                // Typography
                "text-base/6 text-zinc-950 sm:text-sm/6 forced-colors:text-[CanvasText]",

                // Focus
                "outline-none data-[focus]:bg-blue-500 data-[focus]:text-white",

                // Forced colors mode
                "forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText]",

                // Disabled
                "data-[disabled]:opacity-50",

                "pl-1"
              )}
            >
              <CheckIcon className="relative hidden size-4 self-center stroke-current group-data-[selected]/option:inline " />
              <span
                className={clsx(
                  className,
                  selectboxOptionClasses,
                  "col-start-2"
                )}
              >
                {children}
              </span>
            </div>
          );
        }

        return (
          <div
            className={clsx(
              // Basic layout
              "group/option grid cursor-default grid-cols-[theme(spacing.4),1fr] items-baseline gap-x-1.5 py-1.5 ",

              // Typography
              "text-base/6 text-zinc-950 sm:text-sm/6 forced-colors:text-[CanvasText]",

              // Focus
              "outline-none data-[focus]:bg-blue-500 data-[focus]:text-white",

              // Forced colors mode
              "forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText]",

              // Disabled
              "data-[disabled]:opacity-50",

              "pl-1"
            )}
          >
            <div className="size-4" />
            <span
              className={clsx(className, selectboxOptionClasses, "col-start-2")}
            >
              {children}
            </span>
          </div>
        );
      }}
    </HeadlessComboboxOption>
  );
}

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
            onChange={(event) => {
              onChange && onChange(event);
              fieldOnChange(event.target.value);
            }}
            className={inputClasses}
          >
            <option disabled value={""} className={clsx("py-2 pl-3 pr-9")}>
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

export function Listbox<
  Data extends { id: string | number; [key: string]: any },
>({
  className,
  placeholder,
  autoFocus,
  data,
  valueKey,
  displayValueKey,
  "aria-label": ariaLabel,
  children,
  onChange,
  ...props
}: SelectProps<Data> &
  Omit<
    HeadlessListboxProps<typeof Fragment, Data>,
    "multiple" | "children" | "name" | "onChange"
  > & {
    children: (item: Data) => React.ReactNode;
    placeholder?: React.ReactNode;
    autoFocus?: boolean;
    "aria-label"?: string;
  }) {
  const form = useFormContext();

  const { name } = useField();

  const options = useMemo(
    () =>
      (data || []).map((item) => ({
        ...item,
        _listbox: {
          displayValue: getEntryFromPath(item, displayValueKey).entryValue,
          value: valueKey
            ? getEntryFromPath(item, valueKey).entryValue
            : item.id,
        },
      })),
    [data]
  );

  const Options = useMemo(
    () => (
      <For each={options}>
        {(i) => (
          <ListboxOption key={i.id} value={i}>
            {children(i)}
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
        <Span>
          <HeadlessListbox
            as={"div"}
            onChange={(v: any) => {
              onChange && onChange(v);
              fieldOnChange(v._listbox.value);
            }}
            multiple={false}
            value={options.find((i) => i._listbox.value === value) || ""}
            {..._field}
            {...props}
          >
            <HeadlessListboxButton
              autoFocus={autoFocus}
              data-slot="control"
              aria-label={ariaLabel}
              className={clsx([
                className,
                // Basic layout
                "group relative block w-full",

                // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
                "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow",

                // Hide default focus styles
                "focus:outline-none",

                // Focus ring
                "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:after:data-[focus]:ring-2 sm:after:data-[focus]:ring-blue-500",

                // Disabled state
                "data-[disabled]:opacity-50 before:data-[disabled]:bg-zinc-950/5 before:data-[disabled]:shadow-none",
              ])}
            >
              <HeadlessListboxSelectedOption
                as="span"
                options={Options}
                placeholder={
                  placeholder && (
                    <span className="block truncate text-zinc-500">
                      {placeholder}
                    </span>
                  )
                }
                className={clsx([
                  // Basic layout
                  "relative grid cursor-default items-baseline gap-x-1.5 rounded-lg py-1.5 pl-2 pr-3",

                  // Set minimum height for when no value is selected
                  "min-h-9",

                  // Horizontal padding
                  "pl-[calc(theme(spacing[3.5])-1px)] pr-[calc(theme(spacing.7)-1px)] sm:pl-[calc(theme(spacing.3)-1px)]",

                  // Typography
                  "text-left text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 forced-colors:text-[CanvasText]",

                  // Border
                  "border border-zinc-950/10 group-data-[active]:border-zinc-950/20 group-data-[hover]:border-zinc-950/20",

                  // Background color
                  "bg-transparent",

                  // Invalid state
                  "group-data-[invalid]:border-red-500 group-data-[invalid]:group-data-[hover]:border-red-500 ",

                  // Disabled state
                  "group-data-[disabled]:border-zinc-950/20 group-data-[disabled]:opacity-100",
                ])}
              />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="size-4 text-black text-zinc-500" />
              </span>
            </HeadlessListboxButton>
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
                className={clsx(
                  // Listbox z index
                  "z-[150]",

                  // Base styles
                  "isolate w-max min-w-[calc(var(--button-width)+1.75rem)] select-none scroll-py-1 rounded-xl p-1",

                  // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
                  "outline outline-1 outline-transparent focus:outline-none",

                  // Handle scrolling when menu won't fit in viewport
                  "overflow-y-scroll overscroll-contain",

                  // Popover background
                  "bg-white/75 backdrop-blur-xl",

                  // Shadows
                  "shadow-lg ring-1 ring-zinc-950/10"
                )}
              >
                {Options}
              </HeadlessListboxOptions>
            </HeadlessTransition>
          </HeadlessListbox>
        </Span>
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
      {({ selectedOption }) => {
        if (selectedOption) {
          return (
            <div className={clsx(className, selectboxOptionClasses)}>
              {children}
            </div>
          );
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
            <span
              className={clsx(className, selectboxOptionClasses, "col-start-2")}
            >
              {children}
            </span>
          </div>
        );
      }}
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
