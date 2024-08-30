// client
"use client";

import {
  Listbox as HeadlessListbox,
  ListboxButton as HeadlessListboxButton,
  ListboxOption as HeadlessListboxOption,
  ListboxOptions as HeadlessListboxOptions,
  ListboxSelectedOption,
  type ListboxOptionProps as HeadlessListboxOptionProps,
  type ListboxProps as HeadlessListboxProps,
} from "@headlessui/react";
import { useParentForm } from "../Form";
import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";
import { Controller } from "react-hook-form";
import { Overlay } from "../Overlay";
import { useField } from "../Field";
import {
  fieldBackgroundColorClasses,
  fieldBasicLayoutClasses,
  fieldBorderClasses,
  fieldFocusClasses,
  fieldTipographyClasses,
} from "../_shared/styles/field-classes";

export function Listbox<T>({
  className,
  placeholder,
  autoFocus,
  "aria-label": ariaLabel,
  onChange,
  children: options,
  ...props
}: {
  className?: string;
  placeholder?: React.ReactNode;
  autoFocus?: boolean;
  "aria-label"?: string;
  children?: React.ReactNode;
} & Omit<HeadlessListboxProps<typeof Fragment, T>, "multiple">) {
  const form = useParentForm();

  const { name, error } = useField();

  return (
    <Overlay data-slot="control" variant="default">
      <Controller
        name={name}
        control={form.control}
        render={({ field: { onChange: fieldOnChange, value, ..._field } }) => (
          <HeadlessListbox
            as={"div"}
            onChange={(value: any) => {
              onChange && onChange(value);
              fieldOnChange(value);
            }}
            multiple={false}
            value={value || ""}
            {..._field}
            {...props}
          >
            <HeadlessListboxButton
              data-slot="control"
              as="div"
              className={clsx([
                // Form style
                "form-select",

                // Custom styles
                className,

                // Basic layout
                fieldBasicLayoutClasses,

                // Typography
                fieldTipographyClasses,

                // Background color
                fieldBackgroundColorClasses,

                // Border
                fieldBorderClasses,

                // Hide default focus styles
                fieldFocusClasses,

                // Options (multi-select)
                "[&_optgroup]:font-semibold",

                // Invalid state
                "data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-600 data-[invalid]:data-[hover]:dark:border-red-600",

                // Disabled state
                "data-[disabled]:border-zinc-950/20 data-[disabled]:opacity-100 dark:data-[hover]:data-[disabled]:border-white/15 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%]",
              ])}
              autoFocus={autoFocus}
              aria-label={ariaLabel}
              onMouseDown={(e) => e.preventDefault()}
              {...(error ? { "data-invalid": true } : {})}
              {...(props.disabled
                ? {
                    "data-disabled": true,
                  }
                : {})}
            >
              {value ? (
                <ListboxSelectedOption options={options} />
              ) : (
                <div className="select-none text-transparent">placeholder</div>
              )}
            </HeadlessListboxButton>

            <HeadlessListboxOptions
              transition
              as="div"
              anchor="selection start"
              className={clsx(
                "z-[100]",
                // Anchor positioning
                "[--anchor-offset:-1.625rem] [--anchor-padding:theme(spacing.4)] sm:[--anchor-offset:-1.375rem]",
                // Base styles
                "isolate w-max min-w-[calc(var(--button-width)+1.75rem)] select-none scroll-py-1 rounded-xl p-1",
                // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
                "outline outline-1 outline-transparent focus:outline-none",
                // Handle scrolling when menu won't fit in viewport
                "overflow-y-scroll overscroll-contain",
                // Popover background
                "bg-white/75 backdrop-blur-xl dark:bg-zinc-800/75",
                // Shadows
                "shadow-lg ring-1 ring-zinc-950/10 dark:ring-inset dark:ring-white/10",
                // Transitions
                "transition-opacity duration-100 ease-in data-[transition]:pointer-events-none data-[closed]:data-[leave]:opacity-0"
              )}
            >
              {options}
            </HeadlessListboxOptions>
          </HeadlessListbox>
        )}
      />
    </Overlay>
  );
}

export function ListboxOption<Data>({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & HeadlessListboxOptionProps<"div", Data>) {
  let sharedClasses = clsx(
    "flex min-w-0 items-center",
    "[&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 sm:[&>[data-slot=icon]]:size-4",
    "[&>[data-slot=icon]]:text-zinc-500 [&>[data-slot=icon]]:group-data-[focus]/option:text-white [&>[data-slot=icon]]:dark:text-zinc-400",
    "forced-colors:[&>[data-slot=icon]]:text-[CanvasText] forced-colors:[&>[data-slot=icon]]:group-data-[focus]/option:text-[HighlightText]",
    "[&>[data-slot=avatar]]:-mx-0.5 [&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:size-5"
  );

  return (
    <HeadlessListboxOption as={Fragment} {...props}>
      {({ selectedOption }) => {
        if (selectedOption) {
          return (
            <div className={clsx(className, sharedClasses)}>{children}</div>
          );
        }

        return (
          <div
            className={clsx(
              "group/option grid cursor-default grid-cols-[theme(spacing.5),1fr] items-baseline gap-x-2 rounded-lg py-2.5 pl-2 pr-3.5 sm:grid-cols-[theme(spacing.4),1fr] sm:py-1.5 sm:pl-1.5 sm:pr-3",
              "text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]",
              "outline-none data-[focus]:bg-blue-500 data-[focus]:text-white",
              "forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText]",
              "data-[disabled]:opacity-50"
            )}
          >
            <CheckIcon className="relative hidden size-5 self-center stroke-current group-data-[selected]/option:inline sm:size-4" />
            <span className={clsx(className, sharedClasses, "col-start-2")}>
              {children}
            </span>
          </div>
        );
      }}
    </HeadlessListboxOption>
  );
}

export function ListboxLabel({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={clsx(
        className,
        "ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0"
      )}
      {...props}
    />
  );
}

export function ListboxDescription({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={clsx(
        className,
        "flex flex-1 overflow-hidden text-zinc-500 before:w-2 before:min-w-0 before:shrink group-data-[focus]/option:text-white dark:text-zinc-400"
      )}
      {...props}
    >
      <span className="flex-1 truncate">{children}</span>
    </span>
  );
}
