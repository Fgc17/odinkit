"use client";
import {
  Column,
  Header,
  Table,
  Table as TableType,
} from "@tanstack/react-table";
import { use, useMemo, useState } from "react";
import { DebouncedInput } from "../Form/Input";
import { Select } from "../Form/Selectbox/Select";
import { useFormContext } from "../Form/Form";
import { useField } from "../Form/Field";
import { Label, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { CheckIcon, FunnelIcon } from "@heroicons/react/24/outline";
import {
  FunnelIcon as FilledFunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
export function ColumnFilterPopover({
  table,
  header,
}: {
  table: Table<any>;
  header: Header<any, any>;
}) {
  const form = useFormContext();
  const Field = useMemo(() => form.createField(), []);

  return (
    <Popover>
      {({ open, close }) => (
        <>
          <PopoverButton className={"flex flex-col items-center"}>
            {header.column.getIsFiltered() ? (
              <FilledFunnelIcon
                className="text-zinc-500 dark:text-zinc-400"
                height={16}
                width={16}
              />
            ) : (
              <FunnelIcon
                className="text-zinc-500 dark:text-zinc-400"
                height={16}
                width={16}
              />
            )}
          </PopoverButton>
          <PopoverPanel
            anchor="bottom"
            className="z-[20] flex min-w-[180px] flex-col items-center gap-2 rounded-lg border border-zinc-300 bg-white bg-opacity-90 p-1 lg:flex-row"
          >
            {header.column.columnDef.meta?.filterVariant === "range" ? (
              <>
                <Field className={"w-full"} name={`${header.column.id}.0`}>
                  <Label>De</Label>
                  <ColumnFilter table={table} column={header.column} />
                </Field>
                <Field className={"w-full"} name={`${header.column.id}.1`}>
                  <Label>Até</Label>
                  <ColumnFilter table={table} column={header.column} />
                </Field>
              </>
            ) : (
              <Field name={header.column.id}>
                <ColumnFilter table={table} column={header.column} />
              </Field>
            )}
            <div
              className={clsx(
                "flex justify-center gap-2",
                header.column.columnDef.meta?.filterVariant === "range" &&
                  "lg:mt-[20px]"
              )}
            >
              <XMarkIcon
                className="cursor-pointer rounded-lg text-gray-700 hover:bg-zinc-300"
                onClick={() => {
                  close();
                  table.resetPageIndex();
                  header.column.setFilterValue("");
                }}
                height={24}
                width={24}
              />
              <CheckIcon
                onClick={() => {
                  close();
                }}
                className="cursor-pointer rounded-lg text-gray-700 hover:bg-zinc-300"
                height={24}
                width={24}
              />
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}

export function ColumnFilter({
  table,
  column,
}: {
  column: Column<any, unknown>;
  table: TableType<any>;
}) {
  const columnFilterValue = column.getFilterValue();
  const { name } = useField();
  const rangeIndex = parseInt(name.replace(/\D/g, ""));
  const { filterVariant, selectOptions } = column.columnDef.meta ?? {};
  const [_, setIsLoading] = useState(false);

  switch (filterVariant) {
    case "select":
      return (
        <Select
          displayValueKey="name"
          data={
            selectOptions
              ? selectOptions?.map((a) => ({ name: a.label, id: a.value }))
              : Array.from(column.getFacetedUniqueValues())
                  .sort((a, b) => String(a[0])?.localeCompare(String(b[0])))
                  .filter((v) => v[0])
                  .map((a) => ({ name: a[0], id: a[0] }))
          }
          onChange={(e) => {
            if (!e) return column.setFilterValue("");
            table.resetPageIndex();
            if (!e) return column.setFilterValue("");
            if ("target" in e) {
              column.setFilterValue(e.target.value);
            } else {
              column.setFilterValue(e.id);
            }
          }}
          value={columnFilterValue?.toString()}
        />
      );
    case "range":
      return (
        <DebouncedInput
          autoComplete="off"
          setIsLoading={setIsLoading}
          onChange={(e) => {
            const rangeFilterValue = column.getFilterValue() as string[];
            table.resetPageIndex();
            const newFilterValue =
              rangeIndex === 0
                ? [e, rangeFilterValue ? rangeFilterValue[1] : ""]
                : [rangeFilterValue ? rangeFilterValue[0] : "", e];

            if (newFilterValue.every((v) => !v))
              return column.setFilterValue("");
            return column.setFilterValue(newFilterValue);
          }}
          placeholder="Selecionar"
          type="date"
          value={
            columnFilterValue
              ? (columnFilterValue as string[])[rangeIndex] ?? ""
              : ""
          }
        />
      );
    default:
      return (
        <DebouncedInput
          autoComplete="off"
          setIsLoading={setIsLoading}
          onChange={(e) => {
            if (!e) return column.setFilterValue("");
            table.resetPageIndex();

            column.setFilterValue(e);
          }}
          placeholder={`Buscar...`}
          type="text"
          value={(columnFilterValue ?? "") as string}
        />
      );
  }
}
