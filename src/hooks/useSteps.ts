"use client"; // client

import {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useId,
} from "react";
import { create } from "zustand";

interface StepStore {
  stepCount: number;
  setStepCount: (stepCount: number) => void;
  currentStep: number;
  cyclic: boolean;
  setCurrentStep: (currentStep: number) => void;
  walk: (vector: number) => void;
}

const useStepStore = create<StepStore>()((set) => ({
  stepCount: 0,
  currentStep: 0,
  setStepCount: (stepCount: number) => set({ stepCount }),
  setCurrentStep: (currentStep: number) => set({ currentStep }),
  cyclic: false,
  walk: (vector: number) =>
    set((state) => {
      const currentIndex = state.currentStep;

      const maxIndex = state.stepCount;

      if (!state.cyclic) {
        if (currentIndex + vector < 0) {
          return { currentStep: 0 };
        }

        if (currentIndex + vector > maxIndex) {
          return { currentStep: maxIndex };
        }
      } else {
        if (currentIndex + vector < 0) {
          const netWalk = maxIndex - Math.abs(currentIndex + vector);
          return { currentStep: netWalk };
        }

        if (currentIndex + vector > maxIndex) {
          const netWalk = currentIndex + vector - maxIndex;

          return { currentStep: netWalk };
        }
      }

      return { currentStep: state.currentStep + vector };
    }),
}));

export function useSteps({
  currentStep,
  stepCount,
}: {
  currentStep?: number;
  stepCount?: number;
}) {
  const useSteps = useStepStore();
  const key = useId();

  useEffect(() => {
    if (stepCount) useSteps.setStepCount(stepCount);
    if (currentStep) useSteps.setCurrentStep(currentStep - 1);
  }, []);

  return useSteps;
}
