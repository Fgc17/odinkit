"use client";
import { Tab, Transition } from "@headlessui/react";
import { For } from "./For";
import clsx from "clsx";
import { BottomNavigation } from "./BottomNavigation";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { scrollToElement, scrollToElementX } from "../utils/scroll";
import { Button } from "./Button";
import { useSteps } from "../hooks/useSteps";

export interface Step {
  content: React.ReactNode;
  title: string;
  description?: string;
  disabled?: boolean;
}

export function Steps({
  steps,
  topRef,
  stepRefs,
  color,
}: {
  color?: string;
  steps: Step[];
  topRef: MutableRefObject<HTMLDivElement>;
  stepRefs: MutableRefObject<HTMLDivElement[]>;
}) {
  const { currentStep, setCurrentStep } = useSteps({});

  return (
    <>
      <div ref={topRef}></div>
      <Tab.Group
        as={"div"}
        selectedIndex={currentStep}
        onChange={setCurrentStep}
      >
        <Tab.List
          className={clsx(
            "sticky top-0 z-10 -mx-3 mb-3 flex overflow-x-scroll bg-white  lg:mx-0 lg:overflow-x-auto"
          )}
          style={{ scrollbarWidth: "none" }}
        >
          <For each={steps} identifier="tabName">
            {(step, index) => (
              <Tab className="grow">
                {({ selected }) => (
                  <div
                    className={clsx(
                      "mx-2 border-t-4 px-3 py-4 text-sm font-medium duration-200 *:ring-0 focus:ring-0",
                      selected
                        ? `border-${color}-600 text-${color}-600`
                        : "border-gray-200 text-gray-500"
                    )}
                    ref={(el) => {
                      if (el) {
                        stepRefs.current[index] = el;
                      }
                    }}
                    onClick={() => {
                      if (topRef.current) scrollToElement(topRef.current, 0);
                      if (stepRefs.current[index])
                        scrollToElementX(stepRefs.current[index]!, 0);
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <div className="whitespace-nowrap text-nowrap">
                        Passo {index + 1}
                      </div>
                      <div className="whitespace-nowrap text-nowrap text-sm font-medium text-black">
                        {step.title}
                      </div>
                    </div>
                  </div>
                )}
              </Tab>
            )}
          </For>
        </Tab.List>
        <Tab.Panels>
          <For each={steps} identifier="tabContent">
            {(step) => (
              <Tab.Panel>
                {({ selected }) => (
                  <Transition
                    show={selected}
                    enter="transition-opacity duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    {step.content}
                  </Transition>
                )}
              </Tab.Panel>
            )}
          </For>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
