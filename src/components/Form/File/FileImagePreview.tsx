import { useMemo } from "react";
import { useField } from "../Field";
import { useFormContext } from "../Form";
import { getFileExtension, getFileMime } from "./utils";
import { fileFormats } from "./FileFormat";
import Image from "next/image";
import clsx from "clsx";

export function FileImagePreview({
  defaultValue,
  className,
}: {
  defaultValue?: string;
  className?: string;
}) {
  const form = useFormContext();

  const field = useField();

  const images = form.watch(field.name);

  const filePreview = useMemo(() => {
    if (!images) return;
    return images.map((file: any) => {
      return getFileMime(file) === "image"
        ? URL.createObjectURL(file)
        : fileFormats[getFileExtension(file)] ?? "";
    });
  }, [images]);

  if (!filePreview && !defaultValue) return null;

  return (
    <div className="relative flex justify-center">
      <img
        alt="imagem"
        className={clsx("rounded-md", className)}
        src={filePreview?.length ? filePreview[0] : defaultValue}
      />
    </div>
  );
}
