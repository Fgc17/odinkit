// client
"use client";

import { useSteps } from "../../hooks/useSteps";
import { createContext, useContext, useState } from "react";
import { UseFormReturn } from "./Form";
import _ from "lodash";
import { usePaginationUtils } from "../../hooks/usePaginationUtils";

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
          isValid: form.formState.isValid,
          isSubmitting: form.formState.isSubmitting,
        },
      });
    });
  };

  const updateFormValues = (form: UseFormReturn) => {
    setForms((prevForms) => {
      const newForms = new Map(prevForms);
      const formId = form.id;
      const formValues = form.getValues();
      const currentForm = newForms.get(formId);
      if (currentForm) {
        newForms.set(formId, {
          ...currentForm,
          values: formValues,
        });
      }
      return newForms;
    });
  };

  const { currentStep, getNextStep, getPrevStep, walk } = useSteps({
    currentStep: 0,
    stepCount: forms.size,
  });

  const formIds = Array.from(forms.keys());

  const currentFormId = formIds[currentStep]!;

  const next = () => walk(1);

  const previous = () => walk(-1);

  const {
    isCurrent,
    isFirstPage: isFirst,
    isLastPage: isLast,
    shouldShow,
  } = usePaginationUtils({
    currentPageIndex: currentStep,
    pageCount: forms.size,
  });

  const submitFormGroup = () => {
    const lastForm = forms.get(formIds[formIds.length - 1]!);
    if (lastForm?.onSubmit) {
      lastForm.handleSubmit(lastForm.onSubmit)();
    }
  };

  return {
    forms,
    submitFormGroup,
    updateForm,
    updateFormValues,
    currentStep,
    currentForm: forms.get(currentFormId) ?? (defaultForm as FormGroupFormData),
    formControl: {
      next,
      previous,
      isCurrent: (id: string) => isCurrent(formIds.indexOf(id)),
      shouldShow: shouldShow(currentStep),
      isLast: isLast(currentStep),
      isFirst: isFirst(currentStep),
    },
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
