import clsx from "clsx";
import type React from "react";
import { Button } from "./Button";
import {
  ArrowLongRightIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/16/solid";

export function Pagination({
  "aria-label": ariaLabel = "Page navigation",
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      aria-label={ariaLabel}
      {...props}
      className={clsx(className, "flex items-center")}
    />
  );
}

export function PaginationPrevious({
  href = null,
  children = "Previous",
  onClick,
  disabled = false,
}: {
  onClick?: () => void;
  href?: string | null;
  children?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <span className="grow basis-0">
      <Button
        onClick={onClick}
        /* {...(href === null ? { disabled: true } : { href })} */
        plain
        disabled={disabled}
        aria-label="Previous page"
        className="text-sm"
      >
        <ArrowLongLeftIcon className="w-4" />
        {children}
      </Button>
    </span>
  );
}

export function PaginationNext({
  href = null,
  children = "Next",
  onClick,
  disabled = false,
}: {
  onClick?: () => void;
  disabled?: boolean;
  href?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <span className="flex grow basis-0 justify-end">
      <Button
        onClick={onClick}
        /* {...(href === null ? { disabled: true } : { href })} */
        plain
        disabled={disabled}
        aria-label="Next page"
        className="text-sm"
      >
        {children}
        <ArrowLongRightIcon className="w-4" />
      </Button>
    </span>
  );
}

export function PaginationList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={clsx("flex items-baseline *:text-xs", className)}>
      {children}
    </span>
  );
}

export function PaginationPage({
  href,
  children,
  current = false,
  onClick,
  className,
}: {
  href?: string;
  children: string;
  current?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      plain
      aria-label={`Page ${children}`}
      aria-current={current ? "page" : undefined}
      onClick={onClick}
      className={clsx(
        "min-w-[2.25rem] before:absolute before:-inset-px before:rounded-lg",
        current && "before:bg-zinc-950/5 ",
        className
      )}
    >
      <span className="-mx-0.5">{children}</span>
    </Button>
  );
}

export function PaginationGap() {
  return (
    <div
      aria-hidden="true"
      className="w-[2.25rem] select-none text-center text-sm/6 font-semibold text-zinc-950 "
    >
      &hellip;
    </div>
  );
}
