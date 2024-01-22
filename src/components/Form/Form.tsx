import {
  Description as HeadlessDescription,
  Field as HeadlessField,
  Fieldset as HeadlessFieldset,
  Label as HeadlessLabel,
  Legend as HeadlessLegend,
  type DescriptionProps as HeadlessDescriptionProps,
  type FieldProps as HeadlessFieldProps,
  type FieldsetProps as HeadlessFieldsetProps,
  type LabelProps as HeadlessLabelProps,
  type LegendProps as HeadlessLegendProps,
} from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { createContext, useContext, useMemo } from "react";
import {
  useForm as useReactHookForm,
  Path,
  FieldValues,
  FormProvider as useReactHookFormProvider,
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
import { getEntryFromPath } from "./_shared/utils/getEntryFromPath";
import { zodResolver } from "@hookform/resolvers/zod";

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

type FieldOptions = {
  enableAsterisk?: boolean;
};

type UseFormReturn<Fields extends FieldValues = FieldValues> = ReturnType<
  typeof useForm<Fields>
>;

type FieldProps<Fields extends FieldValues> = HeadlessFieldProps &
  FieldOptions & {
    name: Path<Fields>;
  };

const FieldContext = createContext<{
  error: string;
  name: string;
  isRequired: boolean;
}>(null!);

export function useField() {
  return useContext(FieldContext);
}

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
          <Field {...fieldOptions} {...props} />
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

export function Fieldset({
  className,
  ...props
}: { disabled?: boolean } & HeadlessFieldsetProps) {
  return (
    <HeadlessFieldset
      {...props}
      className={clsx(
        className,
        "[&>*+[data-slot=control]]:mt-6 [&>[data-slot=text]]:mt-1"
      )}
    />
  );
}

export function Legend({ ...props }: HeadlessLegendProps) {
  return (
    <HeadlessLegend
      {...props}
      data-slot="legend"
      className={clsx(
        props.className,
        "text-base/6 font-semibold text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6 "
      )}
    />
  );
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} data-slot="control" className={clsx(className)} />;
}

function Field<Fields extends FieldValues>({
  className,
  enableAsterisk,
  ...props
}: FieldProps<Fields>) {
  const form = useFormContext();

  const {
    formState: { errors },
    schema,
  } = form;

  const name = props["name"];
  const zodField = getEntryFromPath(schema, name, "shape").entryValue;
  const isRequired = enableAsterisk ?? !zodField?.isOptional();
  const error = getEntryFromPath(errors, name).entryValue?.message;

  const fieldContextValue = {
    name,
    isRequired,
    error: error,
  };

  return (
    <FieldContext.Provider value={fieldContextValue}>
      <HeadlessField
        className={clsx(
          className,
          "[&>[data-slot=label]+[data-slot=control]]:mt-3",
          "[&>[data-slot=label]+[data-slot=description]]:mt-1",
          "[&>[data-slot=description]+[data-slot=control]]:mt-3",
          "[&>[data-slot=control]+[data-slot=description]]:mt-3",
          "[&>[data-slot=control]+[data-slot=error]]:mt-3",
          "[&>[data-slot=label]]:font-medium"
        )}
        {...props}
      />
    </FieldContext.Provider>
  );
}

export function Label({
  className,
  children,
  ...props
}: { className?: string } & HeadlessLabelProps) {
  const { isRequired } = useField();

  return (
    <HeadlessLabel
      {...props}
      data-slot="label"
      className={clsx(
        className,
        "select-none text-base/6 text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6"
      )}
    >
      <>
        {children} {isRequired && <span className="text-red-600">*</span>}
      </>
    </HeadlessLabel>
  );
}

export function Description({
  className,
  disabled,
  ...props
}: { className?: string; disabled?: boolean } & HeadlessDescriptionProps) {
  return (
    <HeadlessDescription
      {...props}
      data-slot="description"
      className={clsx(
        className,
        "text-base/6 text-zinc-500 data-[disabled]:opacity-50 sm:text-sm/6 "
      )}
    />
  );
}

export function ErrorMessage({
  className,
  disabled,
  ...props
}: { className?: string; disabled?: boolean } & HeadlessDescriptionProps) {
  const { error } = useField()!;

  return (
    <HeadlessDescription
      {...props}
      data-slot="error"
      className={clsx(
        className,
        "text-xs text-red-600 data-[disabled]:opacity-50"
      )}
    >
      {error}
    </HeadlessDescription>
  );
}
