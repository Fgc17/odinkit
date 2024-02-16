//client
"use client";
import { FolderIcon } from "@heroicons/react/20/solid";
import { ReactNode, useContext } from "react";
import { FileInputContext } from "./FileInput";
import { useFormContext } from "../Form";
import { useField } from "../Field";
import { getFileExtension } from "./utils";

export function FileDropArea({
  fileIcon,
  render,
}: {
  fileIcon?: ReactNode;
  render?: ReactNode;
}) {
  const fileInput = useContext(FileInputContext);

  const form = useFormContext();

  const { name } = useField();

  return (
    <div
      {...{
        onDrop: async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const { files } = e.dataTransfer;

          if (!files?.length) return;

          const isValid = await fileInput.validate(files);

          if (!isValid) return;

          fileInput.onChange(files);
        },
        onDragOver: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
      }}
    >
      {
        <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-6">
          <div className="text-center">
            {render ?? (
              <>
                {fileIcon || (
                  <FolderIcon className="mx-auto h-12 w-12 text-gray-300" />
                )}

                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor={fileInput.inputId}
                    className="relative cursor-pointer rounded-md font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-500"
                  >
                    <span>Envie um arquivo</span>
                  </label>
                  <p className="pl-1">ou arraste</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  {fileInput.fileTypes
                    ?.map((t) => t?.split("/")?.[1]?.toUpperCase())
                    .join(", ") ?? "Arquivos de qualquer tipo"}{" "}
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
