import { Row } from "@tanstack/react-table";
import dayjs from "dayjs";

export function dateRangeFilterFn<T>(
  row: Row<T>,
  columnId: string,
  filterValue: any
) {
  if (!filterValue) {
    return true;
  }
  const [startDate, endDate] = filterValue;
  const rowValue = (row.original as any)[columnId];

  // Ensure the row value is a valid date input for dayjs
  const rowDate = dayjs(
    rowValue instanceof Date ||
      typeof rowValue === "string" ||
      typeof rowValue === "number"
      ? rowValue
      : undefined
  );

  if (!startDate && !endDate) {
    return true; // No filtering if both dates are not provided
  }

  if (startDate && endDate && dayjs(startDate).isAfter(dayjs(endDate))) {
    return false; // Invalid range, return false
  }

  const start = startDate ? dayjs(startDate) : null;
  const end = endDate ? dayjs(endDate) : null;
  const startDateFormat = start?.format("YYYY-MM-DD");
  const endDateFormat = end?.format("YYYY-MM-DD");

  let isSameDay = false;

  if (start && end) {
    isSameDay = startDateFormat === endDateFormat;
  }

  if (isSameDay) {
    const rowDateFormat = rowDate.format("YYYY-MM-DD");
    return rowDateFormat === startDateFormat;
  }

  if (!start && end) {
    return rowDate.isBefore(end);
  }

  if (start && !end) {
    return rowDate.isAfter(start);
  }

  return rowDate.isBetween(start, end, "day", "[]");
}
