import { useState, Dispatch, SetStateAction } from "react";

export function useSteps<
  Steps extends Record<string, any>,
  DataKey extends keyof Steps,
>(
  stepKeys: DataKey[],
  initialStep: DataKey,
  stepsFunction: (
    activeStep: DataKey,
    setStep: Dispatch<SetStateAction<DataKey>>
  ) => Steps
) {
  const [activeStep, setActiveStep] = useState<DataKey>(initialStep);
  const parsedSteps = stepsFunction(activeStep, setActiveStep);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      const currentIndex =
        prevActiveStep !== undefined ? stepKeys.indexOf(prevActiveStep) : -1;
      const nextIndex = currentIndex + 1;
      return nextIndex < stepKeys.length ? stepKeys[nextIndex] : prevActiveStep;
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      const currentIndex =
        prevActiveStep !== undefined
          ? stepKeys.indexOf(prevActiveStep)
          : stepKeys.length;
      const prevIndex = currentIndex - 1;
      return prevIndex >= 0 ? stepKeys[prevIndex] : prevActiveStep;
    });
  };

  return {
    steps: parsedSteps,
    activeStep: { key: activeStep, value: parsedSteps[activeStep] },
    setActiveStep,
    handleNext,
    handleBack,
  };
}
