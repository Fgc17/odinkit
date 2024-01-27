import {
  Button as HeadlessButton,
  type ButtonProps as HeadlessButtonProps,
} from "@headlessui/react";
import clsx from "clsx";
import React from "react";
import { TouchTarget } from "./Button";
import { Link } from "./Link";

let colors = {
  red: "bg-red-500/15 text-red-700 group-data-[hover]:bg-red-500/25   -[hover]:bg-red-500/20",
  orange:
    "bg-orange-500/15 text-orange-700 group-data-[hover]:bg-orange-500/25   -[hover]:bg-orange-500/20",
  amber:
    "bg-amber-400/20 text-amber-700 group-data-[hover]:bg-amber-400/30   -[hover]:bg-amber-400/15",
  yellow:
    "bg-yellow-400/20 text-yellow-700 group-data-[hover]:bg-yellow-400/30   -[hover]:bg-yellow-400/15",
  lime: "bg-lime-400/20 text-lime-700 group-data-[hover]:bg-lime-400/30   -[hover]:bg-lime-400/15",
  green:
    "bg-green-500/15 text-green-700 group-data-[hover]:bg-green-500/25   -[hover]:bg-green-500/20",
  emerald:
    "bg-emerald-500/15 text-emerald-700 group-data-[hover]:bg-emerald-500/25   -[hover]:bg-emerald-500/20",
  teal: "bg-teal-500/15 text-teal-700 group-data-[hover]:bg-teal-500/25   -[hover]:bg-teal-500/20",
  cyan: "bg-cyan-400/20 text-cyan-700 group-data-[hover]:bg-cyan-400/30   -[hover]:bg-cyan-400/15",
  sky: "bg-sky-500/15 text-sky-700 group-data-[hover]:bg-sky-500/25   -[hover]:bg-sky-500/20",
  blue: "bg-blue-500/15 text-blue-700 group-data-[hover]:bg-blue-500/25  -[hover]:bg-blue-500/25",
  indigo:
    "bg-indigo-500/15 text-indigo-700 group-data-[hover]:bg-indigo-500/25  -[hover]:bg-indigo-500/20",
  violet:
    "bg-violet-500/15 text-violet-700 group-data-[hover]:bg-violet-500/25  -[hover]:bg-violet-500/20",
  purple:
    "bg-purple-500/15 text-purple-700 group-data-[hover]:bg-purple-500/25  -[hover]:bg-purple-500/20",
  fuchsia:
    "bg-fuchsia-400/15 text-fuchsia-700 group-data-[hover]:bg-fuchsia-400/25   -[hover]:bg-fuchsia-400/20",
  pink: "bg-pink-400/15 text-pink-700 group-data-[hover]:bg-pink-400/25   -[hover]:bg-pink-400/20",
  rose: "bg-rose-400/15 text-rose-700 group-data-[hover]:bg-rose-400/25   -[hover]:bg-rose-400/20",
  zinc: "bg-zinc-600/10 text-zinc-700 group-data-[hover]:bg-zinc-600/20   -[hover]:bg-white/10",
};

type BadgeProps = { color?: keyof typeof colors };

export function Badge({
  color = "zinc",
  className,
  ...props
}: BadgeProps & React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={clsx(
        "inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline",
        colors[color],
        className
      )}
    />
  );
}

export const BadgeButton = React.forwardRef(function BadgeButton(
  {
    color = "zinc",
    className,
    children,
    ...props
  }: BadgeProps & { children: React.ReactNode } & (
      | HeadlessButtonProps
      | React.ComponentPropsWithoutRef<typeof Link>
    ),
  ref: React.ForwardedRef<HTMLElement>
) {
  let classes = clsx(
    className,
    "group relative inline-flex rounded-md focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500"
  );

  return "href" in props ? (
    <Link
      {...props}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <TouchTarget>
        <Badge color={color}>{children}</Badge>
      </TouchTarget>
    </Link>
  ) : (
    <HeadlessButton {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Badge color={color}>{children}</Badge>
      </TouchTarget>
    </HeadlessButton>
  );
});
