import { Tab } from "@headlessui/react";
import { For } from "./For";
import clsx from "clsx";

export type TabItem = {
  title: string;
  content: React.ReactNode;
};

export function Tabs({ tabs }: { tabs: TabItem[] }) {
  return (
    <Tab.Group>
      <Tab.List>
        <For each={tabs} identifier="tabName">
          {(tab) => (
            <Tab>
              {({ selected }) => (
                <div
                  className={clsx(
                    "border-b-2 px-1 py-4 text-sm font-medium duration-200 *:ring-0",
                    selected
                      ? "border-indigo-600 text-indigo-600"
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
