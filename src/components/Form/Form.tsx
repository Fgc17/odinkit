import type React from "react";
import { createContext, useContext, useMemo } from "react";
import {
  useForm as useReactHookForm,
  FieldValues,
  UseFormProps as useReactHookFormProps,
} from "react-hook-form";
import {
  ZodEffects,
  ZodObject,
  ZodRawShape,
  ZodType,
  ZodTypeAny,
  z,
} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldProps, _ODINKIT_INTERNAL_Field } from "./Field";

type UseFormProps<Fields extends FieldValues> = Omit<
  useReactHookFormProps<Fields>,
  "resolver"
> & {
  fieldOptions?: {
    enableAsterisk?: boolean;
  };
  schema:
    | ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>
    | ZodEffects<ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>>;
};

type UseFormReturn<Fields extends FieldValues = FieldValues> = ReturnType<
  typeof useForm<Fields>
>;

const FormContext = createContext<UseFormReturn>(null!);

export function useForm<Fields extends FieldValues>({
  schema,
  fieldOptions,
  ...useReactHookFormProps
}: UseFormProps<Fields>) {
  type _Fields = Fields | z.infer<typeof schema>;
  return {
    schema,
    createField: () =>
      useMemo(
        () => (props: FieldProps<_Fields>) => (
          <_ODINKIT_INTERNAL_Field {...fieldOptions} {...props} />
        ),
        []
      ),
    ...useReactHookForm<_Fields>({
      ...useReactHookFormProps,
      resolver: zodResolver(schema),
    }),
  };
}

export function useFormContext<Fields extends FieldValues>() {
  return useContext(FormContext) as unknown as UseFormReturn<Fields>;
}

export function FormProvider<Fields extends FieldValues>({
  children,
  ...data
}: UseFormReturn<Fields> & { children: React.ReactNode }) {
  return (
    <FormContext.Provider value={data as unknown as UseFormReturn}>
      {children}
    </FormContext.Provider>
  );
}

export function Form<Fields extends FieldValues>({
  onSubmit,
  hform,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit"> & {
  onSubmit: (data: Fields) => void;
  hform: UseFormReturn<Fields>;
}) {
  return (
    <FormProvider {...hform}>
      <form
        onSubmit={hform?.handleSubmit((data) => {
          hform.trigger();
          onSubmit(data);
        })}
        {...props}
      />
    </FormProvider>
  );
}
