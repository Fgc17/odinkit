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

import * as classes from "./classes";

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
            onChange={(_: any) => {
              const data: SelectOption<Data> = _;
              onChange && onChange(data?._);
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
                className={clsx(!options.length && "hidden", classes.options)}
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
                      {children(i._)}
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
    <HeadlessComboboxOption as={"div"} className={classes.option} {...props}>
      {({ selected }) => (
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
      )}
    </HeadlessComboboxOption>
  );
}
