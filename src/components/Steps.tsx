"use client";
import { Tab, Transition } from "@headlessui/react";
import { For } from "./For";
import clsx from "clsx";
import React, { MutableRefObject, useRef } from "react";
import { scrollToElement, scrollToElementX } from "../utils/scroll";
import { useSteps } from "../hooks/useSteps";

export interface Step {
  title: string;
  content?: React.ReactNode;
  href?: string;
  description?: string;
  disabled?: boolean;
}

export function Steps({
  steps,
  ssr,
  topRef,
  stepRefs,
  color,
}: {
  color?: string;
  ssr?: boolean;
  steps: Step[];
  topRef: MutableRefObject<HTMLDivElement>;
  stepRefs: MutableRefObject<HTMLDivElement[]>;
}) {
  const { currentStep, setCurrentStep } = useSteps();
  const stepPanelRefs = useRef<HTMLDivElement[]>(null);

  return (
    <>
      <div ref={topRef}></div>
      <Tab.Group
        as={"div"}
        selectedIndex={currentStep}
        onChange={(index) => setCurrentStep(index)}
      >
        <Tab.List
          className={clsx(
            "sticky top-0 z-10 -mx-3 mb-3 flex overflow-x-scroll bg-white shadow-md md:z-0 lg:mx-0  lg:overflow-x-auto lg:shadow-none"
          )}
          style={{ scrollbarWidth: "none" }}
        >
          <For each={steps} identifier="tabName">
            {(step, index) => (
              <Tab
                className="grow outline-none ring-0"
                disabled={step.disabled}
              >
                {({ selected }) => (
                  <div
                    style={{
                      borderColor: selected ? color : "gray",
                      color: selected ? color : "gray",
                    }}
                    className={clsx(
                      "border-t-4 px-3 py-4 text-sm font-medium duration-200 *:ring-0 focus:ring-0",
                      step.disabled && "cursor-not-allowed opacity-50",
                      index === 0
                        ? "me-2 ms-1 lg:ms-0"
                        : index === steps.length - 1
                          ? "me-1 ms-2 lg:me-0"
                          : "mx-2"
                    )}
                    ref={(el) => {
                      if (el) {
                        stepRefs.current[index] = el;
                      }
                    }}
                    onClick={() => {
                      if (topRef.current) {
                        scrollToElement(
                          topRef.current,
                          ((stepPanelRefs?.current &&
                            stepPanelRefs?.current[index]?.offsetHeight) ||
                            0) > 500
                            ? 0
                            : 96
                        );
                      }

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
        {!ssr && (
          <Tab.Panels>
            <For each={steps} identifier="tabContent">
              {(step, index) => (
                <Tab.Panel as="div">
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
                      <div
                        ref={(el) => {
                          if (el && stepPanelRefs?.current) {
                            stepPanelRefs.current[index] = el;
                          }
                        }}
                      >
                        {step.content}
                      </div>
                    </Transition>
                  )}
                </Tab.Panel>
              )}
            </For>
          </Tab.Panels>
        )}
      </Tab.Group>
    </>
  );
}
