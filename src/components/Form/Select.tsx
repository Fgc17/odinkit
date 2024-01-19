import {
  Select as HeadlessSelect,
  Combobox as HeadlessCombobox,
  type SelectProps as HeadlessSelectProps,
  type ComboboxProps as HeadlessComboboxProps,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
} from "@headlessui/react";
import { clsx } from "clsx";
import { Controller, Path, useFormContext } from "react-hook-form";
import { For } from "../For";
import { useField } from "./Form";
import { useMemo, useRef, useState } from "react";
import { getEntryFromPath } from "./utils/getEntryFromPath";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface SelectFieldProps<Data> {
  data?: Data[] | [];
  displayValueKey: Path<Data>;
  valueKey?: Path<Data>;
  maxVisibleOptions?: number;
  onChange?: (value: any) => void;
}

interface SelectOption {
  id: string;
  displayValue: string;
  value: string;
}

const selectFieldSpanClasses = (extraClasses: string | undefined) =>
  clsx(
    extraClasses,
    "group relative block w-full",
    "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow",
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:after:has-[[data-focus]]:ring-2 sm:after:has-[[data-focus]]:ring-blue-500",
    "has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none"
  );

const selectFieldClasses = clsx(
  "relative block w-full appearance-none rounded-lg py-[calc(theme(spacing[1.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
  "[&_optgroup]:font-semibold",
  "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6",
  "border border-zinc-950/10 data-[hover]:border-zinc-950/20 -[hover]:border-white/20",
  "bg-transparent",
  "focus:outline-none",
  "data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]: data-[invalid]:data-[hover]:",
  "data-[disabled]:border-zinc-950/20 data-[disabled]:opacity-100 -[hover]:data-[disabled]:border-white/15 data-[disabled]: data-[disabled]:/[2.5%]"
);

const visibleOptions = {
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

export function Select<
  Value extends { id: string | number; [key: string]: any },
>({
  className,
  multiple,
  data,
  onChange,
  displayValueKey,
  valueKey,
  ...props
}: HeadlessSelectProps & SelectFieldProps<Value>) {
  const form = useFormContext();

  const { name } = useField();

  const options = useMemo(
    () =>
      (data || []).map((i) => ({
        id: i.id as string,
        displayValue: getEntryFromPath(i, displayValueKey).entryValue,
        value: valueKey ? getEntryFromPath(i, valueKey).entryValue : i.id,
      })),
    [data]
  );

  return (
    <span
      data-slot="control"
      className={selectFieldSpanClasses(className as string)}
    >
      <Controller
        name={name}
        control={form.control}
        render={({ field: { onChange: fieldOnChange, value, ..._field } }) => (
          <HeadlessSelect
            {...props}
            onChange={({ target: { value } }) => {
              onChange && onChange(value);
              fieldOnChange(value);
            }}
            className={selectFieldClasses}
          >
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
    </span>
  );
}

export function Combobox<
  Value extends { id: string | number },
  Nullable extends boolean,
  Multiple extends boolean,
>({
  className,
  data,
  setData,
  debounce = 500,
  displayValueKey,
  valueKey,
  maxVisibleOptions = 7,
  onChange,
  disabled,
  ...props
}: HeadlessComboboxProps<Value, Nullable, Multiple> &
  SelectFieldProps<Value> & {
    debounce?: number;
    setData?: (query: string) => void;
    className?: string;
  }) {
  const form = useFormContext();

  const { name } = useField();

  const [query, setQuery] = useState("");

  const options = useMemo(() => {
    const options = (data || []).map((i) => {
      return {
        id: i.id as string,
        displayValue: getEntryFromPath(i, displayValueKey).entryValue,
        value: valueKey ? getEntryFromPath(i, valueKey).entryValue : i.id,
      };
    });

    return setData
      ? options
      : options.filter((o) =>
          o.displayValue.toLowerCase().includes(query.toLowerCase())
        );
  }, [data, setData ? undefined : query]);

  const timeout = useRef(setTimeout(() => {}, 0));

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange: fieldOnChange, value, ..._field } }) => (
        <span
          data-slot="control"
          className={selectFieldSpanClasses(className as string)}
        >
          <HeadlessCombobox
            as={"div"}
            value={
              options?.find((o: any) => {
                return o.value === value;
              }) || ""
            }
            onChange={(data: SelectOption) => {
              onChange && onChange(data);
              fieldOnChange(data.value);
            }}
            {..._field}
          >
            <ComboboxInput
              className={selectFieldClasses}
              onChange={(event) => {
                setQuery(event.target.value);
                fieldOnChange(event.target.value);
                if (setData) {
                  clearTimeout(timeout.current);

                  timeout.current = setTimeout(() => {
                    setData(query);
                  }, debounce);
                }
              }}
              displayValue={(item: SelectOption) =>
                form.watch(name) === "" ? "" : item.displayValue || query
              }
            />
            <ComboboxButton
              className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
              onClick={() => setQuery("")}
            >
              <MagnifyingGlassIcon className="size-5 text-zinc-500" />
            </ComboboxButton>
            <ComboboxOptions
              className={clsx(
                (visibleOptions as any)[maxVisibleOptions],
                "absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm  "
              )}
            >
              <For each={options}>
                {(item) => {
                  return (
                    <ComboboxOption
                      key={item.id}
                      value={item}
                      className={({ active }) =>
                        clsx(
                          "py-2 pl-3 pr-9",
                          active && "cursor-pointer bg-gray-100"
                        )
                      }
                    >
                      {item.displayValue}
                    </ComboboxOption>
                  );
                }}
              </For>
            </ComboboxOptions>
          </HeadlessCombobox>
        </span>
      )}
    />
  );
}
