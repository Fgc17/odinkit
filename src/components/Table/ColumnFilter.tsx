"use client";
import { Column, Table as TableType } from "@tanstack/react-table";
import { useState } from "react";
import { DebouncedInput } from "../Form/Input";
import { Select } from "../Form/Selectbox/Select";

export function ColumnFilter({
  table,
  column,
}: {
  column: Column<any, unknown>;
  table: TableType<any>;
}) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant, selectOptions } = column.columnDef.meta ?? {};
  const [_, setIsLoading] = useState(false);

  return filterVariant === "select" ? (
    <Select
      displayValueKey="name"
      data={Array.from(column.getFacetedUniqueValues())
        .sort((a, b) => String(a[0])?.localeCompare(String(b[0])))
        .filter((v) => v[0])
        .map((value) => ({
          id: value[0] ?? "N/D",
          name: selectOptions?.find((v) => v.value === value[0])?.label,
        }))}
      onChange={(e) => {
        if (!e) return;
        table.resetPageIndex();
        if ("target" in e) {
          column.setFilterValue(e.target.value);
        } else {
          column.setFilterValue(e.id);
        }
      }}
      value={columnFilterValue?.toString()}
    />
  ) : (
    <DebouncedInput
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
