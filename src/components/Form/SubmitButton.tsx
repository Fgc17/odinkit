import { FieldValues } from "react-hook-form";
import { Button, ButtonProps } from "../Button";
import { UseFormReturn, useFormContext } from "./Form";

export function SubmitButton<T extends FieldValues>(
  props: ButtonProps & { form?: UseFormReturn<T> }
) {
  const _form = useFormContext();

  const form = props.form ?? _form;

  return (
    <Button
      {...props}
      loading={form.formState.isSubmitting}
      form={form.id}
      type="submit"
    />
  );
}
