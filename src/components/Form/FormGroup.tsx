// client
import { useSteps } from "../../hooks/useSteps";
import { createContext, useContext, useState, useEffect, useId } from "react";
import { z } from "zod";
import { useForm, UseFormReturn } from "./Form";

const FormGroupContext = createContext<ReturnType<typeof useFormGroup>>(null!);

export const useParentFormGroup = () => useContext(FormGroupContext);

export function useFormGroup() {
  const starterFormId = useId();

  const starterForm = useForm({
    id: starterFormId,
    schema: z.object({}) as any,
  });

  const [forms, setForms] = useState<UseFormReturn[]>([]);

  const { currentStep, getNextStep, getPrevStep, walk } = useSteps({
    currentStep: 0,
    stepCount: forms.length,
  });

  const nextForm = () => walk(1);

  const previousForm = () => walk(-1);

  const hasNextForm = getNextStep() != 0;

  const hasPreviousForm = getPrevStep() > -1;

  const submitFormGroup = () => {
    const lastForm = forms[forms.length - 1];
    if (lastForm?.onSubmit) {
      lastForm.handleSubmit(lastForm.onSubmit)();
    }
  };

  return {
    forms,
    setForms,
    currentForm: forms[currentStep] ?? starterForm,
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
