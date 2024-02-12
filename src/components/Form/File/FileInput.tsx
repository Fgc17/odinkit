import {
  Input as HeadlessInput,
  type InputProps as HeadlessInputProps,
} from "@headlessui/react";
import React, { useEffect, useId, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import clsx from "clsx";
import { useField } from "../Field";
import { useFormContext } from "../Form";
import { Fileformat } from "./FileFormat";

type FileInputContextProps = {
  fileTypes: Fileformat[];
  maxSize: number;
  maxFiles: number;
  inputId: string;
};

export const FileInputContext = React.createContext<FileInputContextProps>({
  fileTypes: [],
  maxSize: 0,
  maxFiles: 0,
  inputId: "",
});

function FileInputProvider({
  children,
  ...fileInputContextProps
}: { children: React.ReactNode } & FileInputContextProps) {
  return (
    <FileInputContext.Provider value={fileInputContextProps}>
      {children}
    </FileInputContext.Provider>
  );
}

export function FileInput({
  children,
  className,
  dragging = false,
  ...props
}: {
  children: React.ReactNode;
  fileTypes: Fileformat[];
  maxSize: number;
  maxFiles: number;
  dragging: boolean;
  onChange: (files: FileList) => void;
} & HeadlessInputProps) {
  const form = useFormContext();
  const { name } = useField();

  useEffect(() => {
    props.onChange && props.onChange(form.getValues(name));
  }, [form.watch(name)]);

  const id = useId();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange: fieldOnChange, value, ...field } }) => {
        return (
          <FileInputProvider
            maxFiles={props.maxFiles}
            maxSize={props.maxSize}
            fileTypes={props.fileTypes}
            inputId={id}
          >
            <div className={clsx(className)}>
              {children}
              <input
                hidden
                id={id}
                type="file"
                {...field}
                accept={props.fileTypes?.join(",")}
                name={field.name}
                value={value?.filename || ""}
                onChange={(e) => fieldOnChange(e.target.files)}
              />
            </div>
          </FileInputProvider>
        );
      }}
    />
  );
}
