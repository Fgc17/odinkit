//client
"use client";
import { ReactNode, useContext } from "react";
import { FileInputContext } from "./FileInput";
import { useFormContext } from "../Form";
import { useField } from "../Field";
import clsx from "clsx";
import { inputClasses } from "../Input";
import { FolderIcon } from "@heroicons/react/20/solid";

export const fileInputClasses = clsx(
  // Basic layout
  "relative mb-1 mt-[11px] block w-full appearance-none rounded-lg  py-[calc(theme(spacing[1.5])-1px)] sm:pr-[calc(theme(spacing[3])-1px)] pl-[calc(theme(spacing[10])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",

  // Typography
  "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 ",

  // Border
  "-[hover]:border-white/20 border border-zinc-950/10  data-[hover]:border-zinc-950/20",

  // Background color
  "bg-transparent ",

  // Hide default focus styles
  "focus:outline-none",

  // Invalid state
  "data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500",

  // Disabled state
  "-[hover]:data-[disabled]:border-white/15 data-[disabled]: data-[disabled]:/[2.5%] data-[disabled]:border-zinc-950/20"
);

export function FileInputField() {
  const fileInput = useContext(FileInputContext);

  const form = useFormContext();

  const { name, error } = useField();

  return (
    <label htmlFor={fileInput.inputId} className="flex">
      <div
        className={clsx(
          fileInputClasses,
          "flex cursor-pointer gap-2",
          error
            ? "border-red-500 hover:border-red-500"
            : "-[hover]:border-white/20 border border-zinc-950/10  data-[hover]:border-zinc-950/20"
        )}
      >
        <div className="absolute left-2 top-1 text-gray-400">
          <FolderIcon className="size-6" />
        </div>
        <span className="... truncate">
          {form.watch(name)?.[0]?.name ?? "Nenhum Selecionado"}
        </span>
      </div>
    </label>
  );
}

/*  <input
        {...{
          onDrop: async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const { files } = e.dataTransfer;
            const filesArray = Array.from(files);

            if (!files?.length) return;

            const isValid = await fileInput.validate(filesArray);

            if (!isValid) return;

            fileInput.onChange(filesArray);
          },
          onDragOver: (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
        }}
        id="file_input"
        className={fileInputClasses}
        type="file"
      /> */
