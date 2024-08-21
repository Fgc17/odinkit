import { useMemo } from "react";
import { useFormContext } from "../Form/Form";
import { Input } from "../Form/Input";

export default function TableGlobalFilter({
  globalFilter,
  setGlobalFilter,
  cols,
}: {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  cols: any[];
}) {
  const form = useFormContext();
  const Field = useMemo(() => form.createField(), []);

  return (
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
    </Field>
  );
}
