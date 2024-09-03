import { useMemo } from "react";
import { For } from "../For";
import { useForm, useFormContext } from "../Form/Form";
import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "../Pagination";
import { Table as TableType } from "@tanstack/react-table";
import { Select } from "../Form/Selectbox/Select";

export default function TablePagination({ table }: { table: TableType<any> }) {
  const form = useFormContext();

  const tablePageCount = useMemo(
    () =>
      Math.ceil(
        table.getFilteredRowModel().rows.length / form.watch("itemsPerPage")
      ),
    [table.getFilteredRowModel(), form.watch("itemsPerPage")]
  );

  const Field = useMemo(() => form.createField(), [form]);
  return (
    <Pagination className="my-2 max-w-full">
      <PaginationPrevious
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        <span className="hidden lg:block">Anterior</span>
      </PaginationPrevious>
      <div className="flex items-center gap-2 lg:gap-2">
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
        <Field name="itemsPerPage">
          <Select
            className={"mb-0 mt-0 text-xs"}
            data={[
              { id: 10, name: "10" },
              { id: 20, name: "20" },
              { id: 30, name: "30" },
              { id: 50, name: "50" },
            ]}
            displayValueKey="name"
            onChange={(e) =>
              table.setPageSize(
                Number((e as React.ChangeEvent<HTMLSelectElement>).target.value)
              )
            }
          />
        </Field>
        <div className="hidden text-xs text-gray-500 md:block">
          {table.getPaginationRowModel().rows.length} /{" "}
          {table.getFilteredRowModel().rows.length} resultados
        </div>
      </div>
      <PaginationNext
        disabled={
          !table.getCanNextPage() ||
          table.getState().pagination.pageIndex + 1 >= tablePageCount
        }
        onClick={() => table.nextPage()}
      >
        <span className="hidden lg:block">Próxima</span>
      </PaginationNext>
    </Pagination>
  );
}
