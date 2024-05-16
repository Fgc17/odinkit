// client
"use client";
import {
  Textarea as HeadlessTextarea,
  type TextareaProps as HeadlessTextareaProps,
} from "@headlessui/react";
import { clsx } from "clsx";
import { Overlay } from "./Overlay";
import { Controller } from "react-hook-form";
import { inputClasses } from "./Input";
import { useFormContext } from "./Form";
import { useField } from "./Field";

export function Textarea({ className, ...props }: HeadlessTextareaProps) {
  const form = useFormContext();
  const { name } = useField();
  return (
    <Overlay>
      <Controller
        name={name}
        control={form.control}
        render={({ field: { onChange: fieldOnChange, value, ...field } }) => (
          <HeadlessTextarea
            className={inputClasses}
            onChange={(e) => {
              props.onChange && props.onChange(e);
              fieldOnChange(e.target.value);
            }}
            {...props}
            {...field}
          />
        )}
      />
    </Overlay>
  );
}
