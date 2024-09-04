// client
"use client";

import { createContext, useContext, useEffect, useId } from "react";
import { useParentFormGroup } from "./FormGroup";
import {
  useForm as useReactHookForm,
  UseFormProps as useReactHookFormProps,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "../../utils/zod";
import { FieldProps, OdinInternal_Field } from "./Field";
import { ZodEffects, ZodObject, ZodRawShape, ZodTypeAny } from "zod";

export type OnSubmitFn<Fields extends FieldValues> = (data: Fields) => void;

export type UseFormProps<Fields extends FieldValues> = Omit<
  useReactHookFormProps<Fields>,
  "resolver"
> & {
  id?: string;
  onSubmit?: OnSubmitFn<Fields>;
  fieldOptions?: {
    enableAsterisk?: boolean;
  };
  schema:
    | ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>
    | ZodEffects<ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>>;
};

export type FormProps<Fields extends FieldValues> = Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "id" | "ref"
> & {
  innerRef?: React.RefObject<HTMLFormElement>;
  hform: UseFormReturn<Fields>;
  onSubmit?: (data: Fields) => void;
};

export type UseFormReturn<Fields extends FieldValues = FieldValues> =
  ReturnType<typeof useForm<Fields>>;

export const FormContext = createContext<UseFormReturn>(null!);

export const useParentForm = () => useContext(FormContext);

export function useForm<F extends FieldValues>({
  schema,
  fieldOptions,
  onSubmit,
  ...useReactHookFormProps
}: UseFormProps<F>) {
  type Fields = F | z.infer<typeof schema>;

  const id = useId();

  const hookform = useReactHookForm<Fields>({
    ...useReactHookFormProps,
    resolver: zodResolver(schema as any),
  });

  const createField = () => (props: FieldProps<Fields>) => (
    <OdinInternal_Field {...fieldOptions} {...props} />
  );

  const form = {
    id: useReactHookFormProps.id ?? id,
    schema,
    createField,
    onSubmit,
    ...hookform,
  };

  const parentFormGroup = useParentFormGroup();

  useEffect(() => {
    if (!parentFormGroup) return;

    if (!useReactHookFormProps.id) throw new Error("useForm must have an id");

    parentFormGroup.updateForm(form as any);
  }, [form.formState.errors, form.formState.isValid]);

  useEffect(() => {
    if (!parentFormGroup) return;

    if (!useReactHookFormProps.id) throw new Error("useForm must have an id");

    const { unsubscribe } = form.watch(() =>
      parentFormGroup.updateFormValues(form as any)
    );

    return () => unsubscribe();
  }, []);

  return form;
}

export function Form<Fields extends FieldValues>({
  onSubmit,
  hform,
  innerRef,
  ...props
}: FormProps<Fields>) {
  const formGroup = useParentFormGroup();

  if (formGroup && !formGroup?.formControl.isCurrent(hform.id)) return;

  return (
    <FormContext.Provider value={hform as any as UseFormReturn}>
      <form
        onSubmit={
          onSubmit &&
          hform?.handleSubmit((data) => {
            hform.trigger();
            return onSubmit ? onSubmit(data) : hform.onSubmit?.(data);
          })
        }
        ref={innerRef}
        id={hform.id}
        {...props}
      />
    </FormContext.Provider>
  );
}
