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
  className,
  color,
}: {
  tabs: TabItem[];
  className?: string;
  color?: string;
}) {
  const elementRef = useRef<HTMLDivElement>(null);

  return (
    <Tab.Group as={"div"}>
      <Tab.List
        ref={elementRef}
        className={clsx(
          className,
          "z-10 grid min-h-12 overflow-x-scroll border-slate-100 bg-white duration-200 lg:mx-0 lg:overflow-x-auto"
        )}
        as="div"
        style={{
          scrollbarWidth: "none",
          gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
        }}
      >
        <For each={tabs} identifier="tabName">
          {(tab) => (
            <Tab as="button" className={"col-span-1"} onClick={tab.onClick}>
              {({ selected, hover }) => (
                <div
                  style={{
                    color: selected ? (!hover ? color : "#6b7280") : "#6b7280",
                    borderColor: selected ? color : "#6b7280",
                  }}
                  className={clsx(
                    "max-h-12",
                    "text-lg font-semibold sm:text-sm",
                    "flex items-center justify-center border-b-2 px-1 pb-3  duration-200 *:ring-0 lg:px-3"
                  )}
                >
                  {tab.title}
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
