// client
"use client";
import { FieldValues } from "react-hook-form";
import { Button, ButtonProps } from "../Button";
import { useParentForm } from "./Form";

export function SubmitButton(props: ButtonProps) {
  const _form = useParentForm();

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
