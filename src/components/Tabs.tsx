import { Tab } from "@headlessui/react";
import { For } from "./For";
import clsx from "clsx";

export type TabItem = {
  title: string;
  content: React.ReactNode;
};

export function Tabs({ tabs, color }: { tabs: TabItem[]; color?: string }) {
  return (
    <Tab.Group>
      <Tab.List
        className={clsx(
          "sticky top-0 z-10 -mx-3 mb-3 flex min-h-[80px] overflow-x-scroll bg-white  lg:mx-0 lg:overflow-x-auto"
        )}
        as="div"
        style={{ scrollbarWidth: "none" }}
      >
        <For each={tabs} identifier="tabName">
          {(tab) => (
            <Tab>
              {({ selected }) => (
                <div
                  className={clsx(
                    "lg:min-h-auto min-h-[79px]",
                    "flex items-center border-b-2 px-1 text-sm font-medium duration-200 *:ring-0",
                    selected
                      ? `border-${color || "indigo"}-600 text-${color || "indigo"}-600`
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
