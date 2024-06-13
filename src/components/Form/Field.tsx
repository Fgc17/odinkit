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
import { ReactNode, createContext, useContext, useMemo } from "react";
import { Path, FieldValues } from "react-hook-form";
import { getEntryFromPath } from "./_shared/utils/getEntryFromPath";
import { useFormContext } from "./Form";
import { getZodFields, z } from "../../utils/zod";
import { RadioGroup } from "./Radio";

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
  radio: clsx(
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
  default: "has-[[data-slot=description]]:space-y-6",
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
        "text-base font-semibold leading-7 text-gray-900 data-[disabled]:opacity-50"
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

export function Field({
  className,
  ...props
}: { className?: string } & Omit<HeadlessFieldProps, "className">) {
  return (
    <HeadlessField
      {...props}
      className={clsx(
        className,
        "[&>[data-slot=label]+[data-slot=control]]:mt-3",
        "[&>[data-slot=label]+[data-slot=description]]:mt-1",
        "[&>[data-slot=description]+[data-slot=control]]:mt-3",
        "[&>[data-slot=control]+[data-slot=description]]:mt-3",
        "[&>[data-slot=control]+[data-slot=error]]:mt-3",
        "[&>[data-slot=label]]:font-medium"
      )}
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
      className={clsx(className, "block text-sm font-medium text-gray-700")}
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
        "text-base/6 text-red-600 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-red-500"
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
  const form = useFormContext();

  const {
    formState: { errors },
    schema,
  } = form;

  const name = props["name"];

  const zodField = getZodFields(schema)[name];

  const isRequired = Boolean(enableAsterisk) && !zodField?.isOptional();
  const error = getEntryFromPath(errors, name).entryValue?.message;

  let fieldContextValue = {
    name,
    isRequired,
    error: error,
  };

  if (variant === "radio") {
    fieldContextValue.isRequired = false;
  }

  return (
    <FieldContext.Provider value={fieldContextValue}>
      <HeadlessField
        {...props}
        className={clsx(fieldVariants[variant], className)}
      />
    </FieldContext.Provider>
  );
}
