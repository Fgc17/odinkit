// client
"use client";
import { FieldValues } from "react-hook-form";
import { Button, ButtonProps } from "../Button";
import { UseFormReturn, useFormContext } from "./Form";

export function SubmitButton<T extends FieldValues>(props: ButtonProps<T>) {
  const _form = useFormContext();

  const form = props.hform ?? _form;

  return (
    <Button
      {...props}
      loading={form.formState.isSubmitting ? "true" : undefined}
      form={form.id}
      type="submit"
    />
  );
}
