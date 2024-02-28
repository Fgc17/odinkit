//client
"use client";
import {
  Input as HeadlessInput,
  type InputProps as HeadlessInputProps,
} from "@headlessui/react";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import clsx from "clsx";
import { useField } from "../Field";
import { useFormContext } from "../Form";
import { FileFormat } from "./FileFormat";
import { getFileExtension } from "./utils";

type FileInputContextProps = {
  fileTypes: FileFormat[];
  maxSize: number;
  maxFiles: number;
  inputId: string;
  onChange: (files: File[]) => void;
  onError?: (error: string) => void;
  validate: (files: File[]) => boolean | Promise<boolean>;
};

export const FileInputContext = React.createContext<FileInputContextProps>({
  fileTypes: [],
  maxSize: 0,
  maxFiles: 0,
  inputId: "",
  onChange: () => {},
  onError: () => {},
  validate: () => true,
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
  fileTypes: FileFormat[];
  maxSize: number;
  maxFiles: number;
  dragging?: boolean;
  onChange?: (files: File[]) => void;
  onError?: (error: string[] | string) => void;
  validate?: (file: File) => boolean | Promise<boolean>;
} & Omit<HeadlessInputProps, "onChange" | "onError">) {
  const form = useFormContext();
  const { name } = useField();

  const id = useId();

  useEffect(() => {
    const error = form.formState.errors[name]?.message;

    if (error) {
      let parsedError;
      try {
        parsedError = JSON.parse(error as string);
      } catch (error) {
        parsedError = error;
      }
      console.log(error);

      props.onError?.(parsedError as any);
    }
  }, [form.formState.errors[name]?.message]);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange: fieldOnChange, value, ...field } }) => {
        const onChange = (files: File[]) => {
          fieldOnChange([...(value ?? []), ...files]);
          props.onChange?.(files);
        };

        const validate = async (files: File[]) => {
          if (files?.length + value?.length > props.maxFiles) {
            form.setError?.(name, {
              message: JSON.stringify("Número máximo de arquivos excedido"),
            });
            return false;
          }

          if (
            files.some(
              (file) => !props.fileTypes.includes(getFileExtension(file))
            )
          ) {
            form.setError?.(name, {
              message: JSON.stringify("Tipo de arquivo não permitido"),
            });
            return false;
          }

          if (props.validate) {
            for (const file of files) {
              try {
                await props.validate?.(file);
              } catch (err) {
                form.setError?.(name, {
                  message: JSON.stringify(err),
                });
                return false;
              }
            }
          }

          form.clearErrors(name);

          return true;
        };

        return (
          <FileInputProvider
            maxFiles={props.maxFiles}
            maxSize={props.maxSize}
            fileTypes={props.fileTypes}
            onChange={onChange}
            onError={props.onError}
            validate={validate}
            inputId={id}
          >
            <div className={clsx(className)}>
              {children}
              <input
                {...field}
                hidden
                id={id}
                type="file"
                accept={props.fileTypes?.join(",")}
                name={field.name}
                multiple={props.maxFiles > 1 || props.maxFiles === undefined}
                value={""}
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files?.length) return;
                  const filesArray = Array.from(files);
                  const isValid = await validate(filesArray);
                  if (!isValid) return;

                  onChange(filesArray);
                }}
              />
            </div>
          </FileInputProvider>
        );
      }}
    />
  );
}
