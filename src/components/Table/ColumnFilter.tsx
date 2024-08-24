"use client";
import { Column, Table as TableType } from "@tanstack/react-table";
import { use, useMemo, useState } from "react";
import { DebouncedInput } from "../Form/Input";
import { Select } from "../Form/Selectbox/Select";
import { useFormContext } from "../Form/Form";
import { useField } from "../Form/Field";

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
