// client
"use client";

import type React from "react";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import {
  useForm as useReactHookForm,
  FieldValues,
  UseFormProps as useReactHookFormProps,
  Path,
} from "react-hook-form";
import { ZodEffects, ZodObject, ZodRawShape, ZodType, ZodTypeAny } from "zod";

import { z } from "../../utils/zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldProps, _ODINKIT_INTERNAL_Field } from "./Field";
import { StepContext, useSteps } from "../../hooks/useSteps";

type UseFormProps<Fields extends FieldValues> = Omit<
  useReactHookFormProps<Fields>,
  "resolver"
> & {
  id?: string;
  fieldOptions?: {
    enableAsterisk?: boolean;
  };
  schema:
    | ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>
    | ZodEffects<ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>>;
};

export type MultistepFormChildrenProps<Step, Steps> = {
  hasNextStep: boolean;
  hasPrevStep: boolean;
  currentStep: number;
  walk: StepContext["walk"];
  dryWalk: StepContext["dryWalk"];
  steps: Steps;
  order: Step[];
  isCurrentStepValid: boolean;
};

export type FormProps<Fields extends FieldValues> = Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "id"
> & {
  hform: UseFormReturn<Fields>;
  onSubmit?: (data: Fields) => void;
};

export type MultistepFormProps<Fields extends FieldValues, Steps, Step> = Omit<
  FormProps<Fields>,
  "children"
> & {
  steps: Steps;
  order: Step[];
  children: (props: MultistepFormChildrenProps<Step, Steps>) => ReactNode;
};

export type UseFormReturn<Fields extends FieldValues = FieldValues> =
  ReturnType<typeof useForm<Fields>>;

const FormContext = createContext<UseFormReturn>(null!);

export function useForm<Fields extends FieldValues>({
  schema,
  fieldOptions,
  id,
  ...useReactHookFormProps
}: UseFormProps<Fields>) {
  type _Fields = Fields | z.infer<typeof schema>;

  const _id = useId();

  return {
    id: id ?? _id,
    schema,
    createField: () => (props: FieldProps<_Fields>) => (
      <_ODINKIT_INTERNAL_Field {...fieldOptions} {...props} />
    ),
    ...useReactHookForm<_Fields>({
      ...useReactHookFormProps,
      resolver: zodResolver(schema),
    }),
  };
}

export function useFormContext<Fields extends FieldValues>() {
  return useContext(FormContext) as unknown as UseFormReturn<Fields>;
}

export function FormProvider<Fields extends FieldValues>({
  children,
  ...data
}: UseFormReturn<Fields> & { children: React.ReactNode }) {
  return (
    <FormContext.Provider value={data as unknown as UseFormReturn}>
      {children}
    </FormContext.Provider>
  );
}

export function MultistepForm<
  Fields extends FieldValues,
  Step extends string,
  Steps extends Record<
    Step,
    {
      fields: Path<Fields>[];
      conditions?: any[];
      form: ReactNode;
      refine?: (data: Fields) => boolean;
    }
  >,
>({
  onSubmit,
  hform,
  steps,
  order,
  children,
  ...props
}: MultistepFormProps<Fields, Steps, Step>) {
  const {
    currentStep,
    getNextStep,
    getPrevStep,
    walk,
    dryWalk,
    stepCount,
    setStepCount,
  } = useSteps({
    currentStep: 0,
    stepCount: Object.values(steps).filter((s: any) => s.form).length,
  });

  const isCurrentStepValid = useMemo(() => {
    const currentStepKey = order[currentStep] as keyof typeof steps;

    const fields = steps[currentStepKey].fields;

    const formFields = fields.map((field) => ({
      ...hform.getFieldState(field),
      name: field,
    }));

    const preRefineValidationResult = formFields.every(
      (field) => !field.invalid && hform.getValues(field.name)
    );

    const refineFn = steps[currentStepKey].refine;
    if (refineFn) {
      const refineValidationResult = refineFn(hform.getValues());

      return preRefineValidationResult && refineValidationResult;
    }

    return preRefineValidationResult;
  }, [hform.watch()]);

  useEffect(
    () => setStepCount(Object.values(steps).filter((s: any) => s.form).length),
    [steps]
  );

  const hasNextStep = getNextStep() === currentStep + 1;

  const hasPrevStep = getPrevStep() === currentStep - 1;

  return (
    <Form hform={hform} onSubmit={onSubmit} {...props}>
      {children({
        hasNextStep,
        hasPrevStep,
        currentStep,
        walk,
        dryWalk,
        steps,
        order,
        isCurrentStepValid,
      })}
    </Form>
  );
}

export function Form<Fields extends FieldValues>({
  onSubmit,
  hform,
  ...props
}: FormProps<Fields>) {
  return (
    <FormProvider {...hform}>
      <form
        onSubmit={
          onSubmit &&
          hform?.handleSubmit((data) => {
            hform.trigger();
            return onSubmit(data);
          })
        }
        id={hform.id}
        {...props}
      />
    </FormProvider>
  );
}
