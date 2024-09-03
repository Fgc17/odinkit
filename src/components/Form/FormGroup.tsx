// client
"use client";

import { useSteps } from "../../hooks/useSteps";
import { createContext, useContext, useState } from "react";
import { UseFormReturn } from "./Form";
import _ from "lodash";

export type FormGroupFormData = {
  id: string;
  onSubmit: () => void;
  handleSubmit: UseFormReturn["handleSubmit"];
  reset: UseFormReturn["reset"];
  formState: {
    errors: Record<string, any>;
    isValid: boolean;
    isSubmitting: boolean;
  };
  values: Record<string, any>;
};

export const FormGroupContext = createContext<ReturnType<typeof useFormGroup>>(
  null!
);

export const useParentFormGroup = () => useContext(FormGroupContext);

const defaultForm: Record<keyof FormGroupFormData, any> = {
  id: "xxxxxxx",
  onSubmit: () => {},
  handleSubmit: () => {},
  reset: () => {},
  formState: {
    errors: {},
    isValid: false,
  },
  values: {},
};

export function useFormGroup() {
  const [forms, setForms] = useState<Map<string, FormGroupFormData>>(new Map());

  const updateForm = (form: UseFormReturn) => {
    setForms((prevForms) => {
      const newForms = new Map(prevForms);
      return newForms.set(form.id, {
        id: form.id,
        values: form.getValues(),
        handleSubmit: form.handleSubmit,
        reset: form.reset,
        onSubmit: form.onSubmit as any,
        formState: {
          errors: form.formState.errors,
          isValid: _.isEmpty(form.formState.errors),
          isSubmitting: form.formState.isSubmitting,
        },
      });
    });
  };

  const { currentStep, getNextStep, getPrevStep, walk } = useSteps({
    currentStep: 0,
    stepCount: forms.size,
  });

  const formIds = Array.from(forms.keys());

  const currentFormId = formIds[currentStep]!;

  const nextForm = () => walk(1);

  const previousForm = () => walk(-1);

  const hasNextForm = getNextStep() != 0;

  const hasPreviousForm = getPrevStep() > -1;

  const isCurrent = (id: string) => currentFormId === id;

  const submitFormGroup = () => {
    const lastForm = forms.get(formIds[formIds.length - 1]!);
    if (lastForm?.onSubmit) {
      lastForm.handleSubmit(lastForm.onSubmit)();
    }
  };

  return {
    forms,
    updateForm,
    isCurrent,
    currentStep,
    currentForm: forms.get(currentFormId) ?? (defaultForm as FormGroupFormData),
    nextForm,
    previousForm,
    submitFormGroup,
    hasNextForm,
    hasPreviousForm,
  };
}

export function FormGroup({
  children,
  formGroup,
}: {
  children: React.ReactNode;
  formGroup: ReturnType<typeof useFormGroup>;
}) {
  return (
    <FormGroupContext.Provider value={formGroup}>
      {children}
    </FormGroupContext.Provider>
  );
}
