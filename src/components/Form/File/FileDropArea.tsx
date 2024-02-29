//client
"use client";
import { FolderIcon } from "@heroicons/react/20/solid";
import { ReactNode, useContext } from "react";
import { FileInputContext } from "./FileInput";
import { useFormContext } from "../Form";
import { useField } from "../Field";
import { getFileExtension } from "./utils";
import clsx from "clsx";

export function FileDropArea({
  fileIcon,
  render,
}: {
  fileIcon?: ReactNode;
  render?: ReactNode;
}) {
  const fileInput = useContext(FileInputContext);

  const { error } = useField();

  return (
    <div
      {...{
        onDrop: async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const { files } = e.dataTransfer;

          if (!files?.length) return;

          const filesArray = Array.from(files);

          const isValid = await fileInput.validate(filesArray);

          if (!isValid) return;

          fileInput.onChange(filesArray);
        },
        onDragOver: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
      }}
      className="flex grow"
    >
      {
        <div
          className={clsx(
            "mt-3 flex grow items-center justify-center rounded-lg border border-dashed px-6 py-6",
            error ? ["border-red-300", "border-2"] : "border-gray-300"
          )}
        >
          <div className={clsx("text-center", error && "*:text-red-400")}>
            {render ?? (
              <>
                {fileIcon || (
                  <FolderIcon
                    className={clsx("mx-auto h-12 w-12 text-gray-300")}
                  />
                )}

                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor={fileInput.inputId}
                    className={clsx(
                      !error && "text-emerald-600",
                      "relative cursor-pointer rounded-md font-semibold  focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-500"
                    )}
                  >
                    <span>Envie um arquivo</span>
                  </label>
                  <p className="pl-1">ou arraste</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  {fileInput.fileTypes.join(", ") ??
                    "Arquivos de qualquer tipo"}{" "}
                  de até {fileInput.maxSize}MB
                </p>
              </>
            )}
          </div>
        </div>
      }
    </div>
  );
}
