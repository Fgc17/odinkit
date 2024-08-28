"use client";

import { clsx } from "clsx";
import React, { useCallback, useMemo } from "react";
import { createContext, useContext, useState } from "react";
import { Link } from "../Link";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  flexRender,
  createColumnHelper,
  RowData,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { For } from "../For";
import { Form, useForm } from "../Form/Form";
import { z } from "../../utils/zod";
import { Input } from "../Form/Input";
import Xlsx from "./Xlsx";
import { random } from "lodash";
import { Dropdown, DropdownButton, DropdownMenu } from "../Dropdown";
import { CheckIcon, FunnelIcon } from "@heroicons/react/24/outline";
import {
  CheckBadgeIcon,
  FunnelIcon as FilledFunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { ColumnFilter, ColumnFilterPopover } from "./ColumnFilter";
import TablePagination from "./Pagination";
import TableGlobalFilter from "./GlobalFilter";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Label } from "../Form/Field";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    selectOptions?: Array<{ value?: TValue; label: string }>;
    filterVariant?: "text" | "range" | "select";
    className?: string;
  }
}

export const TableContext = createContext<{
  bleed: boolean;
  dense: boolean;
  grid: boolean;
  striped: boolean;
}>({
  bleed: false,
  dense: false,
  grid: false,
  striped: false,
});

const tableSearchSchema = z.object({
  globalFilter: z.string().optional(),
  itemsPerPage: z.number(),
});

type ColumnHelper<Data> = ReturnType<typeof createColumnHelper<Data>>;

export const TableFlag = {
  ENABLE_COLUMN_FILTER: false,
};

export function Table<Data>({
  bleed = false,
  dense = false,
  grid = false,
  striped = false,
  search = true,
  pagination = true,
  className,
  dataSetter,
  disableMobileFilters,
  defaultColumnFilters,
  data,
  columns,
  xlsx,
  link,
  div,
  children,
}: {
  disableMobileFilters?: boolean;
  div?: Omit<React.ComponentPropsWithoutRef<"div">, "children" | "className">;
  search?: boolean;
  pagination?: boolean;
  xlsx?: {
    data: any[];
    fileName?: string;
  };
  link?: React.ReactNode;
  defaultColumnFilters?: ColumnFiltersState;
  bleed?: boolean;
  dense?: boolean;
  grid?: boolean;
  striped?: boolean;
  data: Data[];
  dataSetter?: JSX.Element;
  columns: (
    columnHelper: ColumnHelper<Data>
  ) => (
    | ReturnType<ColumnHelper<any>["accessor"]>
    | ReturnType<ColumnHelper<any>["group"]>
    | ReturnType<ColumnHelper<any>["group"]>
  )[];
  className?: string;
  children?: React.ReactNode;
}) {
  const columnHelper = createColumnHelper<Data>();

  const cols = columns(columnHelper);

  const [globalFilter, setGlobalFilter] = useState("");

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);

    addMeta({
      itemRank,
    });

    return itemRank.passed;
  };

  const zodColumns = useCallback(() => {
    let zodObject = z.object({});

    cols.forEach((col) => {
      if (col.meta?.filterVariant === "range") {
        const columnId = col.id || random();
        zodObject = zodObject.merge(
          z.object({
            [`${columnId}-0`]: defaultColumnFilters?.find(
              (f) => f.id === col.id
            )?.value
              ? z.string()
              : z.string().optional(),
            [`${columnId}-1`]: defaultColumnFilters?.find(
              (f) => f.id === col.id
            )?.value
              ? z.string()
              : z.string().optional(),
          })
        );
      } else {
        zodObject = zodObject.merge(
          z.object({
            [col.id || random()]: defaultColumnFilters?.find(
              (f) => f.id === col.id
            )?.value
              ? z.string()
              : z.string().optional(),
          })
        );
      }
    });

    return zodObject;
  }, [cols]);

  const form = useForm({
    schema: tableSearchSchema.merge(zodColumns()),
    defaultValues: {
      ...(defaultColumnFilters
        ? Object.assign(
            {},
            ...defaultColumnFilters.map((f) => ({ [f.id]: f.value }))
          )
        : undefined),
      itemsPerPage: 10,
    },
  });

  const table = useReactTable({
    data,
    columns: cols,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    initialState: {
      columnFilters: defaultColumnFilters ?? [],
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const Field = useMemo(() => form.createField(), []);

  return (
    <TableContext.Provider
      value={
        { bleed, dense, grid, striped } as React.ContextType<
          typeof TableContext
        >
      }
    >
      <Form hform={form} className={clsx(pagination && "pb-2 lg:pb-0")}>
        <div className="flex items-center justify-between gap-3">
          {search && (
            <TableGlobalFilter
              cols={cols}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          )}
          {dataSetter}
          {link && <div className="mt-1.5">{link}</div>}
          {xlsx && (
            <div className="mt-1.5">
              <Xlsx fileName={xlsx.fileName} data={xlsx.data} />
            </div>
          )}
        </div>

        <div className="mt-3 flow-root">
          <div
            {...div}
            className={clsx(
              className,
              "-mx-[--gutter] overflow-x-auto whitespace-nowrap"
            )}
          >
            <div
              className={clsx(
                "inline-block min-w-full align-middle",
                !bleed && "sm:px-[--gutter]"
              )}
            >
              <table className="min-w-full text-left text-sm/6 text-zinc-950 dark:text-white">
                <TableHead>
                  <For each={table.getHeaderGroups()} identifier="thead">
                    {(headerGroup) => (
                      <TableRow>
                        <For each={headerGroup.headers} identifier="header">
                          {(header) => (
                            <TableHeader>
                              <div className="flex items-center gap-1">
                                <div
                                  {...{
                                    className: header.column.getCanSort()
                                      ? "cursor-pointer select-none"
                                      : "",
                                    onClick:
                                      header.column.getToggleSortingHandler(),
                                  }}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  {{
                                    asc: " ↑",
                                    desc: " ↓",
                                  }[header.column.getIsSorted() as string] ??
                                    null}
                                </div>
                                {!header.column.getCanFilter() && (
                                  <ColumnFilterPopover
                                    header={header}
                                    table={table}
                                  />
                                )}
                              </div>
                            </TableHeader>
                          )}
                        </For>
                      </TableRow>
                    )}
                  </For>
                </TableHead>

                <TableBody>
                  <For
                    each={table.getRowModel().rows}
                    identifier="row"
                    fallback={
                      <TableRow>
                        <For each={table.getAllColumns()}>
                          {(column, index) => (
                            <TableCell>
                              {index === 0 ? <>Nada por aqui.</> : null}
                            </TableCell>
                          )}
                        </For>
                      </TableRow>
                    }
                  >
                    {(row) => (
                      <TableRow>
                        <For each={row.getVisibleCells()} identifier="cell">
                          {(cell) => (
                            <TableCell>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          )}
                        </For>
                      </TableRow>
                    )}
                  </For>
                </TableBody>
              </table>
            </div>
          </div>
          {pagination && <TablePagination table={table} />}
        </div>
      </Form>
    </TableContext.Provider>
  );
}

export function TableHead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"thead">) {
  return (
    <thead
      {...props}
      className={clsx(className, "text-zinc-500 dark:text-zinc-400")}
    />
  );
}

export function TableBody(props: React.ComponentPropsWithoutRef<"tbody">) {
  return <tbody {...props} />;
}

const TableRowContext = createContext<{
  href?: string;
  target?: string;
  title?: string;
}>({
  href: undefined,
  target: undefined,
  title: undefined,
});

export function TableRow({
  href,
  target,
  title,
  className,
  ...props
}: {
  href?: string;
  target?: string;
  title?: string;
} & React.ComponentPropsWithoutRef<"tr">) {
  let { striped } = useContext(TableContext);

  return (
    <TableRowContext.Provider
      value={
        { href, target, title } as React.ContextType<typeof TableRowContext>
      }
    >
      <tr
        {...props}
        className={clsx(
          className,
          href &&
            "has-[[data-row-link][data-focus]]:outline has-[[data-row-link][data-focus]]:outline-2 has-[[data-row-link][data-focus]]:-outline-offset-2 has-[[data-row-link][data-focus]]:outline-blue-500 dark:focus-within:bg-white/[2.5%]",
          striped && "even:bg-zinc-950/[2.5%] dark:even:bg-white/[2.5%]",
          href && striped && "hover:bg-zinc-950/5 dark:hover:bg-white/5",
          href &&
            !striped &&
            "hover:bg-zinc-950/[2.5%] dark:hover:bg-white/[2.5%]"
        )}
      />
    </TableRowContext.Provider>
  );
}

export function TableHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"th">) {
  let { bleed, grid } = useContext(TableContext);

  return (
    <th
      {...props}
      className={clsx(
        className,
        "border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10",
        grid &&
          "border-l border-l-zinc-950/5 first:border-l-0 dark:border-l-white/5",
        !bleed && "sm:first:pl-1 sm:last:pr-1"
      )}
    />
  );
}

export function TableCell({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"td">) {
  let { bleed, dense, grid, striped } = useContext(TableContext);
  let { href, target, title } = useContext(TableRowContext);
  let [cellRef, setCellRef] = useState<HTMLElement | null>(null);

  return (
    <td
      ref={href ? setCellRef : undefined}
      {...props}
      className={clsx(
        className,
        "relative px-4 text-sm first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))]",
        !striped && "border-b border-zinc-950/5 dark:border-white/5",
        grid &&
          "border-l border-l-zinc-950/5 first:border-l-0 dark:border-l-white/5",
        dense ? "py-2.5" : "py-4",
        !bleed && "sm:first:pl-1 sm:last:pr-1"
      )}
    >
      {href && (
        <Link
          data-row-link
          href={href}
          target={target}
          aria-label={title}
          tabIndex={cellRef?.previousElementSibling === null ? 0 : -1}
          className="absolute inset-0 focus:outline-none"
        />
      )}
      {children}
    </td>
  );
}
