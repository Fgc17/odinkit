import { read, utils } from "xlsx";

function objectValuesToString(obj: { [key: string]: any }): {
  [key: string]: string;
} {
  const transformedObj: { [key: string]: string } = {};

  for (const key in obj) {
    transformedObj[key] = String(obj[key]);
  }

  return transformedObj;
}

export const sheetToJson = (sheet: ArrayBuffer) => {
  const Book = read(sheet);
  if (!Book || !Book.SheetNames[0]) return;
  const Sheets = Book.Sheets[Book.SheetNames[0]];
  if (!Sheets) return;
  const data: any[] = utils.sheet_to_json<any>(Sheets);
  const parsedData = data.map((row) => objectValuesToString(row));
  return parsedData;
};
