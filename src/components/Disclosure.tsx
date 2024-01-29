// client
"use client";
import { Disclosure, Transition } from "@headlessui/react";
import {
  MinusIcon,
  MinusSmallIcon,
  PlusIcon,
  PlusSmallIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { scrollToElement } from "../utils/scroll";
import clsx from "clsx";

export default function DisclosureAccordion({
  children,
  title,
  scrollToContent,
  defaultOpen,
  disabled,
  className,
}: {
  children: React.ReactNode;
  title: string;
  scrollToContent?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const contentRef = useRef(null);

  return (
    <Disclosure
      defaultOpen={defaultOpen}
      as="div"
      className={clsx(
        "border-t border-gray-200 p-4 pe-2",
        disabled ? "bg-gray-100" : "bg-transparent",
        className
      )}
    >
      {({ open }) => {
        if (scrollToContent && contentRef.current)
          scrollToElement(contentRef.current, 0);
        return (
          <>
            <dt ref={contentRef}>
              <Disclosure.Button
                disabled={disabled}
                className={clsx(
                  "flex w-full items-center justify-between text-left text-gray-900"
                )}
              >
                <span className="text-sm font-medium text-gray-900">
                  {title}
                </span>
                <span className="ml-6 flex h-7 items-center">
                  {open ? (
                    <MinusIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <PlusIcon className="h-6 w-6" aria-hidden="true" />
                  )}
                </span>
              </Disclosure.Button>
            </dt>
            <Transition
              unmount={false}
              as="dd"
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel unmount={false} as="div" className="mt-4">
                <div>{children}</div>
              </Disclosure.Panel>
            </Transition>
          </>
        );
      }}
    </Disclosure>
  );
}
