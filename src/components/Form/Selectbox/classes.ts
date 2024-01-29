import { clsx } from "clsx";

export const option = clsx(
  // Basic layout
  "flex grid cursor-default items-center h-full py-1.5 sm:py-0.5",

  // Typography
  "text-base/6 text-zinc-950 sm:text-sm/6 forced-colors:text-[CanvasText]",

  // Focus
  "outline-none data-[focus]:bg-blue-500 data-[focus]:text-white",

  // Disabled
  "data-[disabled]:opacity-50",

  "pl-1"
);

export const optionChildren = clsx(
  // Base
  "flex min-w-0 items-center",

  // Icons
  "[&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-zinc-500 [&>[data-slot=icon]]:group-data-[focus]/option:text-white sm:[&>[data-slot=icon]]:size-4 forced-colors:[&>[data-slot=icon]]:text-[CanvasText] forced-colors:[&>[data-slot=icon]]:group-data-[focus]/option:text-[Canvas]",

  // Avatars
  "[&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:size-5"
);

export const options = clsx(
  // Listbox z index
  "z-[150]",

  // Base styles
  "isolate w-max min-w-[calc(var(--button-width)+1.75rem)] select-none scroll-py-1 rounded-md pt-1",

  // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
  "outline outline-1 outline-transparent focus:outline-none",

  // Handle scrolling when menu won't fit in viewport
  "overflow-y-scroll overscroll-contain",

  // Popover background
  "bg-white/75 backdrop-blur-xl",

  // Shadows
  "shadow-lg ring-1 ring-zinc-950/10"
);
