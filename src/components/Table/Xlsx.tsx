import { TableCellsIcon } from "@heroicons/react/24/solid";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { Button } from "../Button";

export interface XlsxProps {
  data: any[];
  fileName?: string;
}

export default function Xlsx({ data, fileName }: XlsxProps) {
  function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  const handleDownload = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    const blob = new Blob([s2ab(wbout)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName || "arquivo"}.xlsx`;

    // Simulate click on the link to trigger the download
    a.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Button
        color="emerald"
        className={"my-0"}
        onClick={() => handleDownload()}
      >
        <div className="flex items-center justify-center gap-2">
          <TableCellsIcon className="h-6 w-6 text-white" />
          <span className="-me-1 hidden lg:inline">Exportar para</span>Excel
        </div>
      </Button>
    </>
  );
}
