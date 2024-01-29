// client
"use client";

import { useEffect, useId } from "react";
import { create } from "zustand";

export type StepStore = {
  stepCount: number;
  currentStep: number;
  cyclic: boolean;
  walk: (vector: number) => void;
  dryWalk: (vector: number) => number;
  setStepCount: (stepCount: number) => void;
  getPrevStep: () => number;
  getNextStep: () => number;
  setCurrentStep: (currentStep: number) => void;
};

const useStepStore = create<StepStore>()((set, get) => ({
  stepCount: 0,
  currentStep: 0,
  setStepCount: (stepCount: number) => set({ stepCount }),
  setCurrentStep: (currentStep: number) => set({ currentStep }),
  cyclic: false,
  dryWalk: (vector: number) => {
    const currentIndex = get().currentStep;
    const maxIndex = get().stepCount;
    let newIndex;

    if (get().cyclic) {
      newIndex = (currentIndex + vector + maxIndex + 1) % (maxIndex + 1);
    } else {
      newIndex = currentIndex + vector;
      if (newIndex < 0) {
        newIndex = 0;
      } else if (newIndex > maxIndex) {
        newIndex = maxIndex;
      }
    }

    return newIndex;
  },
  walk: (vector: number) => {
    const newIndex = get().dryWalk(vector);
    set({ currentStep: newIndex });
  },
  getPrevStep: () => {
    return get().dryWalk(-1);
  },
  getNextStep: () => {
    return get().dryWalk(1);
  },
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
