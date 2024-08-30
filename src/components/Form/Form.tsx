// client
"use client";

import type React from "react";
import { createContext, useContext, useEffect, useId } from "react";
import {
  useForm as useReactHookForm,
  FieldValues,
  UseFormProps as useReactHookFormProps,
} from "react-hook-form";
import { ZodEffects, ZodObject, ZodRawShape, ZodTypeAny } from "zod";
import { z } from "../../utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldProps, OdinInternal_Field } from "./Field";
import { useParentFormGroup } from "./FormGroup";

type UseFormProps<Fields extends FieldValues> = Omit<
  useReactHookFormProps<Fields>,
  "resolver"
> & {
  id?: string;
  onSubmit?: (data: Fields) => void;
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
    if (parentFormGroup) {
      if (!useReactHookFormProps.id) {
        throw new Error("A form inside a FormGroup must have a fixed id");
      }

      const { forms, setForms } = parentFormGroup;
      const formId = useReactHookFormProps.id;

      const isFormAlreadyAdded = forms.some((f) => f.id === formId);

      if (!isFormAlreadyAdded) {
        setForms((prev) => [...prev, form as any]);
      }

      return () => {
        setForms((prev) => prev.filter((f) => f.id !== formId));
      };
    }
  }, []);

  return form;
}

const FormContext = createContext<UseFormReturn>(null!);

export const useParentForm = () => useContext(FormContext);

export function Form<Fields extends FieldValues>({
  onSubmit,
  hform,
  innerRef,
  ...props
}: FormProps<Fields>) {
  const formGroup = useParentFormGroup();

  if (formGroup && formGroup.currentForm.id !== hform.id) return;

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
