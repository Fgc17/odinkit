"use client";
import * as Headless from "@headlessui/react";
import { CloseMenuIcon } from "./CloseMenuIcon";
import { NavbarItem } from "../../Navbar";
import clsx from "clsx";

export function MobileSidebar({
  open,
  close,
  children,
  direction = "left",
}: React.PropsWithChildren<{
  open: boolean;
  close: () => void;
  direction?: "left" | "right";
}>) {
  return (
    <Headless.Transition show={open}>
      <Headless.Dialog onClose={close} className="lg:hidden">
        <Headless.TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Headless.TransitionChild>
        <Headless.TransitionChild
          enter="ease-in-out duration-300"
          enterFrom={
            direction === "left" ? "-translate-x-full" : "translate-x-full"
          }
          enterTo="translate-x-0"
          leave="ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo={
            direction === "left" ? "-translate-x-full" : "translate-x-full"
          }
        >
          <Headless.DialogPanel
            className={clsx(
              "fixed inset-y-0 w-full max-w-80 p-2 transition",
              direction === "right" && "right-0"
            )}
          >
            <div className="flex h-full flex-col rounded-lg bg-white shadow-sm ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
              {children}
            </div>
          </Headless.DialogPanel>
        </Headless.TransitionChild>
      </Headless.Dialog>
    </Headless.Transition>
  );
}
