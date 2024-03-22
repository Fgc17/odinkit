"use client";

import { clsx } from "clsx";
import React, { useMemo } from "react";
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
import { Form, useForm } from "../Form/Form";
import { z } from "../../utils/zod";
import { Input } from "../Form/Input";
import Xlsx from "./Xlsx";

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

function DebouncedInput({
  value: initialValue,
  onChange,
  setIsLoading,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  setIsLoading: Dispatch<boolean>;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, debounce, onChange]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

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
  data,
  columns,
  xlsx,
  div,
}: {
  div?: Omit<React.ComponentPropsWithoutRef<"div">, "children" | "className">;
  search?: boolean;
  pagination?: boolean;
  xlsx?: {
    data: any[];
  };
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
}) {
  const columnHelper = createColumnHelper<Data>();
  const [globalFilter, setGlobalFilter] = useState("");

  const cols = columns(columnHelper);

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);

    addMeta({
      itemRank,
    });

    return itemRank.passed;
  };

  const table = useReactTable({
    data,
    columns: cols,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    pageCount: data.length ? Math.ceil(data.length / 10) : 1,
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

  const form = useForm({ schema: tableSearchSchema, mode: "onChange" });
  const Field = useMemo(() => form.createField(), []);

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
            <div className="flex items-center justify-between gap-3">
              {search && (
                <Form hform={form} className="flex-grow">
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
                </Form>
              )}
              {xlsx && (
                <div className="mt-1.5">
                  <Xlsx data={xlsx.data} />
                </div>
              )}
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
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          </TableHeader>
                        )}
                      </For>
                    </TableRow>
                  )}
                </For>
              </TableHead>
              <TableBody>
                <For each={table.getRowModel().rows} identifier="row">
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
          {pagination && (
            <Pagination className="my-2">
              <PaginationPrevious
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                Anterior
              </PaginationPrevious>
              <PaginationList>
                {
                  <For
                    each={Array.from(
                      { length: table.getPageCount() },
                      (_, index) => index + 1
                    )}
                  >
                    {(page, index) => {
                      const pageIndex = table.getState().pagination.pageIndex;
                      const pageCount = table.getPageCount();

                      const isCurrent = pageIndex === index;
                      const isFirstPage = index === 0;
                      const isLastPage = index === pageCount - 1;
                      const isNearCurrent = Math.abs(index - pageIndex) <= 2;

                      const shouldShow =
                        isCurrent || isFirstPage || isLastPage || isNearCurrent;

                      const shouldShowGapBeforeCurrent =
                        index === pageIndex - 3 && pageIndex > 3;
                      const shouldShowGapBeforeLast =
                        index === pageCount - 4 &&
                        pageIndex < pageCount - 4 &&
                        pageIndex < pageCount - 1;

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
              <PaginationNext
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                Próxima
              </PaginationNext>
            </Pagination>
          )}
        </div>
      </div>
    </TableContext.Provider>
  );
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
        "px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))]",
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
