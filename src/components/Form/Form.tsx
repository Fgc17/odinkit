// client
"use client";

import type React from "react";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import {
  useForm as useReactHookForm,
  FieldValues,
  UseFormProps as useReactHookFormProps,
  Path,
} from "react-hook-form";
import {
  ZodEffects,
  ZodObject,
  ZodRawShape,
  ZodType,
  ZodTypeAny,
  z,
} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldProps, _ODINKIT_INTERNAL_Field } from "./Field";
import { StepStore, useSteps } from "../../hooks/useSteps";

type UseFormProps<Fields extends FieldValues> = Omit<
  useReactHookFormProps<Fields>,
  "resolver"
> & {
  fieldOptions?: {
    enableAsterisk?: boolean;
  };
  schema:
    | ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>
    | ZodEffects<ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>>;
};

export type UseFormReturn<Fields extends FieldValues = FieldValues> =
  ReturnType<typeof useForm<Fields>>;

const FormContext = createContext<UseFormReturn>(null!);

export function useForm<Fields extends FieldValues>({
  schema,
  fieldOptions,
  ...useReactHookFormProps
}: UseFormProps<Fields>) {
  type _Fields = Fields | z.infer<typeof schema>;
  return {
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

export type MultistepFormChildrenProps<Step, Steps> = {
  hasNextStep: boolean;
  hasPrevStep: boolean;
  currentStep: number;
  walk: StepStore["walk"];
  dryWalk: StepStore["dryWalk"];
  steps: Steps;
  order: Step[];
  isCurrentStepValid: boolean;
};

export function MultistepForm<
  Fields extends FieldValues,
  Step extends string,
  Steps extends Record<
    Step,
    {
      refine?: (data: Fields) => boolean;
      fields: Path<Fields>[];
      form: ReactNode;
    }
  >,
>({
  onSubmit,
  hform,
  steps,
  order,
  children,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit" | "children"> & {
  hform: UseFormReturn<Fields>;
  onSubmit?: (data: Fields) => void;
  steps: Steps;
  order: Step[];
  children: (props: MultistepFormChildrenProps<Step, Steps>) => ReactNode;
}) {
  const { currentStep, getNextStep, getPrevStep, walk, dryWalk, stepCount } =
    useSteps({
      currentStep: 0,
      stepCount: order.length,
    });

  const isCurrentStepValid = useMemo(() => {
    const currentStepKey = order[currentStep] as keyof typeof steps;

    const fields = steps[currentStepKey].fields;

    const formFields = fields.map((field) => hform.getFieldState(field));

    const preRefineValidationResult = formFields.every(
      (field) => !field.invalid && field.isDirty
    );

    const refineFn = steps[currentStepKey].refine;
    if (refineFn) {
      const refineValidationResult = refineFn(hform.getValues());

      return preRefineValidationResult && refineValidationResult;
    }

    return preRefineValidationResult;
  }, [hform.watch()]);

  const hasNextStep = getNextStep() === currentStep + 1;

  const hasPrevStep = getPrevStep() === currentStep - 1;

  return (
    <FormProvider {...hform}>
      <form
        onSubmit={
          onSubmit &&
          hform?.handleSubmit((data) => {
            hform.trigger();
            onSubmit(data);
          })
        }
        {...props}
      >
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
      </form>
    </FormProvider>
  );
}

export function Form<Fields extends FieldValues>({
  onSubmit,
  hform,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit"> & {
  hform: UseFormReturn<Fields>;
  onSubmit?: (data: Fields) => void;
}) {
  return (
    <FormProvider {...hform}>
      <form
        onSubmit={
          onSubmit &&
          hform?.handleSubmit((data) => {
            hform.trigger();
            onSubmit(data);
          })
        }
        {...props}
      />
    </FormProvider>
  );
}
