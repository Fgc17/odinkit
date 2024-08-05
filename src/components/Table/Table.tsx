"use client";

import { clsx } from "clsx";
import React, { useCallback, useMemo } from "react";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
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
  Column,
  RowData,
  Table as TableType,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { For } from "../For";
import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "../Pagination";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Form, useForm, useFormContext } from "../Form/Form";
import { z } from "../../utils/zod";
import { DebouncedInput, Input } from "../Form/Input";
import Xlsx from "./Xlsx";
import { random } from "lodash";
import { Select } from "../Form/Selectbox/Select";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
    selectOptions?: { id: string; name: string }[];
  }
}

const TableContext = createContext<{
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
});

type ColumnHelper<Data> = ReturnType<typeof createColumnHelper<Data>>;

export function TableMock({
  bleed = false,
  dense = false,
  grid = false,
  striped = false,
  className,
  children,
  ...props
}: {
  bleed?: boolean;
  dense?: boolean;
  grid?: boolean;
  striped?: boolean;
} & React.ComponentPropsWithoutRef<"div">) {
  return (
    <TableContext.Provider
      value={
        { bleed, dense, grid, striped } as React.ContextType<
          typeof TableContext
        >
      }
    >
      <div className="flow-root">
        <div
          {...props}
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
            <table className="min-w-full text-left text-sm/6">{children}</table>
          </div>
        </div>
      </div>
    </TableContext.Provider>
  );
}

export function Table<Data>({
  bleed = false,
  dense = false,
  grid = false,
  striped = false,
  search = true,
  pagination = true,
  className,
  dataSetter,
  defaultColumnFilters,
  data,
  columns,
  xlsx,
  link,
  div,
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
      zodObject = zodObject.merge(
        z.object({
          [col.id || random()]: defaultColumnFilters?.find(
            (f) => f.id === col.id
          )?.value
            ? z.string()
            : z.string().optional(),
        })
      );
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
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const Field = useMemo(() => form.createField(), []);

  const tablePageCount = useMemo(
    () => Math.ceil(table.getFilteredRowModel().rows.length / 10),
    [table.getFilteredRowModel()]
  );

  return (
    <TableContext.Provider
      value={
        { bleed, dense, grid, striped } as React.ContextType<
          typeof TableContext
        >
      }
    >
      <Form hform={form} className={clsx(pagination && "pb-4 lg:pb-0")}>
        <div className="flex items-center justify-between gap-3">
          {search && (
            <Field name="globalFilter" className="flex-grow">
              <Input
                onChange={(e) => {
                  setGlobalFilter && setGlobalFilter(String(e.target.value));
                }}
                placeholder={`Procurar (ex: ${cols
                  .filter((c) => c.enableGlobalFilter)
                  .map((c) => c.header)
                  .slice(0, 3)
                  .join(", ")})`}
              />
              {dataSetter}
            </Field>
          )}
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
            <div className="flex items-center justify-between gap-3">
              {/* {search && (
                  <Field name="globalFilter">
                    <Input
                      onChange={(e) => {
                        setGlobalFilter &&
                          setGlobalFilter(String(e.target.value));
                      }}
                      placeholder={`Procurar (ex: ${cols
                        .filter((c) => c.enableGlobalFilter)
                        .map((c) => c.header)
                        .slice(0, 3)
                        .join(", ")})`}
                    />
                    {dataSetter}
                  </Field>
                )} */}
            </div>

            <table className="min-w-full text-left text-sm/6">
              <TableHead>
                <For each={table.getHeaderGroups()} identifier="thead">
                  {(headerGroup) => (
                    <TableRow>
                      <For each={headerGroup.headers} identifier="header">
                        {(header) => (
                          <TableHeader>
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
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                            {header.column.getCanFilter() && (
                              <div>
                                <Field name={header.column.id}>
                                  <ColumnFilter
                                    table={table}
                                    column={header.column}
                                  />
                                </Field>
                              </div>
                            )}
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

        {pagination && (
          <Pagination className="my-2">
            <PaginationPrevious
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Anterior
            </PaginationPrevious>
            <div className="flex items-center gap-2">
              <PaginationList>
                {
                  <For
                    each={Array.from(
                      {
                        length: tablePageCount,
                      },
                      (_, index) => index + 1
                    )}
                  >
                    {(page, index) => {
                      const pageIndex = table.getState().pagination.pageIndex;

                      const isCurrent = pageIndex === index;
                      const isFirstPage = index === 0;
                      const isLastPage = index === tablePageCount - 1;
                      const isNearCurrent = Math.abs(index - pageIndex) <= 2;

                      const shouldShow =
                        isCurrent || isFirstPage || isLastPage || isNearCurrent;

                      const shouldShowGapBeforeCurrent =
                        index === pageIndex - 3 && pageIndex > 3;
                      const shouldShowGapBeforeLast =
                        index === tablePageCount - 4 &&
                        pageIndex < tablePageCount - 4 &&
                        pageIndex < tablePageCount - 1;

                      return (
                        <>
                          {shouldShowGapBeforeCurrent && <PaginationGap />}
                          {index === 1 && pageIndex > 3 && <PaginationGap />}
                          {shouldShow && (
                            <PaginationPage
                              current={isCurrent}
                              onClick={() => table.setPageIndex(index)}
                            >
                              {String(page)}
                            </PaginationPage>
                          )}
                          {shouldShowGapBeforeLast && <PaginationGap />}
                        </>
                      );
                    }}
                  </For>
                }
              </PaginationList>
            </div>
            <PaginationNext
              disabled={
                !table.getCanNextPage() ||
                table.getState().pagination.pageIndex + 1 >= tablePageCount
              }
              onClick={() => table.nextPage()}
            >
              Próxima
            </PaginationNext>
          </Pagination>
        )}
      </Form>
    </TableContext.Provider>
  );
}

{
  /* <PaginationPage href="?page=1">1</PaginationPage>
              <PaginationPage href="?page=2">2</PaginationPage>
              <PaginationPage href="?page=3" current>
                3
              </PaginationPage>
              <PaginationPage href="?page=4">4</PaginationPage>
              <PaginationGap />
              <PaginationPage href="?page=65">65</PaginationPage>
              <PaginationPage href="?page=66">66</PaginationPage> */
}

export function TableHead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"thead">) {
  return <thead className={clsx(className, "text-zinc-500 ")} {...props} />;
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
  children,
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
            "/[2.5%] has-[[data-row-link][data-focus]]:outline has-[[data-row-link][data-focus]]:outline-2 has-[[data-row-link][data-focus]]:-outline-offset-2 has-[[data-row-link][data-focus]]:outline-blue-500",
          striped && "/[2.5%] even:bg-zinc-950/[2.5%]",
          href && striped && "hover:bg-zinc-950/5 ",
          href && !striped && "/[2.5%] hover:bg-zinc-950/[2.5%]"
        )}
      >
        {children}
      </tr>
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
        "border-b border-b-zinc-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] ",
        grid && "border-l border-l-zinc-950/5 first:border-l-0 ",
        !bleed && "sm:first:pl-2 sm:last:pr-2"
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
        "relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))]",
        !striped && "border-b border-zinc-950/5 ",
        grid && "border-l border-l-zinc-950/5 first:border-l-0 ",
        dense ? "py-2.5" : "py-4",
        !bleed && "sm:first:pl-2 sm:last:pr-2"
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

export function ColumnFilter({
  table,
  column,
}: {
  column: Column<any, unknown>;
  table: TableType<any>;
}) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const [_, setIsLoading] = useState(false);

  return filterVariant === "select" ? (
    <Select
      displayValueKey="name"
      data={
        column.columnDef.meta?.selectOptions ??
        Array.from(column.getFacetedUniqueValues())
          .sort((a, b) => String(a[0])?.localeCompare(String(b[0])))
          .filter((value) => value[0])
          .map((value) => ({
            id: value[0],
            name: value[0],
          }))
      }
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
    // See faceted column filters example for datalist search suggestions
  );
}
