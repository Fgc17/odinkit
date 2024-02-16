// client
"use client";

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
import { Path, FieldValues } from "react-hook-form";
import { getEntryFromPath } from "./_shared/utils/getEntryFromPath";
import { useFormContext } from "./Form";

export type FieldProps<Fields extends FieldValues> = HeadlessFieldProps &
  FieldOptions & {
    name: Path<Fields>;
    variant?: keyof typeof fieldVariants;
  };

export type FieldOptions = {
  enableAsterisk?: boolean;
};

const fieldVariants = {
  default: clsx(
    "[&>[data-slot=label]+[data-slot=control]]:mt-3",
    "[&>[data-slot=label]+[data-slot=description]]:mt-1",
    "[&>[data-slot=description]+[data-slot=control]]:mt-3",
    "[&>[data-slot=control]+[data-slot=description]]:mt-3",
    "[&>[data-slot=control]+[data-slot=error]]:mt-3",
    "[&>[data-slot=label]]:font-medium"
  ),
  switch: clsx(
    // Base layout
    "grid grid-cols-[1fr_auto]",
    "items-center gap-x-8 gap-y-1 sm:grid-cols-[1fr_auto]",

    // Control layout
    "[&>[data-slot=control]]:col-start-2 [&>[data-slot=control]]:self-center",

    // Label layout
    "[&>[data-slot=label]]:col-start-1 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",

    // Description layout
    "[&>[data-slot=description]]:col-start-1 [&>[data-slot=description]]:row-start-2",

    // With description
    "[&_[data-slot=label]]:has-[[data-slot=description]]:font-medium"
  ),
};

const fieldGroupVariants = {
  default: "",
  switch: clsx(
    // Basic groups
    "space-y-3 [&_[data-slot=label]]:font-normal",

    // With descriptions
    "has-[[data-slot=description]]:space-y-6 [&_[data-slot=label]]:has-[[data-slot=description]]:font-medium"
  ),
};

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
  variant = "default",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  variant?: keyof typeof fieldGroupVariants;
}) {
  return (
    <div
      {...props}
      data-slot="control"
      className={clsx(className, fieldGroupVariants[variant])}
    />
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

const FieldContext = createContext<{
  error: string;
  name: string;
  isRequired: boolean;
}>(null!);

export function useField() {
  return useContext(FieldContext);
}

export function _ODINKIT_INTERNAL_Field<Fields extends FieldValues>({
  className,
  enableAsterisk,
  variant = "default",
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
        className={clsx(className, fieldVariants[variant])}
        {...props}
      />
    </FieldContext.Provider>
  );
}
