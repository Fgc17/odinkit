"use client";
import { Tab } from "@headlessui/react";
import { For } from "./For";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export type TabItem = {
  title: string;
  content: React.ReactNode;
  onClick?: () => void;
};

export function Tabs({
  tabs,
  color,
  className,
}: {
  tabs: TabItem[];
  color?: string;
  className?: string;
}) {
  const elementRef = useRef<HTMLDivElement>(null);

  return (
    <Tab.Group as={"div"}>
      <Tab.List
        ref={elementRef}
        className={clsx(
          className,
          "z-10 flex min-h-12 overflow-x-scroll bg-white duration-200 lg:mx-0 lg:overflow-x-auto"
        )}
        as="div"
        style={{ scrollbarWidth: "none" }}
      >
        <For each={tabs} identifier="tabName">
          {(tab) => (
            <Tab as="button" className={"grow lg:grow-0"}>
              {({ selected }) => (
                <div
                  onClick={tab.onClick}
                  className={clsx(
                    "min-h-12",
                    "flex items-center border-b-2 px-3 font-medium duration-200 *:ring-0",
                    selected
                      ? `border-${color || "indigo-600"} text-indigo-600`
                      : "border-gray-200 text-gray-500"
                  )}
                >
                  <span className="mx-2">{tab.title}</span>
                </div>
              )}
            </Tab>
          )}
        </For>
      </Tab.List>
      <Tab.Panels>
        <For each={tabs} identifier="tabContent">
          {(tab) => <Tab.Panel>{tab.content}</Tab.Panel>}
        </For>
      </Tab.Panels>
    </Tab.Group>
  );
}
