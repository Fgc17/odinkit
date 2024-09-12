// client
"use client";

import {
  Description as HeadlessDescription,
  Field as HeadlessField,
  Radio as HeadlessRadio,
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
import { createContext, useContext } from "react";
import { Path, FieldValues } from "react-hook-form";
import { getEntryFromPath } from "./_shared/utils/getEntryFromPath";
import { getZodFields, z } from "../../utils/zod";
import { useParentForm } from "./Form";

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
    "[&>[data-slot=label]+[data-slot=control]]:mt-1.5",
    "[&>[data-slot=label]+[data-slot=description]]:mt-1",
    "[&>[data-slot=description]+[data-slot=control]]:mt-1.5",
    "[&>[data-slot=control]+[data-slot=description]]:mt-1.5",
    "[&>[data-slot=control]+[data-slot=error]]:mt-1.5",
    "[&>[data-slot=label]]:font-medium"
  ),
  radio: clsx(
    "[&>[data-slot=label]+[data-slot=control]]:mt-1.5",
    "[&>[data-slot=label]+[data-slot=description]]:mt-1",
    "[&>[data-slot=description]+[data-slot=control]]:mt-1.5",
    "[&>[data-slot=control]+[data-slot=description]]:mt-1.5",
    "[&>[data-slot=control]+[data-slot=error]]:mt-1.5",
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

export function Fieldset({
  className,
  ...props
}: { className?: string } & Omit<HeadlessFieldsetProps, "className">) {
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

export function Legend({
  className,
  ...props
}: { className?: string } & Omit<HeadlessLegendProps, "className">) {
  return (
    <HeadlessLegend
      data-slot="legend"
      {...props}
      className={clsx(
        className,
        "text-base/6 font-semibold text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white"
      )}
    />
  );
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(className, "space-y-8")}
    />
  );
}

export function Label({
  className,
  enableAsterisk = true,
  ...props
}: { className?: string; enableAsterisk?: boolean } & Omit<
  HeadlessLabelProps,
  "className"
>) {
  const { isRequired } = useField();

  return (
    <HeadlessLabel
      data-slot="label"
      className={clsx(
        className,
        "block select-none text-sm/6 text-gray-700 data-[disabled]:opacity-50 dark:text-white"
      )}
    >
      <>
        {props.children}{" "}
        {enableAsterisk && isRequired && (
          <span className="text-red-600">*</span>
        )}
      </>
    </HeadlessLabel>
  );
}

export function Description({
  className,
  ...props
}: { className?: string } & Omit<HeadlessDescriptionProps, "className">) {
  return (
    <HeadlessDescription
      data-slot="description"
      {...props}
      className={clsx(
        className,
        "mt-1 text-sm leading-6 text-gray-600 sm:text-left"
      )}
    />
  );
}

export function ErrorMessage({
  className,
  ...props
}: { className?: string } & Omit<HeadlessDescriptionProps, "className">) {
  const { error } = useField();
  return (
    <HeadlessDescription
      data-slot="error"
      {...props}
      className={clsx(
        className,
        "text-base/6 text-sm/6 text-red-600 data-[disabled]:opacity-50 dark:text-red-500"
      )}
    >
      {error ? error : " "}
    </HeadlessDescription>
  );
}

export const FieldContext = createContext<{
  error: string;
  name: string;
  isRequired: boolean;
}>(null!);

export function useField() {
  return useContext(FieldContext);
}

export function OdinInternal_Field<Fields extends FieldValues>({
  className,
  enableAsterisk = true,
  variant = "default",
  ...props
}: FieldProps<Fields>) {
  const form = useParentForm();

  const {
    formState: { errors },
    schema,
  } = form;

  const name = props["name"];

  const zodField = getZodFields(schema)[name];

  const isRequired =
    variant != "radio" &&
    Boolean(enableAsterisk) &&
    zodField &&
    !zodField.isOptional();

  const error = getEntryFromPath(errors, name).entryValue?.message;

  let fieldContextValue = {
    name,
    isRequired,
    error: error,
  };

  return (
    <FieldContext.Provider value={fieldContextValue}>
      <HeadlessField
        {...props}
        data-slot="field"
        className={clsx(fieldVariants[variant], className)}
      />
    </FieldContext.Provider>
  );
}
